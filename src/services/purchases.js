import { Capacitor } from '@capacitor/core';
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor';

const ENTITLEMENT_ID = import.meta.env.VITE_REVENUECAT_ENTITLEMENT_ID || 'premium';
let configured = false;
let currentAppUserID = null;

export function isIOSNative() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
}

export function getEntitlementId() {
  return ENTITLEMENT_ID;
}

async function ensureConfigured(appUserID) {
  if (!isIOSNative()) {
    return { configured: false, reason: 'not-ios-native' };
  }

  const apiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_SDK_KEY;
  if (!apiKey) {
    return { configured: false, reason: 'missing-public-sdk-key' };
  }

  if (!configured) {
    if (import.meta.env.DEV) {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    }

    await Purchases.configure({
      apiKey,
      ...(appUserID ? { appUserID } : {}),
    });

    configured = true;
    currentAppUserID = appUserID || null;
    return { configured: true, appUserID: currentAppUserID };
  }

  return { configured: true, appUserID: currentAppUserID };
}

export async function initializePurchases({ appUserID } = {}) {
  return ensureConfigured(appUserID);
}

export async function syncPurchasesUser(appUserID) {
  if (!appUserID) return { configured: false, reason: 'missing-app-user-id' };

  const status = await ensureConfigured(appUserID);
  if (!status.configured) return status;

  if (currentAppUserID === appUserID) {
    return { configured: true, appUserID, changed: false };
  }

  const result = await Purchases.logIn({ appUserID });
  currentAppUserID = appUserID;
  return {
    configured: true,
    appUserID,
    changed: true,
    customerInfo: result?.customerInfo || null,
    created: Boolean(result?.created),
  };
}

export async function clearPurchasesUser() {
  if (!isIOSNative() || !configured || !currentAppUserID) {
    currentAppUserID = null;
    return { configured, changed: false };
  }

  await Purchases.logOut();
  currentAppUserID = null;
  return { configured: true, changed: true };
}

export function hasPremiumEntitlement(customerInfo) {
  return Boolean(customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]);
}

export async function getSubscriptionStatus() {
  if (!configured) {
    return { configured: false, isPremium: false, customerInfo: null };
  }

  const customerInfo = await Purchases.getCustomerInfo();
  return {
    configured: true,
    isPremium: hasPremiumEntitlement(customerInfo),
    customerInfo,
  };
}

export async function getCurrentOffering() {
  if (!configured) return null;
  const offerings = await Purchases.getOfferings();
  return offerings?.current ?? null;
}

export async function purchasePackage(aPackage) {
  if (!configured) throw new Error('RevenueCat is not configured.');
  if (!aPackage) throw new Error('A RevenueCat package is required.');

  const result = await Purchases.purchasePackage({ aPackage });
  return {
    ...result,
    isPremium: hasPremiumEntitlement(result?.customerInfo),
  };
}

export async function restorePurchases() {
  if (!configured) throw new Error('RevenueCat is not configured.');

  const customerInfo = await Purchases.restorePurchases();
  return {
    customerInfo,
    isPremium: hasPremiumEntitlement(customerInfo),
  };
}
