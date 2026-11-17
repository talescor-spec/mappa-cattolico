// Publishing a preview never enables payment for an unfinished edition.
export const offer = Object.freeze({
  status: 'editorial-preview',
  book: Object.freeze({ price: 39, currency: 'EUR', productID: '3891abcc-aaa1-4bae-bd7b-b316a853f717', checkoutURL: 'https://checkout.mundpay.com/01a1e740-380f-71d4-b88f-e8c4124b323f?ref=', checkoutVerified: false, filesReady: false }),
  apple: Object.freeze({ price: 9.90, currency: 'EUR', interval: 'month', productID: 'com.fideora.studio.monthly', appleID: '6835682414', purchaseURL: '', approved: false, bonusDeliveryVerified: false }),
  appStoreURL: 'https://apps.apple.com/it/app/fideora/id6825337165',
});
export function purchaseURL(kind, config = offer) {
  if (config.status !== 'live') return null;
  if (!config.book.filesReady) return null;
  if (kind === 'book') {
    if (!config.book.checkoutVerified) return null;
    try { const u = new URL(config.book.checkoutURL); return u.protocol === 'https:' && u.hostname === 'checkout.mundpay.com' ? u.href : null; } catch { return null; }
  }
  if (kind === 'apple') {
    if (!config.apple.approved || !config.apple.bonusDeliveryVerified) return null;
    try { const u = new URL(config.apple.purchaseURL); return u.protocol === 'https:' && u.hostname === 'apps.apple.com' ? u.href : null; } catch { return null; }
  }
  return null;
}
