// Add campaign attribution to outgoing marketing links without recipient data.
export function emailAttribution(sequence,message,deliveryId) {
 const source = 'brevo', medium = 'email';
 const campaign = message.delivery_policy?.revision==='fideora_social_20261117_v1' ? 'mdb_studio_v1' : message.delivery_policy?.revision==='fideora_20261106_v2' ? message.delivery_policy.apple_campaign : 'fm_funnel_'+sequence.funnel_id+'_'+message.category;
 const content = 'email_'+message.id+'_step_'+message.step;
 const code = 'fm_email_s'+sequence.id+'_'+message.category+'_m'+message.id;
 return {utm_source:source,utm_medium:medium,utm_campaign:campaign,utm_content:content,src:code,sck:code,...(deliveryId?{fm_delivery:String(deliveryId)}:{})};
}
export function trackEmailLinks(html,{sequence,message,deliveryId,unsubscribeURL=''}) {
 const params = emailAttribution(sequence,message,deliveryId);
 const excluded = new Set([unsubscribeURL,sequence.support_url].filter(Boolean).map(String));
 const decode = value => value.replace(/&amp;/gi,'&').replace(/&#0*38;/g,'&').replace(/&#x0*26;/gi,'&');
 const escape = value => value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 return html.replace(/(<a\b[^>]*?\bhref\s*=\s*)(["'])([^"']*)\2/gi, (match,prefix,quote,raw) => {
  const link=decode(raw);
  if(excluded.has(link))return match;
  let url;try{url=new URL(link);}catch{return match;}
  if(!['http:','https:'].includes(url.protocol))return match;
  if(url.pathname.endsWith('/email-preferences.html'))return match;
  for(const [key,value] of Object.entries(params))url.searchParams.set(key,value);
  return prefix+quote+escape(url.toString())+quote;
 });
}


