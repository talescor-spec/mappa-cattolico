// Ten product bundles. Privacy and access to existing personal data stay free.
export const FEATURE_BUNDLES = Object.freeze([
  { id: "daily", premium: false },
  ...[
    "bible",
    "search",
    "annotations",
    "bookmarks",
    "notebook",
    "guides",
    "lexicon",
    "rosary",
    "devotions",
  ].map((id) => ({ id, premium: true })),
]);
export function hasEntitlement(
  info,
  entitlement = "premium",
  now = Date.now(),
) {
  const active = info?.entitlements?.active?.[entitlement];
  if (!active || active.isActive === false) return false;
  if (active.expirationDate != null) {
    const expiry = Date.parse(active.expirationDate);
    if (!Number.isFinite(expiry) || expiry <= now) return false;
  }
  return true;
}
export function canUseFeature(feature, isPremium, { existing = false } = {}) {
  if (existing) return true;
  const bundle = FEATURE_BUNDLES.find((item) => item.id === feature);
  return Boolean(bundle && (!bundle.premium || isPremium));
}
export function dailyVerses(book, chapter, verses, daily) {
  if (book !== daily.book || chapter !== daily.chapter) return [];
  return verses.filter((v) => v.number >= daily.start && v.number <= daily.end);
}
