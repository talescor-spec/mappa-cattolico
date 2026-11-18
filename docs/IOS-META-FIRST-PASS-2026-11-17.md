# Fideora iOS attribution: first-pass review

## Executive summary

Fideora is a Catholic study/prayer app with optional Supabase authentication and StoreKit subscriptions through RevenueCat (`premium`). Guest purchases remain supported. The website already measures visits and checkout exits. The shipped iOS app does not yet implement Meta attribution. This audit precedes native code changes; no new iOS release is approved by this report.

Verified browser context: AdsPower profile P96, Meta identity P96 BACKUP, business BM140 (`1217677992725700`), Pixel RLG (`2184650478741381`). No Fideora is listed among this identity's four developer apps. A new app registration is being prepared; IDs and permissions are not yet configured.

## Risk register

| Priority | Area | Finding | Evidence | Why it matters for review | Remediation | Effort | Confidence |
|---|---|---|---|---|---|---|---|
| P0 blocker | Native attribution | No Meta SDK, app configuration or ATT flow | AppDelegate, SceneDelegate, Info.plist, Package.swift inspected at main 87220ca | Attribution cannot work; consent must precede tracking | Add native SDK/ATT bridge, identifiers after RevenueCat configuration, fail closed | Medium | Verified source |
| P1 high | Privacy | Manifest and native policy declare no tracking | PrivacyInfo.xcprivacy and src/data/legal.json | New binary and store declarations must agree | Update disclosures for actual consent-gated identifiers; exclude religious/user content | Medium | Verified source |
| P1 high | Revenue duplication | SDK automatic IAP and RC server events could count the same purchase | RevenueCat official Meta documentation, inspected 17 November | Incorrect conversion/revenue reporting | Disable automatic SDK purchases; RevenueCat owns financial events | Small | Verified integration risk |
| P1 high | Consent refusal | Billing/auth must work with denied/restricted ATT | Existing optional auth and CustomerInfo entitlement paths | Tracking cannot gate purchases or premium | Isolate attribution errors; test denied/revoked/unsupported | Medium | Requires native runtime test |
| P1 high | Release identity | Published 1.0.2 build 8 differs from main Xcode 1.0.0 build 1, package 1.0.3 | Live ASC and repository inspected | Wrong base/version can replace newer functionality or fail upload | Reconcile release base; use a higher build only after archive validation | Medium | Verified mismatch |
| P1 high | Native acceptance | No new compiled simulator, signed archive or physical ATT/billing test | No native changes before this audit | Cannot certify production behavior from web/unit tests | Compile on macOS; test real iPhone and sandbox StoreKit; capture truthful evidence | Medium | Unverified |
| P1 high | UTMify identity | Anonymous purchase cannot be assigned to a web lead by proximity | RC optional auth and existing FM webhook | Fabricated attribution or personal data disclosure | Reuse authenticated collector, deduplicate genuine events, retain unknown source | Medium | Verified design constraint |
| P2 medium | Credentials | Correct Meta App/dataset and RC write access unverified | App registration pending, RC Meta form previously blank | Avoid wrong business or broad credential reuse | Verify destination and scope in platform; keep server secrets out of repository | Small | Pending account configuration |

## Reviewer journey

1. Launch and finish onboarding in Italian or Portuguese; guest mode remains available.
2. At a relevant acquisition/paywall point, request the native ATT authorization once; refusal must leave the app usable.
3. Exercise a free reading feature and optional email authentication.
4. Open the native RevenueCat offering; display actual localized StoreKit price and eligible trial.
5. Buy using sandbox, cancel another purchase, retry on network error, and restore.
6. Confirm entitlement from CustomerInfo; tracking results never unlock premium.
7. Reopen/foreground the app, verify activation is not emitted by the 60-second entitlement refresh.
8. Revoke ATT in Settings; no subsequent advertising identifiers may be forwarded.
9. Open profile, support, privacy, subscription management and account deletion. Deletion must explain that it does not cancel an Apple subscription.
10. Repeat with offline/network errors; never block purchase or restore on an attribution vendor failure.

## App Review Notes draft

Fideora provides Bible study, prayer and ongoing premium features. Account creation is optional. To inspect subscriptions, finish onboarding and open the Premium offering. Purchases and restore use Apple's StoreKit through RevenueCat; the entitlement is `premium`. Tracking permission is optional and is requested through Apple's ATT prompt. Rejecting it does not prevent purchase, restore or Premium access. Advertising measurement receives technical identifiers only after authorization; notes, intentions and reading content are excluded. Reviewer test credentials, if needed: **[provide verified disposable account]**. New build/version and device evidence: **[pending]**.

## Gate

Do not upload this as a release candidate while P0 items remain. Do not submit to App Review with unresolved P0/P1 without explicit acceptance and actual supporting evidence. A unit/build pass is not a signed-device or purchase test.

Official references: https://www.revenuecat.com/docs/integrations/attribution/meta-ads ; https://developer.apple.com/app-store/user-privacy-and-data-use/ ; https://developer.apple.com/documentation/apptrackingtransparency
