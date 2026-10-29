import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, Heart, PenLine, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium } from "../contexts/PremiumContext";
import { Mark, Modal } from "./UI";
import { PremiumMessage } from "./Premium";
import Profile from "./Profile";

export default function HardPaywallGate({ checking }) {
  const { user } = useAuth();
  const { language, changeLanguage, l } = useLanguage();
  const { request, restore, busy, preparing } = usePremium();
  const [panel, setPanel] = useState(null);
  const attempted = useRef();
  const owner = user?.id || "guest";
  const showPlans = useCallback(() => request("welcome", { hardPaywall: true }), [request]);
  useEffect(() => {
    if (checking || busy || attempted.current === owner) return;
    attempted.current = owner;
    showPlans();
  }, [checking, busy, owner, showPlans]);
  const pending = checking || busy;
  return (
    <main className="hard-paywall-gate">
      <section className="hard-paywall-card" aria-labelledby="access-heading">
        <Mark />
        <p className="eyebrow">FIDEORA PREMIUM</p>
        <h1 id="access-heading">{l("Il tuo cammino comincia qui.", "Sua caminhada começa aqui.")}</h1>
        <p>{l(
          "Uno spazio per leggere, comprendere e vivere la tua fede, ogni giorno. Scegli un abbonamento per iniziare.",
          "Um espaço para ler, compreender e viver sua fé, todos os dias. Escolha uma assinatura para começar.",
        )}</p>
        <ul className="hard-paywall-benefits">
          <li><BookOpen size={20} />{l("Lettura della Bibbia", "Leitura da Bíblia")}</li>
          <li><PenLine size={20} />{l("Studio e riflessioni personali", "Estudo e reflexões pessoais")}</li>
          <li><Heart size={20} />{l("Preghiera guidata", "Oração guiada")}</li>
        </ul>
        {pending && <p role="status" aria-live="polite">
          {checking ? l("Verifica dell’accesso…", "Verificando seu acesso…") : preparing ? l("Apertura dei piani…", "Abrindo os planos…") : l("Attendi…", "Aguarde…")}
        </p>}
        <PremiumMessage />
        <button className="button primary wide" disabled={pending} onClick={showPlans}>
          {l("Scopri i piani", "Ver planos")}<ArrowUpRight size={17} />
        </button>
        <button className="text-button" disabled={pending} onClick={restore}>
          <RefreshCw size={15} />{l("Ripristina acquisti", "Restaurar compras")}
        </button>
        <p className="caption">{l(
          "Un abbonamento o una prova idonea attiva sblocca Fideora. Prezzi e condizioni sono indicati prima della conferma Apple.",
          "Uma assinatura ou um teste elegível ativo libera o Fideora. Preços e condições são apresentados antes da confirmação da Apple.",
        )}</p>
        <footer className="hard-paywall-links">
          <button className="text-button" disabled={busy} onClick={() => setPanel("account")}>{l("Account e dati", "Conta e dados")}</button>
          <button className="text-button" disabled={busy} onClick={() => setPanel("terms")}>{l("Termini", "Termos")}</button>
          <button className="text-button" disabled={busy} onClick={() => setPanel("privacy")}>{l("Privacy", "Privacidade")}</button>
          <button className="text-button" disabled={busy} onClick={() => setPanel("support")}>{l("Aiuto", "Ajuda")}</button>
        </footer>
        <label className="sr-only" htmlFor="gate-language">{l("Lingua", "Idioma")}</label>
        <select id="gate-language" value={language} disabled={pending} onChange={(e) => changeLanguage(e.target.value)}>
          <option value="it">Italiano</option><option value="pt">Português</option>
        </select>
      </section>
      {panel && <Modal title={panel === "account" ? l("Account e dati", "Conta e dados") : "Fideora"} wide onClose={() => setPanel(null)}>
        {panel === "account" ? <Profile restricted onLegal={setPanel} onSources={() => setPanel("support")} /> : <iframe
          title={panel}
          src={`/${panel}.html?lang=${language}`}
          className="legal-frame"
        />}
      </Modal>}
    </main>
  );
}
