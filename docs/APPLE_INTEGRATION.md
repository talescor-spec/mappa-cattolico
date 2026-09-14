# Fideora — Apple / iOS Integration Plan

This document describes the implementation path for turning the existing React/Vite Fideora app into the iOS product distributed through the App Store.

> App Store approval is governed by the permanent review gate in `docs/APP_STORE_REVIEW_GATE.md` and the repository skill at `.github/skills/apple-appstore-reviewer/SKILL.md`. Any change touching iOS, auth, payments, privacy, permissions, analytics, account lifecycle or review metadata must pass that process.

## Current architecture

- React + Vite client
- Capacitor wrapper for iOS
- Supabase Auth as the canonical Fideora user identity
- `fideora_profiles` + `fideora_progress` protected by own-row RLS
- RevenueCat Capacitor SDK scaffolded for StoreKit subscription access
- authenticated Supabase UUID mapped to RevenueCat `appUserID`
- entitlement target: `premium`
- in-app account deletion scaffold implemented
- Bundle ID currently provisional: `com.fideora.app`
- no live Apple/RevenueCat private credentials are committed to the repository

## Target architecture

`front-end buyer -> Fideora install -> Supabase account -> stable user.id -> RevenueCat appUserID -> StoreKit subscription -> premium entitlement -> Supabase/Funnel Metrics events`

The authenticated Supabase UUID is the application identity. It must be reused after reinstall/device changes rather than creating a fresh subscription identity for each funnel entry.

## Security rules

- `VITE_*` values are public client configuration only.
- Never ship App Store Connect private keys, Apple private keys, RevenueCat secret API keys or Supabase service-role/secret keys in the client.
- Fideora user data is protected with RLS and minimum table grants.
- Premium authority comes from StoreKit/RevenueCat entitlement state, not a local `isPremium` flag.
- Webhooks and privileged subscription/admin operations belong on trusted backend/serverless infrastructure.
- Webhook/event ingestion must be idempotent and preserve original transaction identity.
- Native session persistence must receive a secure-storage/Keychain review before TestFlight.

## Phase 1 — authentication/backend — implemented, E2E validation pending

Implemented:

- Supabase email magic-link client flow;
- profile + progress cloud tables;
- RLS own-row SELECT/INSERT/UPDATE policies;
- `anon` denied Fideora table access;
- local-to-cloud Rosary/novena merge;
- profile/language synchronization;
- authenticated UUID -> RevenueCat identity binding;
- sign out with local personal-data cleanup;
- in-app account deletion entry point;
- deletion warning that an Apple subscription is managed separately by Apple.

Account deletion uses `public.fideora_delete_own_account()` because the connected Supabase project has reached its current Edge Function quota. The RPC takes no user ID, can be executed only by `authenticated`, derives the target from `auth.uid()`, and relies on `ON DELETE CASCADE` for Fideora profile/progress data.

Still required for this phase:

1. configure final Supabase Auth Site URL / allowed redirect URLs;
2. test magic-link round trip on the final web callback and physical iPhone;
3. review native session storage / Keychain strategy;
4. test cross-device merge and account deletion end-to-end.

## Phase 2 — native project

1. Confirm the final Bundle ID.
2. Install dependencies with `npm ci`.
3. Build web assets with `npm run build`.
4. Generate the native project locally on macOS with `npx cap add ios` if it does not already exist.
5. Run `npm run cap:ios` after web changes.
6. Open Xcode with `npm run ios:open`.
7. Select the Apple Developer team/signing identity.
8. Enable In-App Purchase for the app target.
9. Audit `Info.plist`, entitlements, privacy manifests and auth/session storage.
10. Run `npm run appstore:preflight` and perform the first native App Store reviewer audit before remediation.

## Phase 3 — App Store Connect

Create/confirm:

- Fideora app record;
- final Bundle ID;
- subscription group;
- monthly auto-renewable subscription;
- introductory free trial;
- localized subscription display names/descriptions;
- pricing/storefront availability;
- App Privacy answers;
- support URL and privacy policy URL.

## Phase 4 — RevenueCat

Configure:

- iOS app with the same Bundle ID;
- App Store connection;
- Apple subscription product import;
- entitlement `premium`;
- current offering/package;
- public iOS SDK key only in client configuration;
- server-side webhook destination later for Funnel Metrics/Supabase.

## Phase 5 — paywall and subscription UX

Build and test:

- clear recurring price and billing period;
- clear free-trial wording and what happens after trial;
- premium value proposition;
- purchase success/error/cancellation states;
- Restore Purchases;
- subscription-management path;
- no duplicate subscription variants for the same access;
- entitlement refresh after purchase/restore/account sign-in.

## Phase 6 — sandbox/TestFlight

Test at minimum:

- new account + magic-link callback;
- local progress -> cloud migration;
- same Fideora account on another device;
- RevenueCat `appUserID` matches Supabase UUID;
- fresh eligible trial;
- ineligible returning user;
- trial -> paid conversion;
- renewal;
- user cancellation;
- billing issue/recovery;
- refund/revocation;
- reinstall + restore;
- duplicate purchase attempt;
- account deletion;
- deletion while an Apple subscription remains active;
- offline/network failures;
- all six supported languages.

## Phase 7 — Funnel Metrics

Planned normalized events:

- `app_install`
- `account_created`
- `paywall_view`
- `trial_started`
- `trial_cancelled`
- `trial_converted`
- `renewal`
- `billing_issue`
- `billing_recovered`
- `voluntary_churn`
- `involuntary_churn`
- `refund`
- `revocation`

Each event should be idempotent and tied to stable user/subscription identifiers without leaking Apple/RevenueCat secrets to the client.

## Submission gate

Before TestFlight RC and again before App Review submission, run the audit defined in `docs/APP_STORE_REVIEW_GATE.md`. The last pass must verify current official Apple guidance, not rely on a frozen checklist.
