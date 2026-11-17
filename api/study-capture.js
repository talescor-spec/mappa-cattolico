import { capturePayload } from '../website/mappa-della-bibbia/order-core.mjs';

const endpoint = 'https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads?action=capture';
const requests = new Map();
export function createHandler({ fetchImpl = fetch, now = Date.now, limits = requests } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
    const origin = req.headers.origin;
    if (origin) {
      let host = '';
      try { host = new URL(origin).hostname; } catch { /* Rejected below. */ }
      if (!['fideora.app', 'www.fideora.app'].includes(host) && !/^mappa-cattolico-[a-z0-9]+-thales-projects-54040b4e\.vercel\.app$/.test(host)) return res.status(403).json({ ok: false, error: 'invalid_origin' });
    }
    let value;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      if (raw.length > 4096) return res.status(413).json({ ok: false, error: 'request_too_large' });
      value = typeof req.body === 'string' ? JSON.parse(raw) : req.body || {};
      if (value.company) return res.status(400).json({ ok: false, error: 'invalid_request' });
    } catch { return res.status(400).json({ ok: false, error: 'invalid_request' }); }
    let payload;
    try { payload = capturePayload(value); } catch (error) { return res.status(400).json({ ok: false, error: error.message }); }
    const time = now();
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    if (ip) {
      for (const [key, item] of limits) if (time - item.start > 60000) limits.delete(key);
      const item = limits.get(ip) || { start: time, count: 0 };
      if (++item.count > 10) return res.status(429).json({ ok: false, error: 'try_later' });
      limits.set(ip, item);
    }
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(18000),
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true || data.funnel !== 'mdb-studio-it' || Number(data.listId) !== 214) throw new Error('capture_failed');
      return res.status(200).json({ ok: true, offer: payload.selected_offer });
    } catch {
      // Contact information and provider errors are never written to logs or returned.
      return res.status(503).json({ ok: false, error: 'capture_unavailable' });
    }
  };
}
export default createHandler();
