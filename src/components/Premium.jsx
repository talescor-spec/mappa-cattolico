import React from "react";
import { Crown, Lock, ArrowUpRight, RefreshCw } from "lucide-react";
import { usePremium } from "../contexts/PremiumContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Modal } from "./UI";
const labels = {
  bible: ["Esplora le Scritture, al tuo ritmo.", "Explore as Escrituras, no seu ritmo."],
  search: ["Ritrova la Parola che cerchi.", "Encontre a Palavra que procura."],
  annotations: [
    "Dai spazio alle tue riflessioni.",
    "Dê espaço às suas reflexões.",
  ],
  bookmarks: [
    "Custodisci i versetti che contano.",
    "Guarde os versículos que importam.",
  ],
  notebook: [
    "Trasforma una lettura in uno studio.",
    "Transforme uma leitura em um estudo.",
  ],
  guides: ["Leggi con più contesto.", "Leia com mais contexto."],
  lexicon: [
    "Avvicinati alle parole delle origini.",
    "Aproxime-se das palavras das origens.",
  ],
  rosary: [
    "Un Rosario guidato, un grano alla volta.",
    "Um Rosário guiado, uma conta por vez.",
  ],
  devotions: [
    "Coltiva una preghiera costante.",
    "Cultive uma oração constante.",
  ],
  welcome: [
    "Il tuo cammino può cominciare qui.",
    "Sua caminhada pode começar aqui.",
  ],
};
export function PremiumMessage() {
  const { message } = usePremium();
  const { l } = useLanguage();
  const messages = {
    platform: [
      "Gli abbonamenti sono disponibili nell’app iOS. Puoi continuare con la lettura gratuita.",
      "As assinaturas estão disponíveis no app iOS. Você pode continuar com a leitura gratuita.",
    ],
    unavailable: [
      "I piani non sono disponibili in questo momento. Riprova più tardi: non è stato effettuato alcun acquisto.",
      "Os planos estão indisponíveis no momento. Tente mais tarde: nenhuma compra foi realizada.",
    ],
    error: [
      "Non è stato possibile verificare l’abbonamento. Riprova o usa Ripristina acquisti.",
      "Não foi possível verificar a assinatura. Tente novamente ou use Restaurar compras.",
    ],
    "nothing-restored": [
      "Nessun abbonamento Premium attivo trovato per questo account Apple.",
      "Nenhuma assinatura Premium ativa encontrada para esta conta Apple.",
    ],
    active: ["Fideora Premium è attivo.", "Fideora Premium está ativo."],
  };
  return messages[message] ? (
    <p role="status" className="billing-message">
      {l(...messages[message])}
    </p>
  ) : null;
}
export function PremiumCard({ feature = "bible", compact = false }) {
  const { request, checking, busy } = usePremium();
  const { l } = useLanguage();
  return (
    <section className={`premium-card ${compact ? "compact" : ""}`}>
      <span className="premium-label">
        <Crown size={15} /> FIDEORA PREMIUM
      </span>
      <h3>{l(...(labels[feature] || labels.bible))}</h3>
      <p>
        {l(
          "Lettura, studio e preghiera in un unico spazio. La lettura del giorno rimane gratuita.",
          "Leitura, estudo e oração em um único lugar. A leitura do dia continua gratuita.",
        )}
      </p>
      <button
        className="button primary"
        disabled={checking || busy}
        onClick={() => request(feature)}
      >
        <Lock size={15} />
        {l("Scopri Premium", "Conhecer Premium")}
        <ArrowUpRight size={15} />
      </button>
    </section>
  );
}
export function PremiumOffer() {
  const { offer, close, subscribe, restore, busy, preparing } = usePremium();
  const { l } = useLanguage();
  if (preparing) return (
    <div className="checkout-status" role="status" aria-live="polite">
      <RefreshCw size={16} aria-hidden="true" />
      {l("Verifica in corso…", "Verificando…")}
    </div>
  );
  if (!offer) return null;
  return (
    <Modal title="Fideora Premium" onClose={close}>
      <div className="premium-offer checkout-recovery">
        <PremiumMessage />
        <button
          className="button primary wide"
          disabled={busy}
          onClick={subscribe}
        >
          {busy ? l("Attendi…", "Aguarde…") : l("Riprova", "Tentar novamente")}
          <ArrowUpRight size={17} />
        </button>
        <button className="text-button" disabled={busy} onClick={restore}>
          <RefreshCw size={14} />
          {l("Ripristina acquisti", "Restaurar compras")}
        </button>
      </div>
    </Modal>
  );
}
export function SubscriptionPanel() {
  const { isPremium, checking, busy, request, restore, manage } = usePremium();
  const { l } = useLanguage();
  return (
    <section className="card subscription-panel">
      <span className="premium-label">
        <Crown size={16} /> FIDEORA PREMIUM
      </span>
      <h2>
        {checking
          ? l("Verifica in corso…", "Verificando…")
          : isPremium
            ? l("Il tuo Premium è attivo.", "Seu Premium está ativo.")
            : l("Il tuo prossimo passo.", "Seu próximo passo.")}
      </h2>
      <p>
        {isPremium
          ? l(
              "Tutti gli strumenti di lettura, studio e preghiera sono disponibili.",
              "Todas as ferramentas de leitura, estudo e oração estão disponíveis.",
            )
          : l(
              "La lettura quotidiana è gratuita. Sblocca tutti gli strumenti con Premium.",
              "A leitura diária é gratuita. Desbloqueie todas as ferramentas com Premium.",
            )}
      </p>
      {isPremium && <p className="caption">{l(
        "L’abbonamento è associato al tuo account Apple. La sincronizzazione via email è facoltativa.",
        "A assinatura está associada à sua conta Apple. A sincronização por e-mail é opcional.",
      )}</p>}
      {!isPremium && (
        <button
          className="button primary"
          disabled={checking || busy}
          onClick={() => request("welcome")}
        >
          {l("Scopri Premium", "Conhecer Premium")}
        </button>
      )}
      <div className="billing-actions">
        <button
          className="text-button"
          disabled={busy || checking}
          onClick={restore}
        >
          {l("Ripristina acquisti", "Restaurar compras")}
        </button>
        {isPremium && (
          <button className="text-button" disabled={busy} onClick={manage}>
            {l("Centro abbonamenti", "Central de assinaturas")}
          </button>
        )}
        <a
          href="https://apps.apple.com/account/subscriptions"
          target="_blank"
          rel="noreferrer"
        >
          {l(
            "Gestisci o annulla con Apple",
            "Gerenciar ou cancelar com a Apple",
          )}
        </a>
      </div>
      <PremiumMessage />
    </section>
  );
}
