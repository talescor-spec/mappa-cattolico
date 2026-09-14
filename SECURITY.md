# Fideora Security Baseline

## Current architecture

Fideora is currently a React/Vite client deployed on Vercel and prepared for iOS through Capacitor. RevenueCat is installed as the future StoreKit/subscription layer, but no real payment credential is committed and purchase initialization is not wired to app startup yet.

## Non-negotiable rules

1. **Never commit secrets.** `.env` and local environment files are ignored by Git.
2. **Treat every `VITE_*` variable as public.** Vite bundles these values into client code.
3. **Never expose server secrets in the client.** This includes Supabase service-role keys, Apple private keys, App Store Connect private keys and RevenueCat secret API keys.
4. **Use server-side verification for privileged actions.** Subscription lifecycle webhooks and admin operations must be verified by a trusted backend/serverless function.
5. **Supabase must use Row Level Security.** Client access must use the anon/publishable key only; user-owned rows must be protected by RLS policies based on the authenticated user id.
6. **StoreKit/RevenueCat entitlements are authoritative for premium access.** Never trust a client-side boolean such as `isPremium` as the source of truth.
7. **One user = one entitlement identity.** RevenueCat/App Store transaction identity must be mapped idempotently to a single Fideora user to prevent duplicate subscription state.
8. **Do not store auth/session secrets in application LocalStorage.** Current LocalStorage is limited to non-sensitive UI preferences/progress and is validated before use.

## Browser hardening

The Vercel deployment defines a Content Security Policy and defensive response headers in `vercel.json`. Any new external origin (Supabase, analytics, CDN, auth, etc.) must be explicitly reviewed before it is added to CSP.

## Dependency security

- builds use a committed `package-lock.json`
- CI uses `npm ci`
- CI fails on **moderate-or-higher production/runtime advisories**
- CI fails on **high-or-critical advisories across the complete dependency tree**
- Dependabot checks npm dependencies weekly

At the time the Capacitor scaffold was introduced, npm reported moderate advisories through the development-only Capacitor CLI chain (`@capacitor/cli -> xcode -> uuid`). They are not included in the production/runtime dependency audit and no high/critical advisory is accepted by CI. This toolchain issue remains monitored rather than forcing an unreviewed CLI downgrade.

## Before enabling authentication

- configure Supabase Auth
- enable RLS on every user-facing table before inserting production data
- restrict CORS/origins where applicable
- define account deletion/export flows
- add rate limiting to any custom public API or edge function
- review logging to avoid PII or tokens

## Before enabling App Store subscriptions

- confirm the final Bundle ID before creating the App Store record
- create products/subscription group in App Store Connect
- use StoreKit/RevenueCat SDK keys only on the client
- keep App Store Connect private keys and RevenueCat secret API keys server-side
- validate RevenueCat webhooks/signatures server-side
- make webhook processing idempotent
- store original transaction identifiers with uniqueness constraints
- implement Restore Purchases
- test sandbox renewals, cancellations, billing issues, refunds and revocations

## Incident rule

If a private credential is ever committed or exposed, removing it from the repository is not sufficient. Revoke/rotate the credential immediately, then clean history if needed.
