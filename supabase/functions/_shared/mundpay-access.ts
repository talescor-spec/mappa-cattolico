import { createMundpayApi, validMundpayCheckout, validMundpayToken, webhookSubscription } from './mundpay.mjs';

export function mundpayAccess(db: any, prefix: 'fideora' | 'herbalia', env: (name: string) => string | undefined) {
  const api = createMundpayApi(env);
  async function offers() {
    const { data, error } = await db.from(`${prefix}_mundpay_offers`).select('*').eq('active', true);
    if (error) throw new Error('mundpay_configuration_unavailable');
    return data || [];
  }
  async function sync(id: string, configured: any[]) {
    const verified = await api.verify(id, configured);
    if (!verified) return null;
    const { error } = await db.rpc(`${prefix}_save_mundpay_subscription`, { snapshot: verified });
    if (error) throw new Error('mundpay_save_failed');
    const { data: saved, error: readError } = await db.from(`${prefix}_mundpay_subscriptions`).select('*').eq('subscription_id', id).single();
    if (readError) throw new Error('mundpay_save_failed');
    return saved;
  }
  return {
    async plans() {
      if (!api.configured || !env('MUNDPAY_WEBHOOK_TOKEN')) return [];
      return (await offers()).filter((o: any) => o.available_for_purchase && validMundpayCheckout(o.checkout_url))
        .map((o: any) => ({ key: 'monthly', provider: 'mundpay', amount: o.amount_cents / 100,
          currency: o.currency, checkoutUrl: o.checkout_url, introAmount: o.intro_amount_cents / 100,
          introMonths: 1, trialDays: 0 }));
    },
    async entitlement(email: string) {
      const { data, error } = await db.from(`${prefix}_mundpay_subscriptions`).select('*').eq('buyer_email', email).limit(10);
      if (error) throw new Error('mundpay_verification_unavailable');
      if (!data?.length) return null;
      if (!api.configured) return null;
      const configured = await offers();
      for (const row of data) {
        if (!configured.some((o: any) => o.offer_id === row.offer_id)) continue;
        // Short-lived snapshots recover from missed webhooks and never extend a paid cycle.
        const current = Date.now() - Date.parse(row.checked_at) < 15000 ? row : await sync(row.subscription_id, configured);
        if (current?.buyer_email === email && Date.parse(current.expires_at) > Date.now())
          return { expiresAt: current.expires_at, billingProvider: 'mundpay' };
      }
      return null;
    },
    async webhook(req: Request) {
      const respond = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
        status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
      if (req.method !== 'POST') return respond({ error: 'method_not_allowed' }, 405);
      if (!api.configured || !env('MUNDPAY_WEBHOOK_TOKEN')) return respond({ error: 'integration_pending' }, 503);
      // The current Generic Webhook has no HMAC. Use a private per-app URL token AND API verification.
      const token = req.headers.get('x-mundpay-token') || new URL(req.url).searchParams.get('token');
      if (!(await validMundpayToken(token, env('MUNDPAY_WEBHOOK_TOKEN')))) return respond({ error: 'unauthorized' }, 401);
      try {
        const body = await req.text();
        if (body.length > 65536) return respond({ error: 'payload_too_large' }, 413);
        const id = webhookSubscription(JSON.parse(body));
        if (!id) return respond({ ignored: true });
        const verified = await sync(id, await offers());
        return respond({ received: true, matched: Boolean(verified) });
      } catch { return respond({ error: 'verification_unavailable' }, 503); }
    },
  };
}
