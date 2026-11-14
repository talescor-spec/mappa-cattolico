// Device hints choose a CTA; visitors can always choose the other platform.
export function detectPlatform(nav = {}, explicit) {
  if (explicit === 'android' || explicit === 'ios') return explicit;
  const ua = nav.userAgent || '';
  if (/Android/i.test(ua) || /Android/i.test(nav.userAgentData?.platform || '')) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1)) return 'ios';
  return 'both';
}
export const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
export function campaignParams(source) {
  const params = new URLSearchParams();
  for (const key of campaignKeys) {
    const value = source.get(key);
    if (value && value.length <= 150 && /^[\p{L}\p{N}_. :-]+$/u.test(value)) params.set(key, value);
  }
  const ct = source.get('ct');
  if (ct && /^fd2_[a-z0-9_]{1,50}$/.test(ct)) params.set('ct', ct);
  if (source.get('fm_test') === '1') params.set('fm_test', '1');
  return params;
}
export function platformURL({ platform, lang = 'it', currentURL, position = 'hero', plan }) {
  const current = new URL(currentURL);
  const locale = lang === 'pt' ? 'pt' : 'it';
  const target = platform === 'ios'
    ? new URL(`https://apps.apple.com/${locale === 'pt' ? 'br' : 'it'}/app/fideora/id6825337165`)
    : new URL('/app/', current.origin);
  target.searchParams.set('utm_source', 'fideora_site');
  target.searchParams.set('utm_medium', 'website');
  target.searchParams.set('utm_campaign', 'fideora_mappa');
  target.searchParams.set('utm_content', `${position}_${locale}`);
  for (const [key, value] of campaignParams(current.searchParams)) target.searchParams.set(key, value);
  if (platform === 'ios') {
    target.searchParams.set('pt', '129505215');
    target.searchParams.set('mt', '8');
    if (!target.searchParams.has('ct')) target.searchParams.set('ct', `fd2_site_${locale}`);
  } else {
    target.searchParams.set('lang', locale);
    if (plan === 'annual' || plan === 'monthly') target.searchParams.set('plan', plan);
  }
  return target.href;
}
