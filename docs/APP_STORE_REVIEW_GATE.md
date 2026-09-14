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
| P1 | IAP / paywall | Scaffolded only | RevenueCat identity/service exists, but no live App Store product, offering or paywall is configured | Create App Store subscription group/product/trial, connect RevenueCat, then build/test paywall |
| P1 | Reviewer access | Not implemented | No stable demo/reviewer account exists yet | Create reviewer access after final auth callback and IAP paths exist |
| P1 | Native privacy metadata | Unverified pre-iOS | Native target has not yet been generated/committed | After `cap add ios`, audit `Info.plist`, entitlements and `PrivacyInfo.xcprivacy` |
| P1 | Native auth token storage | Needs native review | Web preview uses Supabase SDK persisted browser session; Capacitor/iOS secure-storage behavior is not yet finalized | Before TestFlight, store/restore native auth credentials through an approved secure storage/Keychain strategy and re-audit |
| P2 | Auth callback | Implementation ready, platform config pending | Magic-link code exists, but final Supabase Site URL/allowed redirect paths are not yet configured/tested for production/native | Configure final callback URLs and test round-trip on web + iPhone |
| P2 | Bundle identifier | Provisional | `com.fideora.app` is still a placeholder until App Store Connect registration | Confirm final Bundle ID before creating the Apple app record |
| P2 | Account lifecycle | Implemented, E2E test pending | Account deletion starts inside Fideora, deletes only `auth.uid()`, cascades app data and warns about active Apple subscription | Test signup -> sync -> delete -> stale-session behavior before TestFlight |
| P2 | Subscription value | Product definition required | Fideora has recurring faith utilities/content, but the premium catalog/cadence must be explicit | Document ongoing premium value and reflect it consistently in paywall/metadata |
| P2 | Error/offline UX | Partial | Web app works, but native auth/purchase/network failure states have not been fully tested | Add auth/IAP/offline cases to TestFlight acceptance checklist |
| P3 | Reviewer notes | Draft later | Review notes depend on final auth and IAP paths | Generate final notes in the last audit before submission |

## Current positives

- Supabase Auth is wired to the app and `auth.users.id` is the canonical Fideora identity.
- `fideora_profiles` and `fideora_progress` have RLS enabled with own-row SELECT/INSERT/UPDATE policies.
- `anon` has no access to Fideora user tables; authenticated grants are reduced to SELECT/INSERT/UPDATE.
- In-app account deletion is implemented with a no-argument authenticated RPC that can delete only `auth.uid()`.
- RevenueCat user identity is now bound to the Supabase UUID through `appUserID` / `logIn()`.
- RevenueCat secret/server credentials are explicitly forbidden from the client.
- Runtime entitlement target is `premium` and Restore Purchases is scaffolded.
- RevenueCat initialization is limited to native iOS and requires a public SDK key.
- Dependency CI, locked installs, App Store preflight and security baseline exist.
- The product has ongoing-use features rather than being only a static PDF viewer.

## Required checks by stage

### Stage A — current / pre-iOS

- [x] security baseline exists
- [x] RevenueCat/Capacitor architecture separated from web-only behavior
- [x] private credentials forbidden from `VITE_*`
- [x] dependency lockfile + CI
- [x] App Store reviewer skill added to repository
- [x] Supabase Auth client integrated
- [x] Fideora profile/progress RLS implemented
- [x] stable Fideora `user.id` wired to RevenueCat identity
- [x] account deletion starts inside Fideora
- [x] active Apple subscription warning exists in account deletion UI
- [ ] final Supabase Auth callback URLs configured and tested
- [ ] final Bundle ID chosen
- [ ] Apple app record created

### Stage B — native target generated

- [ ] `Info.plist` reviewed
- [ ] permission usage strings reviewed
- [ ] entitlements/capabilities reviewed
- [ ] app-specific privacy manifest reviewed
- [ ] third-party SDK privacy manifests verified
- [ ] native Supabase session persistence reviewed for Keychain/secure storage
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

- [x] account deletion can start inside Fideora
- [x] active Apple subscription warning is shown during account deletion
- [x] own-row RLS and minimum Fideora table grants verified
- [ ] deletion flow tested end-to-end with a real Auth user
- [ ] privacy policy URL works
- [ ] support URL works
- [ ] App Privacy answers match real SDK/data behavior
- [ ] data retention/deletion behavior documented for all future datasets
- [ ] no sensitive token/receipt/PII leakage in logs
- [ ] social login, if added, receives a fresh Apple login-services review

### Stage E — TestFlight release candidate

- [ ] clean install on physical iPhone
- [ ] all six languages smoke-tested
- [ ] onboarding/core free loop works
- [ ] magic-link/native auth recovery works
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

## Account deletion implementation note

The connected Supabase project's Edge Function quota is currently exhausted, so Fideora account deletion uses `public.fideora_delete_own_account()` rather than a new Edge Function. The RPC accepts no user-id argument, is executable only by `authenticated`, derives the target from `auth.uid()`, and removes the Auth row; Fideora profile/progress rows cascade through foreign keys. This design must remain self-only if it is modified later.

## Official Apple sources to re-check before submission

- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Account deletion: https://developer.apple.com/support/offering-account-deletion-in-your-app
- Introductory subscription offers: https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions

Do not treat this document as frozen law. Apple rules and storefront exceptions change; the final audit must verify current official wording.
