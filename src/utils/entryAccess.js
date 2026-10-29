export const ENTRY_ACCESS_KEY = "fideoraEntryAccessV1";

// Cohort selection preserves the previous free experience on already-onboarded
// installations. It never grants Premium: only SDK CustomerInfo can do that.
export function initializeEntryAccess({ native, read, write }) {
  if (!native) return "legacy";
  const saved = read(ENTRY_ACCESS_KEY);
  if (saved === "hard" || saved === "legacy") return saved;
  const mode = read("fideoraOnboarded") === "1" ? "legacy" : "hard";
  write(ENTRY_ACCESS_KEY, mode);
  return mode;
}

export function entryScreen({ onboard, mode, checking, isPremium }) {
  if (onboard) return "onboarding";
  if (mode !== "hard") return "content";
  if (isPremium) return "content";
  return checking ? "checking" : "paywall";
}
