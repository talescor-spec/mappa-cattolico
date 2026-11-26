# Browser access and Mundpay activation

Fideora web access: https://fideora.app/app/?lang=it
Herbalia web access: https://herbalia-android-web-thales-projects-54040b4e.vercel.app/app/

## Implemented

- Browser/email access and existing paid subscriptions are preserved. No store changes.
- Dedicated private Mundpay offer/subscription tables with RLS and service-role-only writes.
- Per-app `*-mundpay-webhook` receiver. It requires a private URL/header token, then verifies the subscription, anchor order, paid cycle, invoice, order status and buyer email against Mundpay's API.
- No payment or customer identity is trusted from the webhook body. Replay and reordered notifications fetch current API state; snapshots cannot overwrite a newer verification.
- €1 for the first paid monthly cycle and €19.90 for subsequent monthly cycles. No free access based on `subscription.created` or pending invoices. Access ends at the actual paid period boundary. Refund/chargeback orders, immediate cancellation, suspension and expiration do not grant access.
- Existing Hotmart subscriptions and annual offers remain supported. An approved available Mundpay monthly offer takes precedence only for new purchases.

## External setup still required before selling

The account was checked on 26 November: Payment Type currently offers only **Single**. Mundpay support must enable subscriptions and issue the server-side API key. No recurring Mundpay product or checkout has been created and no real Mundpay charge has been tested.

1. Obtain recurrence approval and `X-API-Key` from Mundpay support. Store as `MUNDPAY_API_KEY` in each Supabase project's secrets; never put it in client code or Git.
2. Generate a separate random secret of at least 24 characters per app as `MUNDPAY_WEBHOOK_TOKEN`. Register each receiver URL with `?token=<private secret>` in Generic Webhooks, including paid/refunded/chargeback and all subscription lifecycle events. Do not remove existing Funnel Metrics/UTMify integrations.
3. Create separate Fideora/Herbalia products with external delivery to the respective webapp. Configure a monthly recurring offer with a **paid first cycle of €1**, then **€19.90**. Confirm the API represents it as a paid cycle, rather than an unpaid free trial. Refund period, customer subscription-management/cancellation route, delivery email, and the first renewal date must be checked in the provider UI.
4. Insert each real product UUID, offer UUID and exact `https://checkout.mundpay.com/...` URL into that app's `*_mundpay_offers` table. Keep `active=false, available_for_purchase=false` until controlled end-to-end payment, delivery, renewal, refund and cancellation tests pass. Check API `cancel_mode` values and real order amounts including taxes against the current reference. The current management fallback uses existing support contact; replace with the approved self-service portal when supplied.
5. Enable `active` after webhook verification passes, then `available_for_purchase` after delivery and customer-management QA. Public plans remain Hotmart until then; the Mundpay endpoint returns `integration_pending` while secrets are absent.

## Checks

`node --test tests/mundpay-web.test.mjs` covers token checks, exact checkout host, verified €1/€19.90 periods, unrelated offers, email/currency/price mismatches, pending/refunded/chargeback orders, cancellation and expiry. These are contract fixtures; they do not replace live Mundpay sandbox/payment QA after the account is enabled.

Official reference consulted: https://docs.mundpay.com/api-reference/webhooks/generic/payload and `/orders/retrieve-order`, `/subscriptions/retrieve-subscription`, `/subscriptions/list-subscription-cycles`, `/subscriptions/list-subscription-invoices` under `/api-reference`.

## Authorized app administrators

A confirmed app account with the protected boolean `auth.users.raw_app_meta_data.web_admin=true` receives full Premium access in the webapp. This is an application content entitlement; it does not grant Supabase project/database administration. Only trusted server administration can modify app metadata. Editable user metadata is ignored. The server rereads the user on every status request, so removing the protected role revokes access on the next refresh. Native store billing is unchanged.

Use existing credentials or the app’s email-code flow. Fideora reviewers can also choose password access at `/app/?lang=it&review=mundpay`; Herbalia has a password option on `/app/account`. Never reset an existing user's password for a review. Temporary QA access uses the existing expiring `*_web_access_grants` table.

Checks: `node --test tests/web-admin.test.mjs` verifies protected claims, confirmed identity, user-metadata spoofing and the bounded client entitlement.
