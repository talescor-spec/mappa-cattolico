import {handleFideoraSocial} from './social/index.ts';
import {handleFideoraGrowth} from './growth/index.ts';
import {withRequestCache,readSecret} from './request-cache.mjs';
import { handleEmailStudio } from "./studio.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const cors={"access-control-allow-origin":"*","access-control-allow-headers":"authorization,content-type","access-control-allow-methods":"GET,POST,OPTIONS","cache-control":"no-store"};
const out=(d:any,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{...cors,'content-type':'application/json; charset=utf-8'}});
async function sec(k:string){return readSecret(sb,k)}
async function auth(req:Request){const t=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');return !!t&&t===await sec('dashboard_api_token')}
async function brevo(path:string){const key=await sec('brevo_api_key');if(!key)throw new Error('Brevo API key not configured');const r=await fetch('https://api.brevo.com/v3'+path,{headers:{'api-key':key,'accept':'application/json'}});const txt=await r.text();let x:any={};try{x=txt?JSON.parse(txt):{}}catch{x={raw:txt}}if(!r.ok)throw new Error(`Brevo ${r.status}: ${x?.message||txt||r.statusText}`);return x}
function norm(v:any){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ')}
function ymdSP(v:any){if(!v)return null;const d=new Date(String(v));if(isNaN(d.getTime()))return null;return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}
function addDays(s:string,n:number){const [y,m,d]=s.split('-').map(Number),x=new Date(Date.UTC(y,m-1,d,12));x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)}
function dates(start:string,end:string){const a:string[]=[];for(let d=start;d<=end;d=addDays(d,1)){a.push(d);if(a.length>370)break}return a}
function langToken(slug:string){const s=String(slug||'').toLowerCase();if(/(^|-)fr($|-)/.test(s))return 'fr';if(/(^|-)it($|-)/.test(s))return 'it';if(/(^|-)(es|esp)($|-)/.test(s))return 'es';if(/(^|-)(de|al)($|-)/.test(s))return 'de';if(/(^|-)(en|ing)($|-)/.test(s))return 'en';if(/(^|-)(pt|ptbr)($|-)/.test(s))return 'pt';return ''}
function scoreList(f:any,l:any,recovery:Set<number>){const ln=norm(l.name),fn=norm(f.name),slug=norm(String(f.slug||'').replace(/-/g,' '));if(!ln)return -999;let sc=0;const bad=['comprador','compradores','buyer','buyers','paid','pago','pagos','recusad','refused','declined','cancel','recovery','recupera','abandon','checkout','kiwify'];if(bad.some(x=>ln.includes(x)))sc-=120;if(recovery.has(Number(l.id)))sc-=200;if(ln===fn||ln===slug)sc+=140;if(fn&&ln.includes(fn))sc+=100;const toks=[...new Set((slug+' '+fn).split(' ').filter((x:string)=>x.length>=2))];const meaningful=toks.filter((x:string)=>!['funil','offer','oferta','livro'].includes(x));if(meaningful.length&&meaningful.every((x:string)=>ln.includes(x)))sc+=70;for(const t of meaningful)if(ln.includes(t))sc+=8;const lang=langToken(f.slug);if(lang&&ln.split(' ').includes(lang))sc+=25;const product=norm(f.slug).split(' ')[0];if(product&&ln.includes(product))sc+=25;if(/\b(leads?|captura|capture|prospect)\b/.test(ln))sc+=25;return sc}
async function lists(){const all:any[]=[];for(let off=0;off<1000;off+=50){const x=await brevo(`/contacts/lists?limit=50&offset=${off}&sort=desc`);const rows=x?.lists||[];all.push(...rows);if(rows.length<50)break}return all}
async function autoMap(fid?:number|null){const [{data:fs,error:fe},{data:re,error:reErr},ls]=await Promise.all([sb.from('funnels_v2').select('id,slug,name,status').eq('status','active'),sb.from('brevo_recovery_mappings_v2').select('list_id').eq('active',true),lists()]);if(fe)throw fe;if(reErr)throw reErr;const recovery=new Set<number>((re||[]).map((x:any)=>Number(x.list_id)));const mapped:any[]=[];for(const f of fs||[]){if(fid&&Number(f.id)!==fid)continue;const {data:existing}=await sb.from('brevo_capture_mappings_v2').select('*').eq('funnel_id',f.id).eq('active',true).maybeSingle();if(existing){mapped.push(existing);continue}const ranked=ls.map((l:any)=>({l,score:scoreList(f,l,recovery)})).sort((a:any,b:any)=>b.score-a.score);const best=ranked[0],second=ranked[1];if(!best||best.score<55||(second&&second.score===best.score))continue;const row={funnel_id:f.id,list_id:Number(best.l.id),list_name:best.l.name,auto_matched:true,match_score:best.score,active:true,updated_at:new Date().toISOString()};const {data,error}=await sb.from('brevo_capture_mappings_v2').upsert(row,{onConflict:'funnel_id'}).select().single();if(error)throw error;mapped.push(data)}return mapped}
async function funnelBySlug(slug:string|null){if(!slug)return null;const {data,error}=await sb.from('funnels_v2').select('id,slug,name').eq('slug',slug.toLowerCase()).maybeSingle();if(error)throw error;return data||null}
async function syncMapping(m:any,start:string,end:string){const counts:Record<string,number>={};for(const d of dates(start,end))counts[d]=0;let offset=0;for(;offset<20000;offset+=500){const x=await brevo(`/contacts/lists/${Number(m.list_id)}/contacts?limit=500&offset=${offset}&sort=desc`);const rows=x?.contacts||[];let allOlder=rows.length>0;for(const c of rows){const d=ymdSP(c.createdAt||c.modifiedAt);if(d&&d>=start)allOlder=false;if(d&&d>=start&&d<=end)counts[d]=(counts[d]||0)+1}if(rows.length<500||allOlder)break}for(const d of dates(start,end)){const row={date:d,funnel_id:Number(m.funnel_id),brevo_count:counts[d]||0,source:'brevo_created_at',synced_at:new Date().toISOString(),updated_at:new Date().toISOString()};const {error}=await sb.from('lead_daily_v2').upsert(row,{onConflict:'date,funnel_id'});if(error)throw error}return counts}
async function sync(start:string,end:string,slug:string|null,force=false){const f=await funnelBySlug(slug);if(!f&&slug)return {synced:false,reason:'funnel_not_found'};const fid=f?.id||null;let maps:any[]=[];if(fid){const {data}=await sb.from('brevo_capture_mappings_v2').select('*').eq('funnel_id',fid).eq('active',true);maps=data||[]}else{const {data}=await sb.from('brevo_capture_mappings_v2').select('*').eq('active',true);maps=data||[]}if(!maps.length)maps=await autoMap(fid);if(!maps.length)return {synced:false,reason:'capture_list_not_mapped'};const results=[];for(const m of maps){if(!force){const {data:fresh}=await sb.from('lead_daily_v2').select('synced_at').eq('funnel_id',m.funnel_id).gte('date',start).lte('date',end).order('synced_at',{ascending:false}).limit(1);const t=fresh?.[0]?.synced_at?new Date(fresh[0].synced_at).getTime():0;if(t&&Date.now()-t<10*60*1000){results.push({funnel_id:m.funnel_id,list_id:m.list_id,skipped:'fresh'});continue}}const c=await syncMapping(m,start,end);results.push({funnel_id:m.funnel_id,list_id:m.list_id,list_name:m.list_name,total:Object.values(c).reduce((a:number,b:any)=>a+Number(b||0),0)})}return {synced:true,results}}
async function readData(start:string,end:string,slug:string|null){const f=await funnelBySlug(slug);let q=sb.from('lead_daily_v2').select('date,funnel_id,brevo_count,manual_override,source,synced_at, funnels_v2(slug,name)').gte('date',start).lte('date',end).order('date');if(f)q=q.eq('funnel_id',f.id);const {data,error}=await q;if(error)throw error;return (data||[]).map((r:any)=>({...r,leads:r.manual_override==null?Number(r.brevo_count||0):Number(r.manual_override),isOverride:r.manual_override!=null}))}

function captureSlug(v:any){return String(v||'').trim().toLowerCase().replace(/_/g,'-')}
function emailOk(v:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
let cachedNameAttr:string|null=null;
async function resolveBrevoNameAttr(){
  if(cachedNameAttr)return cachedNameAttr;
  const x=await brevo('/contacts/attributes');
  const names=(x?.attributes||[]).map((a:any)=>String(a?.name||'').toUpperCase()).filter(Boolean);
  const preferred=['NOME','FIRSTNAME','FNAME','FIRST_NAME','NAME'];
  cachedNameAttr=preferred.find((k)=>names.includes(k))||null;
  return cachedNameAttr;
}
async function captureMapping(slug:string){
  const f=await funnelBySlug(slug);if(!f)throw new Error('Funil não encontrado');
  const {data:m,error}=await sb.from('brevo_capture_mappings_v2').select('*').eq('funnel_id',f.id).eq('active',true).maybeSingle();if(error)throw error;
  if(m)return {f,m};
  if(slug==='mdb-it'){
    const fallback={funnel_id:f.id,list_id:55,list_name:'Captura MDB IT',auto_matched:false,match_score:999,active:true,updated_at:new Date().toISOString()};
    const {data:made,error:me}=await sb.from('brevo_capture_mappings_v2').upsert(fallback,{onConflict:'funnel_id'}).select().single();
    if(me){console.error('Falha ao persistir mapeamento MDB IT',me);return {f,m:fallback}}
    return {f,m:made};
  }
  throw new Error('Lista de captura não mapeada');
}
async function publicCapture(body:any){
  const slug=captureSlug(body?.funnel||body?.market),
        email=String(body?.email||'').trim().toLowerCase(),
        name=String(body?.name||'').trim();
  if(!slug)return {status:400,data:{ok:false,error:'funnel obrigatório'}};
  if(!emailOk(email))return {status:400,data:{ok:false,error:'email inválido'}};
  const {f,m}=await captureMapping(slug);
  const key=await sec('brevo_api_key');if(!key)throw new Error('Brevo API key not configured');
  const contactPayload:any={email,listIds:[Number(m.list_id)],updateEnabled:true};
  const nameAttr=name?await resolveBrevoNameAttr():null;
  if(name&&nameAttr)contactPayload.attributes={[nameAttr]:name};
  const r=await fetch('https://api.brevo.com/v3/contacts',{method:'POST',headers:{'api-key':key,'accept':'application/json','content-type':'application/json'},body:JSON.stringify(contactPayload)});
  const txt=await r.text();let x:any={};try{x=txt?JSON.parse(txt):{}}catch{x={raw:txt}}
  if(!r.ok)throw new Error(`Brevo ${r.status}: ${x?.message||txt||r.statusText}`);

  const addressLine1=String(body?.address_line1||body?.address||body?.street_address||'').trim();
  const postalCode=String(body?.postal_code||body?.zip||body?.cap||'').trim();
  const city=String(body?.city||'').trim();
  const province=String(body?.province||body?.region||'').trim();
  const country=String(body?.country||'').trim();
  const testType=String(body?.test_type||'').trim();
  let addressSaved=false;
  {
    const parsedAt=body?.captured_at?new Date(String(body.captured_at)):new Date();
    const capturedAt=isNaN(parsedAt.getTime())?new Date().toISOString():parsedAt.toISOString();
    const {error:capErr}=await sb.from('lead_captures_v2').insert({
      funnel_id:Number(f.id),funnel_slug:f.slug,email,name:name||null,test_type:testType||null,
      address_line1:addressLine1||null,postal_code:postalCode||null,city:city||null,province:province||null,country:country||null,
      page_url:body?.page_url?String(body.page_url):null,captured_at:capturedAt,
      utm_source:body?.utm_source?String(body.utm_source):null,utm_medium:body?.utm_medium?String(body.utm_medium):null,
      utm_campaign:body?.utm_campaign?String(body.utm_campaign):null,utm_term:body?.utm_term?String(body.utm_term):null,
      utm_content:body?.utm_content?String(body.utm_content):null,raw_payload:body
    });
    if(capErr)console.error('Falha ao salvar captura detalhada',capErr);else addressSaved=!!(addressLine1||postalCode||city||province||country||testType);
  }
  return {status:200,data:{ok:true,funnel:f.slug,listId:Number(m.list_id),nameSaved:!!(name&&nameAttr),nameAttribute:nameAttr||null,addressSaved}};
}

const requestHandler=async(req:Request)=>{if(new URL(req.url).searchParams.has('social'))return handleFideoraSocial(req);if(new URL(req.url).searchParams.has('growth'))return handleFideoraGrowth(req);if(new URL(req.url).searchParams.has("studio"))return handleEmailStudio(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});try{const u=new URL(req.url),action=u.searchParams.get('action')||'data';if(action==='capture-health'&&req.method==='GET'){const slug=captureSlug(u.searchParams.get('funnel')||'mdb-it');const {f,m}=await captureMapping(slug);return out({ok:true,funnel:f.slug,listId:Number(m.list_id),listName:m.list_name||null})}if(action==='capture'&&req.method==='POST'){const r=await publicCapture(await req.json().catch(()=>({})));return out(r.data,r.status)}if(!(await auth(req)))return out({ok:false,error:'Unauthorized'},401);if(req.method==='GET'&&action==='data'){const start=u.searchParams.get('start')||new Date().toISOString().slice(0,10),end=u.searchParams.get('end')||start,slug=u.searchParams.get('funnel');return out({ok:true,rows:await readData(start,end,slug)})}if(req.method==='GET'&&action==='mappings'){const {data,error}=await sb.from('brevo_capture_mappings_v2').select('*,funnels_v2(slug,name)').order('funnel_id');if(error)throw error;return out({ok:true,rows:data||[]})}const b=await req.json().catch(()=>({}));if(action==='sync'){const start=String(b.start||u.searchParams.get('start')||new Date().toISOString().slice(0,10)),end=String(b.end||u.searchParams.get('end')||start),slug=String(b.funnel||u.searchParams.get('funnel')||'')||null;return out({ok:true,...await sync(start,end,slug,!!b.force)})}if(action==='override'){const date=String(b.date||''),slug=String(b.funnel||''),leads=b.leads===null||b.leads===''?null:Number(b.leads);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!slug||!(leads===null||(Number.isInteger(leads)&&leads>=0)))return out({ok:false,error:'date, funnel e leads válidos são obrigatórios'},400);const f=await funnelBySlug(slug);if(!f)return out({ok:false,error:'Funil não encontrado'},404);const {data:old}=await sb.from('lead_daily_v2').select('brevo_count').eq('date',date).eq('funnel_id',f.id).maybeSingle();const row={date,funnel_id:f.id,brevo_count:old?.brevo_count??0,manual_override:leads,source:'brevo_created_at',updated_at:new Date().toISOString()};const {error}=await sb.from('lead_daily_v2').upsert(row,{onConflict:'date,funnel_id'});if(error)throw error;return out({ok:true,row:{...row,leads:leads==null?Number(row.brevo_count||0):leads,isOverride:leads!=null}})}return out({ok:false,error:'Unknown action'},404)}catch(e:any){return out({ok:false,error:String(e?.message||e)},500)}};




Deno.serve((req:Request)=>withRequestCache(()=>requestHandler(req)));


