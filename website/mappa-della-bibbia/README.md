# Mappa della Bibbia — Studio collection

Italian study collection at `/mappa-della-bibbia/`, thank-you information at `/mappa-della-bibbia/grazie/`. This is a separate path; the current Fideora landing, quiz, native billing and Android offers keep their existing behavior.

## Assets and original sample pages

The approved main cover and four generated companion covers remain optimized WebP assets. The three new landscape SVG plates replace the previous text-led examples: **La terra dei Vangeli**, **Il primo viaggio di Paolo**, and **La mappa dei 73 libri**. They use precise SVG typography, original commentary, real Natural Earth coastlines/lakes/Jordan river, and SRTM-derived relief. City locations and connections are indicative; modern geography is clearly distinguished from reconstructed ancient borders or exact itineraries. No source book pages or maps were copied. DK and Zondervan atlas publications informed the editorial hierarchy only.

Regenerate with `python scripts/generate-study-atlas.py`. Cropped public-domain data and source notes are retained in `scripts/study-map-data/`. To reimport the full Natural Earth data, pass `--source PATH`; see the script docstring. Pillow is needed for reimport only. These are sample plates, not the complete promised books.

The header now contains only the nonsticky Fideora wordmark. The hero illustration follows the subheadline and precedes the first CTA. The actual app screenshot follows its section headline. Both offer cards display a collection mockup made from the exact cover assets; the Apple card also includes the actual app screenshot. The book's €145 stack is explicitly a **proposed editorial valuation**, not a past sale or available individual prices. The bundle price remains €39. The Apple offer foregrounds the entire collection included free with the €7.99/month Fideora Premium subscription. Provider routing is documented below.

Sample plates can be opened, enlarged to native width, panned, and closed. The mobile sample selector reaches all three plates.

## Payment routing · 2026-11-17 Brazil

Successful capture now continues in the same tab to the selected provider. Stage 2 prepares a real, keyboard-accessible continuation link before automatic navigation, so external-store handoff failures do not leave a disabled button. The two digital-format bullets were removed only from the book offer card. Existing visual assets and offer stacking are preserved.

- **Book:** the configured Mundpay checkout is publicly available. Buyer-side UI was verified with country Italy: **EUR 39.00**, one-time **Libro e Biblioteca — Pagamento unico**. Product ID `3891abcc-aaa1-4bae-bd7b-b316a853f717`, checkout `https://checkout.mundpay.com/01a1e740-380f-71d4-b88f-e8c4124b323f?ref=`. `checkoutVerified` is true. Final ebook upload and delivery are not verified; `filesReady` stays false. Routing does not claim payment confirmation or content readiness.
- **Apple:** the advertised subscription now uses the existing approved `com.fideora.premium.monthly` at **EUR 7.99/month**, matching the Italian App Store listing verified on November 17. The price is consistent in the offer card, FAQ, renewal copy, order summary, offer config and capture payload. Capture continues to `https://apps.apple.com/it/app/fideora/id6825337165`; the visitor downloads/opens Fideora and selects the monthly plan inside the app. This is an app-listing route, not a preselected Apple checkout. No purchase URL or verified bonus delivery is claimed. The separate draft Studio SKU at EUR 9.90 is no longer advertised or recorded as the selected offer.
- Existing Apple billing products are unchanged; this update aligns only the sales page and lead attribution with the current monthly plan. Direct Apple purchase routing still requires a real Apple URL and verified bonus delivery.
- Provider URLs are restricted to HTTPS on the exact Mundpay/App Store hosts. Credentials in URLs and arbitrary redirect parameters are rejected. Contact details are only appended to Mundpay, never Apple. Thank-you redirects do not grant access or prove payment.

The books' public copy remains complete-edition copy per the publisher's launch instructions. The page stays noindex,nofollow. Final paid files still need upload and delivery verification before traffic is launched.

## Order capture

Step 1 collects editable full name and email. Prefill supports personalized URL parameters (`name`/`nome`/`firstname` and `email`, including Brevo uppercase aliases), native browser autocomplete and a 30-day local contact record. No URL or saved identity submits automatically. Invalid/expired values are ignored; values are assigned as form values, never HTML.

`POST /api/study-capture` validates and forwards to the existing Funnel Metrics capture service. Funnel `mdb-studio-it`, ID **298117**, Brevo list **214 — Captura MDB Studio IT**. Selected offer and safe attribution are saved. No campaign/automation was attached. Server validation, rate limits, honeypot, no-store, timeouts and strict success checks prevent false capture success.

Mundpay prefill uses its verified `name` and `email` query parameters, with URL encoding. The public checkout bundle reads these parameters. Apple gets no name or email. The Apple capture records interest in Fideora Premium monthly at EUR 7.99; an App Store visit is not a subscription confirmation.

## Validation

Run `node --test tests/study-offer.test.mjs tests/study-order.test.mjs` and `npm run build:website`. Tests cover routing independent of fulfillment flags, App Store fallback for an unapproved SKU, exact provider validation, prefill, safe attribution, capture validation and provider error handling. Browser QA must verify both successful capture redirects on the published page; do not place a purchase for testing.
