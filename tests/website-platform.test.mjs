import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPlatform, campaignParams, platformURL } from '../website/platform.mjs';

test('device routing recognizes Android, Apple phones, iPadOS desktop UA and unknown devices', () => {
  assert.equal(detectPlatform({ userAgent: 'Mozilla Android 16 Chrome Mobile' }), 'android');
  assert.equal(detectPlatform({ userAgentData: { platform: 'Android' } }), 'android');
  for (const userAgent of ['iPhone', 'iPad', 'iPod']) assert.equal(detectPlatform({ userAgent }), 'ios');
  assert.equal(detectPlatform({ userAgent: 'Macintosh', platform: 'MacIntel', maxTouchPoints: 5 }), 'ios');
  assert.equal(detectPlatform({ userAgent: 'Macintosh', platform: 'MacIntel', maxTouchPoints: 0 }), 'both');
  assert.equal(detectPlatform({ userAgent: 'Windows Chrome' }), 'both');
  assert.equal(detectPlatform(), 'both');
});
test('an explicit supported platform wins over detection; untrusted values cannot select a destination', () => {
  assert.equal(detectPlatform({ userAgent: 'iPhone' }, 'android'), 'android');
  assert.equal(detectPlatform({ userAgent: 'Android' }, 'ios'), 'ios');
  assert.equal(detectPlatform({}, 'https://wrong.example'), 'both');
});
test('Android trial CTA goes directly to the selected Hotmart offer and keeps safe attribution, never auth data', () => {
  const url = new URL(platformURL({ platform: 'android', lang: 'pt', plan: 'monthly', position: 'plan_monthly', currentURL: 'https://fideora.app/pt/?utm_source=brevo&utm_content=email_1&ct=fd2_android_e1&platform=android&email=private&code=secret&fm_test=1#access_token=secret' }));
  assert.equal(url.origin + url.pathname, 'https://pay.hotmart.com/X108495940M');
  assert.equal(url.searchParams.get('off'), 'e792z6va');
  assert.equal(url.searchParams.get('showOnlyTrial'), '1');
  assert.equal(url.searchParams.has('lang'), false);
  assert.equal(url.searchParams.get('utm_source'), 'brevo');
  assert.equal(url.searchParams.get('utm_content'), 'email_1');
  assert.equal(url.searchParams.get('ct'), 'fd2_android_e1');
  assert.equal(url.searchParams.get('fm_test'), '1');
  assert.equal(url.searchParams.has('email'), false);
  assert.equal(url.searchParams.has('code'), false);
  assert.equal(url.hash, '');
});
test('Apple CTA goes to the proper storefront with campaign attribution', () => {
  const url = new URL(platformURL({ platform: 'ios', lang: 'it', currentURL: 'https://fideora.app/?utm_campaign=reactivation&utm_content=email_2' }));
  assert.equal(url.hostname, 'apps.apple.com');
  assert.equal(url.pathname, '/it/app/fideora/id6825337165');
  assert.equal(url.searchParams.get('pt'), '129505215');
  assert.equal(url.searchParams.get('mt'), '8');
  assert.equal(url.searchParams.get('utm_campaign'), 'reactivation');
  assert.equal(url.searchParams.get('utm_content'), 'email_2');
  assert.equal(url.searchParams.has('plan'), false);
});
test('campaign allow-list rejects personal or active payloads and overly long values', () => {
  const params = campaignParams(new URLSearchParams({ utm_source: 'brevo', utm_content: '<script>', utm_term: 'a'.repeat(151), email: 'person@example.com', ct: 'bad', access_token: 'secret' }));
  assert.equal(params.toString(), 'utm_source=brevo');
});

test('hero defaults to the 7-day annual offer; invalid plan hints cannot change the checkout destination', () => {
  for (const plan of [undefined, 'annual', 'https://wrong.example']) {
    const url = new URL(platformURL({platform:'android', plan, currentURL:'https://fideora.app/'}));
    assert.equal(url.hostname, 'pay.hotmart.com');
    assert.equal(url.searchParams.get('off'), 'tyawr5cb');
    assert.equal(url.searchParams.get('showOnlyTrial'), '1');
  }
});
test('returning customer access remains a separate same-origin login link', () => {
  const url = new URL(platformURL({platform:'android', intent:'access', lang:'pt', currentURL:'https://fideora.app/?code=secret#access_token=secret'}));
  assert.equal(url.origin + url.pathname, 'https://fideora.app/app/');
  assert.equal(url.searchParams.get('lang'), 'pt');
  assert.equal(url.searchParams.has('code'), false);
  assert.equal(url.hash, '');
});
