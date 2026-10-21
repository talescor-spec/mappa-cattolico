import { Capacitor } from "@capacitor/core";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { RevenueCatUI } from "@revenuecat/purchases-capacitor-ui";
import { createPurchasesClient } from "./purchasesClient.js";
import { PUBLIC_IOS_SDK_KEY } from "../config/purchases.js";
export const ENTITLEMENT_ID =
  import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID || "premium";
export const isIOSNative = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";
const key =
  import.meta.env.VITE_REVENUECAT_PUBLIC_SDK_KEY || PUBLIC_IOS_SDK_KEY;
// Never ship RevenueCat Test Store as App Store billing.
const apiKey =
  key.startsWith("appl_") || (import.meta.env.DEV && key.startsWith("test_"))
    ? key
    : "";
export const billing = createPurchasesClient({
  sdk: Purchases,
  ui: RevenueCatUI,
  native: isIOSNative(),
  apiKey,
  entitlement: ENTITLEMENT_ID,
});
