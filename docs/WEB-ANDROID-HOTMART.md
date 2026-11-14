# Fideora web for Android

Public entry: `https://fideora.app/app/`. This builds the current native UI into a separate browser bundle. The marketing pages and Apple release branch remain separate. Billing here uses Hotmart and is not automatically portable to Apple/Google RevenueCat entitlements.

## Current activation state

Web UI, verified-email access, installable PWA shell, server access checks, protected Bible endpoint and Hotmart webhook are implemented. The Hotmart product and both offers have been created and verified through the provider API. Monthly (€7.99, 3-day trial) and annual (€59, 7-day trial) database configurations remain **inactive** while product review and live checkout acceptance are pending. No payment has been made or simulated as a real sale.

## Activation checklist

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

- 66 automated cases passed, including webhook authentication, malformed/unapproved events, subscriber cancellation and API entitlement/expiry checks.
- Database transaction verified approval, deduplication, paid-period preservation, refund terminality and denial of browser privileges. All synthetic QA rows were rolled back.
- Existing 24 structural checks passed. Public builds exclude the Bible corpus; server gzip responses are approximately 1.46 MB IT / 1.35 MB PT.
- Live unauthenticated plans request returns an empty list; unauthenticated webhook returns 401. This is intentional while the Hotmart product remains a draft.
- Advisory review: the four new tables intentionally deny all browser access (RLS with no policies and all browser grants revoked). The pre-existing account-deletion function warning predates this work.
- Real checkout, login on a physical Android and payment lifecycle acceptance remain pending provider configuration and owner testing. Passing code tests is not proof of a completed payment.

Official provider references: https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/purchase-webhook/ and https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/cancel-subscription-webhook/.

## Publication — 14 November 2026

The owner explicitly authorized GitHub publication and production deployment. PR #15 was merged. Production code commit: `38471a3647393149cac3f0c1457f4b5b56a4031d`; deployment `dpl_44WogFfTkVs3wPSWw8ibweFf61so` is READY and serves https://fideora.app/app/.

The GitHub Security & Build Check passed. The published four-step onboarding and email gate were inspected in the browser; the preview was also checked at 390 × 844. The installation instruction was checked and no browser console errors were observed. The live HTML, manifest and service worker return 200; public plans return 200 with an empty list. Anonymous status and Bible access return 401; /app/bible/it.json returns 404. No runtime error/fatal logs were found for this deployment during verification.

Hotmart checkout, real email sign-in acceptance, physical Android installation and the real payment lifecycle remain pending. Neither a checkout nor a trial has been activated. No real or simulated payment was added as a customer sale.

![Published Fideora web login](assets/fideora-web-login-20261114.png)


## Hotmart integration — 14 November 2026

The product is registered as a draft, ID 8973641, ucode 994770f4-47f0-4af5-8f78-3eab834029da. Monthly plan ID 1433191 / offer e792z6va and annual plan ID 1433192 / offer tyawr5cb have been verified against the official Products API. Prices are in EUR and VAT is included. The official app icon and Italian description are saved; the support email and approved-purchase return URL are configured.

The account Hottok and exclusive API credentials are stored only as server secrets. The product-filtered v2 webhook is active; all eight Hotmart sample events received HTTP 200. Samples use an unrelated test product and did not grant customer access. The temporary metadata setup probe was disabled immediately after verifying the API.

Trial access uses the live Get Subscriptions API with the authenticated, verified account email and configured product. It requires ACTIVE, trial=true, the exact product ucode/ID and plan ID, matching amount/currency, and an expiry bounded by accession date + configured trial days and next charge. STARTED (unpaid), canceled, delayed, expired, wrong-email/product/plan and refunded/chargeback subscriptions cannot grant trial access. Tokens remain in server memory; trial status is cached for 15 seconds at most.

Hotmart external-delivery review can use a dedicated ordinary student account through `/app/?review=hotmart`. That URL only exposes the password form: Supabase authentication and the same server entitlement boundary remain required. A separately revocable UUID-bound grant expires after 30 days. It cannot read other users' personal data and is not recorded as a payment or trial. Reviewer credentials are never committed.

Pending: complete external delivery validation, submit the product with the owner's at-action-time legal acceptance, verify a real checkout trial/payment and native Android installation, then activate the matching plans.
