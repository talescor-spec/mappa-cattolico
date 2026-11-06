# Fideora public website

The Vercel production domain publishes only this marketing website. Native build commands and the iOS release branch remain separate.

Build: `node scripts/build-website.mjs`. Output: `web-dist`.

Italian is rendered at `/`, Portuguese at `/pt/`. Legal/support URLs used by the shipped app remain available. App screenshots are the actual Italian App Store images fetched on 2026-10-23. No customer testimonials or download counts are invented. The presentation is inspired by a benefit → product demonstration → sources → offer → FAQ progression; no competitor assets or copy are reused.

Reference prices were checked in App Store Connect on 2026-10-23: Italy EUR 59/year, EUR 19/month; Brazil BRL 299.90/year, BRL 99.90/month. The annual introductory trial is 7 days for Apple-eligible accounts; the monthly plan has no trial. Storefront pricing and availability are always determined by Apple. If products/prices change, update `content.mjs` together with the store configuration.

Security boundary: the website build does not ship any application JS, Bible corpus, Supabase SDK or RevenueCat SDK. `sw.js` replaces the old offline worker, removes only `fideora-*` asset caches, refreshes old tabs, then unregisters itself. It does not clear personal localStorage or IndexedDB. Already downloaded offline copies cannot be remotely revoked while disconnected; migration takes effect when they reconnect and the browser updates the worker.

Store links include source/campaign and CTA position, and preserve safe inbound UTM campaign fields. This is link tagging, not complete click/install/purchase attribution. No pixel, cookie banner or new analytics service has been added. Native app authentication, purchases and subscriptions are unchanged. Email-return URLs on the site show app login guidance and remove returned tokens from the visible URL; users complete login with the email code/link in the native app.

Review: `node --check website/site.js`, `node --check website/sw.js`, `node scripts/build-website.mjs`; validate the live domain in desktop/mobile widths, tabs with mouse/keyboard, language links, FAQs, legal pages and App Store CTA. `/bible/it.json`, `/bible/pt.json`, former app bundles and the PWA manifest must return 404 in production. Confirm an existing offline worker migrates to the site after reconnection.


## Conversion measurement — 6 November 2026

Annual: 7 trial days then EUR 59/year (BRL 299.90/year); monthly: 3 trial days then EUR 7.99/month (BRL 49.90/month), for Apple-eligible accounts. Apple determines eligibility, currency and terms. This supersedes the historical reference prices above.

The homepage compares monthly and annual plans; `/come-iniziare.html` and `/pt/come-iniziare.html` demonstrate the actual app and explain the subscription gate before installation. Apple campaign links use the provider token generated in App Store Connect and separate tokens per email lane.

`growth.js` records session-level page views, visible demonstrations and store clicks in the existing backend. No email, customer content or Apple identity is sent. It respects DNT/GPC and uses sessionStorage rather than persistent advertising cookies. QA requests include `fm_test=1` and are excluded from production reports. The privacy notice describes this measurement. No website event can record a trial or purchase: these come from the authenticated RevenueCat webhook. Apple downloads and RevenueCat paywall reports remain separate official sources; email-to-purchase attribution is not inferred.

Validation: build and five behavioral tests passed; live mobile layout checked at 390px, all images loaded with no horizontal overflow, and campaign parameters reached App Store. Test page and store-click events are stored separately. RevenueCat test webhook returned HTTP 200 without recording a conversion. Physical-device purchase completion remains unverified.
