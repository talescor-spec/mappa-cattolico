import test from "node:test";
import assert from "node:assert/strict";
import { createAttributionClient } from "../src/services/attributionClient.js";
import { createPurchasesClient } from "../src/services/purchasesClient.js";

function fixture(state = { status: "authorized", configured: true, anonymousId: "real-device-id" }) {
  const calls = [];
  const sdk = {
    collectDeviceIdentifiers: async () => calls.push(["collect"]),
    setFBAnonymousID: async value => calls.push(["anonymous", value]),
    setAttributes: async value => calls.push(["attributes", value]),
    syncAttributesAndOfferingsIfNeeded: async () => calls.push(["sync"]),
  };
  const bridge = {
    getState: async () => state,
    requestAuthorization: async () => { calls.push(["prompt"]); return state; },
  };
  return { calls, sdk, bridge, client: createAttributionClient({ sdk, bridge, native: true }) };
}

test("denied, restricted, unknown and unconfigured devices never collect advertising identifiers", async () => {
  for (const state of [
    { status: "denied", configured: true },
    { status: "restricted", configured: true },
    { status: "notDetermined", configured: true },
    { status: "authorized", configured: false, anonymousId: "id" },
    { status: "authorized", configured: true },
  ]) {
    const f = fixture(state);
    await f.client.sync();
    assert.ok(!f.calls.some(c => c[0] === "collect"));
    assert.deepEqual(f.calls[0], ["anonymous", { fbAnonymousID: null }]);
    assert.equal(f.calls[1][1].$idfa, null);
    assert.equal(f.calls[1][1].$ip, null);
  }
});

test("authorized identifiers are attached after configuration and refreshed for each RC identity", async () => {
  const f = fixture();
  await f.client.sync({ identity: "user-a" });
  await f.client.sync({ identity: "user-a" });
  await f.client.sync({ identity: "user-b" });
  await f.client.sync({ identity: null });
  assert.equal(f.calls.filter(c => c[0] === "collect").length, 3);
  assert.equal(f.calls.filter(c => c[0] === "prompt").length, 0);
  assert.equal(f.calls[2][1].$attConsentStatus, "authorized");
});

test("revoking consent clears identifiers and the authorization marker on the current customer", async () => {
  const state = { status: "authorized", configured: true, anonymousId: "id" };
  const f = fixture(state);
  await f.client.sync();
  state.status = "denied";
  await f.client.sync();
  assert.deepEqual(f.calls.at(-2), ["anonymous", { fbAnonymousID: null }]);
  assert.equal(f.calls.at(-1)[1].$attConsentStatus, "denied");
  assert.equal(f.calls.at(-1)[1].$idfv, null);
});

test("attribution vendor failure is swallowed and retried without caching partial success", async () => {
  const f = fixture();
  f.sdk.setFBAnonymousID = async () => { throw Error("offline"); };
  await f.client.sync();
  await f.client.sync();
  assert.equal(f.calls.filter(c => c[0] === "collect").length, 2);
  f.bridge.getState = async () => { throw Error("plugin unavailable"); };
  await f.client.sync();
});

test("web/Android do not call the iOS bridge or RevenueCat attribution", async () => {
  const f = fixture();
  const client = createAttributionClient({ ...f, native: false });
  await client.sync({ request: true });
  assert.deepEqual(f.calls, []);
});

test("pre-purchase synchronization happens before StoreKit and inside the billing identity queue", async () => {
  const calls = [];
  const free = { entitlements: { active: {} } };
  const client = createPurchasesClient({
    native: true, apiKey: "appl_test",
    sdk: {
      configure: async () => calls.push("configure"),
      overridePreferredUILocale: async () => {},
      getCustomerInfo: async () => ({ customerInfo: free }),
      getOfferings: async () => ({ all: { mappa_v1: { availablePackages: [{}] } } }),
    },
    ui: { presentPaywall: async () => { calls.push("storekit"); return { result: "CANCELLED" }; } },
    attribution: { sync: async ({ identity, request }) => { calls.push([identity, request]); } },
  });
  await client.present("user-a", "it");
  assert.deepEqual(calls, ["configure", ["user-a", true], "storekit"]);
});

test("even an unexpected attribution exception does not block paywall or verified entitlement", async () => {
  let displayed = false;
  const active = { entitlements: { active: { premium: { isActive: true, expirationDate: "2099-01-01" } } } };
  const client = createPurchasesClient({
    native: true, apiKey: "appl_test",
    sdk: { configure: async () => {}, overridePreferredUILocale: async () => {}, getCustomerInfo: async () => ({ customerInfo: active }) },
    ui: { presentPaywall: async () => { displayed = true; } },
    attribution: { sync: async () => { throw Error("unavailable"); } },
  });
  assert.equal((await client.refresh("user-a", "it")).customerInfo, active);
  assert.equal((await client.present("user-a", "it")).result, "NOT_PRESENTED");
  assert.equal(displayed, false);
});
