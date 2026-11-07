export function nativeBillingPlatform(platform, native) {
  return native && (platform === "ios" || platform === "android");
}

export function publicBillingKey(platform, { iosKey = "", androidKey = "" } = {}) {
  const key = (platform === "ios" ? iosKey : platform === "android" ? androidKey : "").trim();
  const prefix = platform === "ios" ? "appl_" : platform === "android" ? "goog_" : "";
  return prefix && key.startsWith(prefix) && key.length > prefix.length ? key : "";
}

export function subscriptionManagementURL(platform) {
  return platform === "android"
    ? "https://play.google.com/store/account/subscriptions?package=com.fideora.app"
    : "https://apps.apple.com/account/subscriptions";
}
