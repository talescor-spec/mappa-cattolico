// Checkout integration is ready. The merchant will attach the final delivery
// PDFs and activate this separate product in Mundpay. Leave it paused there
// until delivery is complete; existing MDB-IT remains unchanged.
// The merchant extended Fideora's guarantee to 60 days on 22 November 2026.
import { offer } from './offer.mjs';
export const release = Object.freeze({
  fulfillmentVerified: false,
  checkoutConfigured: true,
  price: offer.price,
  currency: 'EUR',
  productID: '6431fd73-6540-4714-9c04-c25f9078b7d4',
  checkoutURL: 'https://checkout.mundpay.com/01a20583-6831-737e-a87c-c57efd6b478b?ref=',
  campaign: 'mdb_approfondita_natale_2026',
});
