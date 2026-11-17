import { offer, purchaseURL } from './offer.mjs';
const previewDialog = document.querySelector('.preview-dialog');
const launchDialog = document.querySelector('.launch-dialog');
const zoomButton = previewDialog.querySelector('.preview-zoom');
function setZoom(active) { previewDialog.classList.toggle('zoomed', active); zoomButton.setAttribute('aria-pressed', String(active)); zoomButton.textContent = active ? 'Riduci tavola −' : 'Ingrandisci dettagli +'; }
zoomButton.addEventListener('click', () => setZoom(!previewDialog.classList.contains('zoomed')));
function openDialog(dialog) { dialog.showModal(); document.body.classList.add('dialog-open'); }
for (const dialog of [previewDialog, launchDialog]) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
}
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
  setZoom(false);
  const surface = previewDialog.querySelector('.preview-surface'); surface.scrollTop = 0; surface.scrollLeft = 0;
  const img = previewDialog.querySelector('img'); img.src = button.dataset.preview; img.alt = button.dataset.caption;
  previewDialog.querySelector('p').textContent = button.dataset.caption; openDialog(previewDialog);
}));
document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
  const target = purchaseURL(button.dataset.buy);
  if (target) { location.assign(target); return; }
  const android = /Android/i.test(navigator.userAgent);
  document.querySelector('#apple-device-note').hidden = !(android && button.dataset.buy === 'apple');
  openDialog(launchDialog);
}));
// All sample pages remain reachable on mobile without horizontal overflow.
const gallery = document.querySelector('.preview-gallery');
const samples = [...gallery.querySelectorAll('.page-preview')];
const switcher = document.createElement('div'); switcher.className = 'preview-switcher'; switcher.setAttribute('role', 'group'); switcher.setAttribute('aria-label', 'Scegli una pagina campione');
samples.forEach((sample, index) => {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = String(index + 1); button.setAttribute('aria-label', `Pagina campione ${index + 1}`); button.setAttribute('aria-pressed', String(index === 0));
  button.addEventListener('click', () => { samples.forEach((item, n) => { item.classList.toggle('mobile-selected', n === index); }); switcher.querySelectorAll('button').forEach((item, n) => item.setAttribute('aria-pressed', String(n === index))); });
  switcher.append(button);
});
gallery.after(switcher);
const mobileStyle = document.createElement('style'); mobileStyle.textContent = '@media(max-width:740px){.preview-gallery:has(.mobile-selected) .page-preview{display:none}.preview-gallery .page-preview.mobile-selected{display:block}}'; document.head.append(mobileStyle);
// No purchase state is inferred from URL parameters or a thank-you redirect.
document.documentElement.dataset.offerStatus = offer.status;
