import test from 'node:test';
import assert from 'node:assert/strict';
import { captureOrder } from '../website/bibbia-2/capture-request.mjs';

const payload = { name: 'Checkout Test', email: 'checkout-test@example.com', offer: 'book', is_test: true };
test('capture confirms a saved contact and keeps delivery alive across checkout navigation', async () => {
 let request;
 const result = await captureOrder(payload, { fetchImpl: async (url, options) => {
  request = { url, ...options };
  return { ok: true, json: async () => ({ ok: true, offer: 'book', journeyId: 'saved' }) };
 }});
 assert.equal(result.journeyId, 'saved');
 assert.equal(request.url, '/api/bible-capture');
 assert.equal(request.keepalive, true);
 assert.deepEqual(JSON.parse(request.body), payload);
});
test('provider, network and malformed responses allow checkout without claiming a saved lead', async () => {
 for (const fetchImpl of [
  async () => ({ ok: false, json: async () => ({ ok: false }) }),
  async () => ({ ok: true, json: async () => ({ ok: true, offer: 'android' }) }),
  async () => ({ ok: true, json: async () => { throw Error('invalid json'); } }),
  async () => { throw Error('network unavailable'); },
  () => { throw Error('unsupported request'); },
 ]) assert.equal(await captureOrder(payload, { fetchImpl }), null);
});
test('a stalled capture or response body cannot hold the buyer indefinitely', async () => {
 for (const fetchImpl of [
  () => new Promise(() => {}),
  async () => ({ ok: true, json: () => new Promise(() => {}) }),
 ]) assert.equal(await captureOrder(payload, { fetchImpl, timeoutMs: 10 }), null);
});
