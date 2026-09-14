---
name: apple-appstore-reviewer
description: Review Fideora from an Apple App Store reviewer perspective before code changes, prioritizing rejection risk, subscription compliance, privacy, account flows, and reviewer clarity.
---

# Fideora App Store Review Gate

Use this skill whenever work touches iOS, App Store Connect, authentication, subscriptions, RevenueCat, StoreKit, privacy, permissions, onboarding, paywalls, legal/support links, account lifecycle, analytics, external links, or submission metadata.

This skill is adapted for Fideora from the public `apple-appstore-reviewer` workflow in `github/awesome-copilot`. Apple rules change; verify current requirements against official Apple documentation before claiming that a rule is current.

## First-pass rule

Do not change code during the first pass. Audit first and produce a risk register. Clearly separate verified findings from assumptions and checks that cannot yet be performed.

## Fideora context

- Brand: Fideora.
- Product: multilingual Catholic faith app with Bible/reflection, Rosary, prayers, novenas and future premium content/features.
- Languages: IT, FR, ES, PT-BR, EN, DE.
- Client: React/Vite wrapped with Capacitor for iOS.
- Purchases: StoreKit through RevenueCat; entitlement target is `premium`.
- Identity target: authenticated Fideora user ID must become the stable RevenueCat `appUserID`.
- Backend target: Supabase Auth + RLS + synced user progress.
- Digital premium access inside iOS must use Apple In-App Purchase unless a current Apple rule explicitly permits another path for the applicable storefront/use case.

## Audit order

### 1. Understand the shipped product

Document:
- primary purpose and top user flows;
- what works without account or payment;
- what requires authentication;
- what requires premium entitlement;
- external services/SDKs involved;
- all permissions requested.

### 2. Inspect Apple/native configuration

When the `ios/` target exists, inspect at minimum:
- `Info.plist` and all `NS*UsageDescription` strings;
- `*.entitlements`;
- `PrivacyInfo.xcprivacy` and third-party SDK privacy manifests;
- Xcode capabilities, Bundle ID and signing configuration;
- URL schemes / Associated Domains if present;
- background modes, push, tracking, keychain groups or other capabilities if present;
- StoreKit configuration/testing files if present.

Missing native files before the iOS target is generated are not a rejection finding; report them as unverified/pre-iOS checks.

### 3. Payments and subscriptions

Verify:
- premium digital features are unlocked through IAP/StoreKit;
- RevenueCat uses the public SDK key only on-device;
- no RevenueCat secret API key or App Store private key is bundled in the client;
- one authenticated Fideora identity maps consistently to one RevenueCat identity;
- entitlement checks use `premium` rather than a local boolean as authority;
- purchase cancellation/errors have a usable state;
- Restore Purchases is visible and works;
- trial, price, billing period and auto-renewal are clear before purchase;
- the subscription provides ongoing value, not merely a static gated file;
- users cannot accidentally subscribe to duplicate variants of the same offering;
- external-payment messaging inside the app is reviewed against current Apple rules for the applicable storefront.

### 4. Accounts and authentication

If account creation exists, verify:
- account deletion can be initiated from inside the app;
- deletion explains what happens to an active Apple subscription;
- auth/session handling is not based on insecure custom LocalStorage secrets;
- Supabase RLS protects all user-owned data;
- social/third-party login is checked against Apple's current login-service requirements;
- reviewer can use a demo account or approved full demo mode;
- backend remains available during review.

### 5. Privacy and data handling

Verify:
- App Privacy answers match actual data collection and SDK behavior;
- privacy policy and support links are functional;
- permissions are requested only when needed and usage strings are specific;
- analytics/identifiers/tracking behavior is disclosed and consented to where required;
- no service-role/private credentials appear in client code;
- deletion/export/retention behavior is documented once accounts exist;
- logs do not expose tokens, receipts or unnecessary personal data.

### 6. Content and reviewer experience

Verify:
- no placeholder, dead-end or unfinished production UI;
- core Catholic content is accessible and stable;
- premium features are visible to the reviewer and explain how to test them;
- offline/network failure has a usable state;
- support, privacy and subscription-management paths are discoverable;
- any future UGC/community feature receives a separate moderation/report/blocking audit before release.

## Output format

Every audit must contain:

### Executive summary
Briefly state app purpose, current gate status and the highest-risk items.

### Risk register
Use columns:
- Priority: P0 blocker / P1 high / P2 medium / P3 low
- Area
- Finding
- Evidence
- Why it matters for review
- Remediation
- Effort
- Confidence

### Reviewer journey
Walk through:
1. install/launch;
2. onboarding;
3. login if required;
4. core free feature;
5. premium/paywall;
6. purchase or sandbox purchase;
7. restore purchase;
8. account/profile;
9. account deletion if accounts exist;
10. privacy/support/legal links;
11. offline/error states.

### App Review Notes draft
Prepare submission notes with placeholders for reviewer credentials and exact steps to reach gated features/IAP.

## Severity policy

- P0: likely blocker or non-functional reviewer path.
- P1: common rejection risk, privacy/payment/account failure, or serious reviewer friction.
- P2: compliance ambiguity or material quality issue.
- P3: polish/optimization.

No P0 may remain before TestFlight release candidate. No unresolved P0/P1 may remain before App Review submission unless explicitly accepted with documented evidence and rationale.
