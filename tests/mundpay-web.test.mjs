import test from 'node:test';
import assert from 'node:assert/strict';
import { createMundpayApi, validMundpayToken, validMundpayCheckout, webhookSubscription } from '../supabase/functions/_shared/mundpay.mjs';
const now = Date.parse('2026-11-26T12:00:00Z');
const id = 'sub_test';
const orderId = '019dd742-5510-71db-bf65-6eb4b95b6ed5';
const offerId = '019dd742-5510-71db-bf65-6eb4b95b6ed6';
const offer = { active: true, offer_id: offerId, currency: 'EUR', amount_cents: 1990, intro_amount_cents: 100 };
function fixture() {
  return {
    sub: { id, status: 'active', currency: 'EUR', snapshot_price_cents: 1990, customer_email: 'Buyer@Example.com',
      signup_order: { uuid: orderId, payment_type: 'recurring', recurring_interval: 'monthly' } },
    order: { id: orderId, offer_id: offerId, status: 'paid', amount: 100, currency: 'EUR',
      customer: { email: 'buyer@example.com' }, paid_at: '2026-11-26T11:00:00Z' },
    cycle: { cycle_number: 1, status: 'paid', amount_cents: 100, currency: 'EUR',
      period_start: '2026-11-26T11:00:00Z', period_end: '2026-12-26T11:00:00Z', invoice_public_id: 'inv_test' },
    invoice: { public_id: 'inv_test', cycle_number: 1, status: 'paid', amount_cents: 100, currency: 'EUR',
      paid_at: '2026-11-26T11:00:00Z', mundpay_order_id: orderId },
  };
}
function api(f) {
  return createMundpayApi(name => name === 'MUNDPAY_API_KEY' ? 'private-fixture-key' : undefined, async (url, options) => {
    assert.equal(new URL(url).origin, 'https://v2.mundpay.com');
    assert.equal(options.headers['X-API-Key'], 'private-fixture-key');
    const data = url.includes('/orders/') ? f.order : url.includes('/cycles?') ? [f.cycle] : url.includes('/invoices?') ? [f.invoice] : f.sub;
    return { ok: true, json: async () => ({ data, meta: { last_page: 1 } }) };
  });
}
test('Mundpay requires configuration and a private token; fake bodies never prove payment', async () => {
  assert.equal(await validMundpayToken('x', undefined), false);
  assert.equal(await validMundpayToken('wrong', 'a-long-random-private-token-123'), false);
  assert.equal(await validMundpayToken('a-long-random-private-token-123', 'a-long-random-private-token-123'), true);
  assert.equal(createMundpayApi(() => undefined).configured, false);
  await assert.rejects(createMundpayApi(() => undefined).verify(id, [offer], now));
  assert.equal(webhookSubscription({ event_type: 'order.paid', subscription: { public_id: '../orders/other' } }), null);
  assert.equal(webhookSubscription({ event_type: 'order.paid', subscription: { public_id: id }, customer: { email: 'forged@example.com' } }), id);
});
test('only exact HTTPS checkout domains are allowed', () => {
  assert.equal(validMundpayCheckout('https://checkout.mundpay.com/offer'), true);
  for (const url of ['http://checkout.mundpay.com/a', 'https://checkout.mundpay.com.evil.test/a', 'https://evil.test/a', 'https://u:p@checkout.mundpay.com/a'])
    assert.equal(validMundpayCheckout(url), false);
});
test('verified first paid cycle grants exactly its API period, normalized email, and no payload data', async () => {
  const result = await api(fixture()).verify(id, [offer], now);
  assert.equal(result.expires_at, '2026-12-26T11:00:00.000Z');
  assert.equal(result.buyer_email, 'buyer@example.com');
  assert.equal('customer' in result, false);
  assert.deepEqual(await api(fixture()).verify(id, [offer], now), result);
});
test('unrelated offers, free trials, missing invoices, unpaid and refunded orders do not unlock', async () => {
  for (const change of [
    f => { f.order.status = 'refunded'; }, f => { f.order.status = 'chargeback'; },
    f => { f.invoice.status = 'pending'; }, f => { f.cycle.status = 'pending'; },
    f => { f.cycle.amount_cents = 0; }, f => { f.cycle.invoice_public_id = 'other'; },
    f => { f.cycle.period_start = '2026-12-01T00:00:00Z'; },
    f => { f.cycle.period_end = '2026-11-26T11:59:00Z'; },
  ]) { const f = fixture(); change(f); assert.equal((await api(f).verify(id, [offer], now)).expires_at, null); }
  const f = fixture(); f.order.offer_id = 'other'; assert.equal(await api(f).verify(id, [offer], now), null);
  assert.equal(await api(fixture()).verify(id, [{...offer, active:false}], now), null);
});
test('customer, product type, price and currency mismatches fail closed', async () => {
  for (const change of [
    f => { f.sub.customer_email = 'other@example.com'; }, f => { f.sub.currency = 'BRL'; },
    f => { f.sub.signup_order.payment_type = 'single'; }, f => { f.sub.snapshot_price_cents = 999; },
  ]) { const f = fixture(); change(f); await assert.rejects(api(f).verify(id, [offer], now)); }
});
test('end-of-cycle cancellation preserves paid time; immediate, suspended and expired revoke it', async () => {
  const f = fixture(); f.sub.status = 'canceled'; f.sub.cancel_mode = 'end_of_cycle';
  assert.ok((await api(f).verify(id, [offer], now)).expires_at);
  f.sub.cancel_mode = 'immediate'; assert.equal((await api(f).verify(id, [offer], now)).expires_at, null);
  for (const status of ['suspended', 'expired', 'pending']) {
    f.sub.status = status; assert.equal((await api(f).verify(id, [offer], now)).expires_at, null);
  }
});
test('renewal requires the 19.90 EUR paid invoice and order, and uses the next API period', async () => {
  const f = fixture(); f.cycle.cycle_number = 2; f.invoice.cycle_number = 2;
  f.cycle.amount_cents = 1990; f.invoice.amount_cents = 1990; f.order.amount = 1990;
  assert.ok((await api(f).verify(id, [offer], now)).expires_at);
  f.order.status = 'refused'; assert.equal((await api(f).verify(id, [offer], now)).expires_at, null);
});
