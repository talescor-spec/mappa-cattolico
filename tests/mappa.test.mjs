import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import React from "react";
import { create, act } from "react-test-renderer";
import { build } from "vite";
import { GOSPELS, MATTHEW } from "../src/data/mappa.js";

for (const language of ["it", "pt"]) {
  test(`${language}: every Mappa reading opens an existing chapter and verse`, () => {
    const bible = JSON.parse(
      readFileSync(`public/bible/${language}.json`, "utf8"),
    );
    const references = [
      ...MATTHEW.passages,
      ...GOSPELS.map((g) => ({ book: g.book, ...g.reference })),
    ];
    for (const r of references)
      assert.ok(
        bible.books
          .find((b) => b.book === r.book)
          ?.chapters.find((c) => c.chapter === r.chapter)
          ?.verses.some((v) => v.number === r.verse),
        `${r.book} ${r.chapter}:${r.verse}`,
      );
    for (const g of GOSPELS)
      assert.equal(
        bible.books.find((b) => b.book === g.book).chapters.length,
        g.chapters,
      );
  });
}
const root = fileURLToPath(new URL("..", import.meta.url));
const fixture = path.join(root, "tests/fixtures/mappa-mocks.jsx");
const temp = mkdtempSync(path.join(root, ".mappa-test-"));
try {
  const entry = path.join(temp, "entry.mjs");
  writeFileSync(
    entry,
    [
      `export { default as MappaHome, MappaSample, GospelComparison, MatthewDetail } from ${JSON.stringify(path.join(root, "src/components/Mappa.jsx"))};`,
      `export { default as Onboarding } from ${JSON.stringify(path.join(root, "src/components/Onboarding.jsx"))};`,
      `export { StudyProvider, useStudy } from ${JSON.stringify(path.join(root, "src/contexts/StudyContext.jsx"))};`,
      `export { state } from ${JSON.stringify(fixture)};`,
    ].join("\n"),
  );
  const result = await build({
    configFile: false,
    logLevel: "silent",
    resolve: {
      alias: [
        {
          find: /^(\.\.\/contexts\/|\.\/)(AuthContext|LanguageContext|PremiumContext)$/,
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
  const {
    MappaHome,
    MappaSample,
    GospelComparison,
    MatthewDetail,
    Onboarding,
    StudyProvider,
    useStudy,
    state,
  } = await import(pathToFileURL(bundle));
  const previousWindow = globalThis.window;
  const storage = new Map();
  globalThis.window = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    scrollTo() {},
    setTimeout,
    clearTimeout,
  });
  const text = (tree) => JSON.stringify(tree.toJSON());
  const nodeText = (node) =>
    typeof node === "string"
      ? node
      : (node.children || []).map(nodeText).join("");
  const click = async (tree, label) => {
    const b = tree.root
      .findAllByType("button")
      .find((n) => nodeText(n).includes(label));
    assert.ok(b, label);
    await act(async () => b.props.onClick());
  };
  let tree;
  try {
    await test("comparison switches all four perspectives and sends the selected real reference to the reader", async () => {
      let reference;
      await act(async () => {
        tree = create(
          React.createElement(GospelComparison, {
            onRead: (r) => (reference = r),
          }),
        );
      });
      for (const g of GOSPELS) {
        await click(tree, g.name[0]);
        assert.ok(text(tree).includes(g.focus[0]));
        await click(tree, "Leggi il riferimento");
        assert.deepEqual(reference, {
          book: g.book,
          chapter: g.reference.chapter,
          verse: g.reference.verse,
        });
      }
      await act(async () => tree.unmount());
    });
    await test("Matteo reflection uses the existing notebook store, survives reload and stays with its owner", async () => {
      let study;
      function Probe() {
        study = useStudy();
        return null;
      }
      const mount = async () =>
        act(async () => {
          tree = create(
            React.createElement(
              StudyProvider,
              null,
              React.createElement(Probe),
              React.createElement(MappaHome, { onRead() {} }),
            ),
          );
        });
      await mount();
      await click(tree, "Esplora Matteo");
      await act(async () =>
        tree.root.findByType("textarea").props.onChange({
          target: { value: "  Un gesto di misericordia oggi.  " },
        }),
      );
      const uuid = Object.getOwnPropertyDescriptor(
        globalThis.crypto,
        "randomUUID",
      );
      Object.defineProperty(globalThis.crypto, "randomUUID", {
        value: undefined,
        configurable: true,
      });
      try {
        await click(tree, "Salva nel Quaderno");
      } finally {
        if (uuid) Object.defineProperty(globalThis.crypto, "randomUUID", uuid);
        else delete globalThis.crypto.randomUUID;
      }
      assert.ok(text(tree).includes("Riflessione salvata"));
      assert.equal(study.entries.length, 1);
      assert.equal(study.entries[0].kind, "note");
      assert.equal(
        study.entries[0].payload.body,
        "Un gesto di misericordia oggi.",
      );
      await act(async () => tree.unmount());
      await mount();
      assert.equal(
        study.entries[0].payload.title,
        "Matteo · La mia riflessione",
      );
      await act(async () => tree.unmount());
      state.auth = { user: { id: "other-account" }, loading: false };
      await mount();
      assert.equal(study.entries.length, 0);
      assert.equal(tree.root.findAllByType(MatthewDetail).length, 0);
      await act(async () => tree.unmount());
      state.auth = { user: null, loading: false };
    });
    await test("legacy free users get an introduction and upgrade without mounting the full guide or note form", async () => {
      state.premium = false;
      state.requests = [];
      await act(async () => {
        tree = create(
          React.createElement(
            StudyProvider,
            null,
            React.createElement(MappaHome, { onRead() {} }),
          ),
        );
      });
      await click(tree, "Continua con Matteo");
      assert.equal(tree.root.findAllByType("textarea").length, 0);
      assert.ok(!text(tree).includes("Passaggi da esplorare"));
      await click(tree, "Scopri Premium");
      assert.deepEqual(state.requests, ["mappa"]);
      await act(async () => tree.unmount());
      state.premium = true;
    });
    await test("onboarding provides interactive samples before checkout without granting access", async () => {
      let finished = 0;
      await act(async () => {
        tree = create(
          React.createElement(Onboarding, {
            hardPaywall: true,
            onFinish: () => finished++,
          }),
        );
      });
      await click(tree, "Scopri la Mappa");
      assert.equal(finished, 0);
      assert.equal(tree.root.findAllByType(MappaSample).length, 1);
      await click(tree, "Il Regno nella vita quotidiana");
      assert.ok(text(tree).includes("Le beatitudini, la preghiera"));
      await click(tree, "Continua");
      await click(tree, "Giovanni");
      assert.ok(text(tree).includes("Segni e fede"));
      assert.equal(finished, 0);
      await click(tree, "Continua");
      await act(async () =>
        tree.root
          .findByType("input")
          .props.onChange({ target: { value: "  Thales  " } }),
      );
      await click(tree, "Scopri i piani Premium");
      assert.equal(finished, 1);
      assert.equal(storage.get("fideoraUserName"), "Thales");
      assert.equal(JSON.parse(storage.get("fideoraRoutine")).goal, "study");
      await act(async () => tree.unmount());
    });
  } finally {
    globalThis.window = previousWindow;
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
