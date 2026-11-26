import test from 'node:test';
import assert from 'node:assert/strict';
import {editionCapture,editionCheckout} from '../website/bibbia-2/order-core.mjs';
import {createHandler} from '../api/study-capture.js';
import {release} from '../website/bibbia-2/release.mjs';
import {editionFor,recoveryURL} from '../integrations/funnel-metrics/fideora-social/core.mjs';
import {normalizeAddress} from '../website/bibbia-2/address.mjs';
import {editionRecoveryMessage} from '../integrations/funnel-metrics/fideora-social/edition-email.mjs';
const address={street:'Via Roma',number:'10/A',complement:'Interno 2',postal_code:'00100',city:'Roma',state:'RM',country:'IT'};
const contact={address,name:'Giulia Rossi',email:'GIULIA@example.com',offer:'book',variant:'a',platform:'ios',session_id:'f4a11692-458e-48b4-b235-f4582c364633',followup_requested:true,attribution:{utm_source:'instagram',utm_content:'AD173',sck:'campaign-id',email:'secret@example.com'}};
test('updated-edition recovery describes the selected book, two bonuses and the current price',()=>{
 for(const variant of ['a','b'])for(const step of [1,2,3]){
  const m=editionRecoveryMessage({variant},step);assert.ok(m.productName.includes(variant==='a'?'Mappa della Bibbia':'Panorama Biblico'));
  assert.ok(m.message.body_html.includes('€27'));assert.ok(m.message.body_html.includes('La Mappa del Catechismo'));assert.ok(m.message.body_html.includes('La Mappa della Messa'));assert.ok(!m.message.body_html.includes('€39'));assert.ok(!m.message.body_html.includes('Biblioteca delle Origini'));
 }
 assert.equal(editionRecoveryMessage(null,1),null);assert.equal(editionRecoveryMessage({variant:'a'},4),null);
});
test('both captures retain campaign IDs and their own fixed edition, price and route',()=>{
 for(const variant of ['a','b']){
  const p=editionCapture({...contact,variant,offer_price:1,offer_reference:'wrong',page_url:'https://other.example'});
  assert.equal(p.email,'giulia@example.com');assert.equal(p.offer_price,27);assert.equal(p.offer_reference,'mdb20_bundle_27_eur');
  assert.equal(p.attribution.ct,`mdb20_name_cover_v1_${variant}`);assert.equal(p.attribution.utm_content,'AD173');assert.equal(p.attribution.email,undefined);
  assert.equal(new URL(p.page_url).pathname,variant==='a'?'/mappa-della-bibbia-2/':'/panorama-biblico/');
  const checkout=new URL(editionCheckout(release.checkoutURL,contact,p.attribution,address));
  assert.equal(checkout.hostname,'checkout.mundpay.com');assert.equal(checkout.pathname,'/01a20583-6831-737e-a87c-c57efd6b478b');
  assert.equal(checkout.searchParams.get('country'),'IT');assert.equal(checkout.searchParams.get('email'),'giulia@example.com');assert.equal(checkout.searchParams.has('street'),false);assert.deepEqual(p.address,address);assert.equal(checkout.searchParams.get('sck'),`campaign-id|fdb_mdb20_${variant}`);
 }
 for(const bad of [{variant:'c'},{offer:'android'},{email:'invalid'},{name:'x'}])assert.throws(()=>editionCapture({...contact,...bad}));
 assert.throws(()=>editionCheckout('https://untrusted.example/',contact,{}));
});
test('new capture forwards the validated edition and confirms only successful provider writes',async()=>{
 let forwarded;
 const handler=createHandler({payloadBuilder:editionCapture,fetchImpl:async(_,req)=>{forwarded=JSON.parse(req.body);return{ok:true,json:async()=>({ok:true,offer:'book',funnel:'mdb-studio-libro-it',listId:217,journeyId:'qa-id'})};}});
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;return this;}};
 await handler({method:'POST',headers:{origin:'https://fideora.app'},body:{...contact,is_test:true,attribution:{...contact.attribution,ct:'wrong'}}},res);
 assert.equal(res.code,200);assert.equal(res.body.journeyId,'qa-id');assert.equal(forwarded.is_test,true);assert.equal(forwarded.attribution.ct,'mdb20_name_cover_v1_a');assert.equal(forwarded.offer_price,27);
 const failed=createHandler({payloadBuilder:editionCapture,fetchImpl:async()=>({ok:false,json:async()=>({ok:false})})});
 await failed({method:'POST',headers:{origin:'https://fideora.app'},body:contact},res);assert.equal(res.code,503);assert.equal(res.body.ok,false);
});
test('signed recovery returns each updated edition to its own offer without personal URL data',()=>{
 for(const variant of ['a','b']){
  const attribution=editionCapture({...contact,variant}).attribution;
  const url=new URL(recoveryURL({offer:'book',attribution},'signed-token',2));
  assert.equal(url.pathname,variant==='a'?'/mappa-della-bibbia-2/':'/panorama-biblico/');assert.equal(url.searchParams.get('ct'),attribution.ct);assert.equal(url.searchParams.get('resume'),'signed-token');assert.equal(url.searchParams.has('email'),false);
  assert.equal(editionFor(attribution).price,27);
 }
 assert.equal(editionFor({ct:'unknown'}),null);
 assert.equal(new URL(recoveryURL({offer:'book',attribution:{}},'signed-token',1)).pathname,'/mappa-della-bibbia/');
});

test('billing address validation preserves accents and leading postal zeros, rejects invalid or injected values',()=>{
 assert.equal(normalizeAddress({...address,city:' Città di Castello ',country:'it'}).city,'Città di Castello');
 assert.equal(normalizeAddress(address).postal_code,'00100');
 for(const bad of [{street:'<script>'},{postal_code:'1234'},{number:''},{country:'ZZ'},{state:'\\n<bad>'}])assert.throws(()=>normalizeAddress({...address,...bad}));
 assert.equal(editionCapture({...contact,address:undefined}).address,undefined);
 assert.equal(normalizeAddress({...address,country:'GB',postal_code:'SW1A 1AA'}).postal_code,'SW1A 1AA');
});

test('contact-only orders reach the capture provider and checkout without address parameters',async()=>{
 const payload={...contact,address:undefined,is_test:true};let forwarded;
 const handler=createHandler({payloadBuilder:editionCapture,fetchImpl:async(_,req)=>{forwarded=JSON.parse(req.body);return{ok:true,json:async()=>({ok:true,offer:'book',funnel:'mdb-studio-libro-it',listId:217,journeyId:'contact-only-qa'})};}});
 const res={setHeader(){},status(n){this.code=n;return this;},json(v){this.body=v;return this;}};
 await handler({method:'POST',headers:{origin:'https://fideora.app'},body:payload},res);
 assert.equal(res.code,200);assert.equal(res.body.journeyId,'contact-only-qa');assert.equal(forwarded.address,undefined);
 const checkout=new URL(editionCheckout(release.checkoutURL,payload,forwarded.attribution));
 assert.equal(checkout.searchParams.get('name'),contact.name);assert.equal(checkout.searchParams.get('email'),'giulia@example.com');
 assert.equal(checkout.searchParams.has('country'),false);assert.equal(checkout.searchParams.get('utm_source'),'instagram');
});
