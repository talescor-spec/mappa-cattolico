import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHotmart, validHottok } from '../supabase/functions/_shared/hotmart.mjs';
import { authorizeBible } from '../api/web-bible.js';
const now = Date.parse('2026-11-14T12:00:00Z');
const event = () => ({ id:'event-1', event:'PURCHASE_APPROVED', version:'2.0.0', creation_date:now,
  data:{ product:{ id:42,ucode:'product-1' }, buyer:{ email:' Buyer@Example.com ' },
    purchase:{ transaction:'HP1', status:'APPROVED',approved_date:now,date_next_charge:now+30*86400000 },
    subscription:{ plan:{id:7},subscriber:{code:'sub-1'} } } });
test('webhook authenticates the exact configured token; unset and mismatched tokens never authorize', async () => {
  assert.equal(await validHottok(null, undefined),false);
  assert.equal(await validHottok('wrong-token','private-test-token'),false);
  assert.equal(await validHottok('private-test-token','private-test-token'),true);
});
test('Hotmart 2.0 approved subscription produces only the fields needed for entitlement', () => {
  const result=normalizeHotmart(event(),now); assert.equal(result.email,'buyer@example.com');
  assert.equal(result.plan_id,'7');assert.equal(result.subscriber_code,'sub-1');
  assert.equal(result.next_charge_at,'2026-12-14T12:00:00.000Z');assert.equal('data' in result,false);
});
test('one-time products, unapproved status, future timestamps and malformed email cannot grant access', () => {
  for(const mutate of [e=>{delete e.data.subscription},e=>{e.data.purchase.status='WAITING_PAYMENT'},e=>{e.creation_date=now+600000},e=>{e.data.buyer.email='invalid'},e=>{delete e.data.purchase.approved_date}]){
    const e=event();mutate(e);assert.throws(()=>normalizeHotmart(e,now));
  }
  assert.equal(normalizeHotmart({...event(),event:'PURCHASE_COMPLETE'},now),null);
  assert.equal(normalizeHotmart({...event(),version:'1.0.0'},now),null);
});
test('cancellation identifies the subscriber without requiring a new payment or issuing a new period', () => {
  const e=event();e.event='SUBSCRIPTION_CANCELLATION';e.data.subscriber={code:'sub-1',email:'buyer@example.com'};delete e.data.purchase;
  const result=normalizeHotmart(e,now);assert.equal(result.transaction,'');assert.equal(result.approved_at,null);assert.equal(result.subscriber_code,'sub-1');
});
test('Bible endpoint refuses missing/fake tokens and an inactive or expired payment',async()=>{
  let calls=0;assert.equal(await authorizeBible('',()=>{calls++;}),401);assert.equal(calls,0);
  const denied=async()=>({ok:false,status:401});assert.equal(await authorizeBible('Bearer fake',denied),401);
  const response=value=>async()=>({ok:true,json:async()=>value});
  assert.equal(await authorizeBible('Bearer fake',response({isPremium:false,userId:'u'})),403);
  assert.equal(await authorizeBible('Bearer fake',response({isPremium:true,userId:'u',expiresAt:'2020-01-01'})),403);
  assert.equal(await authorizeBible('Bearer fake',response({isPremium:true,userId:'u',expiresAt:'2090-01-01'})),200);
});
