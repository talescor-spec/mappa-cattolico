import {createClient} from 'npm:@supabase/supabase-js@2.116.0';
import {createHotmartApi,trialEntitlement} from '../_shared/hotmart-api.mjs';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const hotmart=createHotmartApi((k:string)=>Deno.env.get(k));
const hash=async(v:string)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)))].map(x=>x.toString(16).padStart(2,'0')).join('');
Deno.serve(async req=>{
 const out=(x:unknown,status=200)=>new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json','Cache-Control':'private,no-store'}});
 if(req.method!=='POST')return out({error:'method_not_allowed'},405);
 try{
  const supplied=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
  if(!supplied)return out({error:'unauthorized'},401);
  const {data:config,error:ce}=await db.from('fideora_social_bridge_config').select('token_hash').eq('id',true).single();
  if(ce||!config||await hash(supplied)!==config.token_hash)return out({error:'unauthorized'},401);
  const raw=await req.text();if(raw.length>12000)return out({error:'too_large'},413);
  const body=JSON.parse(raw);
  if(!Array.isArray(body.emails)||body.emails.length>30)return out({error:'invalid_request'},400);
  const emails=[...new Set(body.emails.map((v:unknown)=>String(v).trim().toLowerCase()))] as string[];
  if(emails.some(v=>v.length>254||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v)))return out({error:'invalid_request'},400);
  const {data,error}=await db.rpc('fideora_social_lookup_v1',{p_emails:emails});if(error)throw error;
  const since=typeof body.since==='string'&&!isNaN(Date.parse(body.since))?body.since:new Date(Date.now()-7*86400000).toISOString();
  const {data:updates,error:ue}=await db.rpc('fideora_social_updates_v1',{p_since:since});if(ue)throw ue;
  const {data:plans,error:pe}=await db.from('fideora_web_plans').select('*').eq('active',true);if(pe)throw pe;
  const trials=[];const trialErrors=[];
  if(body.check_trials===true)for(const e of emails.slice(0,5)){
   try{
    const {data:terminal,error:te}=await db.from('fideora_web_payments').select('subscription_code').eq('buyer_email',e).in('status',['refunded','chargeback']);if(te)throw te;
    const items=(await Promise.all([...new Set((plans||[]).filter(p=>p.trial_days>0).map(p=>p.hotmart_product_id))].map(id=>hotmart.subscriptions(e,id)))).flat();
    const until=trialEntitlement(items,e,plans||[],Date.now(),new Set((terminal||[]).map(p=>p.subscription_code)));
    if(until)trials.push({email:e,expires_at:until});
   }catch{trialErrors.push(e);}
  }
  return out({ok:true,...data,payment_updates:updates,trials,trial_check_complete:trialErrors.length===0});
 }catch{return out({error:'verification_unavailable'},503);}
});
