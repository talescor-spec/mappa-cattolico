# Fideora — Google Play preparation

Prepared 6 November 2026 from the current native release branch `fideora-premium-v1` at `365b65ae1d700406ef53ad6cd69bbebd67f96142`. The repository's `main` branch serves a different web version and must not replace the native paywall release. Android package: `com.fideora.app`; version 1.0.1; initial Android versionCode 1.

## Implemented

- Capacitor Android 8.5.2 project, compile/target API 36, minimum Android 7 / API 24.
- Native Android now uses the same Premium entitlement and onboarding/hard-paywall policy as iOS. Its RevenueCat SDK key is `VITE_REVENUECAT_ANDROID_PUBLIC_SDK_KEY` (`goog_`). The iOS key cannot configure Android, and Test Store keys are not accepted for production.
- Native auth tokens use an Android Keystore AES-GCM bridge with authenticated record names, randomized IVs, private preferences and disabled backups. There is no plaintext native fallback. Personal notes remain in the existing account-scoped local storage; this is not a claim of whole-device encrypted notes.
- Correct Google subscription-management links and store-neutral UI. Brand launcher icons, themed adaptive icon and splash replace Capacitor defaults. Release signing fails closed when upload credentials are absent.
- Android CI compiles a debug APK and runs tests/lint; it is explicitly a QA artifact. It never creates or submits a store release.

## Current validation and limits

43 automated tests, web production build, 24 existing native structural checks and Capacitor Android plugin sync passed locally. Android Java/Gradle compilation is a separate CI check. Purchase/restoration on a Google internal track, Keystore/device behavior and final Android screenshots remain unverified. No signed AAB has been generated.

## External completion

Play Console enrollment is unfinished in the current Google session. RevenueCat project `0df93c61` has only the App Store app, and this session cannot add app configurations. Add the Google app for `com.fideora.app`; configure its service account and notifications; add actual Google products to entitlement `premium`, both `default` and `hard_paywall` offerings and the monthly/annual packages. Verify both remote paywalls support Android and display Google's price, eligibility, full recurring charge, legal links, purchase and restore controls. Keep Apple mappings intact.

Use these release variables in a trusted build environment:

```
VITE_REVENUECAT_ANDROID_PUBLIC_SDK_KEY=
FIDEORA_ANDROID_KEYSTORE_PATH=
FIDEORA_ANDROID_KEYSTORE_PASSWORD=
FIDEORA_ANDROID_KEY_ALIAS=
FIDEORA_ANDROID_KEY_PASSWORD=
FIDEORA_ANDROID_VERSION_CODE=1
```

Only the public SDK key may enter the client. Keystore and passwords must never be committed. After real configuration, `npm run playstore:bundle` runs preflight, web build/plugin sync and signed `bundleRelease`. Raise versionCode after each upload. The output is `android/app/build/outputs/bundle/release/app-release.aab`.

Validate eligible/ineligible offers, monthly/annual purchase, pending/cancelled transactions, restoration, expiry, relaunch, account switching, email-code sign-in, export and deletion on Android. Provide Google reviewer access without a client-side Premium bypass. Publish the prepared privacy/deletion URLs, capture real Android screenshots and complete Data safety including optional religious notes/progress sync. Initial native installations require an active subscription or eligible trial after onboarding; listing copy must say so.
