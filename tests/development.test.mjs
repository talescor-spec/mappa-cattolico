import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import React from "react";
import { create, act } from "react-test-renderer";
import { build } from "vite";
import { resolveDevelopmentEnvironment } from "../src/utils/development.js";

test("production, unknown and failed native verification hide QA even when a local debug flag is present", async () => {
  for (const result of [
    null,
    { allowed: false, channel: "sandbox" },
    { allowed: true, channel: "production" },
    { allowed: "true", channel: "sandbox" },
    { allowed: true, channel: "web-local" },
  ]) {
    assert.equal(
      (
        await resolveDevelopmentEnvironment({
          native: true,
          debugWeb: true,
          checkNative: async () => result,
        })
      ).allowed,
      false,
    );
  }
  assert.equal(
    (
      await resolveDevelopmentEnvironment({
        native: true,
        debugWeb: true,
        checkNative: async () => {
          throw new Error("offline");
        },
      })
    ).allowed,
    false,
  );
});
test("only positively verified native test environments or a local web development build enable QA", async () => {
  for (const channel of ["sandbox", "debug"])
    assert.deepEqual(
      await resolveDevelopmentEnvironment({
        native: true,
        checkNative: async () => ({ allowed: true, channel }),
      }),
      { allowed: true, channel },
    );
  assert.equal(
    (await resolveDevelopmentEnvironment({ native: false, debugWeb: false }))
      .allowed,
    false,
  );
  assert.deepEqual(
    await resolveDevelopmentEnvironment({ native: false, debugWeb: true }),
    { allowed: true, channel: "web-local" },
  );
});
const root = fileURLToPath(new URL("..", import.meta.url));
const fixture = path.join(root, "tests/fixtures/development-mocks.jsx");
const temp = mkdtempSync(path.join(root, ".development-test-"));
try {
  const entry = path.join(temp, "entry.mjs");
  writeFileSync(
    entry,
    `export { default as DevelopmentTools } from ${JSON.stringify(path.join(root, "src/components/DevelopmentTools.jsx"))};\nexport { state } from ${JSON.stringify(fixture)};`,
  );
  const result = await build({
    configFile: false,
    logLevel: "silent",
    resolve: {
      alias: [
        {
          find: /^\.\.\/contexts\/(AuthContext|LanguageContext)$/,
          replacement: fixture,
        },
        {
          find: /^\.\.\/services\/(development|purchases)$/,
          replacement: fixture,
        },
        { find: /^\.\/UI$/, replacement: fixture },
      ],
    },
    build: {
      write: false,
      minify: false,
      lib: { entry, formats: ["es"] },
      rollupOptions: {
        external: [/^react(?:\/.*)?$/],
        output: { inlineDynamicImports: true },
      },
    },
  });
  const bundle = path.join(temp, "bundle.mjs");
  writeFileSync(
    bundle,
    (Array.isArray(result) ? result[0] : result).output.find(
      (x) => x.type === "chunk",
    ).code,
  );
  const { DevelopmentTools, state } = await import(pathToFileURL(bundle));
  const previousWindow = globalThis.window;
  const storage = new Map([
    ["fideoraUserName", "Maria"],
    ["fideoraOnboarded", "1"],
    ["fideoraEntryAccessV1", "hard"],
    ["fideoraRoutine", JSON.stringify({ goal: "pray", minutes: 15 })],
    ["fideoraStudy:qa-user", "kept"],
  ]);
  globalThis.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
  };
  const nodeText = (n) =>
    typeof n === "string" ? n : (n.children || []).map(nodeText).join("");
  const text = (tree) => JSON.stringify(tree.toJSON());
  const click = async (tree, label) => {
    const b = tree.root
      .findAllByType("button")
      .find((n) => nodeText(n).includes(label));
    assert.ok(b, label);
    await act(async () => b.props.onClick());
  };
  let tree;
  try {
    await test("public profiles have no replay or development menu", async () => {
      state.environment = { allowed: false, channel: "production" };
      await act(async () => {
        tree = create(React.createElement(DevelopmentTools));
      });
      assert.equal(tree.toJSON(), null);
      await act(async () => tree.unmount());
    });
    await test("internal QA can jump to a clean step and restart without changing real onboarding or account data", async () => {
      state.environment = { allowed: true, channel: "sandbox" };
      state.calls = [];
      const before = [...storage.entries()];
      await act(async () => {
        tree = create(React.createElement(DevelopmentTools));
      });
      await click(tree, "Strumenti di sviluppo");
      await act(async () =>
        tree.root
          .findByType("select")
          .props.onChange({ target: { value: "3" } }),
      );
      await click(tree, "Apri la fase selezionata");
      assert.equal(tree.root.findByType("input").props.value, "");
      await act(async () =>
        tree.root
          .findByType("input")
          .props.onChange({ target: { value: "Temporary" } }),
      );
      await click(tree, "Concludi il test");
      assert.ok(text(tree).includes("Inizia la simulazione"));
      assert.deepEqual([...storage.entries()], before);
      assert.deepEqual(state.calls, []);
      await click(tree, "Inizia la simulazione");
      assert.ok(text(tree).includes("1 / 4"));
      await click(tree, "Close");
      assert.ok(text(tree).includes("Rivedi una fase"));
      await act(async () => tree.unmount());
    });
    await test("closing a QA simulation does not open checkout; completing a selected step can open the guarded sandbox preview", async () => {
      state.environment = { allowed: true, channel: "sandbox" };
      state.calls = [];
      await act(async () => {
        tree = create(React.createElement(DevelopmentTools));
      });
      await click(tree, "Strumenti di sviluppo");
      await act(async () =>
        tree.root
          .findByType("input")
          .props.onChange({ target: { checked: true } }),
      );
      await click(tree, "Inizia la simulazione");
      await click(tree, "Close");
      assert.equal(state.calls.length, 0);
      await act(async () =>
        tree.root
          .findByType("select")
          .props.onChange({ target: { value: "3" } }),
      );
      await click(tree, "Apri la fase selezionata");
      await click(tree, "Scopri i piani Premium");
      assert.deepEqual(state.calls, [["qa-user", "it"]]);
      await click(tree, "Visualizza il paywall");
      assert.equal(state.calls.length, 2);
      await act(async () => tree.unmount());
    });
  } finally {
    globalThis.window = previousWindow;
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
