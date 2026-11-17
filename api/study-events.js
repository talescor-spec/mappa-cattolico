const endpoint='https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads?social=1&action=collect';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private,no-store');
 if(req.method!=='POST')return res.status(405).end();
 if(req.headers.origin&&!['https://fideora.app','https://www.fideora.app'].includes(req.headers.origin))return res.status(403).json({ok:false});
 try{const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});if(raw.length>5000)return res.status(413).end();const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:raw,signal:AbortSignal.timeout(7000)});return res.status(r.status).json(await r.json());}catch{return res.status(503).json({ok:false});}
}
