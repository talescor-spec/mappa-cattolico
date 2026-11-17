import {createClient} from 'npm:@supabase/supabase-js@2.116.0';
import {CHILDREN,collectEvent,captureContact,attribution} from './core.mjs';
import {equal,verifyResume} from './lifecycle.mjs';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const limits=new Map<string,{start:number,count:number}>();
const origins=new Set(['https://fideora.app','https://www.fideora.app']);
const secret=async(k:string)=>{const {data,error}=await db.from('app_secrets_v2').select('secret_value').eq('secret_key',k).single();if(error)throw error;return data.secret_value;};
const checked=async(q:any)=>{const r=await q;if(r.error)throw r.error;return r.data;};
export async function handleFideoraSocial(req:Request){
 const origin=req.headers.get('origin')||'';
 const out=(x:unknown,status=200)=>new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json','Cache-Control':'private,no-store','Access-Control-Allow-Origin':origins.has(origin)?origin:'https://fideora.app','Access-Control-Allow-Headers':'content-type,authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Vary':'Origin'}});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':'https://fideora.app','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST,OPTIONS'}});
 const action=new URL(req.url).searchParams.get('action')||'health';
 if(action==='health'&&req.method==='GET')return out({ok:true,version:'fideora_social_20261117_v1'});
 if(req.method!=='POST')return out({ok:false,error:'method_not_allowed'},405);
 try{
  if(origin&&!origins.has(origin))return out({ok:false,error:'invalid_origin'},403);
  const raw=await req.text();if(raw.length>5000)return out({ok:false,error:'too_large'},413);const body=JSON.parse(raw);
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-forwarded-for')||'unknown';const now=Date.now();
  if(limits.size>5000)for(const [k,v]of limits)if(now-v.start>60000)limits.delete(k);
  const limit=limits.get(ip)||{start:now,count:0};if(now-limit.start>60000){limit.start=now;limit.count=0;}limits.set(ip,limit);
  if(++limit.count>90)return out({ok:false,error:'rate_limited'},429);
  if(action==='collect'){
   const event=collectEvent(body);await checked(db.from('fm_social_events_v1').upsert(event,{onConflict:'event_key',ignoreDuplicates:true}));return out({ok:true});
  }
  if(action==='resume'){
   const id=await verifyResume(body.token,await secret('brevo_worker_token'));if(!id)return out({ok:false,error:'expired_link'},400);
   const journey=await checked(db.from('fm_social_journeys_v1').select('email,contact_name,offer').eq('id',id).single());
   return out({ok:true,name:journey.contact_name,email:journey.email,offer:journey.offer});
  }
  if(action==='capture'){
   if(body.company)return out({ok:false,error:'invalid_request'},400);
   const c=captureContact(body);
   const config=await checked(db.from('fm_social_config_v1').select('config').eq('id','mdb-studio-it').single());
   const f=await checked(db.from('funnels_v2').select('id,slug').eq('slug',CHILDREN[c.offer]).single());
   const mapping=await checked(db.from('brevo_capture_mappings_v2').select('list_id').eq('funnel_id',f.id).eq('active',true).single());
   if(Number(mapping.list_id)!==Number(config.config.lists[c.offer]))throw Error('capture_mapping_mismatch');
   const response=await fetch('https://api.brevo.com/v3/contacts',{method:'POST',headers:{'api-key':await secret('brevo_api_key'),'Content-Type':'application/json'},body:JSON.stringify({email:c.email,listIds:[config.config.parentList,Number(mapping.list_id)],attributes:{NOME:c.name,FIDEORA_SOCIAL_OFFER:c.offer,FIDEORA_SOCIAL_PLATFORM:c.platform,FIDEORA_SOCIAL_SOURCE:c.attribution.utm_source||'direct'},updateEnabled:true}),signal:AbortSignal.timeout(14000)});
   if(!response.ok)throw Error('capture_provider_failed');
   const journey=await checked(db.from('fm_social_journeys_v1').insert({session_id:c.session_id,email:c.email,contact_name:c.name,offer:c.offer,platform:c.platform,funnel_id:f.id,attribution:c.attribution,is_test:c.is_test}).select('id').single());
   const page=new URL('https://fideora.app/mappa-della-bibbia/');for(const[k,v]of Object.entries(c.attribution))page.searchParams.set(k,String(v));
   const lead=await checked(db.from('lead_captures_v2').insert({funnel_id:f.id,funnel_slug:f.slug,email:c.email,name:c.name,test_type:c.is_test?'qa_study_order':null,page_url:page.href,captured_at:new Date().toISOString(),...Object.fromEntries(Object.entries(c.attribution).filter(([k])=>k.startsWith('utm_'))),raw_payload:{...c,funnel:f.slug,parent_funnel:'mdb-studio-it',social_journey_id:journey.id,selected_offer:c.offer,offer_reference:c.offer==='book'?'mdb_studio_library_39_eur':c.offer==='ios'?'com.fideora.premium.monthly':'hotmart_fideora_monthly_e792z6va',offer_price:c.offer==='book'?39:7.99,currency:'EUR',consent_recorded_at:new Date().toISOString()}}).select('id').single());
   await checked(db.from('fm_social_journeys_v1').update({lead_id:lead.id}).eq('id',journey.id));
   await checked(db.from('fm_social_events_v1').upsert({event_key:'capture:'+journey.id,session_id:c.session_id,journey_id:journey.id,event_name:'capture_success',platform:c.platform,offer:c.offer,source:'server',attribution:c.attribution,is_test:c.is_test},{onConflict:'event_key',ignoreDuplicates:true}));
   return out({ok:true,offer:body.offer,funnel:f.slug,listId:Number(mapping.list_id),journeyId:journey.id});
  }
  if(action==='report'){
   const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
   if(!equal(token,await secret('dashboard_api_token'))&&!equal(token,await secret('brevo_worker_token')))return out({ok:false,error:'unauthorized'},401);
   const {data,error}=await db.rpc('fm_social_report_v1',{p_days:Math.min(90,Math.max(1,Number(body.days)||30))});if(error)throw error;return out({ok:true,report:data});
  }
  return out({ok:false,error:'invalid_action'},400);
 }catch(e){const message=e instanceof Error?e.message:'';return out({ok:false,error:message.startsWith('invalid_')?message:'service_unavailable'},message.startsWith('invalid_')?400:503);}
}
