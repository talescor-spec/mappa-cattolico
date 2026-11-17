import test from 'node:test';
import assert from 'node:assert/strict';
import { offer, purchaseURL } from '../website/mappa-della-bibbia/offer.mjs';

const ready = () => ({ status: 'live', book: { filesReady: true, checkoutVerified: true, checkoutURL: 'https://checkout.mundpay.com/test-product' }, apple: { approved: true, bonusDeliveryVerified: true, purchaseURL: 'https://apps.apple.com/it/app/fideora/id6825337165' } });
test('the editorial preview cannot collect payment for an unfinished book or subscription', () => {
  assert.equal(purchaseURL('book'), null);
  assert.equal(purchaseURL('apple'), null);
  assert.equal(offer.status, 'editorial-preview');
  const c = ready(); c.book.filesReady = false;
  assert.equal(purchaseURL('book', c), null);
  assert.equal(purchaseURL('apple', c), null);
});
test('Apple purchase is unavailable until both approval and bonus delivery are verified', () => {
  const c = ready(); c.apple.approved = false;
  assert.equal(purchaseURL('apple', c), null);
  c.apple.approved = true; c.apple.bonusDeliveryVerified = false;
  assert.equal(purchaseURL('apple', c), null);
});
test('only the configured HTTPS provider is accepted for each offer', () => {
  const c = ready();
  assert.equal(purchaseURL('book', c), c.book.checkoutURL);
  assert.equal(purchaseURL('apple', c), c.apple.purchaseURL);
  for (const url of ['javascript:alert(1)', 'https://checkout.mundpay.com.evil.example/a', 'http://checkout.mundpay.com/a']) {
    c.book.checkoutURL = url; assert.equal(purchaseURL('book', c), null);
  }
  c.apple.purchaseURL = 'https://pay.hotmart.com/incorrect-channel';
  assert.equal(purchaseURL('apple', c), null);
  assert.equal(purchaseURL('unknown', ready()), null);
});
