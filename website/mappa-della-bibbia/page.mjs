import { detectedDevice, journeySession, track } from './tracking.mjs';
import { appOffer } from './social-core.mjs';
import { offer, purchaseURL, applePurchaseReady } from './offer.mjs';
import { prefillContact, rememberContact, cleanAttribution, normalizeContact, contactKey, checkoutContactURL } from './order-core.mjs';
import { initMetaPixel } from './meta-pixel.mjs';
import { initUtmifyUTMs } from './utmify.mjs';
const previewDialog = document.querySelector('.preview-dialog');
const orderDialog = document.querySelector('.order-dialog');
const zoomButton = previewDialog.querySelector('.preview-zoom');
function setZoom(active) { previewDialog.classList.toggle('zoomed', active); zoomButton.setAttribute('aria-pressed', String(active)); zoomButton.textContent = active ? 'Riduci tavola −' : 'Ingrandisci dettagli +'; }
zoomButton.addEventListener('click', () => setZoom(!previewDialog.classList.contains('zoomed')));
function openDialog(dialog) { if (!dialog.open) dialog.showModal(); document.body.classList.add('dialog-open'); }
for (const dialog of [previewDialog, orderDialog]) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
}
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
  setZoom(false);
  track('preview_open');
  const surface = previewDialog.querySelector('.preview-surface'); surface.scrollTop = 0; surface.scrollLeft = 0;
  const img = previewDialog.querySelector('img'); img.src = button.dataset.preview; img.alt = button.dataset.caption;
  previewDialog.querySelector('p').textContent = button.dataset.caption; openDialog(previewDialog);
}));
const form = document.querySelector('#study-order-form');
const nameInput = form.elements.name;
const emailInput = form.elements.email;
const submitButton = document.querySelector('#order-submit');
const paymentLink = document.querySelector('#order-payment-button');
const errorText = document.querySelector('#order-error');
const urlParams = new URLSearchParams(location.search);
const entryParams = new URLSearchParams(journeySession.attribution);
let selectedPlatform = detectedDevice === 'ios' ? 'ios' : 'android';
function choosePlatform(platform) {
  selectedPlatform = platform;
  document.querySelectorAll('[data-platform]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.platform===platform)));
  document.querySelector('[data-app-compatibility]').textContent = platform==='ios'?'Fideora Premium per iPhone e iPad':'Fideora Premium su Android e Web';
  document.querySelector('[data-app-route-note]').textContent = platform==='ios'?'Scarica Fideora dall’App Store e scegli il piano mensile da €7,99 dentro l’app. Apple mostra prezzo e rinnovo prima della conferma.':'Attiva il piano mensile su Hotmart: 3 giorni di prova gratuita, poi €7,99/mese salvo annullamento. Ricevi l’accesso via email e apri Fideora dal browser.';
}
document.querySelectorAll('[data-platform]').forEach(button=>button.addEventListener('click',()=>choosePlatform(button.dataset.platform)));
choosePlatform(selectedPlatform);
let storage;
try { storage = localStorage; } catch { /* Private mode can disable storage. */ }
const contact = prefillContact(location.search, storage);
nameInput.value = contact.name; emailInput.value = contact.email;
// Read editable prefills before stripping personal URL parameters for the vendor.
const metaPixel = initMetaPixel();
initUtmifyUTMs();
const resetContact = document.querySelector('#order-reset');
resetContact.hidden = !(contact.name || contact.email);
resetContact.addEventListener('click', () => {
  nameInput.value = ''; emailInput.value = '';
  try { storage?.removeItem(contactKey); } catch { /* The visitor can still edit the fields. */ }
  resetContact.hidden = true; errorText.hidden = true; nameInput.focus();
});
let selectedOffer = 'book', submission = 0;
// iOS Safari keeps the layout viewport tall when the virtual keyboard opens.
// Anchor the order sheet to the visible viewport, not to the covered layout area.
const compactOrderScreen = window.matchMedia('(max-width: 740px)');
function keepFocusedFieldVisible() {
  if (!orderDialog.open || !compactOrderScreen.matches) return;
  const active = document.activeElement;
  if (active !== nameInput && active !== emailInput) return;
  const rect = active.getBoundingClientRect();
  const dialogRect = orderDialog.getBoundingClientRect();
  const viewport = window.visualViewport;
  const visibleBottom = Math.min(dialogRect.bottom, (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight)) - 16;
  const visibleTop = dialogRect.top + 12;
  if (rect.bottom > visibleBottom) orderDialog.scrollTop += rect.bottom - visibleBottom + 10;
  else if (rect.top < visibleTop) orderDialog.scrollTop -= visibleTop - rect.top + 10;
}
function syncOrderViewport() {
  if (!orderDialog.open || !compactOrderScreen.matches) return;
  const viewport = window.visualViewport;
  orderDialog.style.setProperty('--order-visible-height', Math.round(viewport?.height ?? window.innerHeight) + 'px');
  orderDialog.style.setProperty('--order-visible-top', Math.max(0, Math.round(viewport?.offsetTop ?? 0)) + 'px');
  requestAnimationFrame(keepFocusedFieldVisible);
}
window.visualViewport?.addEventListener('resize', syncOrderViewport);
window.visualViewport?.addEventListener('scroll', syncOrderViewport);
window.addEventListener('resize', syncOrderViewport);
form.addEventListener('focusin', event => {
  if (event.target !== nameInput && event.target !== emailInput) return;
  orderDialog.classList.add('field-focused');
  syncOrderViewport();
});

function setOrderStep(step) {
  document.querySelector('#order-details-step').hidden = step !== 1;
  document.querySelector('#order-payment-step').hidden = step !== 2;
  orderDialog.setAttribute('aria-labelledby', step === 1 ? 'order-title' : 'order-payment-title');
  if (step === 2) { orderDialog.classList.remove('field-focused'); orderDialog.scrollTop = 0; }
  document.querySelectorAll('[data-order-indicator]').forEach(item => {
    if (Number(item.dataset.orderIndicator) === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
}
function submitLabel() {
  return selectedOffer === 'apple' && !applePurchaseReady() ? 'Continua sull’App Store →' : 'Continua al pagamento →';
}
function openOrder(kind) {
  if (kind === 'app') kind = appOffer(selectedPlatform);
  selectedOffer = kind;
  track('capture_started',kind);
  submission++;
  setOrderStep(1);
  orderDialog.classList.remove('field-focused');
  orderDialog.scrollTop = 0;
  errorText.hidden = true;
  submitButton.disabled = false;
  submitButton.textContent = submitLabel();
  const apple = kind !== 'book';
  const appleStore = kind === 'apple';
  document.querySelector('[data-order-name]').textContent = apple ? 'Fideora Premium' : 'Libro + biblioteca';
  document.querySelector('[data-order-included]').textContent = apple ? 'Libro + biblioteca completa gratis' : 'Cinque opere digitali complete';
  document.querySelector('[data-order-price]').textContent = apple ? '€7,99/mese' : '€39';
  document.querySelector('#apple-device-note').hidden = !(appleStore && detectedDevice === 'android');
  document.querySelector('#apple-plan-note').hidden = !appleStore || applePurchaseReady();
  document.querySelector('[data-order-indicator="2"] [data-step-label]').textContent = appleStore && !applePurchaseReady() ? 'App Store' : 'Pagamento';
  openDialog(orderDialog);
  // On mobile the form must be visible before Safari opens its keyboard.
  if (compactOrderScreen.matches) {
    orderDialog.querySelector('.dialog-close').focus({ preventScroll: true });
    syncOrderViewport();
  } else {
    (nameInput.value ? emailInput : nameInput).focus({ preventScroll: true });
  }
}
document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => openOrder(button.dataset.buy)));
document.querySelector('.order-back').addEventListener('click', () => openOrder(selectedOffer));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity() || submitButton.disabled) return;
  const currentSubmission = ++submission, chosen = selectedOffer;
  let details;
  try { details = normalizeContact({ name: nameInput.value, email: emailInput.value }); }
  catch (error) {
    errorText.textContent = error.message === 'invalid_name' ? 'Inserisci il tuo nome completo.' : 'Controlla il tuo indirizzo email.';
    errorText.hidden = false;
    return;
  }
  rememberContact(storage, details);
  resetContact.hidden = false;
  errorText.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Salvataggio dei tuoi dati…';
  try {
    const response = await fetch('/api/study-capture', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
      body: JSON.stringify({ ...details, offer: chosen, company: form.elements.company.value,
        attribution: cleanAttribution(entryParams), is_test: urlParams.get('fm_test') === '1', session_id: journeySession.id, platform: detectedDevice, followup_requested: true }),
      signal: AbortSignal.timeout(22000),
    });
    const data = await response.json();
    if (!response.ok || data.ok !== true || data.offer !== chosen) throw new Error('capture_failed');
    metaPixel.lead(chosen,data.journeyId);
    if (submission !== currentSubmission || !orderDialog.open) return;
    const target = checkoutContactURL(purchaseURL(chosen), chosen, details, entryParams);
    if (!target) throw new Error('checkout_unavailable');
    // Prepare an actual link before navigating, so the visitor can also continue
    // manually if an in-app browser or external App Store handoff stays here.
    setOrderStep(2);
    const appDownload = chosen === 'apple' && !applePurchaseReady();
    document.querySelector('#order-payment-title').textContent = appDownload ? 'Apri Fideora sull’App Store.' : 'Continua con il tuo ordine.';
    document.querySelector('#order-payment-note').textContent = appDownload
      ? 'I tuoi dati sono salvati. Scarica o apri Fideora su iPhone o iPad e scegli un piano nell’app. Apple mostra prezzo e rinnovo prima della conferma. Se l’App Store non si apre, tocca il pulsante qui sotto.'
      : 'I tuoi dati sono salvati. Ti stiamo portando al pagamento sicuro. Se non si apre automaticamente, continua con il pulsante qui sotto.';
    paymentLink.href = target;
    paymentLink.textContent = appDownload ? 'Apri Fideora sull’App Store →' : chosen === 'apple' ? 'Continua con Apple →' : chosen === 'android' ? 'Continua su Hotmart →' : 'Vai al pagamento di €39 →';
    paymentLink.focus({ preventScroll: true });
    track(appDownload ? 'store_click' : 'checkout_click',chosen);
    metaPixel.outbound(chosen);
    location.assign(target);
  } catch {
    if (submission !== currentSubmission || !orderDialog.open) return;
    track('capture_error',chosen);
    errorText.textContent = 'Non siamo riusciti a salvare i tuoi dati. Controlla la connessione e riprova: non è stato effettuato alcun addebito.';
    errorText.hidden = false;
  } finally {
    if (submission === currentSubmission) {
      submitButton.disabled = false;
      submitButton.textContent = submitLabel();
    }
  }
});
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

// Signed recovery links restore editable details; opening a link never submits an order.
const resume = urlParams.get('resume');
if (resume) {
  fetch('/api/study-resume',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:resume}),signal:AbortSignal.timeout(12000)})
    .then(response=>response.ok?response.json():null).then(data=>{
      if(!data?.ok)return;
      const details=normalizeContact(data);nameInput.value=details.name;emailInput.value=details.email;resetContact.hidden=false;
      if(data.offer!=='book')choosePlatform(data.offer==='ios'?'ios':'android');
      openOrder(data.offer==='book'?'book':data.offer==='ios'?'apple':'android');track('resume_open',selectedOffer);
      const clean=new URL(location.href);clean.searchParams.delete('resume');history.replaceState(null,'',clean);
    }).catch(()=>{ /* The normal editable order remains available if the link expires. */ });
}
paymentLink.addEventListener('click',()=>{track(selectedOffer==='apple'?'store_click':'checkout_click',selectedOffer);metaPixel.outbound(selectedOffer);});


// Black Friday campaign deadline is 00:00 CET on November 25 (end of Nov 24 in Italy).
// Never reset the countdown on refresh or use the visitor's timezone as the offer timezone.
const bfBar = document.querySelector('#bf-promo');
if (bfBar) {
  const deadline = Date.parse('2026-11-25T00:00:00+01:00');
  const counter = bfBar.querySelector('[data-bf-clock]');
  let timer;
  function refreshBfCountdown() {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      bfBar.hidden = true;
      if (timer) clearInterval(timer);
      return;
    }
    const d = Math.floor(remaining / 86400000);
    const h = Math.floor(remaining / 3600000) % 24;
    const m = Math.floor(remaining / 60000) % 60;
    const s = Math.floor(remaining / 1000) % 60;
    counter.textContent = d + 'g ' + String(h).padStart(2, '0') + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
  }
  refreshBfCountdown();
  if (!bfBar.hidden) timer = window.setInterval(refreshBfCountdown, 1000);
}

// Swipeable testimonials on mobile, discreet arrow controls on larger screens.
const reviewsTrack = document.querySelector('[data-reviews-track]');
if (reviewsTrack) {
  const previous = document.querySelector('[data-review-previous]');
  const next = document.querySelector('[data-review-next]');
  const updateReviewButtons = () => {
    const maxScroll = Math.max(0, reviewsTrack.scrollWidth - reviewsTrack.clientWidth);
    previous.disabled = reviewsTrack.scrollLeft < 5;
    next.disabled = reviewsTrack.scrollLeft >= maxScroll - 5;
  };
  const moveReview = direction => {
    const card = reviewsTrack.querySelector('.review-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(reviewsTrack).gap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    reviewsTrack.scrollBy({
      left: direction * distance,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };
  previous.addEventListener('click', () => moveReview(-1));
  next.addEventListener('click', () => moveReview(1));
  reviewsTrack.addEventListener('scroll', updateReviewButtons, { passive: true });
  window.addEventListener('resize', updateReviewButtons);
  requestAnimationFrame(updateReviewButtons);
}
