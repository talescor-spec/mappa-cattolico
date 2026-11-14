import fs from 'node:fs';
import path from 'node:path';
import { copy } from '../website/content.mjs';
import { MATTHEW, GOSPELS } from '../src/data/mappa.js';
import { platformURL } from '../website/platform.mjs';

const out = 'web-dist';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync('website/assets', `${out}/assets`, { recursive: true });
for (const file of ['site.css', 'site.js', 'platform.mjs', 'growth.js', 'sw.js']) fs.copyFileSync(`website/${file}`, `${out}/${file}`);
for (const file of ['obrigado-fideora.html', 'fideora-obrigado.js', 'app-thanks-tracking.js']) fs.copyFileSync(`website/${file}`, `${out}/${file}`);
for (const file of ['icon.svg', 'icon-192.png']) fs.copyFileSync(`public/${file}`, `${out}/${file}`);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const mark = '<img src="/icon.svg" width="32" height="32" alt="">';
const arrow = '<span aria-hidden="true">↗</span>';
function page(lang) {
  const c = copy[lang], index = lang === 'pt' ? 1 : 0;
  const prefix = lang === 'pt' ? '/pt/' : '/';
  const legal = kind => `/${kind}.html?lang=${lang}`;
  const actions = (position, plan='annual', classes='') => `<div class="actions ${classes}">${['android','ios'].map(platform=>`<a class="button ${platform === 'android' ? 'primary' : 'outline'}" data-platform-link="${position}" data-destination="${platform}" data-plan="${plan}" href="${esc(platformURL({platform, lang, currentURL:'https://fideora.app'+prefix, position, plan}))}"><span>${esc(platform === 'android' ? plan === 'monthly' ? c.monthlyCta : c.cta.android : c.cta.ios)}</span>${arrow}<small>${esc(c[platform])}</small></a>`).join('')}</div>`;
  const platformTexts = (values, cls='micro') => `<p class="${cls}">${Object.entries(values).map(([platform,text])=>`<span data-for-platform="${platform}"${platform !== 'both' ? ' hidden' : ''}>${esc(text)}</span>`).join('')}</p>`;
  const price = plan => Object.entries(c.prices).map(([platform,values])=>`<span data-for-platform="${platform}"${platform !== 'both' ? ' hidden' : ''}>${esc(c.pricePrefix)} ${esc(values[plan])}</span>`).join('');
  const plan = annual => { const key=annual?'annual':'monthly'; return `<article class="plan ${annual?'featured':''}"><div class="plan-top"><span>${esc(c[key])}</span>${annual?`<small>${c.recommended}</small>`:''}</div><h3>${annual?c.annualTrial:c.monthlyTrial}</h3><p class="plan-price">${price(key)}</p>${actions('plan_'+key,key,'plan-actions')}</article>`; };
  return `<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f5ef"><title>${esc(c.title)}</title><meta name="description" content="${esc(c.description)}"><link rel="canonical" href="https://fideora.app${prefix}"><link rel="alternate" hreflang="it" href="https://fideora.app/"><link rel="alternate" hreflang="pt-BR" href="https://fideora.app/pt/"><link rel="alternate" hreflang="x-default" href="https://fideora.app/"><meta property="og:type" content="website"><meta property="og:site_name" content="Fideora"><meta property="og:title" content="${esc(c.title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="https://fideora.app${prefix}"><meta property="og:image" content="https://fideora.app/assets/social.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/icon.svg"><link rel="apple-touch-icon" href="/icon-192.png"><link rel="stylesheet" href="/site.css"><script type="module" src="/site.js"></script><script src="/growth.js" defer></script></head><body>
  <a class="skip" href="#main">${c.skip}</a>
  <header class="header"><div class="nav wrap"><a class="brand" href="${prefix}">${mark}<span>Fideora</span></a><nav aria-label="${lang==='it'?'Navigazione':'Navegação'}">${c.nav.map((text,i)=>`<a href="#${['mappa','premium','faq'][i]}">${text}</a>`).join('')}</nav><div class="nav-actions"><div class="languages" aria-label="${lang==='it'?'Lingua':'Idioma'}"><a href="/" lang="it" ${lang==='it'?'aria-current="page"':''}>IT</a><a href="/pt/" lang="pt-BR" ${lang==='pt'?'aria-current="page"':''}>PT</a></div><a class="access-link" href="/app/?lang=${lang}" data-access>${c.access}${arrow}</a></div></div></header>
  <main id="main"><section class="hero wrap"><div class="hero-copy"><p class="eyebrow">${c.eyebrow}</p><h1>${c.hero}</h1><p class="intro">${c.intro}</p><fieldset class="device-choice"><legend>${c.device}</legend>${['android','ios'].map(p=>`<label><input type="radio" name="platform" value="${p}"><span>${c[p]}</span></label>`).join('')}</fieldset>${actions('hero')}${platformTexts(c.deviceNote)}<p class="fine-print">${c.trialMicro}</p></div>
  <div class="map-preview" aria-label="${esc(c.matthew)}"><div class="preview-top"><span>${c.preview}</span><span>01 / 04</span></div><div class="book-art" aria-hidden="true"><svg viewBox="0 0 340 210" fill="none"><path d="M46 172V49c41-16 82-12 124 10 42-22 83-26 124-10v123c-41-16-82-12-124 10-42-22-83-26-124-10Z" stroke="currentColor" stroke-width="1.2"/><path d="M170 59v123M63 64c30-9 60-5 89 8M188 72c29-13 59-17 89-8M95 119h36l39 23 39-23h36M95 119v24m150-24v24M170 142v22" stroke="currentColor" opacity=".55"/><circle cx="95" cy="119" r="5" fill="#f7f5ef" stroke="currentColor"/><circle cx="245" cy="119" r="5" fill="#f7f5ef" stroke="currentColor"/><circle cx="170" cy="142" r="6" fill="#f7f5ef" stroke="currentColor"/></svg></div><h2>${c.matthew}</h2><p class="map-sub">${c.chapters}</p><div class="map-themes">${MATTHEW.themes.map((theme,i)=>`<details ${i===0?'open':''}><summary><span class="theme-index">0${i+1}</span>${esc(theme.title[index])}<span class="plus" aria-hidden="true">+</span></summary><p>${esc(theme.body[index])}</p><small>${esc(theme.reference)}</small></details>`).join('')}</div><p class="preview-hint">${c.tap}</p></div></section>
  <section class="pillars wrap" aria-label="Fideora">${c.pillars.map(([n,t,p])=>`<article><span class="eyebrow">${n}</span><h2>${t}</h2><p>${p}</p></article>`).join('')}</section>
  <section class="study-section" id="mappa"><div class="wrap study-layout"><div><p class="eyebrow">${c.demoLabel}</p><h2>${c.demoTitle}</h2><p class="section-intro">${c.demoText}</p></div><div class="gospel-demo"><div class="tabs" role="tablist" aria-label="${lang==='it'?'I quattro Vangeli':'Os quatro Evangelhos'}">${GOSPELS.map((g,i)=>`<button id="gospel-tab-${i}" type="button" role="tab" aria-selected="${i===0}" aria-controls="gospel-${i}" tabindex="${i===0?0:-1}">${esc(g.name[index])}</button>`).join('')}</div>${GOSPELS.map((g,i)=>`<div class="gospel-panel" id="gospel-${i}" role="tabpanel" aria-labelledby="gospel-tab-${i}" ${i?'hidden':''}><p class="eyebrow">${g.chapters} ${lang==='it'?'CAPITOLI':'CAPÍTULOS'}</p><h3>${esc(g.focus[index])}</h3><p>${esc(g.summary[index])}</p><p class="gospel-reference">${esc(g.reference.label[index])}</p></div>`).join('')}<p class="fine-print">${c.demoNote}</p></div></div></section>
  <section class="offer wrap" id="premium"><div class="section-heading"><p class="eyebrow">${c.offerLabel}</p><h2>${c.offerTitle}</h2><p class="section-intro">${c.offerText}</p></div><div class="plans">${plan(true)}${plan(false)}</div>${platformTexts(c.billing,'billing')}<div class="how"><h3>${c.next}</h3>${Object.entries(c.instructions).map(([platform,steps])=>`<ol data-for-platform="${platform}"${platform !== 'both' ? ' hidden' : ''}>${steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`).join('')}</div></section>
  <section class="faq-section wrap" id="faq"><div><p class="eyebrow">${c.faqLabel}</p><h2>${c.faqTitle}</h2></div><div class="faqs">${c.faqs.map(([q,a])=>`<details><summary>${esc(q)}<span class="plus" aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join('')}</div></section>
  <section class="final"><div class="wrap"><h2>${c.finalTitle}</h2><p>${c.finalText}</p>${actions('final')}<p class="fine-print">${c.trialMicro}</p></div></section></main>
  <footer class="footer wrap"><div><a class="brand" href="${prefix}">${mark}Fideora</a><p>${c.footer}</p></div><div class="footer-links"><a href="${legal('support')}">${c.support}</a><a href="${legal('privacy')}">${c.privacy}</a><a href="${legal('terms')}">${c.terms}</a><a href="mailto:support@fideora.app">support@fideora.app</a></div><p class="copyright">© ${new Date().getFullYear()} Fideora. ${c.rights}</p></footer>
  </body></html>`;
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


