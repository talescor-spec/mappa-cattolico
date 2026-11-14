const DAY = 86400000;
const stamp = value => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? (number < 1e12 ? number * 1000 : number) : NaN;
};

// A configured trial is not proof of payment. Require an active subscription
// reported by Hotmart, the verified account email, and the exact product/plan.
export function trialEntitlement(items, email, plans, now = Date.now(), blockedCodes = new Set()) {
  let expires = 0;
  for (const item of items || []) {
    if (item?.trial !== true || item.status !== 'ACTIVE' || !item.subscriber_code || blockedCodes.has(item.subscriber_code)) continue;
    if (String(item.subscriber?.email || '').trim().toLowerCase() !== email.trim().toLowerCase()) continue;
    const plan = plans.find(p => p.active && p.trial_days > 0 && String(p.hotmart_product_id) === String(item.product?.id)
      && p.hotmart_product_ucode === item.product?.ucode && String(p.hotmart_plan_id) === String(item.plan?.id));
    // The provider can convert currencies or apply coupons. Authorization
    // follows its exact product/plan identity, not a comparison with list price.
    if (!plan) continue;
    const start = stamp(item.accession_date), next = stamp(item.date_next_charge);
    const until = Math.min(start + plan.trial_days * DAY, next);
    if (start <= now && until > now) expires = Math.max(expires, until);
  }
  return expires ? new Date(expires).toISOString() : null;
}

export function createHotmartApi(getSecret, fetchImpl = fetch, clock = Date.now) {
  let token = null, tokenUntil = 0, generating = null;
  async function accessToken() {
    if (token && tokenUntil > clock()) return token;
    if (generating) return generating;
    generating = (async () => {
      const id = getSecret('HOTMART_CLIENT_ID'), secret = getSecret('HOTMART_CLIENT_SECRET'), basic = getSecret('HOTMART_BASIC');
      if (!id || !secret || !basic) throw new Error('hotmart_not_configured');
      const url = new URL('https://api-sec-vlc.hotmart.com/security/oauth/token');
      url.search = new URLSearchParams({ grant_type: 'client_credentials', client_id: id, client_secret: secret }).toString();
      const response = await fetchImpl(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(7000),
        headers: { Authorization: basic.startsWith('Basic ') ? basic : `Basic ${basic}`, 'Content-Type': 'application/json' } });
      if (!response.ok) throw new Error('hotmart_auth_unavailable');
      const result = await response.json();
      if (typeof result.access_token !== 'string' || !result.access_token) throw new Error('hotmart_auth_unavailable');
      token = result.access_token; tokenUntil = clock() + Math.max(0, Math.min(Number(result.expires_in) || 0, 172800) - 60) * 1000;
      return token;
    })();
    try { return await generating; } finally { generating = null; }
  }
  async function get(path, retry = true) {
    const response = await fetchImpl(`https://developers.hotmart.com${path}`, { redirect: 'error', signal: AbortSignal.timeout(7000),
      headers: { Authorization: `Bearer ${await accessToken()}` } });
    if (response.status === 401 && retry) { token = null; tokenUntil = 0; return get(path, false); }
    if (!response.ok) throw new Error('hotmart_verification_unavailable');
    return response.json();
  }
  return { async subscriptions(email, productId) {
    const params = new URLSearchParams({ product_id: String(productId), subscriber_email: email, trial: 'true',
      accession_date: String(clock() - 31 * DAY), max_results: '50' });
    let items = [], cursor;
    for (let page = 0; page < 3; page++) {
      if (cursor) params.set('page_token', cursor);
      const result = await get(`/payments/api/v1/subscriptions?${params}`);
      if (!Array.isArray(result.items)) throw new Error('hotmart_invalid_response');
      items.push(...result.items); cursor = result.page_info?.next_page_token;
      if (!cursor) return items;
    }
    throw new Error('hotmart_result_limit');
  } };
}
