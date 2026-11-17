import { offer, purchaseURL, applePurchaseReady } from './offer.mjs';
import { prefillContact, rememberContact, cleanAttribution, normalizeContact, contactKey, checkoutContactURL } from './order-core.mjs';
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
const entryParams = new URLSearchParams(location.search);
let storage;
try { storage = localStorage; } catch { /* Private mode can disable storage. */ }
const contact = prefillContact(location.search, storage);
nameInput.value = contact.name; emailInput.value = contact.email;
const resetContact = document.querySelector('#order-reset');
resetContact.hidden = !(contact.name || contact.email);
resetContact.addEventListener('click', () => {
  nameInput.value = ''; emailInput.value = '';
  try { storage?.removeItem(contactKey); } catch { /* The visitor can still edit the fields. */ }
  resetContact.hidden = true; errorText.hidden = true; nameInput.focus();
});
let selectedOffer = 'book', submission = 0;
function setOrderStep(step) {
  document.querySelector('#order-details-step').hidden = step !== 1;
  document.querySelector('#order-payment-step').hidden = step !== 2;
  orderDialog.setAttribute('aria-labelledby', step === 1 ? 'order-title' : 'order-payment-title');
  document.querySelectorAll('[data-order-indicator]').forEach(item => {
    if (Number(item.dataset.orderIndicator) === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
}
function submitLabel() {
  return selectedOffer === 'apple' && !applePurchaseReady() ? 'Continua sull’App Store →' : 'Continua al pagamento →';
}
function openOrder(kind) {
  selectedOffer = kind;
  submission++;
  setOrderStep(1);
  errorText.hidden = true;
  submitButton.disabled = false;
  submitButton.textContent = submitLabel();
  const apple = kind === 'apple';
  document.querySelector('[data-order-name]').textContent = apple ? 'Fideora Premium' : 'Libro + biblioteca';
  document.querySelector('[data-order-included]').textContent = apple ? 'Libro + biblioteca completa gratis' : 'Cinque opere digitali complete';
  document.querySelector('[data-order-price]').textContent = apple ? '€7,99/mese' : '€39';
  document.querySelector('#apple-device-note').hidden = !(apple && /Android/i.test(navigator.userAgent));
  document.querySelector('#apple-plan-note').hidden = !apple || applePurchaseReady();
  document.querySelector('[data-order-indicator="2"] [data-step-label]').textContent = apple && !applePurchaseReady() ? 'App Store' : 'Pagamento';
  openDialog(orderDialog);
  // The visitor confirms editable data; a URL or stored email never submits itself.
  (nameInput.value ? emailInput : nameInput).focus({ preventScroll: true });
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
        attribution: cleanAttribution(entryParams), is_test: entryParams.get('fm_test') === '1' }),
      signal: AbortSignal.timeout(22000),
    });
    const data = await response.json();
    if (!response.ok || data.ok !== true || data.offer !== chosen) throw new Error('capture_failed');
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
    paymentLink.textContent = appDownload ? 'Apri Fideora sull’App Store →' : chosen === 'apple' ? 'Continua con Apple →' : 'Vai al pagamento di €39 →';
    paymentLink.focus({ preventScroll: true });
    location.assign(target);
  } catch {
    if (submission !== currentSubmission || !orderDialog.open) return;
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
