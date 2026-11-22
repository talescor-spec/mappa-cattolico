// One experiment, one offer. Presentation and attribution are the only variant fields.
export const experiment = 'mdb20_name_cover_v1';
export const variants = Object.freeze({
  a: Object.freeze({ id: 'a', route: '/mappa-della-bibbia-2/', name: 'Mappa della Bibbia', cover: 'mappa' }),
  b: Object.freeze({ id: 'b', route: '/panorama-biblico/', name: 'Panorama Biblico', cover: 'panorama' }),
});

export function variantForPath(pathname) {
  return Object.values(variants).find(v => pathname === v.route || pathname === v.route.slice(0, -1)) ?? null;
}

const keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','ttclid','gclid','sck','src','ct'];
export function attributionFor(url, variant, campaign) {
  if (!variants[variant?.id] || variants[variant.id] !== variant) throw new Error('Unknown offer variant');
  const source = new URL(url);
  const safe = Object.fromEntries(keys.map(key => [key, source.searchParams.get(key)])
    .filter(([,value]) => value && value.length <= 200 && !/[@<>\x00-\x1f\x7f]|%40/i.test(value)));
  safe.utm_campaign ||= campaign;
  // ct is the experiment dimension in Funnel Metrics. Keep ad IDs in utm_content.
  safe.ct = `${experiment}_${variant.id}`;
  // Mundpay's sck carries the presentation into the checkout. Keep its existing source prefix.
  const token = `fdb_mdb20_${variant.id}`;
  if (!safe.sck?.split('|').includes(token)) safe.sck = safe.sck ? `${safe.sck}|${token}` : token;
  // Do not shorten a long, existing provider attribution code.
  if (safe.sck.length > 200) safe.sck = source.searchParams.get('sck');
  return safe;
}

export function checkoutFor(baseURL, attribution) {
  const target = new URL(baseURL);
  if (target.protocol !== 'https:' || !['pay.mycheckoutt.com','checkout.mundpay.com'].includes(target.hostname) || target.username || target.password) return null;
  for (const [key, value] of Object.entries(attribution)) target.searchParams.set(key, value);
  return target.href;
}
