# Fideora — Apple / RevenueCat integration

## Current state

The React/Vite application is prepared for iOS through Capacitor and already includes an isolated RevenueCat purchase service. No real Apple or RevenueCat credential is committed to the repository.

## Identity and bundle

- App name: `Fideora`
- Provisional Capacitor app id / iOS Bundle ID: `com.fideora.app`
- RevenueCat entitlement default: `premium`

**Important:** the Bundle ID is provisional. Confirm the final identifier before creating the App Store Connect record because the Xcode bundle identifier must match the App Store Connect app record.

## Intended purchase architecture

1. Customer buys a front-end book/infoproduct outside the iOS app.
2. Customer installs Fideora and creates/signs into a Fideora account.
3. The authenticated Fideora user id becomes the RevenueCat `appUserID`.
4. The app loads the current RevenueCat Offering.
5. The user starts the Apple introductory offer / free trial through StoreKit.
6. Apple handles billing and renewal.
7. RevenueCat exposes the active `premium` entitlement to the app.
8. Server-side webhooks later synchronize subscription lifecycle events with Supabase/Funnel Metrics.

The app must never unlock premium content from a local boolean alone. The active StoreKit/RevenueCat entitlement is authoritative.

## App Store Connect setup

Manual account-side steps:

1. Confirm Apple Developer Program / App Store Connect access.
2. Confirm the final Bundle ID and create the matching app record.
3. Accept the current Paid Apps Agreement and complete tax/banking requirements.
4. Create one auto-renewable subscription group for Fideora.
5. Create the monthly subscription product.
6. Configure countries/regions and Apple price points.
7. Configure the introductory offer (for example a free trial) in App Store Connect.
8. Localize the subscription display name/description for IT, FR, ES, PT-BR, EN and DE.

Customers are eligible for one introductory offer per subscription group, so all plans that should share trial eligibility should be designed deliberately inside that group.

## RevenueCat setup

1. Create/open the Fideora RevenueCat project.
2. Add the iOS app using the final Bundle ID.
3. Connect the App Store credentials requested by RevenueCat.
4. Import the App Store subscription product.
5. Create/confirm entitlement id `premium`.
6. Create an Offering (recommended id: `default`) containing the monthly package.
7. Put only the **public iOS SDK key** in `VITE_REVENUECAT_PUBLIC_SDK_KEY`.
8. Never expose the RevenueCat secret API key in the client.

## Xcode / Capacitor setup

After dependencies are installed:

```bash
npm install
npm run build
npx cap add ios
npm run cap:ios
npm run ios:open
```

In Xcode:

1. Select the Fideora target.
2. Choose the correct Apple Developer team.
3. Confirm the final Bundle Identifier.
4. Enable automatic signing unless there is a specific reason not to.
5. Add the **In-App Purchase** capability.
6. Confirm Swift language version is compatible with the RevenueCat Capacitor plugin (Swift 5+).
7. Run first on Simulator/device before TestFlight.

## RevenueCat client service

`src/services/purchases.js` currently provides:

- native iOS detection
- safe SDK initialization
- current Offering lookup
- entitlement check
- package purchase
- Restore Purchases

Initialization is intentionally not wired to app startup yet. It should happen only after authentication is implemented so RevenueCat can use the stable Fideora user id and avoid unnecessary anonymous identities.

## Security rules for subscriptions

- `VITE_REVENUECAT_PUBLIC_SDK_KEY` is public by design; RevenueCat secret keys are not.
- App Store Connect private keys never belong in the Vite client.
- Future RevenueCat webhook processing must be server-side and idempotent.
- Persist Apple original transaction identity with uniqueness constraints in the backend.
- One Fideora account should map predictably to one RevenueCat app user identity.
- Restore Purchases must be available as an explicit user action.
- Test trial conversion, renewal, billing issue, recovery, cancellation, refund and revocation before production release.

## Funnel Metrics events planned

`app_install`
`signup`
`paywall_view`
`trial_started`
`trial_converted`
`renewal`
`billing_issue`
`billing_recovered`
`voluntary_churn`
`involuntary_churn`
`refund`
`revocation`

These should be emitted from trusted subscription lifecycle data whenever possible, not inferred only from UI clicks.
