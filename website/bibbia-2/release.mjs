// Enable only after the selected cover editions and BOTH bonus PDFs are attached
// to this product's delivery, and the final reader format has been verified.
// The checkout was verified for Italy at EUR 27 on 22 November 2026.
// The merchant extended Fideora's guarantee to 60 days on 22 November 2026.
import { offer } from './offer.mjs';
export const release = Object.freeze({
  fulfillmentVerified: false,
  price: offer.price,
  currency: 'EUR',
  checkoutURL: 'https://pay.mycheckoutt.com/01a0961c-38aa-70f7-ad46-7c26a7327e90?ref=',
  campaign: 'mdb_approfondita_natale_2026',
});
