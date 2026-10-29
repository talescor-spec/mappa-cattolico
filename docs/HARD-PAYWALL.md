# Fideora — hard paywall after onboarding

## Initial audit — 29 October 2026, before code changes

Fideora is a React/Capacitor iOS app with Italian and Portuguese onboarding and Apple subscriptions through RevenueCat. The current app shows checkout after onboarding but then permits free daily reading and Genesis/Exodus after dismissal. Optional email accounts provide sync; purchases also work anonymously. The current `premium` entitlement is already checked against SDK CustomerInfo, including expiry and identity changes.

| Priority | Area | Finding | Evidence | Review impact | Remediation | Effort | Confidence |
|---|---|---|---|---|---|---|---|
| P1 | Access | Onboarding can be dismissed and checkout cancellation exposes free content | App.jsx, Onboarding.jsx | Does not implement the requested subscription-only entry | Root-level access boundary for new iOS installations; never mount core screens while locked | Medium | Verified |
| P1 | Recovery | Blocking the whole app could hide restore, account deletion, data export and legal/support | Profile.jsx, Premium.jsx | Existing account/data and purchase recovery must stay reachable | Keep a restricted account/data view and legal/support links outside the content gate | Medium | Verified |
| P1 | Persistence | The onboarding-complete flag cannot grant paid access | PremiumContext.jsx, access.js | Relaunch must not bypass purchase | Persist cohort separately and require valid SDK entitlement on every render | Small | Verified |
| P2 | Existing users | Prior free installations should retain their existing experience in this first rollout | Existing fideoraOnboarded marker | Avoid silently revoking an existing free experience | Grandfather installations already onboarded before this version; no premium entitlement granted by that marker | Small | Design decision |
| P2 | Native paywall | Close control is part of the remote RevenueCat design | PAYWALL-VISUAL-V2.md | Native presentation configuration alone may not remove a custom editor close button | Use a separate hard-paywall offering/design; confirm presentation and purchase on iPhone | Medium | Runtime unverified |
| P1 | Device acceptance | Linux cannot validate Apple purchase confirmation, restore, offline SDK cache or a signed iPhone build | Execution environment | Automated tests are insufficient for App Review readiness | TestFlight/device acceptance remains required; no App Review submission in this change | Medium | Verified limitation |

Native configuration inspected: Info.plist declares Italian/Portuguese, existing auth URL scheme and no camera/location/microphone permissions. PrivacyInfo.xcprivacy already declares purchase/product interaction data; this change adds no analytics SDK, permissions or backend data collection. Existing signing configuration and dependency pins are retained.

## Reviewer journey

1. New iOS installation: complete name (optional), goal and routine onboarding; see subscription paywall.
2. Without a verified trial/subscription, no Bible, prayer, daily reading or notebook screen is mounted.
3. Purchase/restore must unlock only after CustomerInfo contains the active `premium` entitlement.
4. Cancellation, errors, missing offering, offline or relaunch must keep the content gate closed, with retry and restore available.
5. Account/profile, personal-data export/deletion, privacy, terms and support remain reachable independently of subscription.
6. Expiry removes access to core content; disabling renewal alone does not remove access before entitlement expiry.
7. Existing onboarded installations retain their previous free limits; reinstalling/clearing app data joins the new cohort.

## App Review Notes draft

New iOS installations complete onboarding before a subscription-only content gate. Apple IAP through RevenueCat unlocks the `premium` entitlement. Restore Purchases and account/data management are available from the gate. Existing onboarded installations retain their previous free experience. Monthly and annual products/prices remain unchanged; trial eligibility and terms come from the App Store. No external payment path or exit discount is introduced. Device purchase/restore/expiry evidence: pending. No demo credentials are needed for anonymous Apple billing; email sync is optional.

## Verification

- 40 automated tests passed, including actual React entry-boundary rendering (onboarding first, cancellation/relaunch, verified restoration, expiry and legacy migration) and hard-offering selection/failure.
- 24 native structural preflight checks passed. Production build and Capacitor iOS sync passed on Linux.
- RevenueCat offering `hard_paywall` (`ofrng6e6f11ca37`) duplicates the existing monthly/annual packages, with the same Apple products. It is not the default offering.
- Separate paywall `wf1f98e9104fdc4ffa`, “Fideora Hard Paywall · IT / PT”, published and verified in the Published list on 29 October. Original paywall/default offering retained unchanged.
- Removed the close icon/button. Added the explicit Account/Conta footer link (Close paywall action, system navigation disabled), returning to the locked entry screen where account, export, deletion and support are accessible. This link never grants access to app content. Restore, Terms and Privacy remain in the native footer.
- Prices and annual introductory offer are still derived from the existing App Store products. Editor preview dollar prices are sample values, not a change to live prices.
- Physical iPhone purchase, restoration and expiry acceptance remain unverified. Signed build/distribution status will be recorded separately. This document does not assert App Review approval.
