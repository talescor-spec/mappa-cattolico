// Routing to a provider is separate from verifying payment and content delivery.
export const offer = Object.freeze({
  status: 'checkout-routing',
  book: Object.freeze({ price: 39, currency: 'EUR', productID: '3891abcc-aaa1-4bae-bd7b-b316a853f717', checkoutURL: 'https://checkout.mundpay.com/01a1e740-380f-71d4-b88f-e8c4124b323f?ref=', checkoutVerified: true, filesReady: false }),
  apple: Object.freeze({ price: 9.90, currency: 'EUR', interval: 'month', productID: 'com.fideora.studio.monthly', appleID: '6835682414', purchaseURL: '', approved: false, bonusDeliveryVerified: false }),
  appStoreURL: 'https://apps.apple.com/it/app/fideora/id6825337165',
});
function providerURL(value, hostname) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === hostname && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function applePurchaseReady(config = offer) {
  return config.apple.approved === true && config.apple.bonusDeliveryVerified === true && !!providerURL(config.apple.purchaseURL, 'apps.apple.com');
}
export function purchaseURL(kind, config = offer) {
  if (kind === 'book') {
    return providerURL(config.book.checkoutURL, 'checkout.mundpay.com');
  }
  if (kind === 'apple') {
    // An unapproved Studio SKU must not be presented as an available purchase.
    // The verified listing remains a usable download/activation entry point.
    return applePurchaseReady(config) ? providerURL(config.apple.purchaseURL, 'apps.apple.com') : providerURL(config.appStoreURL, 'apps.apple.com');
  }
  return null;
}
