// Called inside the billing identity queue, after configure/login/logout.
// Advertising errors never affect entitlement, restore or purchase availability.
export function createAttributionClient({ sdk, bridge, native }) {
  let lastIdentity, lastStatus;
  return {
    async sync({ identity = null, request = false } = {}) {
      if (!native) return;
      let state;
      try {
        state = await (request ? bridge.requestAuthorization() : bridge.getState());
      } catch {
        state = { status: "unavailable", configured: false };
      }
      const authorized = state.configured === true && state.status === "authorized"
        && typeof state.anonymousId === "string" && Boolean(state.anonymousId);
      const status = authorized ? "authorized"
        : state.status === "authorized" ? "unavailable" : state.status || "unavailable";
      if (identity === lastIdentity && status === lastStatus && !request) return;
      // Invalidate the cache before writes, so a partial failure is retried.
      lastStatus = undefined;
      try {
        if (authorized) {
          await sdk.collectDeviceIdentifiers();
          await sdk.setFBAnonymousID({ fbAnonymousID: state.anonymousId });
          await sdk.setAttributes({ $attConsentStatus: "authorized", fideora_ad_consent: "authorized" });
        } else {
          await sdk.setFBAnonymousID({ fbAnonymousID: null });
          await sdk.setAttributes({
            $idfa: null,
            $idfv: null,
            $ip: null,
            $attConsentStatus: ["denied", "restricted", "notDetermined"].includes(state.status)
              ? state.status : null,
            fideora_ad_consent: status,
          });
        }
        if (request && typeof sdk.syncAttributesAndOfferingsIfNeeded === "function")
          await sdk.syncAttributesAndOfferingsIfNeeded();
        lastIdentity = identity;
        lastStatus = status;
      } catch {
        // No identifiers, emails, receipts or vendor errors are logged.
      }
    },
  };
}
