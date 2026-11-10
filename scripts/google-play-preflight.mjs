import fs from "node:fs";
import { publicBillingKey } from "../src/utils/billingPlatform.js";
const issues = [];
if (!publicBillingKey("android", { androidKey: process.env.VITE_REVENUECAT_ANDROID_PUBLIC_SDK_KEY }))
  issues.push("Configure the Fideora Google Play public RevenueCat SDK key (goog_).");
for (const name of ["FIDEORA_ANDROID_KEYSTORE_PATH", "FIDEORA_ANDROID_KEYSTORE_PASSWORD", "FIDEORA_ANDROID_KEY_ALIAS", "FIDEORA_ANDROID_KEY_PASSWORD"])
  if (!process.env[name]?.trim()) issues.push(`Configure ${name} in the release environment.`);
const store = process.env.FIDEORA_ANDROID_KEYSTORE_PATH;
if (store && !fs.existsSync(store)) issues.push("Upload keystore file does not exist.");
if (process.env.FIDEORA_ANDROID_VERSION_CODE && !/^[1-9]\d*$/.test(process.env.FIDEORA_ANDROID_VERSION_CODE))
  issues.push("Version code must be a positive integer greater than the last Play upload.");
if (issues.length) {
  console.error("Google Play release blocked:\n" + issues.map(x => "- " + x).join("\n"));
  process.exitCode = 1;
} else console.log("Android release configuration passes. Google products, native purchase tests, legal URLs and store declarations must also be verified before submission.");
