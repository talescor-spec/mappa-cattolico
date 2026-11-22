# iOS Meta / RevenueCat setup

Implementation branch: `feature/ios-meta-attribution-20261117`. This is preparation, not a published iOS tracking release.

## Prepared

- Facebook iOS SDK 19.0.1, pinned in the app Xcode project, outside Capacitor's generated package.
- Native ATT bridge, localized Italian/Portuguese purpose strings. Tracking requires actual ATT authorization and valid app configuration. Missing configuration never prompts or initializes Meta.
- The SDK emits activation only; automatic purchases, automatic metadata (screen titles/URLs), sampled screen/layout collection, codeless logging and SDK SKAN updates are disabled. No religious/user content is sent. No campaign attribution is inferred from the user's Bible activity.
- RevenueCat receives authorized device identifiers and the actual Meta anonymous ID after billing configure/login and before paywall purchase. Refusal/revocation clears matching identifiers and consent attributes. No names/emails are added by this integration. Entitlement and billing work independently of tracking.
- Identifiers are refreshed on identity changes; periodic entitlement checks do not log additional activation events. Server events remain RevenueCat's responsibility.
- Candidate numbering: package/Xcode 1.0.3 build 9, greater than the observed published 1.0.2 build 8. Reconcile actual archive source and current ASC build numbers again before upload.
- Capacitor regenerated package now includes the installed RevenueCat UI plugin as well as Purchases.

## Account work pending

1. Meta creation wizard is prepared for **Fideora**, official contact `support@fideora.app`, use case App Promotion, business **BM140 / 1217677992725700**. The last button accepts Meta Platform Terms and Developer Policies, so it awaits action-time confirmation. No app has been created.
2. Configure iOS bundle `com.fideora.app`, Apple ID `6825337165`, privacy `https://fideora.app/privacy.html`, support `https://fideora.app/support.html`. Do not replace these IDs with the web pixel.
3. Save the public Meta App ID and SDK Client Token in untracked `ios/meta.xcconfig.local`, copied from the example. No App Secret, CAPI credential or private key belongs in the app. Both Debug/Release include this configuration; CI currently compiles the unconfigured safe path.
4. In Events Manager verify the dataset really is associated with this Meta app. Web Pixel RLG **2184650478741381** is confirmed in BM140; its presence alone does not link an iOS app.
5. RevenueCat is signed out in the AdsPower browser. Existing project **0df93c61**, iOS config **appfb1ff980e3**. After login, configure recommended CAPI for the verified app dataset; use a credential valid for that destination. Creating/access-expanding credentials may require action-time confirmation.
6. Leave **Send events when ATT consent is not authorized** disabled. Disable automatic IAP logging in the Meta iOS platform settings too. Keep financial events in RevenueCat; don't duplicate SDK purchases. Configure sandbox separately from production. Confirm actual StartTrial/Subscribe events and revenue currency in accepted Meta deliveries; RevenueCat documents USD reporting.
7. Configure SKAN/AEM and campaign eligibility separately if required for app-promotion optimization. This patch does not configure SKAN conversion values or solve anonymous web-to-App-Store campaign matching. Do not claim complete attribution from accepted server events alone.

## UTMify / existing backend

Authenticated RevenueCat events already reach Funnel Metrics project `kgyqpedwgilotlwyhmnb`, function `dashboard-daily-leads` version 38, `?growth=1&action=revenuecat`. The live handler checks `fideora_rc_webhook_token`, limits products, separates non-production events, deduplicates `rc:<event.id>`, stores hashed customer/transaction references and invokes the existing social lifecycle.

No Apple-to-UTMify financial forwarding has been deployed. Reuse the collector and an authenticated/retryable outbox only after verifying UTMify's current schema and a real identity mapping. Never invent a name/email, assign the nearest web lead, turn trial activation into paid revenue, or duplicate renewal transactions. Preserve the current webhook and other apps. Real customer identity and allowed consent must come from a verified app/account link; unknown acquisition stays unknown. No credentials or webhook payloads are kept in this document.

## Validation and release gate

- 25 focused billing/attribution tests passed; the entire suite passed **114 tests** on 17 November.
- Vite build + Capacitor sync passed; 24 App Store structural checks passed. Xcode project parsed successfully.
- New native simulator compilation, physical iPhone ATT authorization/refusal/revocation, StoreKit sandbox, signed archive and privacy-label updates remain pending. GitHub's PR simulator job compiles without signing and cannot replace these device/release checks.
- Do not submit this preparation as a production release until identifiers, real runtime tests, review/privacy metadata and source reconciliation are completed. `appstore:release` remains an independent evidence gate.

Sources verified: RevenueCat Meta integration documentation and official `meta/facebook-ios-sdk` tag `v19.0.1`, commit `7c3fb7856063fa1074d330616f4070f2ed10a49b`; Apple's ATT/privacy guidance. The first-pass review is in `IOS-META-FIRST-PASS-2026-11-17.md`.
