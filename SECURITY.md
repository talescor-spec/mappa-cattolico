# Fideora Security Baseline

## Current architecture

Fideora is a React/Vite client deployed on Vercel and prepared for iOS through Capacitor. Supabase Auth + RLS now provide the canonical user identity and cloud progress layer. RevenueCat is installed as the StoreKit/subscription layer; the authenticated Supabase `user.id` is the target RevenueCat `appUserID`. No private Apple, RevenueCat or Supabase server credential belongs in the client.

## Non-negotiable rules

1. **Never commit secrets.** `.env` and local environment files are ignored by Git.
2. **Treat every `VITE_*` variable as public.** Vite bundles these values into client code.
3. **Never expose server secrets in the client.** This includes Supabase service-role/secret keys, Apple private keys, App Store Connect private keys and RevenueCat secret API keys.
4. **Use trusted server/database boundaries for privileged actions.** Subscription lifecycle webhooks and admin operations must be verified by trusted backend infrastructure.
5. **Supabase user data uses Row Level Security.** The client uses a publishable key; Fideora user-owned rows are restricted by `auth.uid()` policies.
6. **Least privilege at the SQL grant layer.** `authenticated` receives only SELECT/INSERT/UPDATE on Fideora profile/progress tables; `anon` receives no table access.
7. **StoreKit/RevenueCat entitlements are authoritative for premium access.** Never trust a client-side boolean such as `isPremium` as the source of truth.
8. **One user = one entitlement identity.** Supabase `auth.users.id` maps to RevenueCat `appUserID` so reinstall/device changes do not create a second application identity.
9. **No custom auth tokens in app LocalStorage.** The web preview currently uses the Supabase SDK's standard persisted browser session. Before the native iOS TestFlight release candidate, session/token persistence must be reviewed and moved to an appropriate native secure-storage/Keychain strategy if the Capacitor runtime would otherwise persist credentials in ordinary web storage.

## Account deletion

Fideora exposes an in-app deletion flow. The database RPC `fideora_delete_own_account()`:

- accepts no user-id parameter;
- requires an authenticated JWT;
- derives the target exclusively from `auth.uid()`;
- deletes that one `auth.users` row;
- relies on `ON DELETE CASCADE` for Fideora profile/progress data;
- is executable by `authenticated` only, not `anon`/`public`.

The project had already reached its Supabase Edge Function plan limit, so the self-only database RPC is used instead of adding a new administrative Edge Function. The client signs out and clears local personal data after deletion. The UI explicitly warns that deleting the Fideora account does not automatically cancel an active Apple subscription.

## Browser hardening

The Vercel deployment defines a Content Security Policy and defensive response headers in `vercel.json`. The Fideora Supabase HTTPS/WSS project origin is explicitly allow-listed in `connect-src`; new external origins must be reviewed before being added.

## Dependency security

- builds use a committed `package-lock.json`
- CI uses `npm ci`
- CI fails on **moderate-or-higher production/runtime advisories**
- CI fails on **high-or-critical advisories across the complete dependency tree**
- Dependabot checks npm dependencies weekly

At the time the Capacitor scaffold was introduced, npm reported moderate advisories through the development-only Capacitor CLI chain (`@capacitor/cli -> xcode -> uuid`). They are not included in the production/runtime dependency audit and no high/critical advisory is accepted by CI. This toolchain issue remains monitored rather than forcing an unreviewed CLI downgrade.

## Authentication status

Implemented:

- Supabase email magic-link scaffold
- `fideora_profiles` and `fideora_progress`
- own-row RLS policies
- minimal SQL grants
- local-to-cloud progress migration/merge
- language/profile sync
- in-app sign out and account deletion
- stable Supabase UUID -> RevenueCat identity mapping

Still required before production/native authentication is considered complete:

- configure approved Supabase Auth redirect URLs for the final web/native callback path
- test magic-link round trip on the final domain and physical iPhone
- review native secure session storage
- test cross-device merge, logout/login and deleted-account behavior
- create reviewer/demo access before App Review

## Before enabling App Store subscriptions

- confirm the final Bundle ID before creating the App Store record
- create products/subscription group in App Store Connect
- use StoreKit/RevenueCat SDK keys only on the client
- keep App Store Connect private keys and RevenueCat secret API keys server-side
- validate RevenueCat webhooks/signatures server-side
- make webhook processing idempotent
- store original transaction identifiers with uniqueness constraints
- keep Restore Purchases available
- test sandbox renewals, cancellations, billing issues, refunds and revocations

## Incident rule

If a private credential is ever committed or exposed, removing it from the repository is not sufficient. Revoke/rotate the credential immediately, then clean history if needed.
