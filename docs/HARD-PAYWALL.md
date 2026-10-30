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

## Annual trial visibility audit — 29 October 2026

Scope: remote hard-paywall copy only; retain all Apple products, pricing, restore/account paths and access checks described above. The device screenshot supplied by the tester shows the non-introductory state (annual price, “Assinar”, no trial text). The editor has an eligibility-dependent introductory rule, but the offer is only mentioned in small copy and the primary annual badge still says Recommended.

| Priority | Area | Finding | Evidence | Review impact | Remediation | Effort | Confidence |
|---|---|---|---|---|---|---|---|
| P2 | Trial prominence | Trial is not prominent on the annual selection | Supplied build 7 screenshot and remote annual card | Eligible new subscribers may miss the test offer | Highlight seven free days on annual selection and CTA for eligible users; keep post-trial price and renewal clear | Small | Verified UI |
| P1 | Eligibility | Device shows default paid state; actual account eligibility is unverified | Screenshot has “Assinar”, while editor intro preview has trial CTA | Must not promise free days to an ineligible Apple account | Preserve eligibility-dependent copy, verify annual introductory configuration and preview both states | Small | Verified state; account cause unverified |

Reviewer journey and notes: same hard entry flow, Apple confirmation, restore, account/data, legal and offline behavior as above. Verify annual eligible/ineligible and monthly states in IT/PT. No new binary, permissions, data collection or product is required for a remote copy change. Physical confirmation of eligibility remains a separate tester check.

Annual offer configuration verified in App Store Connect on 29 October: com.fideora.premium.annual is Approved, with “Free for the first week” in 175 introductory-offer territories; the Brazil row is R$299.90 plus that introductory week. The supplied device screenshot uses the default paid state, but account-specific eligibility cannot be established from the screenshot.

Remote copy updated for eligible introductory offers in both locales:
- PT: badge “7 DIAS GRÁTIS”; CTA “Começar meus 7 dias grátis”; annual subtitle “7 dias grátis, depois [store price]/ano”, with equivalent monthly price and explicit post-trial renewal terms.
- IT: badge “7 GIORNI GRATIS”; CTA “Inizia i tuoi 7 giorni gratis”; corresponding annual price and renewal disclosure.
- The default/ineligible state keeps the ordinary paid CTA and Recommended badge; no free trial is promised for an ineligible account. Monthly has no new introductory offer. No price, store product, purchase eligibility or client code changed.

Editor validation: eligible annual IT/PT displays the badge, CTA, post-trial price and renewal text; default PT retains “Assinar” and “Recomendado”. iPhone 17 Pro preview checked; this is remote design verification, not an Apple purchase acceptance test.

## Plan visibility audit — 29 October 2026, before layout changes

The supplied App Store screenshot has the original dismissible paywall (X, three footer links, one-week trial wording), rather than the separate hard offering. Apple confirmation in the second screenshot verifies a one-week annual trial is offered to this account; no purchase completion is evidenced. Both designs share the tall header/feature layout.

| Priority | Area | Finding | Evidence | Review impact | Remediation | Effort | Confidence |
|---|---|---|---|---|---|---|---|
| P2 | Plan visibility | Monthly card falls beneath fixed checkout footer | IMG_5103 on physical iPhone | Customers cannot compare plans without discovering scroll | Compact header/features and keep both plan cards above footer; verify both published designs in PT/IT | Small | Verified screenshot |
| P1 | Subscription clarity | Layout compression must retain trial, total annual/monthly price, renewal, restore and legal links | Current remote design | Smaller layout must not obscure material terms | Retain package pricing and eligibility rules, readable footer, and existing dismissal/account behavior | Small | Design constraint |

Reviewer journey and App Review notes remain as above; this is a remote layout change only, with no binary, product, entitlement, permission or price change. Verify annual trial/default and monthly state in both locales and small/large editor previews; physical-device layout acceptance remains pending.

Layout result: both remote paywalls published. Hidden decorative motif and secondary promise; feature list retains all three icons/titles with hidden detailed descriptions, zero vertical row padding, and list bottom margin reduced from 24 to 12. Products, eligibility, prices, annual intro copy and monthly/default copy are retained. Public design keeps its X; hard design keeps Account and no X. Published-version preview confirms both cards and total monthly price above checkout footer on iPhone 13 mini (375×812), PT annual eligible, and IT preview was checked for both designs before final motif compaction. iPhone 17 Pro was checked during layout iteration. The 375×667 SE requires content scrolling; no claim is made that all content fits without scrolling on every screen or accessibility text size. Physical-device recheck remains pending. Remote publication verified via Latest changes published a few seconds ago in both version selectors. No app code or price change, no new binary or App Review submission.

## Monthly three-day trial audit — 29 October 2026, before configuration changes

Authorized scope: Apple introductory free trial of three days for the existing monthly product; retain seven days annual, annual default selection, no lifetime plan, current prices and entitlement. Apply plan-correct IT/PT text to both published remote designs. Existing native configuration, identity, restore/account/legal/offline flows and reviewer journey remain as audited above; no new binary or permission is proposed.

| Priority | Area | Finding | Evidence | Review impact | Remediation | Effort | Confidence |
|---|---|---|---|---|---|---|---|
| P1 | Offer accuracy | Hard-paywall shared CTA/renewal hardcode seven days, which becomes wrong when monthly gains a trial | Published introductory rule inspected in previous task | Misstates billing terms on monthly selection | Use product.offer_period_in_days in eligible-only intro text; package-local rules retain each package duration | Small | Verified |
| P1 | Eligibility | Both products must retain one shared subscription group and only offer free access when Apple permits it | Apple official introductory offer documentation | Prevent duplicate subscriptions or false repeat-trial promises | Add intro to existing monthly product; retain group, entitlement and eligibility gating | Small | Verified rule; new config pending |
| P2 | UI | Monthly needs an eligible intro subtitle while preserving no-trial fallback | Existing monthly card has ordinary renewal text | Trial should be visible before selection and price remains readable | Add eligible monthly subtitle, dynamic shared CTA/renewal and verify IT/PT annual/monthly/default | Small | Verified |

App Review notes addition: eligible new subscribers can choose a three-day monthly trial or a seven-day annual trial, followed by the displayed store price and automatic renewal. Apple allows one introductory redemption per subscription group. Sandbox/device acceptance remains a separate check; no purchase is completed by this task.

Monthly-trial result: App Store Connect saved a Current Introductory Offer for com.fideora.premium.monthly, Free for the first 3 days, Oct 29 2026 to No End Date, in 175 countries/regions. The existing Approved monthly product and Fideora Premium group (22500299) are retained; Brazil regular price remains R$49.90/month. Annual current intro was rechecked: Free for the first week, 175 territories, Oct 21 2026 to No End Date. No lifetime product added and no regular price changed. Updated monthly Review Notes to describe both trials accurately and saved; no App Review submission.

Both remote paywalls were published before enabling the Apple monthly offer. Published-version rules inspected in IT/PT: package-local annual and monthly intro subtitles, shared CTA and renewal use product.offer_period_in_days; annual total-price/monthly-equivalent and monthly total-price remain explicit. Hard annual badge uses the same variable within the annual package. Intro eligibility remains gated by the existing offer rule; default/no-offer copy retains Subscribe and ordinary renewal, never promises a trial. No package or default selection was changed.

Validation limitation: RevenueCat editor offer values always use examples (seven days even on the monthly package), as documented at https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/variables. This is not evidence of a seven-day monthly store offer. The saved Apple configuration is three days; physical iPhone monthly confirmation must still be checked after propagation (Apple documents up to one hour in Sandbox). No purchase, restore or billing transaction was performed. No code change, binary upload, npm test rerun or public binary release is needed for this remote offer/text change.
