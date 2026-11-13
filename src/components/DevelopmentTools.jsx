import React, { useEffect, useState } from "react";
import { Wrench, Play, ArrowRight, CreditCard } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getDevelopmentEnvironment } from "../services/development";
import { billing } from "../services/purchases";
import { Modal, Row } from "./UI";
import Onboarding from "./Onboarding";

export function DevelopmentToolsPanel({
  environment,
  onClose,
  onPaywall,
  nativePaywall = false,
}) {
  const { language, l } = useLanguage();
  const [step, setStep] = useState(0);
  const [includePaywall, setIncludePaywall] = useState(false);
  const [run, setRun] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const steps = [
    l("Introduzione", "Introdução"),
    l("Matteo", "Mateus"),
    l("Quattro Vangeli", "Quatro Evangelhos"),
    l("Nome e routine", "Nome e rotina"),
  ];
  const showPaywall = async (locale = language) => {
    if (!nativePaywall || !onPaywall || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await onPaywall(locale);
      if (!result?.available)
        setMessage(
          l(
            "Anteprima non disponibile. Verifica il collegamento e l’ambiente di test.",
            "Prévia indisponível. Confira a conexão e o ambiente de teste.",
          ),
        );
    } catch {
      setMessage(
        l(
          "Impossibile aprire il paywall. Riprova.",
          "Não foi possível abrir o paywall. Tente novamente.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  const start = (initialStep) => {
    setMessage("");
    setRun({ initialStep, checkout: nativePaywall && includePaywall });
  };
  if (run)
    return (
      <Onboarding
        replay
        fresh
        initialStep={run.initialStep}
        previewPaywall={run.checkout}
        onFinish={(_premium, result) => {
          const checkout = run.checkout && result?.completed;
          setRun(null);
          if (checkout) void showPaywall(result.language);
        }}
      />
    );
  return (
    <Modal
      title={l("Strumenti di sviluppo", "Ferramentas de desenvolvimento")}
      onClose={busy ? undefined : onClose}
    >
      <div className="development-tools">
        <p className="eyebrow">
          QA ·{" "}
          {environment.channel === "web-local"
            ? "WEB LOCALE"
            : environment.channel.toUpperCase()}
        </p>
        <p>
          {l(
            "Usa lo stesso onboarding del prodotto, con dati temporanei. Account, abbonamento e progressi reali restano invariati.",
            "Use o mesmo onboarding do produto, com dados temporários. Conta, assinatura e progresso reais permanecem intactos.",
          )}
        </p>
        <section>
          <h3>{l("Simula il primo accesso", "Simular primeiro acesso")}</h3>
          <p>
            {l(
              "Riparti dalla prima schermata, senza uscire dall’account o cancellare dati.",
              "Comece pela primeira tela, mantendo a conta conectada e os dados salvos.",
            )}
          </p>
          <label className="development-check">
            <input
              type="checkbox"
              disabled={!nativePaywall || busy}
              checked={includePaywall}
              onChange={(event) => setIncludePaywall(event.target.checked)}
            />
            {l("Apri il paywall al termine", "Abrir paywall ao concluir")}
          </label>
          <button
            className="button primary wide"
            disabled={busy}
            onClick={() => start(0)}
          >
            <Play size={17} />
            {l("Inizia la simulazione", "Iniciar simulação")}
          </button>
        </section>
        <section>
          <h3>{l("Rivedi una fase", "Revisar uma etapa")}</h3>
          <label htmlFor="development-step">
            {l("Schermata iniziale", "Tela inicial")}
          </label>
          <select
            id="development-step"
            value={step}
            onChange={(event) => setStep(Number(event.target.value))}
          >
            {steps.map((title, i) => (
              <option key={title} value={i}>
                {i + 1}. {title}
              </option>
            ))}
          </select>
          <button
            className="button secondary wide"
            disabled={busy}
            onClick={() => start(step)}
          >
            {l("Apri la fase selezionata", "Abrir etapa selecionada")}
            <ArrowRight size={17} />
          </button>
        </section>
        <section>
          <h3>{l("Paywall di test", "Paywall de testes")}</h3>
          <p>
            {l(
              "Apri l’offerta anche se hai già Premium. Nell’app di test viene usato StoreKit sandbox; il pulsante di chiusura resta disponibile.",
              "Abra a oferta mesmo com Premium ativo. No app de teste, ela usa o StoreKit sandbox; o botão de fechar permanece disponível.",
            )}
          </p>
          <button
            className="button secondary wide"
            disabled={!nativePaywall || busy}
            onClick={() => showPaywall()}
          >
            <CreditCard size={17} />
            {busy
              ? l("Apertura…", "Abrindo…")
              : l("Visualizza il paywall", "Visualizar paywall")}
          </button>
          {!nativePaywall && (
            <p className="caption">
              {l(
                "Il paywall nativo si prova dal TestFlight o da una build iOS di sviluppo.",
                "O paywall nativo é testado pelo TestFlight ou por uma build iOS de desenvolvimento.",
              )}
            </p>
          )}
        </section>
        {message && <p role="status">{message}</p>}
      </div>
    </Modal>
  );
}

export default function DevelopmentTools() {
  const { l } = useLanguage();
  const { user } = useAuth();
  const [environment, setEnvironment] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let active = true;
    getDevelopmentEnvironment()
      .then((value) => {
        if (active) setEnvironment(value);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (!environment?.allowed) return null;
  return (
    <>
      <section className="card rows development-tools-entry">
        <Row
          icon={Wrench}
          title={l("Strumenti di sviluppo", "Ferramentas de desenvolvimento")}
          subtitle={l(
            "Onboarding e paywall · solo build di test",
            "Onboarding e paywall · somente builds de teste",
          )}
          onClick={() => setOpen(true)}
        />
      </section>
      {open && (
        <DevelopmentToolsPanel
          environment={environment}
          nativePaywall={environment.channel !== "web-local"}
          onClose={() => setOpen(false)}
          onPaywall={(locale) => billing.previewPaywall(user?.id, locale)}
        />
      )}
    </>
  );
}
