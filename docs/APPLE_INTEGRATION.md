# Fideora — Apple / iOS Integration Plan

This document describes the implementation path for turning the existing React/Vite Fideora app into the iOS product distributed through the App Store.

> App Store approval is governed by the permanent review gate in `docs/APP_STORE_REVIEW_GATE.md` and the repository skill at `.github/skills/apple-appstore-reviewer/SKILL.md`. Any change touching iOS, auth, payments, privacy, permissions, analytics, account lifecycle or review metadata must pass that process.

## Current architecture

- React + Vite client
- Capacitor wrapper for iOS
- RevenueCat Capacitor SDK scaffolded for StoreKit subscription access
- entitlement target: `premium`
- Bundle ID currently provisional: `com.fideora.app`
- no live Apple/RevenueCat private credentials are committed to the repository

## Target architecture

`front-end buyer -> Fideora install -> account/auth -> RevenueCat appUserID -> StoreKit subscription -> premium entitlement -> Supabase/Funnel Metrics events`

Identity must be stable and idempotent. Once Supabase Auth exists, use the authenticated Fideora user ID as the RevenueCat `appUserID`. Do not create a new anonymous subscription identity on every reinstall or funnel entry.

## Security rules

- `VITE_*` values are public client configuration only.
- Never ship App Store Connect private keys, Apple private keys, RevenueCat secret API keys or Supabase service-role keys in the client.
- Premium authority comes from StoreKit/RevenueCat entitlement state, not a local `isPremium` flag.
- Webhooks and privileged subscription/admin operations belong on trusted backend/serverless infrastructure.
- Webhook/event ingestion must be idempotent and preserve original transaction identity.

## Phase 1 — native project

1. Confirm the final Bundle ID.
2. Install dependencies with `npm ci`.
3. Build web assets with `npm run build`.
4. Generate the native project locally on macOS with `npx cap add ios` if it does not already exist.
5. Run `npm run cap:ios` after web changes.
6. Open Xcode with `npm run ios:open`.
7. Select the Apple Developer team/signing identity.
8. Enable In-App Purchase for the app target.
9. Run `npm run appstore:preflight` and perform the first native App Store reviewer audit before remediation.

## Phase 2 — authentication/backend

Before enabling live subscriptions:

- implement Supabase Auth;
- enable RLS on every user-owned table;
- sync Rosary/novena/profile progress through authenticated ownership;
- implement in-app account deletion;
- explain active Apple subscription behavior during deletion;
- use the authenticated Fideora user ID as RevenueCat `appUserID`.

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

- fresh eligible trial;
- ineligible returning user;
- trial -> paid conversion;
- renewal;
- user cancellation;
- billing issue/recovery;
- refund/revocation;
- reinstall + restore;
- same Fideora account on another device;
- duplicate purchase attempt;
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
