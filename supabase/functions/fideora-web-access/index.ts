import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const origins = new Set(['https://fideora.app', 'https://www.fideora.app']);
const cors = (req: Request) => ({ 'Access-Control-Allow-Origin': origins.has(req.headers.get('origin') || '') ? req.headers.get('origin')! : 'https://fideora.app',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin', 'Cache-Control': 'private, no-store' });
Deno.serve(async req => {
  const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors(req), 'Content-Type': 'application/json' } });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  try {
    const { action } = await req.json();
    if (action === 'plans') {
      if (!Deno.env.get('HOTMART_HOTTOK')) return json({ plans: [] });
      const { data, error } = await db.from('fideora_web_plans').select('plan_key,amount,currency,checkout_url').eq('active', true).not('hotmart_product_ucode', 'is', null).not('hotmart_plan_id', 'is', null);
      if (error) return json({ error: 'unavailable' }, 503);
      const plans = (data || []).filter(p => { try { const u = new URL(p.checkout_url); return u.protocol === 'https:' && u.hostname === 'pay.hotmart.com' && !u.username && !u.password; } catch { return false; } });
      return json({ plans: plans.map(p => ({ key: p.plan_key, amount: Number(p.amount), currency: p.currency, checkoutUrl: p.checkout_url })) });
    }
    if (action !== 'status') return json({ error: 'invalid_action' }, 400);
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'authentication_required' }, 401);
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user?.email || !user.email_confirmed_at) return json({ error: 'authentication_required' }, 401);
    const { data, error } = await db.from('fideora_web_payments').select('access_until').eq('buyer_email', user.email.trim().toLowerCase()).eq('status', 'approved').gt('access_until', new Date().toISOString()).order('access_until', { ascending: false }).limit(1);
    if (error) return json({ error: 'verification_unavailable' }, 503);
    return json({ userId: user.id, isPremium: Boolean(data?.length), expiresAt: data?.[0]?.access_until || null });
  } catch { return json({ error: 'invalid_request' }, 400); }
});
