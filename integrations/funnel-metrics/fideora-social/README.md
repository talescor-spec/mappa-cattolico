# Social funnel deployment

The final sales-page route is https://fideora.app/mappa-della-bibbia/. Existing design and two prices are preserved. Delivery is marked complete at the publisher’s request; this is not a claim of an independent purchase/delivery test.

## Routing and captures

| Selection | Funnel | Brevo capture | Paid buyers |
| --- | --- | --- | --- |
| Book | mdb-studio-libro-it / 308882 | 217 | 220 |
| iPhone/iPad | fideora-social-ios-it / 308883 | 218 | 221 |
| Android/Web | fideora-social-android-it / 308884 | 219 | 221 |

All captures also join the shared list 214. Legacy quiz links redirect to the sales page. `/social/{instagram,facebook,tiktok,youtube}` are channel-specific bio destinations. External bios and mLabs/OpenBot text require their own confirmed UI changes; a server redirect does not prove those edits.

## Backend

The metrics project reached its Edge Function count limit. The social handler is imported into the existing `dashboard-daily-leads` under `?social=1&action=...`; no plan or spend cap was changed. `capture`, `collect` and signed `resume` are validated public actions. `report` requires the existing dashboard or worker token. Public events cannot create financial conversions. Test events/captures are excluded.

`schema.sql`, `report.sql`, `order-events.sql` are applied in the Funnel Metrics project. `seed.sql` and `email-seed.sql` are data/configuration scripts. Generated funnel IDs are selected by slug, not baked into the seed statements. All new tables have RLS and service-role-only grants. User identities are not exposed to anonymous clients.

`fideora-social-bridge` runs in the Fideora project. It authenticates the existing worker token against its SHA-256 verifier, resolves only requested verified emails, returns provider-verified access/payments and checks active Hotmart trials. The verifier, not the token, is stored there. The shared original Hotmart validator is reused. No keys are committed or placed in frontend code.

The existing email worker reconciles payment updates and RevenueCat identity before delivery. Mundpay order changes also record conversions inside the same database transaction. Unique provider event keys deduplicate events. RevenueCat aliases are stored as hashes; unmapped production purchases are explicitly unattributed. Native anonymous Apple users may never have an email that can be matched. In that case, later recovery reminders are suppressed rather than assuming abandonment.

Hotmart access records do not contain actual collected amounts. These stay null in revenue reporting; configured list prices are not treated as cash received. RevenueCat's reported USD gross amount is labelled separately. Book refunds/chargebacks reduce reported gross revenue. A click never becomes an installation or subscription metric.

## Emails

Nine Italian messages are in `emails.json`: three per lane. Delays: 10 minutes, 24 hours, 72 hours from capture. Only the new capture lane is activated; unrelated historical lists and campaigns are not enrolled. Capture copy asks for the instructions/reminders explicitly and every reminder has an opt-out. Current Brevo blocklists and buyer lists are checked again before sending.

Email Studio remains responsible for review, template synchronization, link preflight, activation, queue leases and sends. The social extension only adds verified-conversion suppression, latest-offer checks and a signed resume link. It does not blindly retry ambiguous SMTP sends. Temporary verification failures before contacting SMTP can retry with a bounded delay.

## Validation

Run `node --test tests/study-offer.test.mjs tests/study-order.test.mjs tests/study-social.test.mjs` and `npm run build:website`. `verify.py` tests real backend capture in all lanes with a reserved synthetic email and rejects client-forged conversion events. It reads credentials once via hidden stdin. Delete only its exact synthetic contact/records after the test; never real leads. `provider-setup.py` idempotently creates the named lists/attributes and reports active senders without printing a key.
