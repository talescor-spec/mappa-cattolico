import {createSocialLifecycle} from './social/lifecycle.mjs';
import {trackEmailLinks} from "./email-tracking.mjs";
import {lifecycleExclusion} from "./audience-v3.mjs";
import {isFideoraInstallationInvite} from "./fideora-installation.mjs";
// Email Studio lifecycle worker. This worker never activates automations.
export function createLifecycleWorker({db,secret,audience,linkGuard}:{db:any,secret:(key:string)=>Promise<string>,audience?:any,linkGuard?:any}){
 const social=createSocialLifecycle({db,secret});
 const simple=(v:any)=>String(v??"");
 function valid(email:string){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)}
 async function hash(input:string){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(await secret("brevo_worker_token")),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(input)))).map(x=>x.toString(16).padStart(2,"0")).join("");
 }
 function enc(input:string){return btoa(String.fromCharCode(...new TextEncoder().encode(input))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
 function dec(input:string){return new TextDecoder().decode(Uint8Array.from(atob(input.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0)))}
 async function unsubscribeURL(sid:number,email:string){
  const body=enc(JSON.stringify({sid,email,expires:Date.now()+365*24*3600000}));
  return "https://funnel-metrics-dashboard.vercel.app/email-preferences.html?t="+encodeURIComponent(body+"."+(await hash(body)));
 }
 async function optOut(token:string){
  const p=token.split(".");if(p.length!==2||p[1].length!==64)return false;
  const h=await hash(p[0]);let mismatch=0;for(let i=0;i<h.length;i++)mismatch|=h.charCodeAt(i)^p[1].charCodeAt(i);if(mismatch)return false;
  let data:any;try{data=JSON.parse(dec(p[0]))}catch{return false}
  if(!Number.isSafeInteger(data.sid)||!valid(data.email)||typeof data.expires!=="number"||data.expires<Date.now())return false;
  const {error}=await db.from("fm_email_suppressions_v1").upsert({sequence_id:data.sid,email:data.email,reason:"unsubscribe",unsubscribed_at:new Date().toISOString()},{onConflict:"sequence_id,email"});if(error)throw error;
  return true;
 }
 function esc(s:any){return simple(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}
 function html(m:any,s:any,unsub:string){
  const fallback=m.category==="purchase"?s.access_url:s.checkout_url;
  const link=m.cta_url||fallback;
  let contents=simple(m.body_html).replace(/\{\{\s*checkout_url\s*\}\}/gi,s.checkout_url||"")
     .replace(/\{\{\s*access_url\s*\}\}/gi,s.access_url||"")
     .replace(/\{\{\s*support_url\s*\}\}/gi,s.support_url||"")
     .replace(/\{\{\s*product\s*\}\}/gi,s.product_name||"");
  const cta=link?'<p style="padding:16px 0"><a href="'+esc(link)+'" style="display:inline-block;padding:12px 18px;border-radius:7px;background:#2b5c4c;color:white;text-decoration:none">'+esc(m.cta_label||"Continuar")+"</a></p>":"";
  const inlineCta=contents.includes("<!--fm-primary-cta-->");
  if(inlineCta)contents=contents.replace("<!--fm-primary-cta-->",cta);
  const footer=s.support_url?'<p style="font-size:12px">'+(s.language==='it'?'Supporto':'Suporte')+': <a href="'+esc(s.support_url)+'">'+esc(s.support_url)+"</a></p>":"";
  const opt=(m.category!=="purchase"||m.delivery_policy?.marketing)?'<p style="font-size:12px;color:#66737e"><a href="'+esc(unsub)+'">'+(s.language==='it'?'Non ricevere più queste e-mail':'Não receber mais e-mails desta oferta / Unsubscribe')+'</a></p>':"";
  return '<!doctype html><html><head><meta charset="utf-8"></head><body style="background:#f5f6f2;padding:20px;font-family:Arial,sans-serif;color:#213e34"><div style="margin:0 auto;max-width:580px;background:white;padding:28px;border-radius:10px"><span style="display:none;max-height:0;overflow:hidden;mso-hide:all">'+esc(m.preheader)+'</span><h3>'+esc(m.delivery_policy?.revision==='fideora_20261106_v2'?'Fideora':s.product_name)+'</h3><div style="line-height:1.6">'+contents+"</div>"+(inlineCta?"":cta)+footer+opt+"</div></body></html>";
 }
 async function updateStatus(id:number,fields:any){const {error}=await db.from("fm_email_delivery_queue_v1").update(fields).eq("id",id);if(error)throw error}
 async function cancel(row:any,e:any,reason:string){
   await updateStatus(row.id,{state:"cancelled",last_error:reason,lease_token:null,leased_until:null});
 }
 async function send(row:any,socialReady=true){
  const {data:acq,error:lockError}=await db.from("fm_email_delivery_queue_v1")
    .update({state:"processing",lease_token:crypto.randomUUID(),leased_until:new Date(Date.now()+180000).toISOString(),attempts:row.attempts+1})
    .eq("id",row.id).eq("state","queued").select("id,attempts,lease_token").maybeSingle();
  if(lockError)throw lockError;if(!acq)return {id:row.id,skipped:"taken"};
  let socialDelivery=false,providerAttempted=false;
  try{
   const {data:context,error:contextError}=await db.rpc("fm_email_send_context_v1",{p_queue_id:row.id,p_lease_token:acq.lease_token});
   if(contextError)throw contextError;
   if(!context?.enrollment||!context?.message||!context?.sequence||!context?.rule)throw Error("Email delivery context is unavailable");
   const {enrollment:e,message:m,sequence:s,rule}=context;
   socialDelivery=m.delivery_policy?.revision==='fideora_social_20261117_v1';
   if(socialDelivery&&!socialReady)throw Error('social_conversion_check_unavailable');
   if(!rule.enabled||e.state!=="active"){await cancel(row,e,"sequence paused or enrollment cancelled");return {id:row.id,skipped:"paused"}}
   if(m.is_archived===true){await cancel(row,e,"email archived");return {id:row.id,skipped:"archived"}}
   // Purchase conversion emails are marketing too; honor opt-out before provider calls.
   if(e.category==="purchase"&&m.delivery_policy?.marketing===true){
    if(context.suppressed){await cancel(row,e,"unsubscribed from purchase marketing");return {id:row.id,skipped:"suppressed"}}
   }
   if(m.status!=="reviewed"||!m.subject||!m.body_html||!s.sender_email||!s.sender_name||!m.brevo_template_id||!m.brevo_synced_at||new Date(m.brevo_synced_at).getTime()<new Date(m.updated_at).getTime()){
    await updateStatus(row.id,{state:"failed",last_error:"Template is not reviewed and synced",lease_token:null,leased_until:null});
    return {id:row.id,error:"template_not_reviewed"};
   }
   const currentOrders=context.orders||[];
   const activePaid=(currentOrders||[]).some((o:any)=>o.status==="paid"),everPaid=(currentOrders||[]).some((o:any)=>o.approved_at||["paid","refunded","chargeback"].includes(o.status));
   if(e.category!=="purchase"){
    if(everPaid||context.suppressed){await cancel(row,e,"already purchased or unsubscribed");return {id:row.id,skipped:"suppressed"}}
   }else if(!activePaid&&(currentOrders||[]).some((o:any)=>["refunded","chargeback"].includes(o.status))){await cancel(row,e,"order refunded or charged back");return {id:row.id,skipped:"order_status_changed"}}
   if(e.category==="purchase"&&e.source_type==="order"&&e.source_id){
    const o=context.source_order;
    if(o&&o.status!=="paid"){await cancel(row,e,"order no longer approved");return {id:row.id,skipped:"order_status_changed"}}
   }
   if(m.delivery_policy?.purpose==='app_installation'&&!isFideoraInstallationInvite(m))throw Error('Invalid Fideora installation invitation');
   if(Number(s.funnel_id)===200777&&e.category==='purchase'&&!isFideoraInstallationInvite(m)){
    const policy=m.delivery_policy||{},ctx=e.lifecycle_context||{};
    if(policy.blocked_reason)throw Error(policy.blocked_reason);
    if(!policy.segment||policy.segment!==ctx.segment){await cancel(row,e,'Package does not match this email');return {id:row.id,skipped:'package_mismatch'}}
    if(policy.anchor!=='approval')throw Error('Confirmed Fideora activation/expiry is required before scheduling this email');
    if(policy.marketing){
     if(ctx.marketing_consent!==true)throw Error('Marketing consent is not confirmed');
     if(ctx.premium_active!==false)throw Error('Current Fideora subscription must be checked before a conversion email');
     if(context.suppressed){await cancel(row,e,'unsubscribed');return {id:row.id,skipped:'suppressed'}}
    }
   }
   let socialPrepared:any;
   if(socialDelivery){socialPrepared=await social.prepare(e,s,m);if(!socialPrepared.eligible){await cancel(row,e,socialPrepared.reason);return {id:row.id,skipped:socialPrepared.reason};}}
   // Guard actual destination just before contacting the provider.
    if(socialPrepared?.message)Object.assign(m,socialPrepared.message);
    if(socialPrepared?.productName)s.product_name=socialPrepared.productName;
    // Validate the actual offer route without logging a signed recovery token.
    const inspectionMessage=socialPrepared?.ctaURL?{...m,cta_url:new URL(socialPrepared.ctaURL).origin+new URL(socialPrepared.ctaURL).pathname}:m;
    if(linkGuard)await linkGuard.verifySend(s,inspectionMessage);
    if(socialPrepared?.ctaURL)m.cta_url=socialPrepared.ctaURL;
    const key=await secret("brevo_api_key");if(!key)throw Error("Brevo is not connected");
   // Recheck sender at send time; registrations may be disabled after template review.
   const senderReply=await fetch("https://api.brevo.com/v3/senders",{method:"GET",headers:{"api-key":key,"accept":"application/json"},signal:AbortSignal.timeout(14000)});
   if(!senderReply.ok)throw Error("Could not validate sender status in Brevo ("+senderReply.status+")");
   const senderResult=await senderReply.json();
   if(!Array.isArray(senderResult.senders)||!senderResult.senders.some((v:any)=>v.active===true&&String(v.email||"").trim().toLowerCase()===String(s.sender_email||"").trim().toLowerCase())){
    throw Error("The configured sender is no longer active in Brevo; delivery blocked.");
   }
   const contactReply=await fetch("https://api.brevo.com/v3/contacts/"+encodeURIComponent(e.email),{headers:{"api-key":key,"accept":"application/json"},signal:AbortSignal.timeout(14000)});
   let currentContact:any;
   if(contactReply.status===404&&e.category==="purchase"&&e.source_type==="order")currentContact={listIds:[],listUnsubscribed:[]};
   else {if(!contactReply.ok)throw Error("Brevo contact check failed: "+contactReply.status);currentContact=await contactReply.json();}
   const {data:binding,error:bindingError}=await db.rpc("fm_email_studio_service_v2",{p_action:"reconcile_bindings",p_patch:{sequence_id:s.id}});if(bindingError)throw bindingError;
   const excluded=lifecycleExclusion({category:e.category,contact:currentContact,bindings:binding.lists,sourceType:e.source_type});
   if(excluded){await cancel(row,e,excluded);return {id:row.id,skipped:"current_contact_state"}}
   const commercial=e.category!=="purchase"||m.delivery_policy?.marketing===true;
   const unsubscribe=commercial?await unsubscribeURL(s.id,e.email):"";
   const payload:any={sender:{name:s.sender_name,email:s.sender_email},to:[{email:e.email,name:e.contact_name||undefined}],subject:m.subject,htmlContent:trackEmailLinks(html(m,s,unsubscribe),{sequence:s,message:m,deliveryId:row.id,unsubscribeURL:unsubscribe}),tags:["funnel_metrics",s.language,e.category,...(m.delivery_policy?.revision==="fideora_20261106_v2"?["fideora_v2",m.delivery_policy.apple_campaign]:[])]};
   if(commercial)payload.headers={"List-Unsubscribe":"<"+unsubscribe+">"};
   providerAttempted=true;
   const resp=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{"api-key":key,"accept":"application/json","content-type":"application/json"},body:JSON.stringify(payload)});
   const raw=await resp.text();let d:any={};try{d=JSON.parse(raw)}catch{}
   if(!resp.ok)throw Error("Brevo SMTP "+resp.status+": "+(d.message||raw.slice(0,120)));
   await updateStatus(row.id,{state:"sent",sent_at:new Date().toISOString(),provider_message_id:simple(d.messageId||""),last_error:null,lease_token:null,leased_until:null});
   const {data:remaining}=await db.from("fm_email_delivery_queue_v1").select("id").eq("enrollment_id",e.id).in("state",["queued","processing"]).limit(1);
   if(!(remaining||[]).length)await db.from("fm_email_enrollments_v1").update({state:"completed"}).eq("id",e.id).eq("state","active");
   return {id:row.id,sent:true};
  }catch(error:any){
   const message=simple(error?.message||error).slice(0,350);
   if(socialDelivery&&!providerAttempted&&acq.attempts<6){
    await updateStatus(row.id,{state:'queued',next_attempt_at:new Date(Date.now()+300000).toISOString(),last_error:message,lease_token:null,leased_until:null});return {id:row.id,error:message,retry:true};
   }
   // Do not blindly retry ambiguous network failures (avoids duplicate sends).
   await updateStatus(row.id,{state:"failed",last_error:message,lease_token:null,leased_until:null});
   return {id:row.id,error:message};
  }
 }
 async function run(){
  let socialReady=true;try{await social.tick();}catch{socialReady=false;console.warn('Social conversion verification will retry in the existing worker');}
  // Process only previously confirmed historical jobs, in bounded batches.
  const {error:backfillError}=await db.rpc("fm_email_studio_service_v2",{p_action:"backfill_tick",p_patch:{limit:100}});
  if(backfillError)console.warn("Email Studio historical queue unavailable");
  // A previous send may have succeeded before the callback failed: never automatically requeue processing jobs.
  // Fair, bounded selection across approved sequence lanes. This does not enable
  // a lane, create enrollments, increase the batch size, or resend failed jobs.
  const {data:pending,error}=await db.rpc("fm_email_due_fair_v2",{p_limit:15});
  if(error)throw error;
  const results=[];
  for(const j of pending||[])results.push(await send(j,socialReady));
  try{if(audience)for(let i=0;i<4;i++){const result=await audience.tick();if(result.idle)break;}}catch{console.warn("Email audience reconciliation will retry on its next cycle");}
  return {ok:true,processed:results.length,sent:results.filter(x=>x.sent).length,failures:results.filter(x=>x.error).length,results};
 }
 return {run,optOut};
}






