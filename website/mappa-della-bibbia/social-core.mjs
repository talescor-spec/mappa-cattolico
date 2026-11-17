export const socialCampaign='mdb_studio_v1';
export const socialSessionKey='fideoraStudySession:v1';
export function detectDevice(nav={}){const ua=nav.userAgent||'';if(/Android/i.test(ua)||/Android/i.test(nav.userAgentData?.platform||''))return 'android';if(/iPhone|iPad|iPod/i.test(ua)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1))return 'ios';return 'desktop';}
export function appOffer(platform){return platform==='ios'?'apple':'android';}
export function campaignToken(source,medium){const s=String(source||'direct').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,9)||'direct';const m=String(medium||'site').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8)||'site';return 'mdbs_'+s+'_'+m;}
export function sessionContext(storage,params,referrer='',createID=()=>crypto.randomUUID()){
 let saved;try{saved=JSON.parse(storage?.getItem(socialSessionKey)||'null');}catch{}
 if(!saved?.id||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved.id)||!Number.isFinite(saved.createdAt)||Date.now()-saved.createdAt>30*60000)saved={id:createID(),createdAt:Date.now(),attribution:{}};
 if(!saved.attribution||typeof saved.attribution!=='object'||Array.isArray(saved.attribution))saved.attribution={};
 const allowed=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','ct','fbclid','gclid','ttclid','fm_delivery'];
 for(const key of allowed){const v=params.get(key);if(v&&v.length<=200&&!/[<>\x00-\x1f\x7f]/.test(v))saved.attribution[key]=v;}
 if(!saved.attribution.utm_source){try{const host=new URL(referrer).hostname;for(const network of ['tiktok','instagram','facebook','youtube'])if(host.includes(network+'.'))saved.attribution.utm_source=network;}catch{}}
 saved.attribution.utm_source ||= 'direct';saved.attribution.utm_medium ||= saved.attribution.utm_source==='direct'?'direct':'organic';saved.attribution.utm_campaign ||= socialCampaign;
 try{storage?.setItem(socialSessionKey,JSON.stringify(saved));}catch{}
 return saved;
}
