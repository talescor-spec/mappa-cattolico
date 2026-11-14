# Fideora website and Android access

`npm run build:website` publishes the Italian sales page at `/`, Portuguese at `/pt/`, and authenticated Android PWA at `/app/`. The two legacy `/come-iniziare.html` campaign URLs render the same new sales page. Legal/support and thank-you URLs remain available.

The sales page continues the video → Bible context → Matthew map → four Gospel comparison → personal notebook experience. Its demonstrations reuse the original editorial `MATTHEW` and `GOSPELS` data used inside the app; it does not promise a complete visual atlas. Scripture-edition limitations stay in the FAQ.

`platform.mjs` detects Android and iOS/iPadOS (including iPads presenting a Mac UA). Unknown/desktop visitors see both destinations. Visitors can switch platform explicitly; `?platform=android` and `?platform=ios` override detection. No automatic sales-page redirect occurs. Android CTAs open `/app/` with a safe language and plan hint; Apple CTAs open the verified App Store product. Platform switching preserves safe campaign fields. Auth tokens and arbitrary query fields never enter CTA or language URLs; email callbacks on the apex still forward to the PWA.

Annual: 7 trial days; monthly: 3 trial days for eligible new subscribers, payment method required, then automatic paid renewal unless cancelled. Italian reference prices: EUR 59/year or EUR 7.99/month. Portuguese Apple reference prices: BRL 299.90/year or BRL 49.90/month. Hotmart's base prices are EUR 59/year and EUR 7.99/month; checkout determines currency, conversion and final price. Never hardcode a converted BRL price for Hotmart. Apple and web purchases are separate; existing customers should contact support before starting another subscription.

Android requires a verified email, the same checkout email, internet and an active subscription/trial. Installing the PWA does not bypass access control. Billing code, protected Bible delivery and iOS subscription behavior remain separate from the sales site. No Bible corpus is published as a marketing asset. `sw.js` updates the former root worker without deleting personal data or the `/app/` worker.

`growth.js` uses the existing aggregate collector for page views, demo exposure and Apple-only store clicks. It respects DNT/GPC and uses a session identifier. Android web access is deliberately not logged as an App Store click: the current backend only accepts `page_view`, `store_click`, `demo_view`. Campaign email click reporting and device-level website views remain available; neither establishes a paid conversion. Use `fm_test=1` for QA.

Validation: `npm test`, `npm run build:website`, `npm run appstore:preflight`, plus browser checks on desktop and mobile for device choices, plans, legacy campaign links, tabs with keyboard, language, FAQs, legal pages, and CTA destinations. A real new subscriber's email verification → Hotmart trial → Premium access test is still required before sending the reactivation campaign.
