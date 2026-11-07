import { Capacitor } from "@capacitor/core";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { RevenueCatUI } from "@revenuecat/purchases-capacitor-ui";
import { createPurchasesClient } from "./purchasesClient.js";
import { PUBLIC_IOS_SDK_KEY } from "../config/purchases.js";
import { nativeBillingPlatform, publicBillingKey } from "../utils/billingPlatform.js";
export const ENTITLEMENT_ID =
  import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID || "premium";
export const isIOSNative = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";
export const isNativeBilling = () =>
  nativeBillingPlatform(Capacitor.getPlatform(), Capacitor.isNativePlatform());
const platform = Capacitor.getPlatform();
const apiKey = publicBillingKey(platform, {
  iosKey: import.meta.env.VITE_REVENUECAT_IOS_PUBLIC_SDK_KEY || import.meta.env.VITE_REVENUECAT_PUBLIC_SDK_KEY || PUBLIC_IOS_SDK_KEY,
  androidKey: import.meta.env.VITE_REVENUECAT_ANDROID_PUBLIC_SDK_KEY,
});
export const billing = createPurchasesClient({
  sdk: Purchases,
  ui: RevenueCatUI,
  native: nativeBillingPlatform(platform, Capacitor.isNativePlatform()),
  apiKey,
  entitlement: ENTITLEMENT_ID,
});
