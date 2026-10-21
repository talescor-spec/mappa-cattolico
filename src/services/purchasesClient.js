import { hasEntitlement } from "../utils/access.js";
// Serialize billing with identity, independent of profile/database hydration.
export function createPurchasesClient({
  sdk,
  ui,
  native,
  apiKey,
  entitlement = "premium",
}) {
  let configured = false,
    identity,
    locale,
    queue = Promise.resolve();
  const unavailable = () => ({
    available: false,
    reason: native ? "configuration" : "platform",
    customerInfo: null,
  });
  const serial = (run) => {
    const task = queue.then(run);
    queue = task.catch(() => {});
    return task;
  };
  async function connect(userId, language) {
    if (!native || !apiKey) return false;
    const next = userId || null;
    if (!configured) {
      await sdk.configure({ apiKey, ...(next ? { appUserID: next } : {}) });
      configured = true;
      if (!next && !(await sdk.isAnonymous()).isAnonymous) await sdk.logOut();
      identity = next;
    } else if (identity !== next) {
      if (next) await sdk.logIn({ appUserID: next });
      else if (!(await sdk.isAnonymous()).isAnonymous) await sdk.logOut();
      identity = next;
    }
    const preferred = language === "pt" ? "pt_BR" : "it";
    if (locale !== preferred) {
      await sdk.overridePreferredUILocale({ locale: preferred });
      locale = preferred;
    }
    return true;
  }
  const info = async () => (await sdk.getCustomerInfo()).customerInfo;
  return {
    refresh: (user, lang) =>
      serial(async () => {
        if (!(await connect(user, lang))) return unavailable();
        return { available: true, customerInfo: await info() };
      }),
    present: (user, lang) =>
      serial(async () => {
        if (!(await connect(user, lang))) return unavailable();
        const before = await info();
        if (hasEntitlement(before, entitlement))
          return {
            available: true,
            customerInfo: before,
            result: "NOT_PRESENTED",
          };
        const offering = (await sdk.getOfferings())?.current;
        if (!offering?.availablePackages?.length)
          return { ...unavailable(), reason: "offering" };
        const { result } = await ui.presentPaywall({
          offering,
          displayCloseButton: true,
          presentationConfiguration: { ios: "FULL_SCREEN" },
        });
        // UI result / local flags never grant access; only CustomerInfo does.
        return { available: true, customerInfo: await info(), result };
      }),
    restore: (user, lang) =>
      serial(async () => {
        if (!(await connect(user, lang))) return unavailable();
        const { customerInfo } = await sdk.restorePurchases();
        return { available: true, customerInfo };
      }),
    manage: (user, lang) =>
      serial(async () => {
        if (!(await connect(user, lang))) return unavailable();
        await ui.presentCustomerCenter();
        return { available: true, customerInfo: await info() };
      }),
    subscribe: async (listener) => {
      if (!native || !apiKey) return () => {};
      await queue;
      if (!configured) return () => {};
      const id = await sdk.addCustomerInfoUpdateListener(listener);
      return () =>
        sdk.removeCustomerInfoUpdateListener({ listenerToRemove: id });
    },
  };
}
