import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { media } from '../website/bibbia-2/media.mjs';
import { renderBibleOffer } from '../website/bibbia-2/render.mjs';

test('the first screen uses responsive compressed covers and one bundled deferred script', () => {
 for (const id of ['a','b']) {
  const html = renderBibleOffer(id);
  const scripts = [...html.matchAll(/<script\b[^>]+>/g)];
  assert.equal(scripts.length, 1);
  assert.match(scripts[0][0], /defer src="\/bibbia-2\/page-fast\.js\?v=/);
  assert.ok(fs.statSync('web-dist/bibbia-2/page-fast.js').size < 30000);
  const preload = html.match(/<link rel="preload"[^>]+>/)[0];
  assert.match(preload, /imagesrcset=/);
  assert.match(preload, /fetchpriority="high"/);
  for (const [,src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
   assert.match(src, /^\/bibbia-2\/assets\/fast\//);
   assert.ok(fs.existsSync('web-dist'+src));
  }
 }
 for (const [url,item] of media) if (/copertina-/.test(url)) {
  const cover = item.outputs.find(output=>output.width===640);
  assert.ok(fs.statSync('web-dist'+cover.url).size < 100000, '640px cover must remain below 100 KB');
 }
});

test('full size illustrations load only when a reader asks to enlarge them', () => {
 const html = renderBibleOffer('a');
 assert.ok(html.includes('data-preview="/bibbia-2/assets/pagina-01-illustrata.webp"'));
 assert.ok(!html.includes('src="/bibbia-2/assets/pagina-01-illustrata.webp"'));
 for (const image of html.matchAll(/<img\b[^>]+>/g)) {
  if (!image[0].includes('src=')) continue;
  assert.ok(image[0].includes('fetchpriority="high"') || image[0].includes('loading="lazy"'));
 }
});
