import test from "node:test";
import assert from "node:assert/strict";
import {
  FEATURE_BUNDLES,
  hasEntitlement,
  canUseFeature,
  dailyVerses,
} from "../src/utils/access.js";
import { createPurchasesClient } from "../src/services/purchasesClient.js";
const active = {
  entitlements: {
    active: {
      premium: { isActive: true, expirationDate: "2099-01-01T00:00:00Z" },
    },
  },
};
const free = { entitlements: { active: {} } };
function fake({ native = true, apiKey = "appl_test", retained = null } = {}) {
  const calls = [];
  let user = retained,
    infos = free,
    result = "CANCELLED",
    purchaseInfo = free;
  const sdk = {
    configure: async (options) => {
      calls.push(["configure", options.appUserID]);
      if (options.appUserID) user = options.appUserID;
    },
    isAnonymous: async () => ({ isAnonymous: !user }),
    logIn: async ({ appUserID }) => {
      calls.push(["login", appUserID]);
      user = appUserID;
      infos = free;
    },
    logOut: async () => {
      calls.push(["logout"]);
      user = null;
      infos = free;
    },
    overridePreferredUILocale: async ({ locale }) =>
      calls.push(["locale", locale]),
    getCustomerInfo: async () => {
      calls.push(["info", user]);
      return { customerInfo: infos };
    },
    getOfferings: async () => ({
      current: {
        identifier: "default",
        availablePackages: [{ identifier: "$rc_annual" }],
      },
    }),
    restorePurchases: async () => ({ customerInfo: infos }),
    addCustomerInfoUpdateListener: async (listener) => {
      calls.push(["listen", listener]);
      return "listener-1";
    },
    removeCustomerInfoUpdateListener: async (options) =>
      calls.push(["remove", options.listenerToRemove]),
  };
  const ui = {
    presentPaywall: async (options) => {
      calls.push(["paywall", options]);
      infos = purchaseInfo;
      return { result };
    },
    presentCustomerCenter: async () => calls.push(["manage"]),
  };
  return {
    calls,
    sdk,
    ui,
    setInfo: (info) => {
      infos = info;
    },
    setPurchase: (r, info) => {
      result = r;
      purchaseInfo = info;
    },
    client: createPurchasesClient({ sdk, ui, native, apiKey }),
  };
}
test("one free bundle out of ten, unknown features closed, own content remains accessible", () => {
  assert.equal(FEATURE_BUNDLES.length, 10);
  assert.equal(FEATURE_BUNDLES.filter((f) => !f.premium).length, 1);
  for (const f of FEATURE_BUNDLES)
    assert.equal(canUseFeature(f.id, false), !f.premium);
  assert.equal(canUseFeature("unknown", true), false);
  assert.equal(canUseFeature("notebook", false, { existing: true }), true);
});
test("only a valid active entitlement grants access; expired/offline cache and malformed dates deny", () => {
  assert.equal(hasEntitlement(active), true);
  assert.equal(hasEntitlement(free), false);
  assert.equal(hasEntitlement({ premium: true }), false);
  assert.equal(
    hasEntitlement({ entitlements: { active: { premium: {} } } }),
    false,
  );
  for (const expirationDate of ["2020-01-01", "garbage"])
    assert.equal(
      hasEntitlement({
        entitlements: { active: { premium: { expirationDate } } },
      }),
      false,
    );
  assert.equal(
    hasEntitlement({
      entitlements: { active: { premium: { isActive: false } } },
    }),
    false,
  );
});
test("daily preview is limited to exact book, chapter and verse range", () => {
  const verses = Array.from({ length: 10 }, (_, i) => ({ number: i + 1 }));
  const daily = { book: "John", chapter: 1, start: 3, end: 5 };
  assert.deepEqual(
    dailyVerses("John", 1, verses, daily).map((v) => v.number),
    [3, 4, 5],
  );
  assert.deepEqual(dailyVerses("Gen", 1, verses, daily), []);
  assert.deepEqual(dailyVerses("John", 2, verses, daily), []);
});
test("no native billing calls or fabricated premium when unsupported or missing configuration", async () => {
  for (const options of [{ native: false }, { apiKey: "" }]) {
    const f = fake(options);
    assert.equal((await f.client.present(null, "it")).available, false);
    assert.equal((await f.client.restore(null, "it")).available, false);
    assert.equal(f.calls.length, 0);
  }
});
test("concurrent initializations configure once and serialize accounts A/B/logout", async () => {
  const f = fake();
  await Promise.all([
    f.client.refresh("A", "it"),
    f.client.refresh("B", "pt"),
    f.client.refresh(null, "it"),
  ]);
  assert.equal(f.calls.filter((c) => c[0] === "configure").length, 1);
  assert.deepEqual(
    f.calls.filter((c) => ["login", "logout"].includes(c[0])),
    [["login", "B"], ["logout"]],
  );
  assert.deepEqual(
    f.calls.filter((c) => c[0] === "info").map((c) => c[1]),
    ["A", "B", null],
  );
});
test("a retained custom identity is logged out before guest subscription checks", async () => {
  const f = fake({ retained: "old-account" });
  await f.client.refresh(null, "it");
  assert.ok(
    f.calls.findIndex((c) => c[0] === "logout") <
      f.calls.findIndex((c) => c[0] === "info"),
  );
});
test("cancel/success UI results cannot grant premium without entitlement; successful purchase rechecks SDK", async () => {
  const f = fake();
  f.setPurchase("PURCHASED", free);
  assert.equal(
    hasEntitlement((await f.client.present("A", "it")).customerInfo),
    false,
  );
  f.setPurchase("CANCELLED", free);
  assert.equal(
    hasEntitlement((await f.client.present("A", "it")).customerInfo),
    false,
  );
  f.setPurchase("PURCHASED", active);
  assert.equal(
    hasEntitlement((await f.client.present("A", "it")).customerInfo),
    true,
  );
  const count = f.calls.filter((c) => c[0] === "paywall").length;
  await f.client.present("A", "it");
  assert.equal(f.calls.filter((c) => c[0] === "paywall").length, count);
});
test("restore unwraps customerInfo, listener removes exact id, customer center refreshes", async () => {
  const f = fake();
  await f.client.refresh("A", "it");
  f.setInfo(active);
  assert.equal(
    hasEntitlement((await f.client.restore("A", "it")).customerInfo),
    true,
  );
  const dispose = await f.client.subscribe(() => {});
  await dispose();
  assert.deepEqual(f.calls.at(-1), ["remove", "listener-1"]);
  assert.equal(
    hasEntitlement((await f.client.manage("A", "it")).customerInfo),
    true,
  );
});
test("no offering prevents paywall presentation and reports a recoverable state", async () => {
  const f = fake();
  f.sdk.getOfferings = async () => ({ current: null });
  const result = await f.client.present(null, "it");
  assert.equal(result.reason, "offering");
  assert.equal(
    f.calls.some((c) => c[0] === "paywall"),
    false,
  );
});
test("billing queue recovers after a failed identity change", async () => {
  const f = fake();
  await f.client.refresh("A", "it");
  const login = f.sdk.logIn;
  f.sdk.logIn = async () => {
    throw new Error("network");
  };
  await assert.rejects(f.client.refresh("B", "it"));
  f.sdk.logIn = login;
  await f.client.refresh("B", "it");
  assert.deepEqual(f.calls.at(-1), ["info", "B"]);
});
