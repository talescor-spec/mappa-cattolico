import {CHILDREN,successful,email,validEmail,recoveryURL} from './core.mjs';
const bytes=s=>new TextEncoder().encode(s);
export const digest=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
export async function signature(value,key){const k=await crypto.subtle.importKey('raw',bytes(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);return [...new Uint8Array(await crypto.subtle.sign('HMAC',k,bytes(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function equal(a,b){if(typeof a!=='string'||typeof b!=='string'||!a||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
export async function resumeToken(id,key,now=Date.now()){const body=id+'.'+Math.floor((now+30*86400000)/1000);return body+'.'+await signature(body,key);}
export async function verifyResume(token,key,now=Date.now()){
 const parts=String(token||'').split('.');if(parts.length!==3||!/^\d{10}$/.test(parts[1])||Number(parts[1])*1000<now||Number(parts[1])*1000>now+31*86400000)return null;
 if(!/^[a-f0-9-]{36}$/i.test(parts[0]))return null;
 return equal(parts[2],await signature(parts[0]+'.'+parts[1],key))?parts[0]:null;
}
export function createSocialLifecycle({db,secret,fetchImpl=fetch}){
 const check=async q=>{const r=await q;if(r.error)throw r.error;return r.data;};
 async function converted(e){const {data,error}=await db.rpc('fm_social_has_conversion_v1',{p_email:e});if(error)throw error;return data===true;}
 async function record(event){
  const saved=await check(db.from('fm_social_conversions_v1').upsert(event,{onConflict:'event_key',ignoreDuplicates:true}).select('event_key'));
  if(event.email&&successful(event.event_name)&&!event.is_test){const {error}=await db.rpc('fm_social_stop_recovery_v1',{p_email:event.email});if(error)throw error;}
  return saved?.length||0;
 }
 async function revenueCat(e){
  const name=e.type==='INITIAL_PURCHASE'?(e.period_type==='TRIAL'?'trial_started':Number(e.price)>0?'subscription_started':null):e.type==='RENEWAL'&&Number(e.price)>0?(e.is_trial_conversion===true?'subscription_started':'subscription_renewed'):({EXPIRATION:'subscription_expired',CANCELLATION:'subscription_cancelled'})[e.type];
  if(!name||!['com.fideora.premium.monthly','com.fideora.premium.annual'].includes(e.product_id))return;
  const hashes=await Promise.all([...new Set([e.app_user_id,e.original_app_user_id,...(Array.isArray(e.aliases)?e.aliases:[])].filter(v=>typeof v==='string'&&v))].map(digest));
  const identities=hashes.length?await check(db.from('fm_social_identities_v1').select('email').in('customer_hash',hashes).limit(1)):[];
  const attr=email(e.subscriber_attributes?.$email?.value);const known=identities?.[0]?.email||(validEmail(attr)?attr:null);
  await record({event_key:'rc:'+e.id,provider:'revenuecat',event_name:name,email:known,customer_hash:hashes[0]||null,
   transaction_id:e.transaction_id?await digest(String(e.transaction_id)):null,
   amount:typeof e.price==='number'?e.price:null,currency:typeof e.price==='number'?'USD':null,amount_basis:'revenuecat_gross_usd',
   occurred_at:new Date(e.event_timestamp_ms||Date.now()).toISOString(),is_test:e.environment!=='PRODUCTION',
   properties:{customer_hashes:hashes,product_id:e.product_id,period_type:e.period_type,price_in_purchased_currency:e.price_in_purchased_currency??null,purchased_currency:e.currency||null,source:'verified_revenuecat_webhook'}});
 }
 async function tick(){
  const config=await check(db.from('fm_social_config_v1').select('config').eq('id','mdb-studio-it').maybeSingle());if(!config)return {skipped:'not_configured'};
  // One bounded batch in the existing worker; no extra scheduled agent or poller.
  const journeys=await check(db.from('fm_social_journeys_v1').select('*').eq('is_test',false).order('checked_at',{ascending:true,nullsFirst:true}).limit(12));
  const emails=[...new Set((journeys||[]).map(j=>j.email))];
  const cursor=await check(db.from('fm_social_config_v1').select('config').eq('id','payment_cursor').maybeSingle());
  const since=cursor?.config?.since||new Date(Date.now()-86400000).toISOString();
  const response=await fetchImpl('https://sysuottboucultzzaagv.supabase.co/functions/v1/fideora-social-bridge',{method:'POST',headers:{Authorization:'Bearer '+await secret('brevo_worker_token'),'Content-Type':'application/json'},body:JSON.stringify({emails,since,check_trials:false}),signal:AbortSignal.timeout(40000)});
  if(!response.ok)throw Error('social_conversion_check_unavailable');const data=await response.json();if(data.ok!==true)throw Error('social_conversion_check_unavailable');
  for(const u of data.users||[]){const customer_hash=await digest(u.id);await check(db.from('fm_social_identities_v1').upsert({email:u.email,customer_hash},{onConflict:'email,customer_hash'}));}
  // Recover production Apple events already received before identity association.
  const ids=emails.length?await check(db.from('fm_social_identities_v1').select('*').in('email',emails)):[];
  const unknown=ids?.length?await check(db.from('fm_social_conversions_v1').select('*').eq('provider','revenuecat').is('email',null).eq('is_test',false).order('occurred_at',{ascending:false}).limit(500)):[];
  for(const c of unknown||[]){const identity=ids.find(i=>i.customer_hash===c.customer_hash||c.properties?.customer_hashes?.includes(i.customer_hash));if(identity){await check(db.from('fm_social_conversions_v1').update({email:identity.email}).eq('event_key',c.event_key));if(successful(c.event_name))await db.rpc('fm_social_stop_recovery_v1',{p_email:identity.email});}}
  const payments=[...new Map([...(data.payments||[]),...(data.payment_updates||[])].map(p=>[p.transaction_id+':'+p.status,p])).values()].sort((a,b)=>Date.parse(a.approved_at||a.event_created_at)-Date.parse(b.approved_at||b.event_created_at));
  for(const p of payments){
   let name=({approved:'subscription_started',refunded:'refunded',chargeback:'chargeback'})[p.status];if(!name)continue;
   if(name==='subscription_started'){const previous=await check(db.from('fm_social_conversions_v1').select('transaction_id').eq('provider','hotmart').eq('properties->>subscription_code',p.subscription_code).in('event_name',['subscription_started','subscription_renewed']).neq('transaction_id',p.transaction_id).limit(1));if(previous?.length)name='subscription_renewed';}
   await record({event_key:'hm:'+p.transaction_id+':'+p.status,provider:'hotmart',event_name:name,email:p.email,transaction_id:p.transaction_id,
    amount:null,currency:null,amount_basis:'amount_not_in_access_webhook',occurred_at:p.approved_at||p.event_created_at,is_test:false,
    properties:{subscription_code:p.subscription_code,plan_key:p.plan_key,expires_at:p.access_until,source:'verified_hotmart_access_webhook'}});
  }
  for(const t of data.trials||[])await record({event_key:'hm:trial:'+await digest(t.email+':'+t.expires_at),provider:'hotmart',event_name:'trial_started',email:t.email,
   amount:0,currency:'EUR',amount_basis:'free_trial',occurred_at:new Date().toISOString(),is_test:false,properties:{expires_at:t.expires_at,source:'verified_hotmart_api'}});
  const bookFunnel=await check(db.from('funnels_v2').select('id').eq('slug',CHILDREN.book).single());
  const orders=emails.length?await check(db.from('orders_v2').select('id,order_id,customer_email,status,approved_at,created_at,is_test,currency,gross_amount_cents,net_amount_cents').eq('funnel_id',bookFunnel.id).in('customer_email',emails).in('status',['paid','refunded','chargeback']).eq('is_test',false)):[];
  for(const o of orders||[])await record({event_key:'mp:'+o.order_id+':'+o.status,provider:'mundpay',event_name:({paid:'purchase_confirmed',refunded:'refunded',chargeback:'chargeback'})[o.status],email:email(o.customer_email),transaction_id:o.order_id,
   amount:Number(o.gross_amount_cents)/100,currency:o.currency,amount_basis:'provider_gross',occurred_at:o.approved_at||o.created_at,is_test:false,properties:{net_amount:Number(o.net_amount_cents)/100,source_order_id:o.id}});
  const now=new Date().toISOString();if(journeys.length)await check(db.from('fm_social_journeys_v1').update({checked_at:now}).in('id',journeys.map(j=>j.id)));
  const updates=data.payment_updates||[];const last=updates.at(-1)?.updated_at;await check(db.from('fm_social_config_v1').upsert({id:'payment_cursor',config:{since:last||new Date(Date.now()-60000).toISOString()}},{onConflict:'id'}));
  for(const e of emails){
   if(!await converted(e))continue;
   const paid=await check(db.from('fm_social_conversions_v1').select('provider,event_name').eq('email',e).eq('is_test',false).in('event_name',['purchase_confirmed','subscription_started','subscription_renewed']));
   const listIds=[...new Set((paid||[]).map(c=>c.provider==='mundpay'?config.config.buyerLists.book:config.config.buyerLists.app))];if(!listIds.length)continue;
   const r=await fetchImpl('https://api.brevo.com/v3/contacts',{method:'POST',headers:{'api-key':await secret('brevo_api_key'),'Content-Type':'application/json'},body:JSON.stringify({email:e,listIds,updateEnabled:true}),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('buyer_list_sync_failed');
  }
  return {checked:emails.length,trialCheckComplete:data.trial_check_complete===true};
 }
 async function prepare(enrollment,sequence,message){
  if(message.delivery_policy?.revision!=='fideora_social_20261117_v1')return {eligible:true};
  if(await converted(enrollment.email))return {eligible:false,reason:'purchase_or_activation_confirmed'};
  const journey=await check(db.from('fm_social_journeys_v1').select('*').eq('email',enrollment.email).eq('is_test',false).order('created_at',{ascending:false}).limit(1).maybeSingle());
  if(!journey||journey.funnel_id!==sequence.funnel_id)return {eligible:false,reason:'offer_changed'};
  if(journey.offer==='ios'&&Number(message.step)>1){const identities=await check(db.from('fm_social_identities_v1').select('email').eq('email',enrollment.email).limit(1));if(!identities?.length)return {eligible:false,reason:'apple_identity_unavailable'};}
  if(journey.offer==='android'){
   const r=await fetchImpl('https://sysuottboucultzzaagv.supabase.co/functions/v1/fideora-social-bridge',{method:'POST',headers:{Authorization:'Bearer '+await secret('brevo_worker_token'),'Content-Type':'application/json'},body:JSON.stringify({emails:[enrollment.email],check_trials:true}),signal:AbortSignal.timeout(35000)});
   if(!r.ok)throw Error('social_activation_check_unavailable');const current=await r.json();if(!current.ok||!current.trial_check_complete)throw Error('social_activation_check_unavailable');
   for(const t of current.trials||[])await record({event_key:'hm:trial:'+await digest(t.email+':'+t.expires_at),provider:'hotmart',event_name:'trial_started',email:t.email,amount:0,currency:'EUR',amount_basis:'free_trial',occurred_at:new Date().toISOString(),is_test:false,properties:{expires_at:t.expires_at,source:'verified_hotmart_api'}});
   if((current.payments||[]).some(p=>p.status==='approved')||(current.trials||[]).length)return {eligible:false,reason:'purchase_or_activation_confirmed'};
  }
  const token=await resumeToken(journey.id,await secret('brevo_worker_token'));
  return {eligible:true,ctaURL:recoveryURL(journey,token,message.step)};
 }
 return {tick,prepare,revenueCat,record};
}

