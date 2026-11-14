const ENDPOINT = 'https://sysuottboucultzzaagv.supabase.co/functions/v1/fideora-web-access';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store'); res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const action = body?.action;
    if (!['plans', 'status'].includes(action)) return res.status(400).json({ error: 'invalid_action' });
    if (action === 'status' && !/^Bearer [A-Za-z0-9_.-]+$/.test(req.headers.authorization || '')) return res.status(401).json({ error: 'authentication_required' });
    const result = await fetch(ENDPOINT, { method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(action === 'status' ? { Authorization: req.headers.authorization } : {}) },
      body: JSON.stringify({ action }), signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return res.status(result.status === 401 ? 401 : 503).json({ error: 'verification_unavailable' });
    return res.status(200).json(await result.json());
  } catch { return res.status(503).json({ error: 'verification_unavailable' }); }
}
