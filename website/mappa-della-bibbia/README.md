# Mappa della Bibbia — Studio collection

Italian editorial preview at `/mappa-della-bibbia/`, thank-you information at `/mappa-della-bibbia/grazie/`. This is a separate path; the current Fideora landing, quiz, native billing and Android offers keep their existing behavior.

## Assets and original sample pages

The approved main cover and four generated companion covers remain optimized WebP assets. The three new landscape SVG plates replace the previous text-led examples: **La terra dei Vangeli**, **Il primo viaggio di Paolo**, and **La mappa dei 73 libri**. They use precise SVG typography, original commentary, real Natural Earth coastlines/lakes/Jordan river, and SRTM-derived relief. City locations and connections are indicative; modern geography is clearly distinguished from reconstructed ancient borders or exact itineraries. No source book pages or maps were copied. DK and Zondervan atlas publications informed the editorial hierarchy only.

Regenerate with `python scripts/generate-study-atlas.py`. Cropped public-domain data and source notes are retained in `scripts/study-map-data/`. To reimport the full Natural Earth data, pass `--source PATH`; see the script docstring. Pillow is needed for reimport only. These are sample plates, not the complete promised books.

The header now contains only the nonsticky Fideora wordmark. The hero illustration follows the subheadline and precedes the first CTA. The actual app screenshot follows its section headline. Both offer cards display a collection mockup made from the exact cover assets; the Apple card also includes the actual app screenshot. The book's €145 stack is explicitly a **proposed editorial valuation**, not a past sale or available individual prices. The bundle price remains €39. The Apple offer foregrounds the entire collection included free with the planned €9.90/month subscription. Payment gating is unchanged.

Sample plates can be opened, enlarged to native width, panned, and closed. The mobile sample selector reaches all three plates.

## Payment state · 2026-11-16 Brazil

The page explicitly presents the new collection as in preparation and is `noindex,nofollow`. `offer.mjs` is the single routing guard: preview mode never navigates to a paid checkout. Neither URL query parameters nor the thank-you URL can grant content access. Both full files and provider-specific verification must be ready before payment links can activate.

- Book: **created** on Mundpay at EUR 39, Single payment, E-books category and Ebook/book/PDF delivery. Support-email verification completed in the live UI before final registration. Product ID `3891abcc-aaa1-4bae-bd7b-b316a853f717`; checkout `https://checkout.mundpay.com/01a1e740-380f-71d4-b88f-e8c4124b323f?ref=`. The new cover is uploaded; sales and thank-you URLs point to this page and `/grazie/`; support uses `support@fideora.app` and the same WhatsApp as the existing MDB product. **Product sale is switched off and saved.** The public checkout was opened and correctly reports “Product inactive”. No final PDF is uploaded. The offer price is verified in the admin UI; final buyer-side currency/tax and fulfillment verification remain pending while sales are paused.
- Apple: a separate subscription was created under the existing Fideora Premium group `22500299`: reference `Fideora Studio e Biblioteca Mensile`, Product ID `com.fideora.studio.monthly`, Apple ID `6835682414`, duration one month. The Italian price point was selected and saved as **EUR 9.90**, with Italy as the initial available storefront. Italian display name `Fideora Studio + Biblioteca`; description `Studio, preghiera e biblioteca digitale inclusa.` No introductory offer was created. The product remains **Prepare for Submission**; it is not an approved/purchasable subscription.
- Existing approved `com.fideora.premium.monthly` and annual products are unchanged. An App Store app-listing URL does not preselect the new subscription and must not be described as its direct checkout.

## Requirements before taking payment

1. Complete and review the main digital book and all four companion volumes; verify the exact translation/distribution permissions and final files.
2. Upload the final collection files to the existing Mundpay product, verify delivery and the final buyer-side checkout amount, then activate only when fulfillment is ready. Reuse the existing product and checkout; do not register a duplicate.
3. Integrate the new Apple SKU in RevenueCat and in the native purchase entry point, implement verified delivery of the included collection, prepare truthful review screenshots, then submit and obtain Apple approval.
4. Obtain a real Apple-generated promoted-purchase/offer route if available for the approved product; otherwise label the route honestly as App Store download followed by in-app subscription selection. Do not invent an `action=subscribe` or `iap` URL.
5. Set the corresponding verification flags only after those checks succeed, update availability copy, and then set the offer live. Confirm each device route, including Android's inability to purchase an Apple subscription.

The future rule for keeping downloaded bonus files after cancellation and delivery after the first paid charge remains a commercial recommendation from the editorial brief; it has not been implemented or tested.

## Validation

Build: `npm run build:website`. Full suite: 85 tests passed. `tests/study-offer.test.mjs` checks preview payment blocking, Apple approval/fulfillment requirements and exact HTTPS provider hosts. Browser QA verified the public deployed page at `https://fideora.app/mappa-della-bibbia/`, desktop layout, sample enlargement/close, offer dialog, and a 390×844 mobile viewport. Mobile document width equals viewport width (390 px), with no horizontal overflow; switching to sample 2 and opening/closing it works. The Apple offer button correctly shows pre-launch information rather than routing to an unapproved subscription. Temporary viewport overrides were reset. Vercel production deployment from commit `58e1b5912e415b9d3c8e0a2aacc7cf6122fcc17b` was READY before this checkout-status update.
