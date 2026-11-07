import test from "node:test";
import assert from "node:assert/strict";
import { nativeBillingPlatform, publicBillingKey, subscriptionManagementURL } from "../src/utils/billingPlatform.js";

test("Android uses only its Google SDK key; absent, wrong-store and test keys cannot enable production billing", () => {
  const keys = { iosKey: "appl_public_example", androidKey: "goog_public_example" };
  assert.equal(publicBillingKey("android", keys), keys.androidKey);
  assert.equal(publicBillingKey("ios", keys), keys.iosKey);
  assert.equal(publicBillingKey("android", { iosKey: keys.iosKey }), "");
  for (const androidKey of ["appl_public_example", "test_example", "sk_example", "goog_", ""])
    assert.equal(publicBillingKey("android", { androidKey }), "");
  assert.equal(publicBillingKey("web", keys), "");
});

test("native Android follows the same Premium gate as iOS; web never pretends to run native billing", () => {
  assert.equal(nativeBillingPlatform("android", true), true);
  assert.equal(nativeBillingPlatform("ios", true), true);
  assert.equal(nativeBillingPlatform("android", false), false);
  assert.equal(nativeBillingPlatform("web", true), false);
});

test("Android account deletion and subscription management link to the Google subscription account", () => {
  const url = new URL(subscriptionManagementURL("android"));
  assert.equal(url.origin, "https://play.google.com");
  assert.equal(url.searchParams.get("package"), "com.fideora.app");
  assert.equal(new URL(subscriptionManagementURL("ios")).hostname, "apps.apple.com");
});
