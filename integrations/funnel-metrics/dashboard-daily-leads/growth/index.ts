import {createSocialLifecycle} from '../social/lifecycle.mjs';
import {collectReviewEvent,reviewCounts} from './review-events.mjs';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
import {ROLLOUT,SLUGS,normalizeBrevo,websiteEvent,safeToken,revenueCatEventName} from './core.mjs';
const db=createClient(Deno.env.get('SUPABASE_URL')||'',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'',{auth:{persistSession:false}});
const social=createSocialLifecycle({db,secret});
const origin='https://fideora.app';
const enc=new TextEncoder();
const hex=(b)=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const digest=async(s)=>hex(await crypto.subtle.digest('SHA-256',typeof s==='string'?enc.encode(s):s));
async function secret(key){const {data,error}=await db.from('app_secrets_v2').select('secret_value').eq('secret_key',key).maybeSingle();if(error)throw error;return data?.secret_value||'';}
function equal(a,b){if(!a||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
function out(x,status=200){return new Response(JSON.stringify(x),{status,headers:{'content-type':'application/json','cache-control':'no-store','access-control-allow-origin':origin,'access-control-allow-methods':'POST,GET,OPTIONS','access-control-allow-headers':'content-type,authorization,x-worker-token','vary':'Origin'}});}
async function brevo(path,init={}){const r=await fetch('https://api.brevo.com/v3'+path,{...init,headers:{'api-key':await secret('brevo_api_key'),'accept':'application/json','content-type':'application/json',...init.headers},signal:AbortSignal.timeout(18000)});const raw=await r.text();let data={};try{data=raw?JSON.parse(raw):{}}catch{throw Error('Invalid provider response');}if(!r.ok)throw Error('Brevo HTTP '+r.status+': '+String(data.message||'request failed').slice(0,150));return data;}
async function syncMetrics(){
 const now=new Date(),today=now.toISOString().slice(0,10),from=new Date(now.getTime()-6*86400000).toISOString().slice(0,10);
 await db.from('fm_fideora_sync_v1').upsert({id:'brevo_bulk'},{onConflict:'id',ignoreDuplicates:true});
 const {data:lock,error}=await db.from('fm_fideora_sync_v1').update({lease_until:new Date(Date.now()+110000).toISOString()}).eq('id','brevo_bulk').or('lease_until.is.null,lease_until.lt.'+now.toISOString()).select('*').maybeSingle();
 if(error)throw error;if(!lock)return {ok:true,busy:true};
 let cursor=lock.cursor||{},date=cursor.date>=from&&cursor.date<=today?cursor.date:from,offset=Number(cursor.offset)||0;
 let received=0,inserted=0,deliveries=0,pages=0;
 try{
  for(;pages<4;pages++){
   const qp=new URLSearchParams({startDate:date,endDate:date,limit:'2500',offset:String(offset),sort:'asc'});
   const data=await brevo('/smtp/statistics/events?'+qp);
   if(!Array.isArray(data.events))throw Error('Provider events unavailable');
   received+=data.events.length;
   const rows=await Promise.all(data.events.map(async(e)=>{const n=normalizeBrevo(e);if(!n)return null;const {fingerprint,...row}=n;return {...row,event_key:await digest(fingerprint)};}));
   if(rows.some(Boolean)){const {data:saved,error:saveError}=await db.rpc('fm_fideora_ingest_brevo_v1',{p_events:rows.filter(Boolean)});if(saveError)throw saveError;inserted+=saved.inserted;deliveries+=saved.deliveries;}
   offset+=data.events.length;
   if(data.events.length<2500){
    if(date===today){cursor={date:from,offset:0,completed_at:new Date().toISOString(),cycles:Number(cursor.cycles||0)+1};break;}
    date=new Date(new Date(date+'T12:00:00Z').getTime()+86400000).toISOString().slice(0,10);offset=0;
   }
   cursor={...cursor,date,offset};
  }
  const {error:finish}=await db.from('fm_fideora_sync_v1').update({cursor,lease_until:null,updated_at:new Date().toISOString(),last_error:null}).eq('id','brevo_bulk');if(finish)throw finish;
  return {ok:true,received,inserted,deliveries,pages:Math.min(pages+1,4),cursor};
 }catch(e){await db.from('fm_fideora_sync_v1').update({lease_until:null,last_error:String(e.message||e).slice(0,250),updated_at:new Date().toISOString()}).eq('id','brevo_bulk');throw e;}
}
async function syncTemplates(){
 const {data:seqs,error}=await db.from('fm_email_sequences_v1').select('*,funnels_v2(slug)').in('id',[13,15,16,23,63]);if(error)throw error;
 const {data:messages,error:me}=await db.from('fm_email_messages_v1').select('*').in('sequence_id',seqs.map((s)=>s.id)).eq('is_archived',false).in('category',['capture','purchase']);if(me)throw me;
 let synced=0;const errors=[];
 for(const m of messages||[]){
  if(m.delivery_policy?.revision!==ROLLOUT)continue;
  if(m.brevo_synced_at&&new Date(m.brevo_synced_at)>=new Date(m.updated_at))continue;
  const s=seqs.find((s)=>s.id===m.sequence_id);
  try{
   if(!m.brevo_template_id)throw Error('Existing template is required');
   await brevo('/smtp/templates/'+m.brevo_template_id,{method:'PUT',body:JSON.stringify({templateName:'Fideora V2 '+s.funnels_v2.slug+' '+m.category+' '+m.sort_order,subject:m.subject,sender:{name:s.sender_name,email:s.sender_email},htmlContent:'<!doctype html><html><body>'+m.body_html.replace('<!--fm-primary-cta-->','<p><a href="'+m.cta_url.replace(/&/g,'&amp;')+'" style="display:inline-block;padding:14px 20px;background:#173f34;color:white;text-decoration:none">'+m.cta_label+'</a></p>')+'</body></html>',isActive:true})});
   const {error:se}=await db.from('fm_email_messages_v1').update({brevo_synced_at:new Date().toISOString(),status:'reviewed'}).eq('id',m.id).eq('updated_at',m.updated_at);if(se)throw se;synced++;
  }catch(e){errors.push({id:m.id,error:String(e.message||e).slice(0,150)});}
 }
 return {ok:errors.length===0,synced,errors};
}
export async function fideoraGrowthReport(slug=null) {
 const [report, appReviews] = await Promise.all([
  db.rpc('fm_fideora_report_v1',{p_slug:slug}),
  reviewCounts(db),
 ]);
 if(report.error)throw report.error;
 return {...report.data,app_reviews:appReviews};
}
export async function handleFideoraGrowth(req){
 try{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'POST,GET,OPTIONS','access-control-allow-headers':'content-type,authorization,x-worker-token','vary':'Origin'}});
  const action=new URL(req.url).searchParams.get('action');
  if(action==='health')return out({ok:true,version:ROLLOUT});
  if(action==='app-review')return await collectReviewEvent(req,db,out);
  if(action==='collect'){
   if(req.method!=='POST'||req.headers.get('origin')!==origin)return out({ok:false},403);
   if(Number(req.headers.get('content-length')||0)>4000)return out({ok:false},413);
   if(/bot|crawler|spider|preview|headless/i.test(req.headers.get('user-agent')||''))return out({ok:true,ignored:'automated'});
   const body=await req.text();if(body.length>4000)return out({ok:false},413);
   const event=websiteEvent(JSON.parse(body));
   const {error}=await db.from('fm_fideora_events_v1').upsert(event,{onConflict:'event_key',ignoreDuplicates:true});if(error)throw error;return out({ok:true});
  }
  if(action==='revenuecat'){
   const supplied=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
   if(req.method!=='POST'||!equal(supplied,await secret('fideora_rc_webhook_token')))return out({ok:false,error:'Unauthorized'},401);
   if(Number(req.headers.get('content-length')||0)>65536)return out({ok:false},413);
   const payload=await req.json(),e=payload.event;
   if(!e||typeof e.id!=='string'||typeof e.type!=='string')return out({ok:false,error:'Invalid event'},400);
   if(e.type==='TEST'){
    await db.from('fm_fideora_sync_v1').upsert({id:'revenuecat_webhook',cursor:{tested_at:new Date().toISOString(),environment:e.environment||'TEST'},updated_at:new Date().toISOString()});
    return out({ok:true,test:true});
   }
   if(!['com.fideora.premium.monthly','com.fideora.premium.annual'].includes(e.product_id))return out({ok:true,ignored:true});
   const name=revenueCatEventName(e);
   if(!name)return out({ok:true,ignored:true});
   const event={event_key:'rc:'+safeToken(e.id,150),event_name:name,source:'revenuecat',rollout_id:ROLLOUT,
    is_test:e.environment!=='PRODUCTION',platform:'ios',occurred_at:new Date(e.event_timestamp_ms||Date.now()).toISOString(),
    properties:{provider_type:e.type,customer_hash:await digest(String(e.app_user_id||'')),product_id:e.product_id,period_type:e.period_type,
     revenue_usd:Number(e.price)||0,currency:safeToken(e.currency),offering:safeToken(e.presented_offering_id),cancel_reason:safeToken(e.cancel_reason),
     expiration_at_ms:e.expiration_at_ms||null,transaction_hash:e.transaction_id?await digest(String(e.transaction_id)):null}};
   const {error}=await db.from('fm_fideora_events_v1').upsert(event,{onConflict:'event_key',ignoreDuplicates:true});if(error)throw error;
   await social.revenueCat(e);
   await db.from('fm_fideora_sync_v1').upsert({id:'revenuecat_webhook',cursor:{last_event_at:new Date().toISOString(),last_type:e.type},updated_at:new Date().toISOString()});
   return out({ok:true});
  }
  const token=req.headers.get('x-worker-token')||(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
  if(!equal(token,await secret('brevo_worker_token')))return out({ok:false,error:'Unauthorized'},401);
  const body=req.method==='POST'?await req.json().catch(()=>({})):{};
  if(action==='sync-metrics')return out(await syncMetrics());
  if(action==='sync-templates')return out(await syncTemplates());
  if(action==='senders'){const d=await brevo('/senders');return out({ok:true,senders:(d.senders||[]).map((s)=>({name:s.name,email:s.email,active:s.active}))});}
  return out({ok:false,error:'Unknown action'},404);
 }catch(e){return out({ok:false,error:String(e.message||e).slice(0,300)},500);}
}

