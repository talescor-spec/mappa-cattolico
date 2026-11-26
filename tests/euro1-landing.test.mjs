import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderLanding} from '../website/inizia/render.mjs';
import {checkoutURL} from '../website/inizia/offer.mjs';

test('every purchase CTA works without scripts and uses the verified paid introductory offer',()=>{
 const html=renderLanding();
 const links=[...html.matchAll(/data-buy="([^"]+)" href="([^"]+)"/g)];
 assert.ok(links.length>=8);
 for(const [,position,href] of links){const url=new URL(href.replaceAll('&amp;','&'));assert.equal(url.origin,'https://pay.hotmart.com');assert.equal(url.pathname,'/X108495940M');assert.equal(url.searchParams.get('off'),'t8i2l9ha');assert.equal(url.searchParams.get('utm_content'),position);assert.equal(url.hash,'');assert.equal(url.searchParams.has('showOnlyTrial'),false);}
 assert.ok(html.includes('€1 per il primo mese, poi €19,90/mese.'));
 assert.ok(html.includes('Poi €19,90 al mese'));
 assert.ok(html.includes('Rinnovo automatico mensile.'));
 assert.ok(html.includes('abbonamento web'));
});
test('attribution survives while identity and arbitrary destination parameters cannot enter checkout',()=>{
 const url=new URL(checkoutURL('https://fideora.app/inizia/?utm_source=instagram&utm_campaign=AD123&off=wrong&email=private%40example.com&redirect=https://evil.example&fbclid=click123'));
 assert.equal(url.searchParams.get('off'),'t8i2l9ha');assert.equal(url.searchParams.get('utm_source'),'instagram');assert.equal(url.searchParams.get('utm_campaign'),'AD123');assert.equal(url.searchParams.get('fbclid'),'click123');assert.equal(url.searchParams.has('email'),false);assert.equal(url.searchParams.has('redirect'),false);
});
test('the offer demonstrates existing app features without inventing testimony or expert credentials',()=>{
 const html=renderLanding();
 for(const phrase of ['personaggio digitale','otto schede','Mappa di Matteo','Diodati 1649','sette libri deuterocanonici','distinta dal testo della liturgia'])assert.ok(html.includes(phrase),phrase);
 for(const phrase of ['5.540','35.722','152 opere','4,9','testimonianza','teologo','interlineare completo incluso'])assert.ok(!html.includes(phrase),phrase);
 assert.equal((html.match(/role="tab"/g)||[]).length,7);
 for(const [,asset] of html.matchAll(/(?:src|href)="(\/[^"?#]+\.(?:webp|jpg|svg|css|js))[^\"]*"/g))assert.ok(fs.existsSync('web-dist'+asset),asset);
 assert.equal(fs.readFileSync('web-dist/inizia/index.html','utf8'),html);
 assert.ok(fs.statSync('web-dist/inizia/page-fast.js').size<25000);
 assert.ok(fs.statSync('web-dist/inizia/assets/don-luca-960.webp').size<150000);
});
