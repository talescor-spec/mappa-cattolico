# Fideora web for Android

Public entry: `https://fideora.app/app/`. This builds the current native UI into a separate browser bundle. The marketing pages and Apple release branch remain separate. Billing here uses Hotmart and is not automatically portable to Apple/Google RevenueCat entitlements.

## Current activation state

Web UI, verified-email access, installable PWA shell, server access checks, protected Bible endpoint and Hotmart webhook are implemented. Monthly and annual database configurations start **inactive**. No Hotmart checkout, price or trial is advertised until the real provider configuration is supplied. No payment has been made or simulated as a real sale.

## Complete after creating the Hotmart subscription

1. Obtain the product ucode (and optionally numeric product ID), monthly/annual plan IDs, exact checkout URLs and final prices/currencies. The checkout must be on `https://pay.hotmart.com/`. Activate only the plans being offered; the default annual/monthly intervals are 12/1 calendar months.
2. Set the account's real Hottok as the **server-only** Supabase Edge Function secret `HOTMART_HOTTOK` in the Fideora project (`sysuottboucultzzaagv`). Do not put it in a VITE variable, git, a checkout URL or frontend code.
3. Configure a Hotmart 2.0.0 webhook to `https://sysuottboucultzzaagv.supabase.co/functions/v1/fideora-hotmart` for `PURCHASE_APPROVED`, `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_CANCELED`, `PURCHASE_DELAYED`, `PURCHASE_EXPIRED` and `SUBSCRIPTION_CANCELLATION`. Hotmart sends `X-HOTMART-HOTTOK`; the server authenticates it before parsing the event. Unsupported products/plans are ignored. The configured numeric product ID is a fallback for payloads without a product ucode.
4. Populate `fideora_web_plans` using trusted server/admin access. Set the matching product/plan, checkout URL, amount and currency and mark the intended plan active. No browser role can modify billing tables or execute the payment processing function.
5. Use Hotmart's test notification, then verify a real approved payment using a controlled buyer account, renew/cancel/refund behavior, and the same verified email on Fideora. Only then distribute the checkout as a functioning subscription link. A Hotmart test/sample payload must never be promoted to a real subscriber record.
6. Set the Hotmart thank-you/return page to `https://fideora.app/app/`. A return URL or query parameter never grants access: the server's payment record does. A buyer can return manually and use “Ho già acquistato · Verifica accesso”.

## Access model

Supabase Auth verifies the email; `/functions/v1/fideora-web-access` verifies the JWT with `auth.getUser` and matches the **verified email**, never client-editable metadata. Purchase email is not silently appended to an external checkout URL. The UI tells buyers to use the same email at Hotmart. This also supports purchases made before creating the Fideora account.

Approved transaction dates determine expiry. The authoritative next-charge date is used when supplied; otherwise the configured calendar month/year period is used. Duplicate events are ignored transactionally. Canceling renewal does not remove a paid period. Refunds/chargebacks are terminal for that transaction, so a late approval cannot resurrect it. Failed new renewal transactions do not revoke a different paid transaction. Expiry is checked on the server without needing a scheduled job.

`/api/web-bible?lang=it|pt` verifies access before returning the corpus; JSON files are included only inside the server function, compressed below the response-size limit. They are never published in `web-dist/app` or saved in its service worker cache. The shell is installable but full web use requires connectivity. Native offline reading remains a separate capability.

No changes to Supabase Auth redirect settings are needed: the pre-existing root callback forwards auth returns only to the same-origin `/app/` page, where Supabase consumes the session. Existing email-code/link copy login remains supported.

## Validation

- 61 automated cases passed, including webhook authentication, malformed/unapproved events, subscriber cancellation and API entitlement/expiry checks.
- Database transaction verified approval, deduplication, paid-period preservation, refund terminality and denial of browser privileges. All synthetic QA rows were rolled back.
- Existing 24 structural checks passed. Public builds exclude the Bible corpus; server gzip responses are approximately 1.46 MB IT / 1.35 MB PT.
- Live unauthenticated plans request returns an empty list; unauthenticated webhook returns 401. This is intentional while Hotmart is unconfigured.
- Advisory review: the four new tables intentionally deny all browser access (RLS with no policies and all browser grants revoked). The pre-existing account-deletion function warning predates this work.
- Real checkout, login on a physical Android and payment lifecycle acceptance remain pending provider configuration and owner testing. Passing code tests is not proof of a completed payment.

Official provider references: https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/purchase-webhook/ and https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/cancel-subscription-webhook/.

## Publication checkpoint — 14 November 2026

Backend migration and both Supabase functions were deployed with Hotmart disabled. Frontend publication was rejected by automatic approval review because explicit authorization to publish to `talescor-spec/mappa-cattolico` was required. No GitHub push, PR or production frontend deployment occurred. The prepared local branch is `feature/fideora-web-hotmart-20261114`. Browser visual QA remains incomplete because the connected browser could not reach the isolated local preview server. Local HTTP tests exercise the built app shell and the same API handlers.
