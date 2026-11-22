// Enable only after the selected cover editions and BOTH bonus PDFs are attached
// to this product's delivery, and the final reader format has been verified.
// The checkout was verified for Italy at EUR 27 on 22 November 2026.
// The merchant extended Fideora's guarantee to 60 days on 22 November 2026.
import { offer } from './offer.mjs';
export const release = Object.freeze({
  fulfillmentVerified: false,
  price: offer.price,
  currency: 'EUR',
  productID: '6431fd73-6540-4714-9c04-c25f9078b7d4',
  checkoutURL: 'https://checkout.mundpay.com/01a20583-6831-737e-a87c-c57efd6b478b?ref=',
  campaign: 'mdb_approfondita_natale_2026',
});
