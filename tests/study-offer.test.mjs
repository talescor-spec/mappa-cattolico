import test from 'node:test';
import assert from 'node:assert/strict';
import { offer, purchaseURL, applePurchaseReady } from '../website/mappa-della-bibbia/offer.mjs';

const config = () => ({
  status: 'checkout-routing',
  book: { filesReady: false, checkoutVerified: true, checkoutURL: 'https://checkout.mundpay.com/test-product' },
  apple: { approved: false, bonusDeliveryVerified: false, purchaseURL: 'https://apps.apple.com/it/purchase/approved-offer' },
  appStoreURL: 'https://apps.apple.com/it/app/fideora/id6825337165',
});
test('capture can continue to the configured book checkout without pretending fulfillment is ready', () => {
  assert.equal(purchaseURL('book'), offer.book.checkoutURL);
  assert.equal(offer.book.checkoutVerified, true);
  assert.equal(offer.book.filesReady, false);
  assert.equal(purchaseURL('book', config()), config().book.checkoutURL);
});
test('an unapproved Apple SKU falls back to download without being represented as a purchase', () => {
  const c = config();
  assert.equal(applePurchaseReady(c), false);
  assert.equal(purchaseURL('apple', c), c.appStoreURL);
  c.apple.approved = true;
  assert.equal(purchaseURL('apple', c), c.appStoreURL);
  c.apple.bonusDeliveryVerified = true;
  assert.equal(applePurchaseReady(c), true);
  assert.equal(purchaseURL('apple', c), c.apple.purchaseURL);
  assert.equal(c.book.filesReady, false);
});
test('both provider routes reject impersonated hosts, credentials and non-HTTPS destinations', () => {
  for (const url of ['javascript:alert(1)', 'https://checkout.mundpay.com.evil.example/a', 'http://checkout.mundpay.com/a', 'https://user:pass@checkout.mundpay.com/a']) {
    const c = config(); c.book.checkoutURL = url;
    assert.equal(purchaseURL('book', c), null);
  }
  for (const url of ['https://apps.apple.com.evil.example/a', 'https://pay.hotmart.com/incorrect-channel', 'http://apps.apple.com/a', 'https://user:pass@apps.apple.com/a']) {
    const c = config(); c.appStoreURL = url;
    assert.equal(purchaseURL('apple', c), null);
    c.appStoreURL = config().appStoreURL;
    c.apple.approved = true; c.apple.bonusDeliveryVerified = true; c.apple.purchaseURL = url;
    assert.equal(applePurchaseReady(c), false);
    assert.equal(purchaseURL('apple', c), c.appStoreURL);
  }
  assert.equal(purchaseURL('unknown', config()), null);
});
