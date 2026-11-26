// Mundpay public API, checked against the official API reference on 2026-11-26.
// Webhook bodies only identify a subscription; they never prove payment or identity.
const API = 'https://v2.mundpay.com/api/v1/public';
const identifier = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
const email = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? value.trim().toLowerCase() : null;
export async function validMundpayToken(actual, expected) {
  if (typeof actual !== 'string' || !expected || expected.length < 24) return false;
  const hash = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  const [a, b] = await Promise.all([hash(actual), hash(expected)]);
  return a.reduce((different, value, i) => different | (value ^ b[i]), 0) === 0;
}
export function webhookSubscription(body) {
  if (!body || typeof body.event_type !== 'string' ||
      !/^(order\.(paid|refunded|chargeback|refused)|subscription\.(created|activated|reactivated|canceled|past_due|suspended|expired)|trial\.(started|ending|ended))$/.test(body.event_type)) return null;
  const id = body.subscription?.public_id;
  if (!identifier(id)) return null;
  return id;
}
export function validMundpayCheckout(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && u.hostname === 'checkout.mundpay.com' && !u.username && !u.password && !u.port; }
  catch { return false; }
}
export function createMundpayApi(env, fetcher = fetch) {
  const key = env('MUNDPAY_API_KEY');
  async function get(path) {
    if (!key) throw new Error('mundpay_not_configured');
    const response = await fetcher(`${API}${path}`, {
      headers: { 'X-API-Key': key, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000), redirect: 'error',
    });
    if (!response.ok) throw new Error('mundpay_verification_unavailable');
    return response.json();
  }
  async function pages(path) {
    const all = [];
    for (let page = 1; page <= 20; page++) {
      const result = await get(`${path}?per_page=50&page=${page}`);
      if (!Array.isArray(result.data) || !Number.isInteger(result.meta?.last_page)) throw new Error('mundpay_invalid_response');
      all.push(...result.data);
      if (page >= result.meta.last_page) return all;
    }
    throw new Error('mundpay_pagination_incomplete');
  }
  return {
    configured: Boolean(key),
    async verify(subscriptionId, offers, now = Date.now()) {
      if (!identifier(subscriptionId)) throw new Error('mundpay_invalid_subscription');
      const checkedAt = new Date(now).toISOString();
      const { data: sub } = await get(`/subscriptions/${encodeURIComponent(subscriptionId)}`);
      if (!sub || sub.id !== subscriptionId || !uuid(sub.signup_order?.uuid)) throw new Error('mundpay_invalid_subscription');
      const { data: signup } = await get(`/orders/${sub.signup_order.uuid}`);
      const offer = offers.find(o => o.active && o.offer_id === signup?.offer_id);
      if (!offer) return null; // Other products cannot unlock this app.
      const buyerEmail = email(sub.customer_email);
      if (!buyerEmail || signup.id !== sub.signup_order.uuid || email(signup.customer?.email) !== buyerEmail ||
          sub.signup_order.payment_type !== 'recurring' || sub.signup_order.recurring_interval !== 'monthly' ||
          sub.currency !== offer.currency || signup.currency !== offer.currency ||
          Number(sub.snapshot_price_cents) !== Number(offer.amount_cents)) throw new Error('mundpay_subscription_mismatch');
      let expiresAt = null;
      // End-of-cycle cancellation preserves confirmed paid time; immediate cancellation does not.
      const eligible = ['active', 'past_due'].includes(sub.status) ||
        (sub.status === 'canceled' && sub.cancel_mode === 'end_of_cycle');
      if (eligible) {
        const [cycles, invoices] = await Promise.all([
          pages(`/subscriptions/${encodeURIComponent(subscriptionId)}/cycles`),
          pages(`/subscriptions/${encodeURIComponent(subscriptionId)}/invoices`),
        ]);
        for (const cycle of cycles) {
          const start = Date.parse(cycle.period_start), end = Date.parse(cycle.period_end);
          if (cycle.status !== 'paid' || !Number.isInteger(cycle.cycle_number) || cycle.cycle_number < 1 ||
              !(start <= now && end > now && end > start && end - start <= 32 * 86400000)) continue;
          const amount = cycle.cycle_number === 1 ? Number(offer.intro_amount_cents) : Number(offer.amount_cents);
          const invoice = invoices.find(i => i.public_id === cycle.invoice_public_id && i.cycle_number === cycle.cycle_number);
          if (!invoice || invoice.status !== 'paid' || !uuid(invoice.mundpay_order_id) ||
              cycle.currency !== offer.currency || invoice.currency !== offer.currency ||
              Number(cycle.amount_cents) !== amount || Number(invoice.amount_cents) !== amount ||
              !(Date.parse(invoice.paid_at) <= now)) continue;
          const { data: order } = await get(`/orders/${invoice.mundpay_order_id}`);
          if (!order || order.id !== invoice.mundpay_order_id || order.status !== 'paid' ||
              order.currency !== offer.currency || Number(order.amount) !== amount ||
              email(order.customer?.email) !== buyerEmail || !(Date.parse(order.paid_at) <= now)) continue;
          if (sub.ends_at && Date.parse(sub.ends_at) < end) {
            const ends = Date.parse(sub.ends_at);
            if (!(ends > now)) continue;
            expiresAt = new Date(ends).toISOString();
          } else expiresAt = new Date(end).toISOString();
          break;
        }
      }
      return { subscription_id: subscriptionId, offer_id: offer.offer_id, buyer_email: buyerEmail,
        status: String(sub.status), expires_at: expiresAt, checked_at: checkedAt };
    },
  };
}
