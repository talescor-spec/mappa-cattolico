import fs from 'node:fs';
import path from 'node:path';
import { copy } from '../website/content.mjs';
import { platformURL } from '../website/platform.mjs';

const out = 'web-dist';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync('website/assets', `${out}/assets`, { recursive: true });
fs.cpSync('website/mappa', `${out}/mappa`, { recursive: true });
for (const file of ['site.css', 'site.js', 'platform.mjs', 'growth.js', 'sw.js']) fs.copyFileSync(`website/${file}`, `${out}/${file}`);
for (const file of ['obrigado-fideora.html', 'fideora-obrigado.js', 'app-thanks-tracking.js']) fs.copyFileSync(`website/${file}`, `${out}/${file}`);
for (const file of ['icon.svg', 'icon-192.png']) fs.copyFileSync(`public/${file}`, `${out}/${file}`);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const mark = '<img src="/icon.svg" width="32" height="32" alt="">';
const arrow = '<span aria-hidden="true">↗</span>';
function page(lang) {
  const c = copy[lang];
  const prefix = lang === 'pt' ? '/pt/' : '/';
  const legal = kind => `/${kind}.html?lang=${lang}`;
  const actions = (position, plan='annual', classes='') => `<div class="actions ${classes}">${['android','ios'].map(platform=>`<a class="button primary" data-platform-link="${position}" data-destination="${platform}" data-plan="${plan}" href="${esc(platformURL({platform, lang, currentURL:'https://fideora.app'+prefix, position, plan}))}"><span>${esc(plan === 'monthly' ? c.monthlyCta : c.annualCta)}</span>${arrow}<small>${esc(c[platform])}</small></a>`).join('')}</div>`;
  const platformTexts = (values, cls='micro') => `<p class="${cls}">${Object.entries(values).map(([platform,text])=>`<span data-for-platform="${platform}"${platform !== 'both' ? ' hidden' : ''}>${esc(text)}</span>`).join('')}</p>`;
  const price = plan => Object.entries(c.prices).map(([platform,values])=>`<span data-for-platform="${platform}"${platform !== 'both' ? ' hidden' : ''}>${platform === 'both' && lang === 'pt' ? '' : esc(c.pricePrefix)+' '}${esc(values[plan])}</span>`).join('');
  const plan = annual => { const key=annual?'annual':'monthly'; return `<article class="plan ${annual?'featured':''}"><div class="plan-top"><span>${esc(c[key])}</span>${annual?`<small>${c.recommended}</small>`:''}</div><h3>${annual?c.annualTrial:c.monthlyTrial}</h3><p class="plan-price">${price(key)}</p>${actions('plan_'+key,key,'plan-actions')}</article>`; };
  const screen = (image, alt, eager=false) => `<a class="screen-zoom" href="/assets/${image}" data-zoom aria-label="${esc(c.zoomLabel+': '+alt)}"><img src="/assets/${image}" width="390" height="844" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async"><span class="zoom-hint"><span aria-hidden="true">⤢</span> ${c.zoomHint}</span></a>`;
  return `<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f5ef"><title>${esc(c.title)}</title><meta name="description" content="${esc(c.description)}"><link rel="canonical" href="https://fideora.app${prefix}"><link rel="alternate" hreflang="it" href="https://fideora.app/"><link rel="alternate" hreflang="pt-BR" href="https://fideora.app/pt/"><link rel="alternate" hreflang="x-default" href="https://fideora.app/"><meta property="og:type" content="website"><meta property="og:site_name" content="Fideora"><meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="https://fideora.app${prefix}"><meta property="og:image" content="https://fideora.app/assets/social.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/icon.svg"><link rel="apple-touch-icon" href="/icon-192.png"><link rel="preload" as="image" href="/assets/app-mappa.jpg"><link rel="stylesheet" href="/site.css"><script type="module" src="/site.js"></script><script src="/growth.js" defer></script></head><body>
  <a class="skip" href="#main">${c.skip}</a>
  <header class="header"><div class="nav wrap"><a class="brand" href="${prefix}">${mark}<span>Fideora</span></a><nav aria-label="${lang==='it'?'Navigazione':'Navegação'}">${c.nav.map((text,i)=>`<a href="#${['mappa','premium','faq'][i]}">${text}</a>`).join('')}</nav><div class="nav-actions"><div class="languages" aria-label="${lang==='it'?'Lingua':'Idioma'}"><a href="/" lang="it" ${lang==='it'?'aria-current="page"':''}>IT</a><a href="/pt/" lang="pt-BR" ${lang==='pt'?'aria-current="page"':''}>PT</a></div><a class="access-link" href="/app/?lang=${lang}" data-access>${c.access}${arrow}</a></div></div></header>
  <main id="main"><section class="hero wrap"><div class="hero-copy"><p class="eyebrow">${c.eyebrow}</p><h1>${c.hero}</h1><p class="intro">${c.intro}</p><fieldset class="device-choice"><legend>${c.device}</legend>${['android','ios'].map(p=>`<label><input type="radio" name="platform" value="${p}"><span>${c[p]}</span></label>`).join('')}</fieldset>${actions('hero')}${platformTexts(c.deviceNote)}<p class="fine-print">${c.trialMicro}</p><a class="tour-link" href="#mappa">${c.tourLink}<span aria-hidden="true">↓</span></a></div>
  <div class="app-hero" data-motion aria-label="${esc(c.galleryLabel)}"><div class="hero-glow" aria-hidden="true"></div><div class="hero-device hero-device-back" aria-hidden="true"><img src="/assets/app-quaderno.jpg" width="390" height="844" alt="" decoding="async"></div><div class="hero-device hero-device-front">${screen('app-mappa.jpg',c.features[0].alt,true)}</div><div class="hero-caption"><span aria-hidden="true">✦</span>${c.heroCaption}</div></div></section>
  <section class="showcase-section" id="mappa"><div class="wrap"><div class="section-heading" data-reveal><p class="eyebrow">${c.galleryLabel}</p><h2>${c.galleryTitle}</h2><p class="section-intro">${c.galleryIntro}</p></div><div class="showcase-tabs" role="tablist" aria-label="${esc(c.galleryTabs)}">${c.features.map((f,i)=>`<button id="feature-tab-${f.id}" type="button" role="tab" aria-selected="${i===0}" aria-controls="feature-${f.id}" tabindex="${i===0?0:-1}"><span>0${i+1}</span>${esc(f.label)}</button>`).join('')}</div><div class="showcase-stage" data-reveal>${c.features.map((f,i)=>`<div class="showcase-panel" role="tabpanel" id="feature-${f.id}" aria-labelledby="feature-tab-${f.id}" ${i?'hidden':''}><div class="showcase-copy"><p class="eyebrow">${f.kicker}</p><h3>${f.title}</h3><p>${esc(f.text)}</p><ul>${f.bullets.map(b=>`<li><span aria-hidden="true">✓</span>${esc(b)}</li>`).join('')}</ul>${actions('feature_'+f.id)}</div><div class="showcase-art"><div class="screen-number" aria-hidden="true">0${i+1}</div><div class="showcase-device">${screen(f.image,f.alt)}</div></div></div>`).join('')}</div><p class="gallery-note">${c.galleryNote}</p></div></section>
  <section class="offer wrap" id="premium" data-reveal><div class="section-heading"><p class="eyebrow">${c.offerLabel}</p><h2>${c.offerTitle}</h2><p class="section-intro">${c.offerText}</p></div><div class="plans">${plan(true)}${plan(false)}</div>${platformTexts(c.billing,'billing')}<div class="how"><h3>${c.next}</h3>${Object.entries(c.instructions).map(([platform,steps])=>`<ol data-for-platform="${platform}"${platform !== 'both' ? ' hidden' : ''}>${steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`).join('')}</div></section>
  <section class="faq-section wrap" id="faq"><div><p class="eyebrow">${c.faqLabel}</p><h2>${c.faqTitle}</h2></div><div class="faqs">${c.faqs.map(([q,a])=>`<details><summary>${esc(q)}<span class="plus" aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>
  <section class="final"><div class="wrap"><h2>${c.finalTitle}</h2><p>${c.finalText}</p>${actions('final')}<p class="fine-print">${c.trialMicro}</p></div></section></main>
  <footer class="footer wrap"><div><a class="brand" href="${prefix}">${mark}Fideora</a><p>${c.footer}</p></div><div class="footer-links"><a href="${legal('support')}">${c.support}</a><a href="${legal('privacy')}">${c.privacy}</a><a href="${legal('terms')}">${c.terms}</a><a href="mailto:support@fideora.app">support@fideora.app</a></div><p class="copyright">© ${new Date().getFullYear()} Fideora. ${c.rights}</p></footer>
  <dialog class="screen-dialog" aria-label="${esc(c.zoomLabel)}"><form method="dialog"><button aria-label="${esc(c.close)}">×</button></form><img alt=""><p></p></dialog></body></html>`;
}
fs.writeFileSync(`${out}/index.html`, page('it'));
fs.mkdirSync(`${out}/pt`);
fs.writeFileSync(`${out}/pt/index.html`, page('pt'));
fs.writeFileSync(`${out}/come-iniziare.html`, page('it'));
fs.writeFileSync(`${out}/pt/come-iniziare.html`, page('pt'));
const policies = JSON.parse(fs.readFileSync('website/legal-copy.json', 'utf8'));
for (const kind of ['privacy','terms','support']) {
  const sections = Object.entries(policies).map(([lang,c])=>`<section lang="${lang}" id="${lang}"><h1>${esc(c[kind].title)}</h1>${c[kind].sections.map(([h,p])=>`<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}</section>`).join('');
  fs.writeFileSync(`${out}/${kind}.html`, `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fideora · ${kind}</title><link rel="icon" href="/icon.svg"><link rel="stylesheet" href="/site.css"><script src="/legal.js" defer></script></head><body class="legal-page"><nav><a class="brand" href="/">${mark}Fideora</a><a href="?lang=it">Italiano</a><a href="?lang=pt">Português</a></nav><main>${sections}</main><footer><a href="mailto:support@fideora.app">support@fideora.app</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Termini / Termos</a> · <a href="/support.html">Supporto / Suporte</a></footer></body></html>`);
}
fs.copyFileSync('public/legal.js', `${out}/legal.js`);
fs.writeFileSync(`${out}/404.html`, page('it'));
fs.writeFileSync(`${out}/robots.txt`, 'User-agent: *\nAllow: /\nSitemap: https://fideora.app/sitemap.xml\n');
fs.writeFileSync(`${out}/sitemap.xml`, '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/','/pt/','/privacy.html','/terms.html','/support.html'].map(p=>`<url><loc>https://fideora.app${p}</loc></url>`).join('')+'</urlset>');
const files = fs.readdirSync(out, {recursive:true}).filter(p=>fs.statSync(path.join(out,p)).isFile());
if(files.some(f => /\.json$|\.jsx$|manifest\.webmanifest|\/bible\//.test(f))) throw new Error('Native app data must not be published with the marketing site');
console.log(`Fideora website built: ${files.length} files. Italian + Portuguese. No application bundle or Bible corpus.`);


