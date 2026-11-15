import { detectPlatform, campaignParams, platformURL } from './platform.mjs';
const current = new URL(window.location.href);
const locale = document.documentElement.lang.startsWith('pt') ? 'pt' : 'it';
// The existing apex email redirect forwards only auth data to the same-origin PWA.
if (/access_token=|refresh_token=|error_description=/.test(current.hash) || current.searchParams.has('code')) {
  const code = current.searchParams.get('code');
  window.location.replace('/app/' + (code ? '?code=' + encodeURIComponent(code) : current.hash));
} else if (current.searchParams.get('lang') === 'pt' && current.pathname === '/') {
  current.pathname = '/pt/'; current.searchParams.delete('lang');
  window.location.replace(current.pathname + current.search + current.hash);
}
let platform = detectPlatform(navigator, current.searchParams.get('platform'));
function applyPlatform(choice) {
  platform = choice;
  document.querySelectorAll('[data-for-platform]').forEach(el => { el.hidden = el.dataset.forPlatform !== platform; });
  document.querySelectorAll('[data-platform-link]').forEach(link => {
    link.hidden = platform !== 'both' && link.dataset.destination !== platform;
    link.href = platformURL({ platform: link.dataset.destination, lang: locale, currentURL: current.href, position: link.dataset.platformLink, plan: link.dataset.plan });
  });
  document.querySelectorAll('input[name="platform"]').forEach(input => { input.checked = input.value === platform; });
  document.querySelectorAll('.languages a').forEach(link => {
    const target = new URL(link.href);
    target.search = campaignParams(current.searchParams).toString();
    if (platform !== 'both') target.searchParams.set('platform', platform);
    link.href = target.href;
  });
}
applyPlatform(platform);
// Keep the chosen language for the post-checkout return to this same-origin app.
document.querySelectorAll('[data-platform-link]').forEach(link => link.addEventListener('click', () => {
  if (link.dataset.destination === 'android') { try { localStorage.setItem('fideoraLanguage', locale); } catch {} }
}));
document.querySelectorAll('input[name="platform"]').forEach(input => input.addEventListener('change', () => {
  if (!input.checked) return;
  current.searchParams.set('platform', input.value);
  history.replaceState(null, '', current.pathname + current.search + current.hash);
  applyPlatform(input.value);
}));
document.querySelectorAll('[data-access]').forEach(link => {
  link.href = platformURL({ platform: 'android', lang: locale, currentURL: current.href, position: 'returning', intent: 'access' });
});
// Each product tour has its own accessible keyboard navigation.
document.querySelectorAll('[role="tablist"]').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });
});
const screenDialog = document.querySelector('.screen-dialog');
if (screenDialog?.showModal) document.querySelectorAll('[data-zoom]').forEach(link => {
  link.addEventListener('click', event => {
    const img = link.querySelector('img');
    if (!img || !/^\/assets\/app-[a-z]+\.jpg$/.test(new URL(link.href).pathname)) return;
    event.preventDefault();
    const full = screenDialog.querySelector('img');
    full.src = link.href; full.alt = img.alt;
    screenDialog.querySelector('p').textContent = img.alt;
    screenDialog.showModal();
  });
});
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('reveal-enter'); reveal.unobserve(entry.target);
    }
  }, { threshold: .1 });
  document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
  const motion = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: .05 });
  document.querySelectorAll('[data-motion]').forEach(el => motion.observe(el));
}
// Update the old root offline worker without clearing personal data or the /app worker.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async registrations => {
    for (const registration of registrations) {
      if (new URL(registration.active?.scriptURL || registration.waiting?.scriptURL || location.origin).pathname === '/sw.js') await registration.update();
    }
  }).catch(() => {});
}
