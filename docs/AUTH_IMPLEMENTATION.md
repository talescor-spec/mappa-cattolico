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

- verify the published custom-domain login after the dedicated-backend deployment
- generate native iOS target and implement/audit secure native session persistence
- test login/reinstall/cross-device/account-deletion behavior on a physical iPhone
- create reviewer/demo credentials before App Review

## Supabase placement

Fideora now targets the dedicated project `sysuottboucultzzaagv` (Fideora, us-west-2). The project was empty before installation. The owner configured Auth URLs and custom SMTP, then confirmed receipt of the login email and successful login on the prepared version. Read-only database verification confirmed one confirmed, signed-in user and automatic creation of profile/progress records. No users or tables from Funnel Metrics were copied or deleted. See SUPABASE-CUTOVER.md for release evidence.

## Account deletion implementation

The existing account-deletion design is preserved in the dedicated project. `public.fideora_delete_own_account()` is used for self-deletion. It accepts no target user ID, requires `authenticated`, derives the target from `auth.uid()`, and deletes only that Auth row. Do not alter it to accept arbitrary user IDs.
