import test from 'node:test';
import assert from 'node:assert/strict';
import {META_PIXEL_ID,metaPageURL,createMetaTracker} from '../website/mappa-della-bibbia/meta-pixel.mjs';

function context(search='',nav={},preference=null,path='/mappa-della-bibbia/') {
 const calls=[],scripts=[],location=new URL('https://fideora.app'+path+search);
 const root={dataset:{}};
 const win={location,crypto:{randomUUID:()=> '59d1f650-31c7-45fc-9837-4782d1bf3326'},history:{replaceState(_s,_t,url){win.location=new URL(url);}},fbq:(...args)=>{if(win.blockEvents&&args[0].startsWith('track'))throw Error('blocked');calls.push(args);}};
 const doc={documentElement:root,querySelector:()=>null,createElement:()=>({dataset:{}}),head:{append:s=>scripts.push(s)}};
 const storage={getItem:()=>JSON.stringify(preference)};
 return {win,doc,nav,storage,calls,scripts,root};
}
test('marketing URL strips personal prefills, signed recovery credentials and arbitrary parameters',()=>{
 const url=new URL(metaPageURL('https://fideora.app/mappa-della-bibbia/?email=ana%40example.com&name=Ana&resume=secret&token=secret&utm_source=instagram&utm_campaign=launch&fbclid=click123&unknown=private&utm_content=ana%40example.com#access_token=secret'));
 assert.equal(url.search,'?utm_source=instagram&utm_campaign=launch&fbclid=click123');assert.equal(url.hash,'');
});
test('test traffic, privacy signals, an existing refusal and foreign origins never load or emit Meta events',()=>{
 for(const c of [context('?fm_test=1'),context('',{doNotTrack:'1'}),context('',{globalPrivacyControl:true}),context('',{}, {meta:false})]) {
  assert.equal(createMetaTracker(c).enabled,false);assert.equal(c.scripts.length,0);assert.equal(c.calls.length,0);
 }
 const c=context();c.win.location=new URL('https://preview.example/mappa-della-bibbia/');assert.equal(createMetaTracker(c).enabled,false);assert.equal(c.calls.length,0);
});
test('only confirmed captures emit a deduplicated Lead; redirects cannot manufacture checkout or purchase events',()=>{
 const c=context('?email=ana%40example.com&resume=secret&utm_source=instagram');const tracker=createMetaTracker(c);
 assert.equal(c.win.location.search,'?utm_source=instagram');assert.equal(c.scripts.length,1);
 assert.equal(c.scripts[0].src,'https://connect.facebook.net/en_US/fbevents.js');
 assert.equal(tracker.lead('book',''),false);assert.equal(tracker.lead('invalid','3b6be332-4734-4261-ac2e-fe99cbf01a5a'),false);
 assert.equal(tracker.lead('book','3b6be332-4734-4261-ac2e-fe99cbf01a5a'),true);assert.equal(tracker.lead('book','3b6be332-4734-4261-ac2e-fe99cbf01a5a'),false);
 tracker.outbound('apple');tracker.outbound('android');tracker.outbound('android');
 const events=c.calls.filter(x=>x[0].startsWith('track'));
 assert.deepEqual(events.map(x=>x[2]),['PageView','ViewContent','Lead','AppStoreClick','CheckoutRedirect']);
 assert(events.every(x=>x[1]===META_PIXEL_ID));assert(!JSON.stringify(events).includes('ana@'));assert(!JSON.stringify(events).includes('secret'));
 assert.deepEqual(c.calls[0],['set','autoConfig',false,META_PIXEL_ID]);
});
test('an unverified thank-you visit emits only PageView even if URL claims a paid order',()=>{
 const c=context('?paid=true&value=39&email=ana%40example.com',{},null,'/mappa-della-bibbia/grazie/');createMetaTracker(c);
 assert.equal(c.win.location.search,'');assert.deepEqual(c.calls.filter(x=>x[0].startsWith('track')).map(x=>x[2]),['PageView']);
});
test('a vendor exception after initialization does not prevent the checkout action',()=>{
 const c=context();const tracker=createMetaTracker(c);c.win.blockEvents=true;
 assert.doesNotThrow(()=>assert.equal(tracker.outbound('book'),false));
});
