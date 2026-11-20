# La Mappa del Cattolico — offer revision, 20 November 2026

The main book is now **La Mappa del Cattolico**. The four existing companion volumes are grouped as **Pacchetto Bibbia e Radici** (Didachè, I Vangeli con i Padri, Con sant’Agostino, Il mondo dei Vangeli). **La Mappa del Catechismo** and **La Mappa della Messa** are two additional bonus books: one main book and six bonus volumes in total. The one-time price is €27. The existing Fideora subscription route is preserved with the updated collection presentation.

The canonical route is `/mappa-del-cattolico/`. The old sales path and existing `/mappa` and social aliases redirect there without dropping query attribution. The build publishes the existing physical source directory to both paths so historical asset and module links remain valid. The new path has the same scoped tracking CSP. Capture retains the existing funnel/provider IDs and adds the new `mdc_bundle_27_eur` offer reference and `mdc_it_v1` default campaign.

Three coordinated covers are project assets. The old Bible-only samples are replaced by original faith, Mass, and prayer sample plates, reproducible with `python scripts/generate-cattolico-previews.py`. These are explicitly illustrative editorial samples. Source structure references: the Vatican’s Italian Catechism Compendium and General Instruction of the Roman Missal. New covers and these samples are not the complete deliverable book PDFs. The main book and two new bonuses still need final content and fulfillment verification. The old publisher-confirmed readiness flag below applies to the former collection only, not an independent verification of this new seven-volume package.

The new offer does not reuse testimonials written for Mappa della Bibbia. The price stack lists the included components without inventing new individual prices or an increased valuation.

Validation: focused study routing, capture, social, Meta and UTMify tests; production website build; asset existence check. The historical implementation notes below describe the prior edition and are retained for provider/funnel provenance.

---

# Mappa della Bibbia — Studio collection

Italian study collection at `/mappa-della-bibbia/`, thank-you information at `/mappa-della-bibbia/grazie/`. This is a separate path; the current Fideora landing, quiz, native billing and Android offers keep their existing behavior.

## Assets and original sample pages

The approved main cover and four generated companion covers remain optimized WebP assets. The three new landscape SVG plates replace the previous text-led examples: **La terra dei Vangeli**, **Il primo viaggio di Paolo**, and **La mappa dei 73 libri**. They use precise SVG typography, original commentary, real Natural Earth coastlines/lakes/Jordan river, and SRTM-derived relief. City locations and connections are indicative; modern geography is clearly distinguished from reconstructed ancient borders or exact itineraries. No source book pages or maps were copied. DK and Zondervan atlas publications informed the editorial hierarchy only.

Regenerate with `python scripts/generate-study-atlas.py`. Cropped public-domain data and source notes are retained in `scripts/study-map-data/`. To reimport the full Natural Earth data, pass `--source PATH`; see the script docstring. Pillow is needed for reimport only. These are sample plates, not the complete promised books.

The header now contains only the nonsticky Fideora wordmark. The hero illustration follows the subheadline and precedes the first CTA. The actual app screenshot follows its section headline. Both offer cards display a collection mockup made from the exact cover assets; the Apple card also includes the actual app screenshot. The book's €145 stack is explicitly a **proposed editorial valuation**, not a past sale or available individual prices. The bundle price remains €39. The Apple offer foregrounds the entire collection included free with the €7.99/month Fideora Premium subscription. Provider routing is documented below.

Sample plates can be opened, enlarged to native width, panned, and closed. The mobile sample selector reaches all three plates.

## Payment routing · 2026-11-17 Brazil

Successful capture now continues in the same tab to the selected provider. Stage 2 prepares a real, keyboard-accessible continuation link before automatic navigation, so external-store handoff failures do not leave a disabled button. The two digital-format bullets were removed only from the book offer card. Existing visual assets and offer stacking are preserved.

- **Book:** the configured Mundpay checkout is publicly available. Buyer-side UI was verified with country Italy: **EUR 39.00**, one-time **Libro e Biblioteca — Pagamento unico**. Product ID `3891abcc-aaa1-4bae-bd7b-b316a853f717`, checkout `https://checkout.mundpay.com/01a1e740-380f-71d4-b88f-e8c4124b323f?ref=`. `checkoutVerified` is true. Delivery was marked complete on the publisher’s explicit instruction on November 17; `filesReady` is true. This is a publisher confirmation, not an independent paid-delivery test. Routing does not claim payment confirmation or content readiness.
- **Apple:** the advertised subscription now uses the existing approved `com.fideora.premium.monthly` at **EUR 7.99/month**, matching the Italian App Store listing verified on November 17. The price is consistent in the offer card, FAQ, renewal copy, order summary, offer config and capture payload. Capture continues to `https://apps.apple.com/it/app/fideora/id6825337165`; the visitor downloads/opens Fideora and selects the monthly plan inside the app. This is an app-listing route, not a preselected Apple checkout. No direct Apple purchase URL is claimed. Bonus delivery is marked ready on the publisher’s instruction. The separate draft Studio SKU at EUR 9.90 is no longer advertised or recorded as the selected offer.
- Existing Apple billing products are unchanged; this update aligns only the sales page and lead attribution with the current monthly plan. Direct Apple purchase routing still requires a real Apple URL. Android now uses the verified Hotmart monthly offer.
- Provider URLs are restricted to HTTPS on the exact Mundpay/App Store hosts. Credentials in URLs and arbitrary redirect parameters are rejected. Contact details are only appended to Mundpay, never Apple. Thank-you redirects do not grant access or prove payment.

The books' public copy remains complete-edition copy per the publisher's launch instructions. The page stays noindex,nofollow. The publisher is responsible for completing and checking the final paid files before traffic is launched; this delivery task is marked complete at their request.

## Order capture

Step 1 collects editable full name and email. Prefill supports personalized URL parameters (`name`/`nome`/`firstname` and `email`, including Brevo uppercase aliases), native browser autocomplete and a 30-day local contact record. No URL or saved identity submits automatically. Invalid/expired values are ignored; values are assigned as form values, never HTML.

`POST /api/study-capture` validates and forwards to the existing Funnel Metrics capture service. Funnel `mdb-studio-it`, ID **298117**, Brevo list **214 — Captura MDB Studio IT**. Selected offer and safe attribution are saved. Social order-recovery configuration is described in the launch section below. Server validation, rate limits, honeypot, no-store, timeouts and strict success checks prevent false capture success.

Mundpay prefill uses its verified `name` and `email` query parameters, with URL encoding. The public checkout bundle reads these parameters. Apple gets no name or email. The Apple capture records interest in Fideora Premium monthly at EUR 7.99; an App Store visit is not a subscription confirmation.

## Validation

Run `node --test tests/study-offer.test.mjs tests/study-order.test.mjs` and `npm run build:website`. Tests cover routing independent of fulfillment flags, App Store fallback for an unapproved SKU, exact provider validation, prefill, safe attribution, capture validation and provider error handling. Browser QA must verify both successful capture redirects on the published page; do not place a purchase for testing.

## Definitive social test route · 2026-11-17

Keep the approved hero, first CTA, offer stacking and prices (€39 once / €7.99 monthly). The device detector handles iPhone, iPad desktop mode, Android and desktop, with an explicit iPhone/Android-Web override. Android goes to the existing Hotmart monthly offer `e792z6va` with a three-day trial; iOS goes to the App Store with provider/campaign tokens. No click is counted as a download, activation or paid subscription.

Legacy `/mappa` and `/mappa/` links redirect to this page and preserve query attribution. Clean social bio routes `/social/instagram`, `/social/facebook`, `/social/tiktok`, `/social/youtube` supply channel attribution. Editing those routes does not prove that the profile bios or external DM text have been edited.

Capture now writes to the shared list 214 plus the exact selected lane: book 217 / iOS 218 / Android 219. Paid book buyers go to 220; paid app subscribers go to 221. Three separate Funnel Metrics funnels and Email Studio sequences avoid crossing book and app reminders. Explicit order-followup request text is shown at submission; up to three reminders, at 10 minutes, 24 hours and 72 hours, include unsubscribe. Only new captures enroll.

First-party events are centralized through `/api/study-events`; capture success is generated on the server. Session-scoped attribution does not retain personalized query parameters. Test traffic is flagged and excluded. Signed 30-day recovery links restore editable contact details without putting a name/email in the URL.

Verified Mundpay orders, Hotmart payments/trials and RevenueCat events suppress recovery. The existing minute worker reconciles status; no new scheduled agent is created. Apple purchases without a verified identity remain unattributed. For unidentified Apple leads, only the initial requested installation instructions are eligible; later sale reminders are cancelled. Missing collected Hotmart amounts are not fabricated. See `integrations/funnel-metrics/fideora-social/` for deployment source, SQL, email copy and checks.

## Meta Pixel RLG

UTMify attribution is implemented in `utmify.mjs`: its official UTMs script loads only after URL privacy cleanup and uses the same QA/privacy gates as Meta. `checkoutContactURL` carries UTMs through JavaScript navigation and adds the official five-slot Hotmart `xcod`, preserving existing safe codes and offer/trial parameters. Mundpay retains its existing `sck`; Apple gets neither contact details nor Hotmart codes. UTMify's separate optimization pixel is not installed alongside the direct Meta SDK. See `docs/fideora-meta-tracking-2026-11-17.md` for native integration status and the exact Meta ad URL template. Run the focused `study-utmify`, `study-meta`, `study-order` and `study-social` tests when changing attribution or redirect behavior.

The collection and grazie routes initialize Pixel `2184650478741381`. The sales page emits PageView, ViewContent and Lead only after successful server capture. AppStoreClick and CheckoutRedirect are custom outbound events. Checkouts own InitiateCheckout, AddPaymentInfo and Purchase; the unverified grazie URL never emits Purchase. No browser event claims an Apple subscription. Personal prefills and signed resume tokens are removed from the URL after prefill parsing and before the vendor loads. Explicit existing Meta refusals, Do Not Track, Global Privacy Control, foreign origins and fm_test=1 disable Meta delivery. The CSP exception is scoped to this sales-page subtree.
