# Fideora V1 — initial audit, 21 October 2026

## Executive summary

React/Vite Catholic devotional app. Free guest flow includes reflection, rosary, prayers and novenas. Optional Supabase magic-link identity syncs progress and supports self-service deletion. RevenueCat scaffold exists, with no configured products, paywall or Vercel environment variables. No native iOS project exists at this baseline. Release gate: BLOCKED pending native signing, device validation and App Store Connect setup.

## Risk register

| Priority | Area              | Finding                                                                 | Evidence                                 | Review impact                                     | Remediation                                                                              | Effort | Confidence |
| -------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ | ---------- |
| P0       | Native release    | No iOS project, archive, signature or device evidence                   | No ios directory                         | Cannot upload an installable build                | Generate target; configure signing; archive and test on Apple hardware                   | Large  | Verified   |
| P1       | Content           | Bible screen contains one fixed reflection, presented with current date | src/App.jsx and LanguageContext          | Inaccurate daily/content expectations             | Add licensed scripture corpus; label editorial daily selection accurately                | Large  | Verified   |
| P1       | Purchases         | Service only; no live key, offering or paywall                          | services/purchases.js, empty Vercel envs | Paid flow cannot be reviewed                      | Do not advertise unavailable paid access; preserve integration for configured deployment | Medium | Verified   |
| P1       | Auth storage      | Browser localStorage session on native                                  | lib/supabase.js                          | Token protection needs native review              | Keychain storage adapter; OTP code entry avoiding callback dependency                    | Medium | Verified   |
| P1       | Legal/support     | No live in-app policy and support journey                               | src/App.jsx                              | Required support/privacy not discoverable         | Publish accessible policy/support pages and in-app links                                 | Medium | Verified   |
| P2       | Locale            | Six languages, Portuguese auth fallback                                 | LanguageContext and AuthContext          | Mismatches requested product                      | Keep only Italian and Portuguese; Italian default                                        | Small  | Verified   |
| P2       | Account sync      | Reload hydration; upsert errors discarded                               | AuthContext.jsx                          | Lost updates and cross-account contamination risk | Explicit account ownership, state events, validated writes, sync tests                   | Medium | Verified   |
| P2       | Content integrity | Salve Regina truncated; rosary counts only 53 steps without full guide  | LanguageContext / App.jsx                | Incomplete religious experience                   | Complete prayers and guided mysteries, date-aware novena completion                      | Medium | Verified   |
| P2       | New study data    | No notes/highlights/prayer journal                                      | source tree                              | New features need persistence/deletion/export     | Local-first guest store, account-isolated cloud sync, retention disclosure               | Large  | Verified   |

## Reviewer journey at baseline

1. Launch web preview without account. No onboarding.
2. Open fixed reflection, rosary, prayers and novena.
3. Optional profile magic-link login; real email receipt not tested.
4. Premium purchase and restore UI absent.
5. Account deletion RPC exists but end-to-end deletion not tested here.
6. Offline/privacy/support/native install unverified.

## Review notes draft

The V1 release will use Italian as its default and offer Portuguese in Profile. Core reading, prayer and study tools must be available without registration. Optional account enables cloud sync. Exact native build, reviewer access and purchase configuration must be recorded after testing; no credentials or successful tests are assumed.
