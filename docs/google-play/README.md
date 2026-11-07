# Fideora — Google Play preparation

Prepared 6 November 2026 from the current native release branch `fideora-premium-v1` at `365b65ae1d700406ef53ad6cd69bbebd67f96142`. The repository's `main` branch serves a different web version and must not replace the native paywall release. Android package: `com.fideora.app`; version 1.0.1; initial Android versionCode 1.

## Implemented

- Capacitor Android 8.5.2 project, compile/target API 36, minimum Android 7 / API 24.
- Native Android now uses the same Premium entitlement and onboarding/hard-paywall policy as iOS. Its RevenueCat SDK key is `VITE_REVENUECAT_ANDROID_PUBLIC_SDK_KEY` (`goog_`). The iOS key cannot configure Android, and Test Store keys are not accepted for production.
- Native auth tokens use an Android Keystore AES-GCM bridge with authenticated record names, randomized IVs, private preferences and disabled backups. There is no plaintext native fallback. Personal notes remain in the existing account-scoped local storage; this is not a claim of whole-device encrypted notes.
- Correct Google subscription-management links and store-neutral UI. Brand launcher icons, themed adaptive icon and splash replace Capacitor defaults. Release signing fails closed when upload credentials are absent.
- Android CI compiles a debug APK and runs tests/lint; it is explicitly a QA artifact. It never creates or submits a store release.

## Current validation and limits

43 automated tests, web production build, 24 existing native structural checks and Capacitor Android plugin sync passed locally. Android Java/Gradle debug APK compilation and native lint also passed at `28e4e75db468456d0d01e8902be1db31611f3511` in [Android CI run 42330088221](https://github.com/talescor-spec/mappa-cattolico/actions/runs/42330088221). This is compilation verification, not store-release or device acceptance. Purchase/restoration on a Google internal track, Keystore/device behavior and final Android screenshots remain unverified. No signed AAB has been generated.

## External completion

Updated 7 November 2026: organization Play Console account INFO CURSOS (`6780962018513156337`) has been created and paid by the owner. The owner uploaded the organization document. Google reports identity verification in progress; the submission flow is closed and there is no new document action shown. Trader was saved and the organization website was verified in Search Console and Play Console after explicit owner consent. Phone verification is gated on document approval, and app creation remains disabled. Complete this account instead of enrolling again; do not request the completed Trader/site consents again.

RevenueCat Google Play app `app3f1390da96` now exists in project `0df93c61` for `com.fideora.app`. Manual products `fideora_premium:monthly` (`prodcb674b3520`) and `fideora_premium:annual` (`prodbce309aa7e`) are attached to `premium` and mapped to `$rc_monthly` / `$rc_annual` in both `default` and `hard_paywall`. Its public Google SDK key was issued but is not yet installed in the remote build environment. These records do not create or validate subscriptions in Google Play. Configure the Google service account, notifications and real Google plans/prices/offers. Verify both remote paywalls on Android: Google price, eligibility, full recurring charge, legal links, purchase and restore controls.

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
