# Fideora Auth / Identity Implementation

## Canonical identity

Supabase `auth.users.id` is the canonical Fideora user identifier and the RevenueCat `appUserID`.

## Implemented

- email magic-link authentication scaffold
- `fideora_profiles` and `fideora_progress`
- own-row RLS policies using `auth.uid()`
- minimum authenticated table grants: SELECT / INSERT / UPDATE
- no anonymous table access
- automatic profile/progress creation on Auth signup
- local Rosary/novena progress merge into cloud state
- profile/name/language synchronization
- RevenueCat `logIn` / `logOut` identity lifecycle
- in-app account deletion flow
- account-deletion RPC can only delete current `auth.uid()`
- profile/progress cascade on Auth user deletion
- Apple subscription warning during account deletion
- Supabase project origin allow-listed by web CSP

## Remaining platform configuration

- configure final Supabase Site URL and allowed Auth redirect URLs
- test magic-link flow end-to-end on final web URL
- generate native iOS target and implement/audit secure native session persistence
- test login/reinstall/cross-device/account-deletion behavior on a physical iPhone
- create reviewer/demo credentials before App Review

## Supabase placement

The Premium branch is prepared for the dedicated project sysuottboucultzzaagv (us-west-2). The three Fideora tables and nine own-row RLS policies are installed there. Ten transactional isolation/account-deletion checks passed, with fixtures rolled back. See DEDICATED-SUPABASE.md for the deployment state and pending Auth URL/SMTP configuration.

Public web production still uses metrics-dashboard (kgyqpedwgilotlwyhmnb) until the dedicated login is configured and accepted. Its Fideora tables were last checked with zero rows. No shared Auth users or Funnel Metrics data were copied or deleted.

## Account deletion implementation

The application uses the existing self-deletion RPC design. `public.fideora_delete_own_account()` is therefore used for self-deletion. It accepts no target user ID, requires `authenticated`, derives the target from `auth.uid()`, and deletes only that Auth row. Do not alter it to accept arbitrary user IDs.
