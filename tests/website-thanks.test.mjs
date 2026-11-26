import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../website/obrigado-fideora.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../website/fideora-obrigado.js', import.meta.url), 'utf8');

function render({ lang = 'it', userAgent = '', platform = '', maxTouchPoints = 0, query = '' } = {}) {
  const elements = [...html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)].map(([, tag, raw]) => {
    const attrs = Object.fromEntries([...raw.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value.replaceAll('&amp;', '&')]));
    return { tag, attrs, content: attrs.content || '', href: attrs.href || '', textContent: '',
      getAttribute(key) { return this.attrs[key] ?? null; },
      setAttribute(key, value) { this.attrs[key] = value; },
      removeAttribute(key) { delete this.attrs[key]; }
    };
  });
  const root = elements.find(el => el.tag === 'html');
  const location = new URL(`https://fideora.app/obrigado-fideora.html?funil=mdb&${query}`);
  const document = {
    documentElement: root, readyState: 'complete',
    getElementById: id => elements.find(el => el.attrs.id === id),
    querySelector: selector => elements.find(el => el.tag === 'meta' && el.attrs.name === selector.match(/name="([^"]+)"/)[1]),
    querySelectorAll: selector => elements.filter(el => Object.hasOwn(el.attrs, selector.slice(1, -1)))
  };
  const window = { location, setTimeout: () => 1, clearTimeout() {} };
  vm.runInNewContext(script, { window, document, URL, URLSearchParams, navigator: { languages: [lang], language: lang, userAgent, platform, maxTouchPoints } });
  return { root, window, document, elements };
}

for (const lang of ['it', 'pt-BR', 'pt-PT', 'en', 'fr', 'es', 'de']) {
  for (const [device, userAgent, platform, maxTouchPoints] of [
    ['android', 'Mozilla/5.0 (Linux; Android 14)', '', 0],
    ['ios', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18)', '', 0],
    ['ios', 'Mozilla/5.0 (Macintosh)', 'MacIntel', 5],
    ['desktop', 'Mozilla/5.0 (Macintosh)', 'MacIntel', 0]
  ]) {
    test(`${lang}: ${device} ${platform || userAgent}`, () => {
      const { root, document, window, elements } = render({ lang, userAgent, platform, maxTouchPoints });
      assert.equal(root.attrs['data-device'], device);
      assert.equal(root.attrs.lang, lang);
      assert.equal(root.attrs['data-localizing'], undefined);
      const target = new URL(document.getElementById('android-checkout').href);
      assert.equal(target.origin, 'https://pay.hotmart.com');
      assert.equal(target.pathname, '/X108495940M');
      assert.equal(target.searchParams.get('off'), 't8i2l9ha');
      assert.equal(target.searchParams.has('showOnlyTrial'), false);
      assert.equal(target.searchParams.get('utm_campaign'), 'ty_mdb');
      assert.equal(document.getElementById('app-next-step').href, '#ativar-fideora');
      const access = new URL(document.getElementById('android-access').href);
      assert.equal(access.pathname, '/app/');
      assert.equal(access.searchParams.get('lang'), lang.startsWith('pt') ? 'pt' : 'it');
      assert.ok(window.FideoraThanks.copy.androidReady);
      assert.match(window.FideoraThanks.copy.androidEligibility, /19[.,]90/);
      assert.match(window.FideoraThanks.copy.androidCta, /1/);
      for (const element of elements.filter(el => el.attrs['data-i18n'])) assert.ok(element.textContent, `Missing copy: ${element.attrs['data-i18n']}`);
      if (device !== 'ios') assert.match(window.FideoraThanks.copy.activation, /Hotmart/);
      else assert.equal(window.FideoraThanks.copy.activation.includes('Hotmart'), false);
    });
  }
}

test('preserves campaign attribution without forwarding buyer data or arbitrary checkout overrides', () => {
  const { document } = render({ query: 'lang=it&utm_source=instagram&utm_campaign=mdb_v2&utm_content=thanks&email=private@example.com&token=secret&off=wrong&showOnlyTrial=0' });
  const target = new URL(document.getElementById('android-checkout').href);
  assert.equal(target.searchParams.get('utm_source'), 'instagram');
  assert.equal(target.searchParams.get('utm_campaign'), 'mdb_v2');
  assert.equal(target.searchParams.get('utm_content'), 'thanks');
  assert.equal(target.searchParams.get('off'), 't8i2l9ha');
  assert.equal(target.searchParams.has('showOnlyTrial'), false);
  assert.equal(target.searchParams.has('email'), false);
  assert.equal(target.searchParams.has('token'), false);
});

test('renders a working Android checkout without JavaScript', () => {
  assert.match(html, /id="android-checkout"[^>]+href="https:\/\/pay\.hotmart\.com\/X108495940M\?off=t8i2l9ha/);
  assert.doesNotMatch(html, /google-play-pending|data-play-ready|Google Play/);
  assert.match(html, /html\[data-device="ios"\] \[data-store="android"\], html\[data-device="android"\] \[data-store="ios"\]/);
});
