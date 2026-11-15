# Fideora website and Android access

`npm run build:website` publishes the Italian sales page at `/`, Portuguese at `/pt/`, and authenticated Android PWA at `/app/`. The two legacy `/come-iniziare.html` campaign URLs render the same new sales page. Legal/support and thank-you URLs remain available.

The sales page continues the video → Bible context → Matthew map → four Gospel comparison → personal notebook experience. Its product tour uses actual screenshots captured from the current production web app on 2026-11-14; it does not promise a complete visual atlas. Scripture-edition limitations stay in the FAQ.

`platform.mjs` detects Android and iOS/iPadOS (including iPads presenting a Mac UA). Unknown/desktop visitors see both destinations. Visitors can switch platform explicitly; `?platform=android` and `?platform=ios` override detection. No automatic sales-page redirect occurs. Android trial CTAs open the selected public Hotmart offer directly with `showOnlyTrial=1`; annual is the hero default. Apple CTAs open the verified App Store product. Both use the same 7-day annual / 3-day monthly trial copy and primary style. The separate returning-customer link still opens `/app/`. Platform switching preserves safe campaign fields. Auth tokens and arbitrary query fields never enter CTA or language URLs; email callbacks on the apex still forward to the PWA.

Annual: 7 trial days; monthly: 3 trial days for eligible new subscribers, payment method required, then automatic paid renewal unless cancelled. Italian reference prices: EUR 59/year or EUR 7.99/month. Portuguese Apple reference prices: BRL 299.90/year or BRL 49.90/month. Hotmart's base prices are EUR 59/year and EUR 7.99/month; checkout determines currency, conversion and final price. Never hardcode a converted BRL price for Hotmart. Apple and web purchases are separate; existing customers should contact support before starting another subscription.

After checkout, Android access requires verification of the same checkout email, internet and an active subscription/trial. The login appears before onboarding; active customers see onboarding with an access CTA rather than another invitation to subscribe. Installing the PWA does not bypass access control. Billing code, protected Bible delivery and iOS subscription behavior remain separate from the sales site. No Bible corpus is published as a marketing asset. `sw.js` updates the former root worker without deleting personal data or the `/app/` worker.

`growth.js` uses the existing aggregate collector for page views, demo exposure and Apple-only store clicks. It respects DNT/GPC and uses a session identifier. Android web access is deliberately not logged as an App Store click: the current backend only accepts `page_view`, `store_click`, `demo_view`. Campaign email click reporting and device-level website views remain available; neither establishes a paid conversion. Use `fm_test=1` for QA.

Validation: `npm test`, `npm run build:website`, `npm run appstore:preflight`, plus browser checks on desktop and mobile for device choices, plans, legacy campaign links, tabs with keyboard, language, FAQs, legal pages, and CTA destinations. A real new subscriber's email verification → Hotmart trial → Premium access test is still required before sending the reactivation campaign.

## Real product imagery

`assets/app-mappa.jpg`, `app-vangeli.jpg`, `app-versetto.jpg`, and `app-quaderno.jpg` are unaltered 390×844 screenshots of the production web UI in Italian, captured 2026-11-14. They show the Matthew map, Gospel comparison, verse annotation and notebook. The notebook reflection is original demonstration content, not a testimonial or a customer record. No account credentials or profile data appear in these assets. Combined image weight is approximately 133 KB.

The hero features two real screens. The four-step tour pairs each screenshot with a concrete benefit, supports keyboard selection and offers native-dialog enlargement. Decorative floating/reveal animations respect `prefers-reduced-motion`, and the floating screens pause outside the viewport. Images have fixed dimensions; tour images lazy-load. Existing platform selection, trial copy, direct Hotmart checkout and App Store routes are preserved.

Hotmart's historical external delivery URL includes `?review=hotmart`. It now defaults to normal buyer email-code authentication, matching `/app/`. The dedicated password login for reviewers is an explicit optional button on that URL; the URL never grants Premium or changes server authorization.
