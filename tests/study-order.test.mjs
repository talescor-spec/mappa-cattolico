import test from 'node:test';
import assert from 'node:assert/strict';
import { contactKey, contactMaxAge, prefillContact, rememberContact, capturePayload, checkoutContactURL } from '../website/mappa-della-bibbia/order-core.mjs';
import { createHandler } from '../api/study-capture.js';

const storage = value => ({ getItem: () => value, setItem(key, next) { assert.equal(key, contactKey); this.saved = JSON.parse(next); } });
test('personalized links override saved contact fields without allowing invalid data or code', () => {
  const saved = storage(JSON.stringify({name:'Nome precedente',email:'old@example.com',savedAt:100}));
  assert.deepEqual(prefillContact('?NOME=Giulia%20Rossi&EMAIL=Giulia%2BLibro%40example.com', saved,200), {name:'Giulia Rossi',email:'giulia+libro@example.com'});
  assert.deepEqual(prefillContact('?name=%3Cimg%20src%3Dx%3E&email=invalid',saved,200),{name:'Nome precedente',email:'old@example.com'});
  assert.deepEqual(prefillContact('?nome=Maria&email=mar%40example.com',{getItem(){throw Error('blocked');}},200),{name:'Maria',email:'mar@example.com'});
});
test('stale or corrupt contact storage is ignored and normalized edits can be remembered', () => {
  assert.deepEqual(prefillContact('',storage('{invalid'),200),{name:'',email:''});
  assert.deepEqual(prefillContact('',storage(JSON.stringify({name:'Old Name',email:'old@example.com',savedAt:0})),contactMaxAge),{name:'',email:''});
  const s=storage('');rememberContact(s,{name:'  Éléonore   Rossi ',email:' USER@EXAMPLE.COM '},200);
  assert.deepEqual(s.saved,{name:'Éléonore Rossi',email:'user@example.com',savedAt:200});
});
test('capture attribution cannot leak personalized URLs or change price, funnel, provider or audience', () => {
  const payload=capturePayload({name:'Giulia Rossi',email:'user@example.com',offer:'apple',funnel:'mdb-it',price:1,listId:55,page_url:'https://evil.example/?email=private',attribution:{utm_source:'brevo',utm_content:'book_1',email:'private',access_token:'secret',redirect:'https://evil.example'}});
  assert.equal(payload.funnel,'mdb-studio-it');assert.equal(payload.offer_price,7.99);
  assert.equal(payload.selected_offer,'apple');assert.equal(payload.offer_reference,'com.fideora.premium.monthly');
  assert.equal(payload.page_url,'https://fideora.app/mappa-della-bibbia/?utm_source=brevo&utm_content=book_1');
  assert.equal(payload.access_token,undefined);assert.equal(payload.listId,undefined);
  assert.throws(()=>capturePayload({name:'Giulia Rossi',email:'invalid',offer:'book'}),/invalid_email/);
  assert.throws(()=>capturePayload({name:'Giulia Rossi',email:'user@example.com',offer:'lifetime'}),/invalid_offer/);
});
test('Mundpay receives encoded editable contact details while Apple never receives a lead email',()=>{
  const contact={name:'Giulia d’Ávila',email:'giulia+libro@example.com'};
  const m=new URL(checkoutContactURL('https://checkout.mundpay.com/checkout?ref=', 'book', contact, new URLSearchParams('utm_source=brevo&redirect=https://evil.example')));
  assert.equal(m.searchParams.get('email'),contact.email);assert.equal(m.searchParams.get('name'),contact.name);
  assert.equal(m.searchParams.get('utm_source'),'brevo');assert.equal(m.searchParams.has('redirect'),false);
  const a=new URL(checkoutContactURL('https://apps.apple.com/it/app/fideora/id6825337165','apple',contact,{utm_source:'brevo'}));
  assert.equal(a.searchParams.has('email'),false);assert.equal(a.searchParams.has('name'),false);
  assert.equal(checkoutContactURL(null,'book',contact),null);
  assert.throws(()=>checkoutContactURL('https://evil.example','book',contact),/invalid_checkout/);
});
const makeRes=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(d){this.data=d;return this;}});
const request=(patch={})=>({method:'POST',headers:{origin:'https://fideora.app','x-forwarded-for':'192.0.2.10'},body:{name:'Giulia Rossi',email:'USER@example.com',offer:'book',attribution:{utm_source:'brevo'}},...patch});
test('only a validated submission is forwarded and confirmed; provider failures never look successful', async()=>{
  const seen=[];
  const handle=createHandler({limits:new Map(),fetchImpl:async(url,init)=>{seen.push({url,payload:JSON.parse(init.body)});return {ok:true,json:async()=>({ok:true,funnel:'mdb-studio-it',listId:214})};}});
  const res=makeRes();await handle(request(),res);
  assert.equal(res.code,200);assert.deepEqual(res.data,{ok:true,offer:'book'});
  assert.match(res.headers['Cache-Control'],/no-store/);assert.equal(seen.length,1);
  assert.equal(seen[0].payload.email,'user@example.com');assert.equal(seen[0].payload.selected_offer,'book');
  for(const response of [{ok:false,json:async()=>({ok:false})},{ok:true,json:async()=>({ok:true,funnel:'mdb-it',listId:55})}]){
    const fail=makeRes();await createHandler({fetchImpl:async()=>response,limits:new Map()})(request(),fail);
    assert.equal(fail.code,503);assert.equal(fail.data.ok,false);
  }
});
test('invalid names, emails, origins, methods and honeypot requests cannot create contacts',async()=>{
  let calls=0;const h=createHandler({fetchImpl:async()=>{calls++;},limits:new Map()});
  for(const req of [request({method:'GET'}),request({body:{name:'A',email:'user@example.com',offer:'book'}}),request({body:{name:'Name',email:'notemail',offer:'book'}}),request({body:{name:'Name',email:'user@example.com',offer:'book',company:'bot'}}),request({headers:{origin:'https://evil.example'}})]){
    const r=makeRes();await h(req,r);assert.ok([400,403,405].includes(r.code));
  }
  assert.equal(calls,0);
});
test('rapid duplicate submissions are limited before provider writes',async()=>{
  let calls=0;const h=createHandler({now:()=>1000,limits:new Map(),fetchImpl:async()=>{calls++;return {ok:true,json:async()=>({ok:true,funnel:'mdb-studio-it',listId:214})};}});
  for(let i=0;i<11;i++){const r=makeRes();await h(request(),r);assert.equal(r.code,i<10?200:429);}
  assert.equal(calls,10);
});
