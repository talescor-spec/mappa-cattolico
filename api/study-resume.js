const endpoint='https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads?social=1&action=resume';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private,no-store');res.setHeader('CDN-Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).end();
 if(req.headers.origin&&!['https://fideora.app','https://www.fideora.app'].includes(req.headers.origin))return res.status(403).json({ok:false});
 try{const body=typeof req.body==='string'?JSON.parse(req.body):req.body;const token=body?.token;if(typeof token!=='string'||token.length>200)return res.status(400).json({ok:false});const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),signal:AbortSignal.timeout(10000)});return res.status(r.status).json(await r.json());}catch{return res.status(503).json({ok:false});}
}
