# Fideora public website

The Vercel production domain publishes only this marketing website. Native build commands and the iOS release branch remain separate.

Build: `node scripts/build-website.mjs`. Output: `web-dist`.

Italian is rendered at `/`, Portuguese at `/pt/`. Legal/support URLs used by the shipped app remain available. App screenshots are the actual Italian App Store images fetched on 2026-10-23. No customer testimonials or download counts are invented. The presentation is inspired by a benefit → product demonstration → sources → offer → FAQ progression; no competitor assets or copy are reused.

Reference prices were checked in App Store Connect on 2026-10-23: Italy EUR 59/year, EUR 19/month; Brazil BRL 299.90/year, BRL 99.90/month. The annual introductory trial is 7 days for Apple-eligible accounts; the monthly plan has no trial. Storefront pricing and availability are always determined by Apple. If products/prices change, update `content.mjs` together with the store configuration.

Security boundary: the website build does not ship any application JS, Bible corpus, Supabase SDK or RevenueCat SDK. `sw.js` replaces the old offline worker, removes only `fideora-*` asset caches, refreshes old tabs, then unregisters itself. It does not clear personal localStorage or IndexedDB. Already downloaded offline copies cannot be remotely revoked while disconnected; migration takes effect when they reconnect and the browser updates the worker.

Store links include source/campaign and CTA position, and preserve safe inbound UTM campaign fields. This is link tagging, not complete click/install/purchase attribution. No pixel, cookie banner or new analytics service has been added. Native app authentication, purchases and subscriptions are unchanged. Email-return URLs on the site show app login guidance and remove returned tokens from the visible URL; users complete login with the email code/link in the native app.

Review: `node --check website/site.js`, `node --check website/sw.js`, `node scripts/build-website.mjs`; validate the live domain in desktop/mobile widths, tabs with mouse/keyboard, language links, FAQs, legal pages and App Store CTA. `/bible/it.json`, `/bible/pt.json`, former app bundles and the PWA manifest must return 404 in production. Confirm an existing offline worker migrates to the site after reconnection.
