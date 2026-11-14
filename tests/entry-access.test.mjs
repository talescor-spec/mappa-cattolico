import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import React from "react";
import { create, act } from "react-test-renderer";
import { build } from "vite";
import { initializeEntryAccess, entryScreen, ENTRY_ACCESS_KEY } from "../src/utils/entryAccess.js";

test("new iOS cohort survives onboarding completion and relaunch; legacy/web remain free", () => {
  const storage = new Map();
  const options = { native: true, read: key => storage.get(key), write: (key, value) => storage.set(key, value) };
  assert.equal(initializeEntryAccess(options), "hard");
  storage.set("fideoraOnboarded", "1");
  assert.equal(initializeEntryAccess(options), "hard");
  storage.delete(ENTRY_ACCESS_KEY);
  assert.equal(initializeEntryAccess(options), "legacy");
  assert.equal(initializeEntryAccess({ ...options, native: false }), "legacy");
  assert.equal(initializeEntryAccess({ native: true, read: () => "", write: () => false }), "hard");
});

test("the entry boundary fails closed during verification and after entitlement expiry", () => {
  const base = { onboard: false, mode: "hard", checking: false, isPremium: false };
  assert.equal(entryScreen(base), "paywall");
  assert.equal(entryScreen({ ...base, checking: true }), "checking");
  assert.equal(entryScreen({ ...base, isPremium: true }), "content");
  assert.equal(entryScreen({ ...base, onboard: true }), "onboarding");
  assert.equal(entryScreen({ ...base, mode: "legacy" }), "content");
});

const root = fileURLToPath(new URL("..", import.meta.url));
const fixture = path.join(root, "tests/fixtures/entry-mocks.jsx");
const temp = mkdtempSync(path.join(root, ".entry-test-"));
try {
  const entry = path.join(temp, "entry.mjs");
  writeFileSync(entry, [
    `export { Fideora } from ${JSON.stringify(path.join(root, "src/App.jsx"))};`,
    `export { PremiumProvider, usePremium } from ${JSON.stringify(path.join(root, "src/contexts/PremiumContext.jsx"))};`,
    `export { default as Onboarding } from ${JSON.stringify(path.join(root, "src/components/Onboarding.jsx"))};`,
    `export { state } from ${JSON.stringify(fixture)};`,
  ].join("\n"));
  const result = await build({
    configFile: false, logLevel: "silent",
    resolve: { alias: [
      { find: /^(\.\/contexts\/|\.\.\/contexts\/|\.\/)(AuthContext|LanguageContext|StudyContext)$/, replacement: fixture },
      { find: /^(\.\/services\/|\.\.\/services\/)purchases$/, replacement: fixture },
      { find: /^\.\/hooks\/useBible$/, replacement: fixture },
      { find: /^(\.\/components\/|\.\/|\.\.\/components\/)UI$/, replacement: fixture },
      { find: /^@capacitor\/app$/, replacement: fixture },
    ] },
    build: { write: false, minify: false, lib: { entry, formats: ["es"] }, rollupOptions: { external: [/^react(?:\/.*)?$/], output: { inlineDynamicImports: true } } },
  });
  const bundle = path.join(temp, "entry-bundle.mjs");
  writeFileSync(bundle, (Array.isArray(result) ? result[0] : result).output.find(x => x.type === "chunk").code);
  const { Fideora, PremiumProvider, usePremium, Onboarding, state } = await import(pathToFileURL(bundle));
  const free = { entitlements: { active: {} } };
  const active = { entitlements: { active: { premium: { isActive: true, expirationDate: "2099-01-01" } } } };
  const oldWindow = globalThis.window, oldDocument = globalThis.document;
  const storage = new Map();
  globalThis.window = Object.assign(new EventTarget(), { localStorage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }, scrollTo() {} });
  globalThis.document = new EventTarget();
  let latest, tree;
  function Probe() { latest = usePremium(); return null; }
  const view = () => React.createElement(PremiumProvider, null, React.createElement(Probe), React.createElement(Fideora));
  const contentCount = () => tree.root.findAll(node => node.props.className === "app").length;
  async function mount(seed = {}) {
    storage.clear(); Object.entries(seed).forEach(([key, value]) => storage.set(key, value));
    state.auth = { user: null, loading: false }; state.language = "it"; state.info = free; state.calls = [];
    state.present = async () => ({ available: true, result: "CANCELLED", customerInfo: state.info });
    await act(async () => { tree = create(view()); });
  }
  try {
    await test("new install shows onboarding first; completion opens hard checkout and cancellation keeps all content unmounted", async () => {
      await mount();
      assert.equal(state.calls.length, 0);
      assert.equal(contentCount(), 0);
      assert.equal(tree.root.findByType(Onboarding).props.hardPaywall, true);
      assert.equal(tree.root.findAll(node => node.props["data-dismiss"] === "true").length, 0);
      await act(async () => tree.root.findByType(Onboarding).props.onFinish(true));
      assert.deepEqual(state.calls, [[null, "it", { hardPaywall: true }]]);
      assert.equal(storage.get("fideoraOnboarded"), "1");
      assert.equal(contentCount(), 0);
      await act(async () => {});
      assert.equal(state.calls.length, 1, "cancellation must not reopen checkout in a loop");
      await act(async () => tree.unmount());
      state.calls = [];
      await act(async () => { tree = create(view()); });
      assert.equal(tree.root.findAllByType(Onboarding).length, 0);
      assert.equal(contentCount(), 0);
      assert.equal(state.calls.length, 1, "relaunch presents checkout without repeating onboarding");
      await act(async () => tree.unmount());
    });
    await test("verified restore unlocks the root; expiry locks it again without deleting personal data", async () => {
      await mount({ [ENTRY_ACCESS_KEY]: "hard", fideoraOnboarded: "1", fideoraUserName: "Test" });
      state.info = active;
      await act(async () => latest.restore());
      assert.equal(contentCount(), 1);
      state.info = { entitlements: { active: { premium: { isActive: true, expirationDate: "2020-01-01" } } } };
      await act(async () => latest.refresh());
      assert.equal(contentCount(), 0);
      assert.equal(storage.get("fideoraUserName"), "Test");
      await act(async () => tree.unmount());
    });
    await test("offering failures retain retry, restore and account/data access without exposing core content", async () => {
      state.present = null;
      await mount({ [ENTRY_ACCESS_KEY]: "hard", fideoraOnboarded: "1" });
      state.present = async () => ({ available: false, reason: "offering", customerInfo: null });
      await act(async () => latest.request("welcome", { hardPaywall: true }));
      assert.equal(contentCount(), 0);
      assert.equal(latest.message, "unavailable");
      const text = JSON.stringify(tree.toJSON());
      assert.match(text, /Ripristina acquisti/);
      assert.match(text, /Account e dati/);
      await act(async () => tree.unmount());
    });
    await test("partial storage failure cannot turn a new hard install into a legacy free installation", async () => {
      await mount();
      storage.delete(ENTRY_ACCESS_KEY);
      const originalSet = window.localStorage.setItem;
      window.localStorage.setItem = (key, value) => {
        if (key === ENTRY_ACCESS_KEY) throw new Error("storage unavailable");
        originalSet(key, value);
      };
      await act(async () => tree.root.findByType(Onboarding).props.onFinish(true));
      assert.notEqual(storage.get("fideoraOnboarded"), "1");
      assert.equal(contentCount(), 0);
      window.localStorage.setItem = originalSet;
      await act(async () => tree.unmount());
    });
    await test("previously onboarded installation keeps its existing free experience", async () => {
      await mount({ fideoraOnboarded: "1" });
      assert.equal(storage.get(ENTRY_ACCESS_KEY), "legacy");
      assert.equal(contentCount(), 1);
      assert.equal(state.calls.length, 0);
      await act(async () => tree.unmount());
    });
  } finally { globalThis.window = oldWindow; globalThis.document = oldDocument; }
} finally { rmSync(temp, { recursive: true, force: true }); }
