# Fideora — App Store Review Gate

This document is the operating checklist for App Store readiness. It complements `SECURITY.md` and `docs/APPLE_INTEGRATION.md`.

## Gate policy

- Every change touching iOS, auth, privacy, subscriptions, RevenueCat, StoreKit, permissions, analytics, external links or account lifecycle must be evaluated against `.github/skills/apple-appstore-reviewer/SKILL.md`.
- First pass = audit only. Do not patch before the risk register exists.
- P0 = blocker. P1 = high rejection/reviewer risk. P2 = medium. P3 = polish.
- No P0 before a TestFlight release candidate.
- No unresolved P0/P1 before App Review submission unless the exception is documented with current Apple evidence.

## Current Fideora risk register

| Priority | Area | Current status | Evidence / reason | Next action |
|---|---|---|---|---|
| P1 | Account lifecycle | Not implemented | Supabase Auth is not connected yet, so in-app account deletion does not exist | Build auth and account deletion together; deletion must explain active Apple subscription behavior |
| P1 | IAP / paywall | Scaffolded only | RevenueCat service exists, but no live App Store product, offering or paywall is configured | Create App Store subscription group/product/trial, connect RevenueCat, then build/test paywall |
| P1 | Reviewer access | Not implemented | No authenticated backend/demo reviewer account exists yet | Create stable demo/reviewer account and document steps before submission |
| P1 | Native privacy metadata | Unverified pre-iOS | Native target has not yet been generated/committed | After `cap add ios`, audit `Info.plist`, entitlements and `PrivacyInfo.xcprivacy` |
| P2 | Bundle identifier | Provisional | `com.fideora.app` is a placeholder until App Store Connect registration | Confirm final Bundle ID before creating the Apple app record |
| P2 | Subscription value | Product definition required | Fideora has recurring faith utilities/content, but the premium catalog/cadence must be explicit | Document ongoing premium value and reflect it consistently in paywall/metadata |
| P2 | Error/offline UX | Partial | Web app works, but native purchase/network failure states have not been tested | Add sandbox/error/offline cases to TestFlight acceptance checklist |
| P3 | Reviewer notes | Draft later | Review notes depend on final auth and IAP paths | Generate final notes in the last audit before submission |

## Current positives

- RevenueCat secret/server credentials are explicitly forbidden from the client.
- Runtime entitlement target is `premium`.
- Restore Purchases service is already scaffolded.
- RevenueCat initialization is limited to native iOS and requires a public SDK key.
- Dependency CI, locked installs, production audit and security baseline already exist.
- The product has ongoing-use features rather than being only a static PDF viewer.

## Required checks by stage

### Stage A — current / pre-iOS

- [x] security baseline exists
- [x] RevenueCat/Capacitor architecture separated from web-only behavior
- [x] private credentials forbidden from `VITE_*`
- [x] dependency lockfile + CI
- [x] App Store reviewer skill added to repository
- [ ] final Bundle ID chosen
- [ ] Apple app record created
- [ ] Supabase Auth/RLS implemented
- [ ] stable Fideora user ID wired to RevenueCat `appUserID`

### Stage B — native target generated

- [ ] `Info.plist` reviewed
- [ ] permission usage strings reviewed
- [ ] entitlements/capabilities reviewed
- [ ] app-specific privacy manifest reviewed
- [ ] third-party SDK privacy manifests verified
- [ ] In-App Purchase capability enabled
- [ ] signing/team/Bundle ID verified
- [ ] app icon/launch experience verified on device

### Stage C — monetization connected

- [ ] subscription group created
- [ ] monthly product created
- [ ] free trial/intro offer configured
- [ ] RevenueCat project/app/product/offering connected
- [ ] entitlement `premium` mapped
- [ ] paywall displays price/period/trial/renewal clearly
- [ ] successful sandbox purchase tested
- [ ] cancellation flow tested
- [ ] Restore Purchases tested
- [ ] billing issue/recovery behavior tested
- [ ] refund/revocation behavior tested
- [ ] duplicate-subscription scenarios tested

### Stage D — account/privacy review

- [ ] account deletion can start inside Fideora
- [ ] active Apple subscription warning is shown during account deletion
- [ ] privacy policy URL works
- [ ] support URL works
- [ ] App Privacy answers match real SDK/data behavior
- [ ] data retention/deletion behavior documented
- [ ] no sensitive token/receipt/PII leakage in logs
- [ ] social login, if added, receives a fresh Apple login-services review

### Stage E — TestFlight release candidate

- [ ] clean install on physical iPhone
- [ ] all six languages smoke-tested
- [ ] onboarding/core free loop works
- [ ] paywall works
- [ ] purchase works
- [ ] restore works after reinstall/sign-in
- [ ] offline and server-error states do not dead-end
- [ ] demo/reviewer credentials work
- [ ] no placeholder content/URLs
- [ ] current App Store Guidelines rechecked
- [ ] P0 count = 0

### Stage F — App Review submission

- [ ] P0 count = 0
- [ ] P1 count = 0 or explicitly resolved with evidence
- [ ] IAP visible and reviewable
- [ ] backend live
- [ ] reviewer account or full demo mode supplied
- [ ] Notes for Review explain non-obvious features and IAP test path
- [ ] screenshots/description accurately identify premium content
- [ ] support/privacy URLs live

## Official Apple sources to re-check before submission

- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Account deletion: https://developer.apple.com/support/offering-account-deletion-in-your-app
- Introductory subscription offers: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions

Do not treat this document as frozen law. Apple rules and storefront exceptions change; the final audit must verify current official wording.
