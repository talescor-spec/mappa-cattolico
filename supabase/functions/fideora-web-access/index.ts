import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { createHotmartApi, trialEntitlement } from '../_shared/hotmart-api.mjs';
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const hotmart = createHotmartApi((name: string) => Deno.env.get(name));
const trialCache = new Map<string, { until: number; expiresAt: string | null }>();
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
      const { data, error } = await db.from('fideora_web_plans').select('plan_key,amount,currency,checkout_url,trial_days').eq('active', true).not('hotmart_product_ucode', 'is', null).not('hotmart_plan_id', 'is', null);
      if (error) return json({ error: 'unavailable' }, 503);
      const plans = (data || []).filter(p => { try { const u = new URL(p.checkout_url); return u.protocol === 'https:' && u.hostname === 'pay.hotmart.com' && !u.username && !u.password; } catch { return false; } });
      return json({ plans: plans.map(p => ({ key: p.plan_key, amount: Number(p.amount), currency: p.currency, checkoutUrl: p.checkout_url, trialDays: p.trial_days })) });
    }
    if (action !== 'status') return json({ error: 'invalid_action' }, 400);
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'authentication_required' }, 401);
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user?.email || !user.email_confirmed_at) return json({ error: 'authentication_required' }, 401);
    const { data: grants, error: grantError } = await db.from('fideora_web_access_grants').select('expires_at').eq('user_id', user.id).gt('expires_at', new Date().toISOString()).limit(1);
    if (grantError) return json({ error: 'verification_unavailable' }, 503);
    if (grants?.length) return json({ userId: user.id, isPremium: true, expiresAt: grants[0].expires_at });
    const { data, error } = await db.from('fideora_web_payments').select('access_until').eq('buyer_email', user.email.trim().toLowerCase()).eq('status', 'approved').gt('access_until', new Date().toISOString()).order('access_until', { ascending: false }).limit(1);
    if (error) return json({ error: 'verification_unavailable' }, 503);
    if (data?.length) return json({ userId: user.id, isPremium: true, expiresAt: data[0].access_until });
    const email = user.email.trim().toLowerCase(), now = Date.now();
    const { data: terminal, error: terminalError } = await db.from('fideora_web_payments').select('subscription_code').eq('buyer_email', email).in('status', ['refunded', 'chargeback']);
    const { data: plans, error: planError } = await db.from('fideora_web_plans').select('*').eq('active', true).gt('trial_days', 0);
    if (terminalError || planError) return json({ error: 'verification_unavailable' }, 503);
    if (!plans?.length) return json({ userId: user.id, isPremium: false, expiresAt: null });
    let cached = trialCache.get(email);
    // Terminal financial events always override a previously cached trial.
    if (terminal?.length) { trialCache.delete(email); cached = undefined; }
    if (!cached || cached.until < now) {
      const blocked = new Set((terminal || []).map(p => p.subscription_code));
      const items = (await Promise.all([...new Set(plans.map(p => p.hotmart_product_id))].map(id => hotmart.subscriptions(email, id)))).flat();
      cached = { until: now + 15000, expiresAt: trialEntitlement(items, email, plans, now, blocked) };
      if (trialCache.size >= 200) trialCache.delete(trialCache.keys().next().value!);
      trialCache.set(email, cached);
    }
    const expiresAt = cached.expiresAt && Date.parse(cached.expiresAt) > now ? cached.expiresAt : null;
    return json({ userId: user.id, isPremium: Boolean(expiresAt), expiresAt });
  } catch { return json({ error: 'verification_unavailable' }, 503); }
});
