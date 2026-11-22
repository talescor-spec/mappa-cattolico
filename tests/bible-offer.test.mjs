import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderBibleOffer } from '../website/bibbia-2/render.mjs';
import { variants, variantForPath, attributionFor, checkoutFor } from '../website/bibbia-2/experiment.mjs';
import { release } from '../website/bibbia-2/release.mjs';

function normalize(html, v) {
  const quotes=[];
  return html.replace(/<blockquote>.*?<\/blockquote>/gs, q => {quotes.push(q);return `QUOTE_${quotes.length-1}`;})
    .replaceAll(v.name, 'BOOK_NAME').replaceAll(v.route, '/BOOK_ROUTE/')
    .replaceAll(`copertina-${v.cover}.`, 'COVER.')
    .replace(`data-offer-variant="${v.id}"`, 'data-offer-variant="VARIANT"');
}
test('A and B differ only by the book title, selected cover, route and measurement ID',()=>{
  const a=renderBibleOffer('a'),b=renderBibleOffer('b');
  assert.equal(normalize(a,variants.a),normalize(b,variants.b));
  assert.deepEqual(a.match(/<blockquote>.*?<\/blockquote>/gs),b.match(/<blockquote>.*?<\/blockquote>/gs));
  for(const html of [a,b]) {
    assert.equal((html.match(/class="price"/g)||[]).length,1);
    assert.ok(html.includes('27 €'));
    assert.ok(html.includes('La Mappa del Catechismo'));
    assert.ok(html.includes('La Mappa della Messa'));
    assert.equal((html.match(/class="page-preview"/g)||[]).length,5);
    assert.ok(html.includes('con la prima edizione.'));
    assert.ok(!html.includes('{{'));
  }
  assert.throws(()=>renderBibleOffer('c'));
});
test('all image, stylesheet and module references resolve in the marketing build',()=>{
  for(const v of Object.values(variants)) {
    const html=fs.readFileSync(`web-dist${v.route}index.html`,'utf8');
    assert.equal(html,renderBibleOffer(v.id));
    for(const [,asset] of html.matchAll(/(?:src|href|srcset|data-preview)="(\/[^"?#]+\.(?:webp|jpg|svg|css|mjs))"/g)) {
      assert.ok(fs.existsSync(`web-dist${asset}`),`Missing asset ${asset}`);
    }
  }
});
test('route determines the variant, and checkout attribution preserves campaign and creative IDs',()=>{
  const incoming='https://fideora.app/mappa-della-bibbia-2/?utm_source=instagram&utm_medium=organic_dm&utm_campaign=existing&utm_content=AD173&sck=source123&email=private%40example.com&name=Private&token=secret';
  for(const v of Object.values(variants)) {
    assert.equal(variantForPath(v.route),v);
    assert.equal(variantForPath(v.route.slice(0,-1)),v);
    const safe=attributionFor(incoming,v,release.campaign);
    assert.equal(safe.utm_campaign,'existing');assert.equal(safe.utm_content,'AD173');
    assert.equal(safe.sck,`source123|fdb_mdb20_${v.id}`);
    assert.equal(safe.ct,`mdb20_name_cover_v1_${v.id}`);
    assert.ok(!('email' in safe));assert.ok(!('name' in safe));assert.ok(!('token' in safe));
    const target=new URL(checkoutFor(release.checkoutURL,safe));
    assert.equal(target.origin,'https://pay.mycheckoutt.com');
    assert.equal(target.searchParams.get('sck'),safe.sck);
    assert.equal(target.searchParams.get('utm_content'),'AD173');
  }
  assert.equal(variantForPath('/mappa-del-cattolico/'),null);
  assert.equal(checkoutFor('http://pay.mycheckoutt.com/',{}),null);
  assert.equal(checkoutFor('https://other.example/',{}),null);
});
test('checkout stays closed until the exact principal book and both bonuses are verified in delivery',()=>{
  assert.equal(release.fulfillmentVerified,false);
  for(const v of Object.values(variants)) {
    assert.ok(renderBibleOffer(v.id).includes('data-checkout href="#anteprime"'));
  }
  const code=fs.readFileSync(new URL('../website/bibbia-2/page.mjs',import.meta.url),'utf8');
  assert.ok(code.includes('if(release.fulfillmentVerified)'));
  assert.ok(!/track\w*\([^\n]*['"]Purchase['"]/.test(code));
  assert.ok(code.includes('navigator.globalPrivacyControl'));
});
