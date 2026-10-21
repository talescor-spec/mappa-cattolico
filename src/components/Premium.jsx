import React from "react";
import { Check, Crown, Lock, ArrowUpRight, RefreshCw } from "lucide-react";
import { usePremium } from "../contexts/PremiumContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Modal } from "./UI";
const labels = {
  bible: ["Tutta la Bibbia, al tuo ritmo.", "Toda a Bíblia, no seu ritmo."],
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
  const { request, checking } = usePremium();
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
        disabled={checking}
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
  const { offer, close, subscribe, restore, busy } = usePremium();
  const { l, language } = useLanguage();
  if (!offer) return null;
  return (
    <Modal title="Fideora Premium" onClose={close}>
      <div className="premium-offer">
        <span className="premium-emblem">
          <Crown size={30} />
        </span>
        <p className="eyebrow">
          {l("PIÙ SPAZIO ALLA TUA FEDE", "MAIS ESPAÇO PARA SUA FÉ")}
        </p>
        <h3>{l(...(labels[offer] || labels.welcome))}</h3>
        <ul className="premium-benefits">
          {[
            [
              "Leggi e approfondisci",
              "Leia e aprofunde",
              "66 libri per lingua, ricerca e parole greche/ebraiche.",
              "66 livros por idioma, busca e palavras gregas/hebraicas.",
            ],
            [
              "Custodisci ciò che impari",
              "Guarde o que aprende",
              "Note, evidenziatori, preferiti e quaderno di studio.",
              "Notas, destaques, favoritos e caderno de estudo.",
            ],
            [
              "Ritrova un ritmo di preghiera",
              "Encontre um ritmo de oração",
              "Rosario guidato, novene e diario delle intenzioni.",
              "Rosário guiado, novenas e diário de intenções.",
            ],
          ].map(([it, pt, dit, dpt]) => (
            <li key={it}>
              <Check size={18} />
              <div>
                <strong>{l(it, pt)}</strong>
                <span>{l(dit, dpt)}</span>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="button primary wide"
          disabled={busy}
          onClick={subscribe}
        >
          {busy ? l("Attendi…", "Aguarde…") : l("Vedi i piani", "Ver planos")}
          <ArrowUpRight size={17} />
        </button>
        <p className="caption">
          {l(
            "Scegli tra mensile e annuale. Prezzo totale, durata e rinnovo sono mostrati prima della conferma Apple.",
            "Escolha entre mensal e anual. Preço total, duração e renovação aparecem antes da confirmação Apple.",
          )}
        </p>
        <PremiumMessage />
        <button className="text-button" disabled={busy} onClick={restore}>
          <RefreshCw size={14} />
          {l("Ripristina acquisti", "Restaurar compras")}
        </button>
        <div className="premium-legal">
          <a
            href={`/terms.html?lang=${language}`}
            target="_blank"
            rel="noreferrer"
          >
            {l("Termini", "Termos")}
          </a>
          <a
            href={`/privacy.html?lang=${language}`}
            target="_blank"
            rel="noreferrer"
          >
            {l("Privacy", "Privacidade")}
          </a>
        </div>
        <button
          className="text-button free-choice"
          disabled={busy}
          onClick={close}
        >
          {l(
            "Continua con la lettura gratuita",
            "Continuar com a leitura gratuita",
          )}
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
