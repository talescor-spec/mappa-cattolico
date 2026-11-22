import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderBibleOffer } from '../website/bibbia-2/render.mjs';
import { variants, variantForPath, attributionFor, checkoutFor } from '../website/bibbia-2/experiment.mjs';
import { release } from '../website/bibbia-2/release.mjs';
import { offer, referenceTotal } from '../website/bibbia-2/offer.mjs';

function normalize(html, v) {
  const quotes=[];
  return html.replace(/<blockquote>.*?<\/blockquote>/gs, q => {quotes.push(q);return `QUOTE_${quotes.length-1}`;})
    .replaceAll(v.name, 'BOOK_NAME').replaceAll(v.route, '/BOOK_ROUTE/')
    .replaceAll(`copertina-${v.cover}-hd.`, 'COVER_HD.')
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
test('all internal previews use the new portrait layout and the printed-book FAQ is removed',()=>{
  for(const v of Object.values(variants)) {
    const html=renderBibleOffer(v.id);
    assert.ok(!html.includes('anteprima-'));
    assert.ok(!html.includes('width="842" height="595"'));
    const block=html.split('id="contenuto"')[1].split('id="anteprime"')[0];
    assert.equal((block.match(/class="page-card"/g)||[]).length,5);
    assert.equal((block.match(/width="1219" height="1829"/g)||[]).length,5);
    assert.ok(!html.includes('Ricevo un libro cartaceo o un PDF?'));
    assert.ok(!html.match(/class="hero-action"[^]*?class="micro">Libro digitale/));
  }
});
test('both offers show the authorized 60-day guarantee and consistent reference values',()=>{
  assert.equal(offer.guaranteeDays,60);
  assert.equal(referenceTotal,75);
  assert.equal(referenceTotal-offer.price,48);
  for(const v of Object.values(variants)) {
    const html=renderBibleOffer(v.id);
    assert.ok(html.includes('Garanzia di 60 giorni'));
    assert.ok(html.includes('Hai 60 giorni'));
    assert.ok(!html.includes('sette giorni'));
    assert.ok(!html.includes('Garanzia di 7'));
    assert.ok(html.includes('Valore complessivo <del>€75</del>'));
    assert.equal((html.match(/<del>€37<\/del>/g)||[]).length,1);
    assert.equal((html.match(/<del>€19<\/del>/g)||[]).length,4);
    assert.ok(html.includes('€48 in meno'));
  }
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
    assert.equal(target.origin,'https://checkout.mundpay.com');
    assert.equal(target.searchParams.get('sck'),safe.sck);
    assert.equal(target.searchParams.get('utm_content'),'AD173');
  }
  assert.equal(variantForPath('/mappa-del-cattolico/'),null);
  assert.equal(checkoutFor('http://pay.mycheckoutt.com/',{}),null);
  assert.equal(checkoutFor('https://other.example/',{}),null);
});
test('checkout uses the dedicated product while delivery remains explicitly pending merchant upload',()=>{
  assert.equal(release.fulfillmentVerified,false);
  assert.equal(release.checkoutConfigured,true);
  assert.equal(release.productID,'6431fd73-6540-4714-9c04-c25f9078b7d4');
  for(const v of Object.values(variants)) {
    assert.ok(renderBibleOffer(v.id).includes('data-checkout href="#anteprime"'));
  }
  const code=fs.readFileSync(new URL('../website/bibbia-2/page.mjs',import.meta.url),'utf8');
  const capture=fs.readFileSync(new URL('../website/bibbia-2/capture.mjs',import.meta.url),'utf8');
  assert.ok(capture.includes('!release.checkoutConfigured'));
  assert.ok(!/track\w*\([^\n]*['"]Purchase['"]/.test(code));
  assert.ok(code.includes('navigator.globalPrivacyControl'));
});
