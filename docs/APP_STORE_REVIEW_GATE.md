# Fideora App Store gate — V1, 21 October 2026

## Executive summary

V1 implements the core guest journey in Italian and Portuguese, offline scripture, reading/study tools and Catholic prayer utilities. Optional account uses the existing Supabase backend; native auth storage has a custom Keychain bridge. Web build, unit/content tests, own-row database isolation and unsigned iOS simulator compilation/launch have evidence. **App Review readiness remains blocked by signed-device and App Store Connect evidence.**

This supersedes the pre-iOS checklist from September. The original first-pass audit is in `V1-INITIAL-AUDIT.md`. The repository reviewer skill remains `.github/skills/apple-appstore-reviewer/SKILL.md`.

## Risk register

| Priority | Area                  | Finding                                                                                                                    | Evidence                                                                                                           | Why it matters                                                  | Remediation                                                                                                                       | Effort                   | Confidence          |
| -------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- |
| P0       | Signed release        | No signed archive, registered Apple app record or physical iPhone acceptance                                               | No signing team/certificate/profile or processed Apple build is verified; App Store Connect browser requires login | There is no uploadable release to submit                        | Authenticate to the developer account, verify Bundle ID/team, archive, upload and install through TestFlight                      | Medium                   | Verified blocker    |
| P1       | Native identity       | Email delivery, copied-link/code sign-in, session restoration and user-facing deletion not tested on a physical device     | DB self-delete cascade and Keychain Swift compilation tested; no real email round trip                             | Optional account path still needs complete acceptance           | Use disposable Fideora test accounts on iPhone, verify auth, relaunch, sync, export and deletion                                  | Medium                   | Unverified runtime  |
| P1       | Store metadata        | App Privacy answers, age rating, review contact, final screenshots and store availability not entered in App Store Connect | Draft package exists; Apple account session is signed out                                                          | Store submission cannot be completed                            | Populate and verify actual Apple record using `APP_STORE_V1.md`                                                                   | Medium                   | Verified blocker    |
| P2       | Catholic corpus scope | Reader uses historical 66-book editions, not a full 73-book Catholic edition                                               | Source metadata and in-app disclosure                                                                              | Avoid misleading store promises                                 | Keep disclosure and metadata accurate; obtain an appropriate 73-book licensed corpus before advertising a complete Catholic Bible | Product/content decision | Verified            |
| P2       | Support identity      | Public GitHub Issues support works; dedicated private support contact/legal entity details still need verification         | Public support page links repository Issues, warns against private data                                            | Private privacy enquiries need an operational route             | Confirm official support email and controller details in account metadata/policy before submission                                | Small                    | Verified limitation |
| P2       | Shared backend        | Existing backend also serves other apps; advisor findings predate this change                                              | Supabase security advisor results; only Fideora tables changed                                                     | Account and infrastructure changes must respect shared services | Review shared project governance before enabling public-scale signups; do not alter other app policies casually                   | Medium                   | Verified            |

## Resolved source-level findings

- Italian default; Portuguese only additional language in all active UI.
- Fixed sample reflection replaced with credited scripture and a labelled 14-reading editorial devotional cycle.
- Complete traditional prayer text, 67-step Rosary, day-limited novena completion.
- Keychain storage adapter and native bridge registered through both storyboard and scene lifecycle.
- Source and native privacy metadata, account deletion, export, support/privacy/terms journeys.
- Notebook sync disabled initially; guest and account notes kept separate; tombstones remove personal payloads; stale writes rejected server-side.
- No private server keys, tracking pixels, advertising SDK or active purchase offering in this V1.
- RevenueCat result wrappers corrected, but no products, price or trial are advertised or assumed to be configured.

## Reviewer journey

1. Launch: Italian onboarding, Portuguese alternative, no sign-in required.
2. Today: devotional selection/reflection; mark today's meditation.
3. Bible: choose book/chapter, search, tap verse, color, note or bookmark.
4. Notebook: create/edit/pin a study, find saved verses, read guides and word cards.
5. Pray: choose mystery, step through Rosary, open prayers, complete one novena day and keep intentions.
6. Profile: change name/language, export, optional account email access and explicit notebook cloud consent.
7. Account deletion: initiated in Profile; clearly warns that account deletion does not cancel an Apple subscription.
8. Privacy/support/sources: live public pages and in-app presentation.
9. Offline: bundled scripture on iOS, full public static precache in web; network needed for account/cloud operations.

## Submission policy

No P0 before a TestFlight release candidate. No unresolved P0/P1 before App Review submission. This report is evidence, not permission to waive missing tests. Current official Apple sources were consulted on 21 October 2026; recheck at actual submission.

- https://developer.apple.com/app-store/review/guidelines/
- https://developer.apple.com/support/offering-account-deletion-in-your-app
- https://capacitorjs.com/docs/ios/privacy-manifest
- https://capacitorjs.com/docs/apis/filesystem
