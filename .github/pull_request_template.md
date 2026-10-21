## Summary

Describe what changed and why.

## Validation

- [ ] `npm ci`
- [ ] `npm run build`
- [ ] `npm run appstore:preflight`

## Security impact

- [ ] No secret/private key was added to client code or `VITE_*`
- [ ] Auth/session handling remains consistent with `SECURITY.md`
- [ ] Any new external origin/SDK was reviewed for CSP/privacy impact

## App Store Review impact

Does this PR touch any of the following?

- [ ] iOS / Capacitor / Xcode
- [ ] RevenueCat / StoreKit / paywall / subscription
- [ ] authentication / account lifecycle / account deletion
- [ ] permissions / privacy / analytics / tracking
- [ ] external links / payment messaging
- [ ] onboarding / reviewer access / legal/support links
- [ ] none of the above

If any box except `none` is checked:

- [ ] Run the first-pass audit using `.github/skills/apple-appstore-reviewer/SKILL.md` **before** remediation
- [ ] Update `docs/APP_STORE_REVIEW_GATE.md` if risk/status changed
- [ ] Record any P0/P1 finding and its resolution/evidence
- [ ] Re-check current official Apple guidance for any rule relied upon

### App Store risk notes

Priority / finding / evidence / remediation:

> N/A if this PR has no App Store review impact.
