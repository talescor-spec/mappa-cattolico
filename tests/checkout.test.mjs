import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { build } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixture = path.join(root, 'tests/fixtures/checkout-mocks.mjs');
const temp = mkdtempSync(path.join(root, '.checkout-test-'));
try {
  const entry = path.join(temp, 'entry.mjs');
  writeFileSync(entry, [
    `export { PremiumProvider, usePremium } from ${JSON.stringify(path.join(root, 'src/contexts/PremiumContext.jsx'))};`,
    `export { state } from ${JSON.stringify(fixture)};`,
  ].join('\n'));
  const built = await build({
    configFile: false, logLevel: 'silent',
    resolve: { alias: [
      { find: /^\.\/AuthContext$/, replacement: fixture },
      { find: /^\.\/LanguageContext$/, replacement: fixture },
      { find: /^\.\.\/services\/purchases$/, replacement: fixture },
      { find: /^@capacitor\/app$/, replacement: fixture },
    ] },
    build: {
      write: false, minify: false,
      lib: { entry, formats: ['es'] },
      rollupOptions: { external: [/^react(?:\/.*)?$/] },
    },
  });
  const bundle = path.join(temp, 'checkout.mjs');
  writeFileSync(bundle, (Array.isArray(built) ? built[0] : built).output.find(x => x.type === 'chunk').code);
  const { PremiumProvider, usePremium, state } = await import(pathToFileURL(bundle));
  const free = { entitlements: { active: {} } };
  const active = { entitlements: { active: { premium: { isActive: true, expirationDate: '2099-01-01' } } } };
  const previousDocument = globalThis.document, previousWindow = globalThis.window;
  globalThis.document = new EventTarget();
  globalThis.window = new EventTarget();
  let latest;
  function Probe() { latest = usePremium(); return null; }
  let tree;
  async function mount(auth = { user: null, loading: false }) {
    state.auth = auth; state.language = 'it'; state.calls = []; state.info = free;
    state.present = async () => ({ available: true, customerInfo: state.info, result: 'CANCELLED' });
    await act(async () => { tree = create(React.createElement(PremiumProvider, null, React.createElement(Probe))); });
  }
  async function unmount() { await act(async () => tree.unmount()); }
  try {
    await test('one tap opens checkout directly; rapid taps cannot open two paywalls', async () => {
      await mount();
      let resolve;
      state.present = () => new Promise(r => { resolve = r; });
      await act(async () => { latest.request('welcome'); latest.request('welcome'); });
      assert.equal(state.calls.length, 1);
      assert.equal(latest.offer, null, 'no intermediate offer modal');
      assert.equal(latest.busy, true);
      await act(async () => latest.request('bible'));
      assert.equal(state.calls.length, 1);
      await act(async () => resolve({ available: true, customerInfo: free, result: 'CANCELLED' }));
      assert.equal(latest.busy, false);
      assert.equal(latest.offer, null, 'dismissal must return to the app');
      await act(async () => {});
      assert.equal(state.calls.length, 1, 'dismissal must not reopen checkout');
      await unmount();
    });
    await test('onboarding checkout waits for auth hydration and uses the resolved account and locale', async () => {
      await mount({ user: null, loading: true });
      await act(async () => latest.request('welcome'));
      assert.equal(state.calls.length, 0);
      assert.equal(latest.preparing, true);
      state.auth = { user: { id: 'resolved-account' }, loading: false }; state.language = 'pt';
      await act(async () => tree.update(React.createElement(PremiumProvider, null, React.createElement(Probe))));
      assert.deepEqual(state.calls, [['resolved-account', 'pt']]);
      await unmount();
    });
    await test('unavailable checkout offers retry; only a verified entitlement unlocks Premium', async () => {
      await mount();
      state.present = async () => ({ available: false, reason: 'offering', customerInfo: null });
      await act(async () => latest.request('bible'));
      assert.equal(latest.offer, 'bible'); assert.equal(latest.message, 'unavailable');
      state.present = async () => ({ available: true, result: 'PURCHASED', customerInfo: free });
      await act(async () => latest.subscribe());
      assert.equal(latest.isPremium, false); assert.equal(latest.offer, null);
      state.present = async () => ({ available: true, result: 'RESTORED', customerInfo: active });
      await act(async () => latest.request('welcome'));
      assert.equal(latest.isPremium, true); assert.equal(latest.offer, null);
      await unmount();
    });
    await test('cancelled Apple purchase is silent, while a real failure is recoverable', async () => {
      await mount();
      state.present = async () => { throw { userCancelled: true, code: '1' }; };
      await act(async () => latest.request('welcome'));
      assert.equal(latest.offer, null); assert.equal(latest.message, '');
      state.present = async () => { throw new Error('network'); };
      await act(async () => latest.request('welcome'));
      assert.equal(latest.offer, 'welcome'); assert.equal(latest.message, 'error');
      await unmount();
    });
    await test('checkout result from a previous account cannot unlock the current user', async () => {
      await mount({ user: { id: 'A' }, loading: false });
      let resolve;
      state.present = () => new Promise(r => { resolve = r; });
      await act(async () => latest.request('welcome'));
      state.auth = { user: { id: 'B' }, loading: false };
      await act(async () => tree.update(React.createElement(PremiumProvider, null, React.createElement(Probe))));
      await act(async () => resolve({ available: true, result: 'PURCHASED', customerInfo: active }));
      assert.equal(latest.isPremium, false);
      await unmount();
    });
  } finally {
    globalThis.document = previousDocument; globalThis.window = previousWindow;
  }
} finally { rmSync(temp, { recursive: true, force: true }); }
