import React, { useEffect, useState } from 'react';
import { BookOpen, Heart, PenLine, RefreshCw, ArrowUpRight, Mail, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mark, Modal } from '../components/UI';
import Profile from '../components/Profile';
import { webRequest, validCheckout } from './api';
import { supabase } from '../lib/supabase';
export function InstallApp() {
  const { l } = useLanguage();
  const [prompt, setPrompt] = useState(null), [help, setHelp] = useState(false), [installed, setInstalled] = useState(false);
  useEffect(() => {
    setInstalled(window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true);
    const offer = event => { event.preventDefault(); setPrompt(event); };
    const done = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', offer); window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', offer); window.removeEventListener('appinstalled', done); };
  }, []);
  if (installed) return null;
  return <div className="web-install"><button className="text-button" onClick={async () => {
    if (prompt) { await prompt.prompt(); setPrompt(null); } else setHelp(!help);
  }}><Download size={16}/>{l('Aggiungi alla schermata iniziale', 'Adicionar à tela inicial')}</button>
    {help && <p role="status">{l('Su Android: apri questa pagina in Chrome, tocca ⋮ e scegli “Aggiungi a schermata Home” o “Installa app”.', 'No Android: abra esta página no Chrome, toque em ⋮ e escolha “Adicionar à tela inicial” ou “Instalar app”.')}</p>}</div>;
}
export default function WebGate() {
  const { l, language, changeLanguage } = useLanguage();
  const { user, loading, sendMagicLink, verifyEmailCode } = useAuth();
  const { refresh, checking, webError } = usePremium();
  const [plans, setPlans] = useState(null), [configError, setConfigError] = useState(false);
  const [panel, setPanel] = useState(false), [email, setEmail] = useState(''), [code, setCode] = useState('');
  const [sent, setSent] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const [selected, setSelected] = useState('annual');
  const reviewLogin = new URLSearchParams(window.location.search).get('review') === 'hotmart';
  const [password, setPassword] = useState('');
  const loadPlans = () => { setConfigError(false); webRequest('plans', false).then(v => setPlans(v.plans || [])).catch(() => { setPlans([]); setConfigError(true); }); };
  useEffect(loadPlans, []);
  const available = (plans || []).filter(p => validCheckout(p.checkoutUrl));
  const chosen = available.find(p => p.key === selected) || available[0];
  const act = async fn => { setBusy(true); setMessage(''); try { await fn(); } catch { setMessage(l('Operazione non riuscita. Controlla i dati e riprova.', 'Não foi possível concluir. Confira os dados e tente novamente.')); } finally { setBusy(false); } };
  return <main className="hard-paywall-gate web-gate"><section className="hard-paywall-card" aria-labelledby="access-heading">
    <Mark/><p className="eyebrow">MAPPA DELLA BIBBIA · FIDEORA</p>
    <h1 id="access-heading">{l('Comprendi ciò che leggi.', 'Compreenda o que você lê.')}</h1>
    <p>{l('La tua Mappa della Bibbia, ogni giorno. Leggi, comprendi e prega anche dal tuo Android.', 'Seu Mapa da Bíblia, todos os dias. Leia, compreenda e reze também pelo seu Android.')}</p>
    <ul className="hard-paywall-benefits"><li><BookOpen size={20}/>{l('La Mappa di Matteo e i quattro Vangeli', 'O Mapa de Mateus e os quatro Evangelhos')}</li><li><PenLine size={20}/>{l('Il tuo Quaderno di riflessioni', 'Seu Caderno de reflexões')}</li><li><Heart size={20}/>{l('Lettura e preghiera guidata', 'Leitura e oração guiada')}</li></ul>
    {!user ? <form className="web-login" onSubmit={event => { event.preventDefault(); void act(async () => { if (reviewLogin) { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; } else { await sendMagicLink({ email, locale: language }); setSent(true); } }); }}>
      <label htmlFor="web-email">{l('Accedi con la tua email', 'Acesse com seu e-mail')}</label>
      <input id="web-email" type="email" autoComplete="email" required value={email} disabled={busy} onChange={e => { setEmail(e.target.value); setSent(false); }}/>
      {reviewLogin && <><label htmlFor="web-review-password">Password</label><input id="web-review-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={busy}/></>}
      <button className="button primary wide" disabled={loading || busy}><Mail size={17}/>{reviewLogin ? l('Accedi', 'Entrar') : sent ? l('Invia di nuovo', 'Enviar novamente') : l('Continua con email', 'Continuar com e-mail')}</button>
      {sent && <div className="web-code"><p role="status">{l('Controlla la tua email. Copia qui il codice oppure il link ricevuto per accedere su questo telefono.', 'Confira seu e-mail. Cole aqui o código ou o link recebido para entrar neste celular.')}</p><label htmlFor="web-code">{l('Codice o link ricevuto', 'Código ou link recebido')}</label><input id="web-code" autoComplete="one-time-code" maxLength={2048} value={code} onChange={e => setCode(e.target.value)} disabled={busy}/><button type="button" className="button secondary wide" disabled={busy || code.trim().length < 6} onClick={() => void act(() => verifyEmailCode(email, code))}>{l('Conferma accesso', 'Confirmar acesso')}</button></div>}
      <p className="caption">{l('Usa la stessa email dell’acquisto Hotmart. Il primo accesso crea il tuo account Fideora. Accedere non attiva alcun pagamento.', 'Use o mesmo e-mail da compra na Hotmart. O primeiro acesso cria sua conta Fideora. Entrar não inicia nenhuma cobrança.')}</p>
    </form> : <div className="web-plans"><p className="web-email">{user.email}</p>
      {available.length > 0 ? <><div className="web-plan-list">{available.map(plan => <button className={`web-plan ${chosen?.key === plan.key ? 'selected' : ''}`} key={plan.key} onClick={() => setSelected(plan.key)} aria-pressed={chosen?.key === plan.key}><span>{plan.trialDays > 0 ? l(`${plan.trialDays} giorni gratis`, `${plan.trialDays} dias grátis`) : plan.key === 'annual' ? l('Annuale', 'Anual') : l('Mensile', 'Mensal')}</span><small>{new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'pt-BR', { style: 'currency', currency: plan.currency }).format(plan.amount)}{plan.key === 'annual' ? l(' / anno', ' / ano') : l(' / mese', ' / mês')}</small></button>)}</div><button className="button primary wide" disabled={busy} onClick={() => {
        if (!chosen || !validCheckout(chosen.checkoutUrl)) return;
        // Payment email is explicitly visible here and editable at checkout. Access follows the verified buyer email.
        window.location.assign(chosen.checkoutUrl);
      }}>{chosen?.trialDays > 0 ? l(`Prova gratis per ${chosen.trialDays} giorni`, `Teste grátis por ${chosen.trialDays} dias`) : l('Continua su Hotmart', 'Continuar na Hotmart')}<ArrowUpRight size={17}/></button><p className="caption">{l('Nel pagamento usa la stessa email mostrata qui. Dopo la prova si rinnova al prezzo indicato. Puoi annullare il rinnovo su Hotmart prima del primo addebito.', 'No pagamento, use o mesmo e-mail exibido aqui. Preço final, eventual teste e renovação aparecem na Hotmart antes da confirmação.')}</p></> : <p className="web-pending" role="status">{configError ? l('I piani non sono disponibili al momento. Riprova tra poco.', 'Os planos estão indisponíveis no momento. Tente novamente em instantes.') : plans === null ? l('Caricamento dei piani…', 'Carregando planos…') : l('Stiamo preparando gli abbonamenti per Android. Se hai già acquistato, verifica il tuo accesso qui sotto.', 'Estamos preparando as assinaturas para Android. Se você já comprou, verifique seu acesso abaixo.')}</p>}
      <button className="button secondary wide" disabled={checking || busy} onClick={() => void act(async () => { const active = await refresh(); if (!active) setMessage(l('Nessun abbonamento attivo trovato per questa email. Se hai appena pagato, attendi qualche istante e riprova.', 'Nenhuma assinatura ativa encontrada para este e-mail. Se você acabou de pagar, aguarde alguns instantes e tente novamente.')); })}><RefreshCw size={16}/>{checking ? l('Verifica…', 'Verificando…') : l('Ho già acquistato · Verifica accesso', 'Já comprei · Verificar acesso')}</button>
      <button className="text-button" onClick={() => setPanel(true)}>{l('Account e dati', 'Conta e dados')}</button></div>}
    {(message || webError) && <p className="billing-message" role="status">{message || l('Non è stato possibile verificare l’accesso. Controlla la connessione e riprova.', 'Não foi possível verificar seu acesso. Confira a conexão e tente novamente.')}</p>}
    {configError && <button className="text-button" onClick={loadPlans}>{l('Ricarica piani', 'Recarregar planos')}</button>}
    <InstallApp/><footer className="hard-paywall-links"><a href={`/terms.html?lang=${language}`}>{l('Termini', 'Termos')}</a><a href={`/privacy.html?lang=${language}`}>{l('Privacy', 'Privacidade')}</a><a href={`mailto:support@fideora.app`}>{l('Aiuto', 'Ajuda')}</a></footer>
    <select aria-label={l('Lingua', 'Idioma')} value={language} onChange={e => changeLanguage(e.target.value)}><option value="it">Italiano</option><option value="pt">Português</option></select>
  </section>{panel && <Modal title={l('Account e dati', 'Conta e dados')} wide onClose={() => setPanel(false)}><Profile restricted onLegal={kind => window.location.assign(`/${kind}.html?lang=${language}`)} onSources={() => {}}/></Modal>}</main>;
}
