(() => {
  'use strict';

  const config = {
  "origin": "https://fideora.app",
  "appleId": "6825337165",
  "hotjarSite": 6850260,
  "pixel": "2184650478741381",
  "families": [
    "mdb",
    "mdc",
    "ldj",
    "mdn",
    "apc"
  ],
  "aliases": {},
  "path": "/obrigado-fideora.html",
  "providerToken": "129505215",
  "collector": "https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-api-core?action=app-thanks-collect"
};
  if (location.origin !== config.origin || location.pathname !== config.path) return;

  const params = new URLSearchParams(location.search);
  const marketAliases = { es: 'esp', cz: 'rc', cs: 'rc', rc: 'rc' };
  const markets = new Set(['it', 'fr', 'al', 'de', 'esp', 'en', 'br', 'pt', 'rc', 'jap']);
  const locales = new Set(['pt-BR', 'pt-PT', 'en', 'it', 'fr', 'es', 'de', 'cs']);
  const isTest = params.get('fm_test') === '1';

  function funnelFromUrl() {
    const input = (params.get('funil') || params.get('funnel') || '').toLowerCase().trim().replaceAll('_', '-');
    const [first, suffix] = input.split('-');
    const family = Object.hasOwn(config.aliases, first) ? config.aliases[first] : first;
    if (!config.families.includes(family)) return 'generic';
    const market = Object.hasOwn(marketAliases, suffix) ? marketAliases[suffix] : suffix;
    return markets.has(market) ? `${family}-${market}` : family;
  }

  const texts = {
    'pt-BR': ['Privacidade', 'Preferências de privacidade', 'Escolha se podemos analisar a navegação nesta página.', 'Gravações de sessão (Hotjar)', 'Medição de anúncios (Meta)', 'Salvar escolhas', 'Agora não'],
    'pt-PT': ['Privacidade', 'Preferências de privacidade', 'Escolhe se podemos analisar a navegação nesta página.', 'Gravações de sessão (Hotjar)', 'Medição de anúncios (Meta)', 'Guardar escolhas', 'Agora não'],
    en: ['Privacy', 'Privacy preferences', 'Choose whether we may analyze visits to this page.', 'Session recordings (Hotjar)', 'Ad measurement (Meta)', 'Save choices', 'Not now'],
    it: ['Privacy', 'Preferenze sulla privacy', 'Scegli se possiamo analizzare la navigazione su questa pagina.', 'Registrazioni delle sessioni (Hotjar)', 'Misurazione degli annunci (Meta)', 'Salva le scelte', 'Non ora'],
    fr: ['Confidentialité', 'Préférences de confidentialité', 'Choisissez si nous pouvons analyser la navigation sur cette page.', 'Enregistrements des sessions (Hotjar)', 'Mesure des publicités (Meta)', 'Enregistrer mes choix', 'Pas maintenant'],
    es: ['Privacidad', 'Preferencias de privacidad', 'Elige si podemos analizar la navegación en esta página.', 'Grabaciones de sesiones (Hotjar)', 'Medición de anuncios (Meta)', 'Guardar preferencias', 'Ahora no'],
    de: ['Datenschutz', 'Datenschutzeinstellungen', 'Wähle, ob wir die Nutzung dieser Seite analysieren dürfen.', 'Sitzungsaufzeichnungen (Hotjar)', 'Werbemessung (Meta)', 'Auswahl speichern', 'Jetzt nicht'],
    cs: ['Soukromí', 'Nastavení soukromí', 'Vyberte, zda můžeme analyzovat návštěvy této stránky.', 'Záznamy relací (Hotjar)', 'Měření reklam (Meta)', 'Uložit volby', 'Teď ne'],
  };

  function start() {
    const root = document.documentElement;
    const funnel = funnelFromUrl();
    const locale = locales.has(root.lang) ? root.lang : 'en';
    const device = ['ios', 'android'].includes(root.dataset.device) ? root.dataset.device : 'desktop';
    const campaign = `ty_${funnel.replaceAll('-', '_')}`;
    const privateBrowsing = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
    const sensitiveUrl = [...params.keys()].some(key => /^(code|access_token|refresh_token|token)$/i.test(key)) ||
      /(?:access_token|refresh_token)=/i.test(location.hash);
    const viewId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : '';
    const sent = new Set();
    const pixel = config.pixel;
    let metaActive = false;
    let hotjarActive = false;

    function track(event, store = '') {
      if (!viewId || privateBrowsing || sensitiveUrl || sent.has(`${event}:${store}`)) return;
      sent.add(`${event}:${store}`);
      const body = JSON.stringify({ path: config.path, event, store, view_id: viewId, funnel, locale, device, is_test: isTest });
      fetch(config.collector, {
        method: 'POST',
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
        credentials: 'omit', keepalive: true, referrerPolicy: 'no-referrer', body,
      }).catch(() => {});
      return true;
    }

    for (const link of document.querySelectorAll('[data-store] a')) {
      const store = link.closest('[data-store]').dataset.store === 'ios' ? 'apple' : 'google';
      if (store === 'apple') {
        const target = new URL(link.href);
        if (target.hostname === 'apps.apple.com' && target.pathname.endsWith(`id${config.appleId}`)) {
          target.searchParams.set('pt', config.providerToken);
          target.searchParams.set('ct', campaign);
          target.searchParams.set('mt', '8');
          link.href = target.href;
        }
      }
      link.addEventListener('click', () => {
        if (!link.hasAttribute('href') || !track('store_click', store)) return;
        if (hotjarActive) window.hj('event', `thanks_${store}_click`);
        if (metaActive) window.fbq('trackSingleCustom', pixel, store === 'apple' ? 'AppStoreClick' : 'GooglePlayClick');
      });
    }
    track('page_view');

    const hasHotjar = /^\d{6,9}$/.test(String(config.hotjarSite));
    const hasMeta = !isTest && /^\d{10,20}$/.test(pixel);
    if (privateBrowsing || sensitiveUrl || (!hasHotjar && !hasMeta)) return;

    function prepareVendorUrl() {
      const clean = new URL(config.path, config.origin);
      if (funnel !== 'generic') clean.searchParams.set('funil', funnel);
      if (params.has('lang')) clean.searchParams.set('lang', locale);
      if (isTest) clean.searchParams.set('fm_test', '1');
      try {
        history.replaceState(history.state, '', clean);
        return true;
      } catch {
        return false;
      }
    }

    function loadScript(url) {
      const script = document.createElement('script');
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      script.src = url;
      document.head.append(script);
    }

    function startHotjar() {
      if (hotjarActive || !hasHotjar || !prepareVendorUrl()) return;
      hotjarActive = true;
      window.hj ||= function () { (window.hj.q ||= []).push(arguments); };
      window._hjSettings = { hjid: Number(config.hotjarSite), hjsv: 6 };
      loadScript(`https://static.hotjar.com/c/hotjar-${config.hotjarSite}.js?sv=6`);
      window.hj('event', isTest ? 'fm_test' : 'app_thank_you');
    }

    function startMeta() {
      if (metaActive || !hasMeta || !prepareVendorUrl()) return;
      metaActive = true;
      if (!window.fbq) {
        const queue = window.fbq = function () {
          if (queue.callMethod) queue.callMethod.apply(queue, arguments);
          else queue.queue.push(arguments);
        };
        window._fbq = queue;
        queue.push = queue;
        queue.loaded = true;
        queue.version = '2.0';
        queue.queue = [];
        loadScript('https://connect.facebook.net/en_US/fbevents.js');
      }
      window.fbq('set', 'autoConfig', false, pixel);
      window.fbq('init', pixel);
      window.fbq('trackSingleCustom', pixel, 'AppThankYouView');
    }

    const [privacy, title, intro, hotjarLabel, metaLabel, saveLabel, declineLabel] = texts[locale];
    const key = 'fm-app-thanks-privacy-v1';
    let preferences = null;
    try { preferences = JSON.parse(localStorage.getItem(key)); } catch {}

    const section = document.createElement('section');
    section.className = 'fm-thanks-privacy';
    section.setAttribute('data-hj-suppress', '');
    section.innerHTML = '<button class="fm-privacy-open" type="button"></button><div class="fm-privacy-options" hidden><strong></strong><p></p><label data-vendor="hotjar"><input type="checkbox"><span></span></label><label data-vendor="meta"><input type="checkbox"><span></span></label><div class="fm-privacy-actions"><button type="button" data-save></button><button type="button" data-decline></button></div></div>';
    const open = section.querySelector('.fm-privacy-open');
    const panel = section.querySelector('.fm-privacy-options');
    const hotjar = panel.querySelector('[data-vendor="hotjar"]');
    const meta = panel.querySelector('[data-vendor="meta"]');
    const hotjarChoice = hotjar.querySelector('input');
    const metaChoice = meta.querySelector('input');
    open.textContent = privacy;
    panel.querySelector('strong').textContent = title;
    panel.querySelector('p').textContent = intro;
    hotjar.hidden = !hasHotjar;
    meta.hidden = !hasMeta;
    hotjar.querySelector('span').textContent = hotjarLabel;
    meta.querySelector('span').textContent = metaLabel;
    panel.querySelector('[data-save]').textContent = saveLabel;
    panel.querySelector('[data-decline]').textContent = declineLabel;
    hotjarChoice.checked = preferences?.hotjar === true;
    metaChoice.checked = preferences?.meta === true;
    open.addEventListener('click', () => { panel.hidden = !panel.hidden; open.setAttribute('aria-expanded', String(!panel.hidden)); });

    function choose(next) {
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      panel.hidden = true;
      open.setAttribute('aria-expanded', 'false');
      if ((hotjarActive && !next.hotjar) || (metaActive && !next.meta)) {
        location.reload();
        return;
      }
      if (next.hotjar) startHotjar();
      if (next.meta) startMeta();
    }

    panel.querySelector('[data-save]').addEventListener('click', () => choose({ hotjar: hotjarChoice.checked, meta: metaChoice.checked }));
    panel.querySelector('[data-decline]').addEventListener('click', () => {
      hotjarChoice.checked = false;
      metaChoice.checked = false;
      choose({ hotjar: false, meta: false });
    });
    document.querySelector('main').append(section);
    panel.hidden = !!preferences;
    open.setAttribute('aria-expanded', String(!panel.hidden));
    if (preferences?.hotjar === true) startHotjar();
    if (preferences?.meta === true) startMeta();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
