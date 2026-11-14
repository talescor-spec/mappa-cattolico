import test from 'node:test';
import assert from 'node:assert/strict';
import { trialEntitlement, createHotmartApi } from '../supabase/functions/_shared/hotmart-api.mjs';
const now=Date.parse('2026-11-14T12:00:00Z'), DAY=86400000;
const plan={active:true,trial_days:3,hotmart_product_id:'42',hotmart_product_ucode:'product-1',hotmart_plan_id:'7',currency:'EUR',amount:7.99};
const sub=()=>({trial:true,status:'ACTIVE',subscriber_code:'sub-1',subscriber:{email:'buyer@example.com'},product:{id:42,ucode:'product-1'},plan:{id:7},price:{currency_code:'EUR',value:7.99},accession_date:now-DAY,date_next_charge:now+2*DAY});
test('active verified Hotmart trial is limited to its configured duration and first charge',()=>{
  assert.equal(trialEntitlement([sub()],'Buyer@example.com',[plan],now),new Date(now+2*DAY).toISOString());
  assert.equal(trialEntitlement([{...sub(),date_next_charge:now+365*DAY}],'buyer@example.com',[plan],now),new Date(now+2*DAY).toISOString());
  assert.equal(trialEntitlement([{...sub(),accession_date:(now-DAY)/1000,date_next_charge:(now+2*DAY)/1000}],'buyer@example.com',[plan],now),new Date(now+2*DAY).toISOString());
});
test('unpaid boleto, inactive, cancelled, expired and future trials never unlock Premium',()=>{
  for(const status of ['STARTED','INACTIVE','DELAYED','OVERDUE','CANCELLED_BY_CUSTOMER'])assert.equal(trialEntitlement([{...sub(),status}],'buyer@example.com',[plan],now),null);
  for(const patch of [{trial:false},{trial:'true'},{date_next_charge:now},{accession_date:now+DAY},{accession_date:now-8*DAY},{accession_date:null}])assert.equal(trialEntitlement([{...sub(),...patch}],'buyer@example.com',[plan],now),null);
});
test('email, exact product, plan, amount, currency and terminal payment block trial impersonation',()=>{
  for(const patch of [{subscriber:{email:'other@example.com'}},{product:{id:43,ucode:'product-1'}},{product:{id:42,ucode:'wrong'}},{plan:{id:8}},{price:{currency_code:'BRL',value:7.99}},{price:{currency_code:'EUR',value:1}},{price:{currency_code:'EUR'}}])assert.equal(trialEntitlement([{...sub(),...patch}],'buyer@example.com',[plan],now),null);
  assert.equal(trialEntitlement([sub()],'buyer@example.com',[{...plan,active:false}],now),null);
  assert.equal(trialEntitlement([sub()],'buyer@example.com',[plan],now,new Set(['sub-1'])),null);
});
test('API uses server credentials, filters by verified email/product and refreshes one expired token',async()=>{
  let oauth=0,gets=0;const seen=[];
  const fake=async(url,options)=>{seen.push([String(url),options]);if(String(url).includes('/oauth/')){oauth++;return {ok:true,json:async()=>({access_token:'token-'+oauth,expires_in:3600})};}gets++;if(gets===1)return {ok:false,status:401};return {ok:true,json:async()=>({items:[sub()],page_info:{}})};};
  const api=createHotmartApi(k=>({HOTMART_CLIENT_ID:'id',HOTMART_CLIENT_SECRET:'secret',HOTMART_BASIC:'Basic basic'}[k]),fake,()=>now);
  assert.equal((await api.subscriptions('buyer@example.com','42')).length,1);assert.equal(oauth,2);assert.equal(gets,2);
  const u=new URL(seen.at(-1)[0]);assert.equal(u.searchParams.get('subscriber_email'),'buyer@example.com');assert.equal(u.searchParams.get('product_id'),'42');assert.equal(u.searchParams.get('trial'),'true');
  assert.equal(seen[0][1].headers.Authorization,'Basic basic');assert.equal(seen.at(-1)[1].headers.Authorization,'Bearer token-2');
  await api.subscriptions('buyer@example.com','42');assert.equal(oauth,2);
});
test('missing secrets and upstream failures reject verification rather than granting access',async()=>{
  await assert.rejects(createHotmartApi(()=>null,()=>assert.fail()).subscriptions('buyer@example.com',42));
  const api=createHotmartApi(()=> 'configured',async()=>({ok:false,status:500}));await assert.rejects(api.subscriptions('buyer@example.com',42));
});
