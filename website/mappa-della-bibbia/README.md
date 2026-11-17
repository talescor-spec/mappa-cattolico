# Mappa della Bibbia — Studio collection

Italian editorial preview at `/mappa-della-bibbia/`, thank-you information at `/mappa-della-bibbia/grazie/`. This is a separate path; the current Fideora landing, quiz, native billing and Android offers keep their existing behavior.

## Assets and original sample pages

The approved main cover and four new generated companion covers are stored as optimized WebP assets (combined approximately 1.24 MB). The three SVG sample pages contain original, selectable text and actual Scripture references: Luke overview, Emmaus reading guide and personal study notebook. Regenerate with `python3 scripts/generate-study-previews.py`. These are samples, not the complete promised books or licensed translations. The app section uses the existing unaltered production screenshot.

## Payment state · 2026-11-16 Brazil

The page explicitly presents the new collection as in preparation and is `noindex,nofollow`. `offer.mjs` is the single routing guard: preview mode never navigates to a paid checkout. Neither URL query parameters nor the thank-you URL can grant content access. Both full files and provider-specific verification must be ready before payment links can activate.

- Book: planned EUR 39 one-time on Mundpay. New-product wizard contains the title, first offer name, E-books category, description, sales/thank-you URLs, support email `support@fideora.app` and the same support WhatsApp as the existing MDB product. **Registration is blocked at support-email verification (four-digit email code). No new Mundpay product ID or checkout URL exists yet.** The wizard must resume, not be duplicated.
- Apple: a separate subscription was created under the existing Fideora Premium group `22500299`: reference `Fideora Studio e Biblioteca Mensile`, Product ID `com.fideora.studio.monthly`, Apple ID `6835682414`, duration one month. The Italian price point was selected and saved as **EUR 9.90**, with Italy as the initial available storefront. Italian display name `Fideora Studio + Biblioteca`; description `Studio, preghiera e biblioteca digitale inclusa.` No introductory offer was created. The product remains **Prepare for Submission**; it is not an approved/purchasable subscription.
- Existing approved `com.fideora.premium.monthly` and annual products are unchanged. An App Store app-listing URL does not preselect the new subscription and must not be described as its direct checkout.

## Requirements before taking payment

1. Complete and review the main digital book and all four companion volumes; verify the exact translation/distribution permissions and final files.
2. Finish the Mundpay email verification, create a EUR 39 one-time offer and verify delivery and the final checkout amount. Keep sales disabled while files or fulfillment are missing.
3. Integrate the new Apple SKU in RevenueCat and in the native purchase entry point, implement verified delivery of the included collection, prepare truthful review screenshots, then submit and obtain Apple approval.
4. Obtain a real Apple-generated promoted-purchase/offer route if available for the approved product; otherwise label the route honestly as App Store download followed by in-app subscription selection. Do not invent an `action=subscribe` or `iap` URL.
5. Set the corresponding verification flags only after those checks succeed, update availability copy, and then set the offer live. Confirm each device route, including Android's inability to purchase an Apple subscription.

The future rule for keeping downloaded bonus files after cancellation and delivery after the first paid charge remains a commercial recommendation from the editorial brief; it has not been implemented or tested.

## Validation

Build: `npm run build:website`. Full suite at initial validation: 85 tests passed. `tests/study-offer.test.mjs` checks preview payment blocking, Apple approval/fulfillment requirements and exact HTTPS provider hosts. Browser QA covers page layout, image loading, sample enlargement, close behavior, offer dialog and responsive CSS. Mobile visual QA and final deployed URL must be recorded when completed.
