import fs from "node:fs";
import assert from "node:assert/strict";
const checks = [];
const check = (condition, message) => {
  assert.ok(condition, message);
  checks.push(message);
};
const read = (f) => fs.readFileSync(f, "utf8");
const cap = JSON.parse(read("capacitor.config.json"));
check(
  cap.appName === "Fideora" && cap.appId === "com.fideora.app",
  "Native name / bundle identifier defined",
);
check(!cap.server?.url, "iOS ships bundled assets; no live remote wrapper");
check(
  fs.existsSync("ios/App/App.xcodeproj/project.pbxproj"),
  "Xcode project present",
);
check(
  read("ios/App/App/Base.lproj/Main.storyboard").includes(
    "FideoraViewController",
  ),
  "Custom bridge registered in storyboard",
);
check(
  read("ios/App/App/SceneDelegate.swift").includes("FideoraViewController()"),
  "Scene lifecycle uses the secure custom bridge",
);
const keychain = read("ios/App/App/FideoraSecureStorage.swift");
check(
  keychain.includes("SecItemCopyMatching") &&
    keychain.includes("kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly"),
  "Native auth uses device-only Keychain",
);
check(
  read("src/lib/supabase.js").includes("storage: authStorage"),
  "Supabase uses platform storage adapter",
);
check(
  /getPlatform\(\)\s*===\s*["']ios["']/.test(read("src/lib/secureStorage.js")),
  "Native tokens do not fall back to WebView storage",
);
const plist = read("ios/App/App/Info.plist");
check(
  plist.includes("ITSAppUsesNonExemptEncryption") &&
    plist.includes("pt-BR") &&
    plist.includes("<string>it</string>"),
  "Native Italian/Portuguese localization and encryption declaration present",
);
check(
  !/NS(Camera|Microphone|Location|PhotoLibrary)UsageDescription/.test(plist),
  "No unneeded sensitive permission requests",
);
check(
  fs.existsSync("ios/App/App/PrivacyInfo.xcprivacy"),
  "App privacy manifest present",
);
check(
  fs.existsSync(
    "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png",
  ),
  "App Store icon present",
);
check(
  read("ios/App/App.xcodeproj/project.pbxproj").includes(
    "PrivacyInfo.xcprivacy in Resources",
  ),
  "Privacy manifest belongs to native target",
);
for (const language of ["it", "pt"]) {
  const bible = JSON.parse(read(`public/bible/${language}.json`));
  check(
    bible.books.length === 66 && bible.license === "public-domain",
    `${language}: credited public-domain Bible corpus`,
  );
  check(
    bible.books.reduce((count, b) => count + b.chapters.length, 0) === 1189,
    `${language}: 1189 readable chapters`,
  );
}
for (const page of ["privacy", "terms", "support"])
  check(fs.existsSync(`public/${page}.html`), `Public ${page} page present`);
check(
  /rpc\(\s*["']fideora_delete_own_account["']\s*\)/.test(read("src/contexts/AuthContext.jsx")),
  "In-app account deletion connected",
);
check(
  read("src/components/AccountPanel.jsx").includes("Apple"),
  "Account deletion explains Apple subscriptions",
);
const scan = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? scan(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
    );
const client = scan("src")
  .filter((f) => /\.(js|jsx)$/.test(f))
  .map(read)
  .join("\n");
check(
  !/sb_secret_|service_role["']\s*:|-----BEGIN PRIVATE KEY-----/.test(client),
  "No private server credentials in client",
);
check(
  !client.includes("dangerouslySetInnerHTML"),
  "No raw HTML injection for study content",
);
console.log(checks.map((c) => `PASS ${c}`).join("\n"));
console.log(
  `\n${checks.length} structural checks passed. This is not a signed-build or App Review release approval. Run npm run appstore:release for the separate evidence gate.`,
);
