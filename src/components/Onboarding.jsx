import React, { useRef, useState } from "react";
import { BookOpen, Heart, PenLine, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  safeGet,
  safeGetJSON,
  safeSet,
  safeSetJSON,
  sanitizeDisplayName,
  clampInt,
} from "../utils/storage";
import { Modal } from "./UI";
import { MappaArtwork, MappaSample, GospelComparison } from "./Mappa";

export default function Onboarding({
  onFinish,
  hardPaywall = false,
  replay = false,
  fresh = false,
  initialStep = 0,
  previewPaywall = false,
}) {
  const appLanguage = useLanguage();
  const [previewLanguage, setPreviewLanguage] = useState(appLanguage.language);
  const language = replay ? previewLanguage : appLanguage.language;
  const l = replay ? (it, pt) => (language === "pt" ? pt : it) : appLanguage.l;
  const changeLanguage = replay
    ? setPreviewLanguage
    : appLanguage.changeLanguage;
  const [routine] = useState(() =>
    replay && !fresh ? safeGetJSON("fideoraRoutine") : {},
  );
  const [step, setStep] = useState(() =>
    replay ? clampInt(initialStep, 0, 3) : 0,
  );
  const [name, setName] = useState(() =>
    replay && fresh ? "" : safeGet("fideoraUserName"),
  );
  const [goal, setGoal] = useState(() =>
    ["study", "read", "pray"].includes(routine.goal) ? routine.goal : "study",
  );
  const [minutes, setMinutes] = useState(() =>
    [5, 10, 15].includes(routine.minutes) ? routine.minutes : 5,
  );
  const content = useRef(null);
  const goals = [
    ["study", PenLine, "Comprendere", "Compreender"],
    ["read", BookOpen, "Leggere", "Ler"],
    ["pray", Heart, "Pregare", "Rezar"],
  ];
  const finish = (premium) => {
    if (replay) {
      onFinish(false, { completed: premium === true, language });
      return;
    }
    const displayName = sanitizeDisplayName(name);
    if (displayName) safeSet("fideoraUserName", displayName);
    safeSetJSON("fideoraRoutine", { goal, minutes });
    onFinish(premium);
  };
  const move = (next) => {
    setStep(next);
    content.current
      ?.closest("dialog")
      ?.scrollTo({ top: 0, behavior: "instant" });
    content.current?.focus({ preventScroll: true });
  };
  return (
    <Modal
      title={
        replay
          ? l("Onboarding · Anteprima QA", "Onboarding · Prévia QA")
          : l("La tua Mappa della Bibbia", "Seu Mapa da Bíblia")
      }
      onClose={hardPaywall && !replay ? undefined : () => finish(false)}
    >
      <div className="onboarding mappa-onboarding" ref={content} tabIndex={-1}>
        <div className="onboarding-progress" aria-label={`${step + 1} / 4`}>
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className={n <= step ? "active" : ""} />
          ))}
        </div>
        <p className="mappa-step-label" aria-live="polite">
          {step + 1} / 4 · {l("IL TUO PRIMO PERCORSO", "SEU PRIMEIRO PERCURSO")}
        </p>
        {step === 0 && (
          <>
            {replay && (
              <p className="mappa-editorial-note">
                {l(
                  "Puoi rivedere tutti i passaggi. Le scelte fatte qui non modificano il tuo profilo.",
                  "Você pode rever todas as etapas. As escolhas feitas aqui não alteram seu perfil.",
                )}
              </p>
            )}
            <MappaArtwork compact />
            <span className="eyebrow">MAPPA DELLA BIBBIA · FIDEORA</span>
            <h3>
              {l(
                "Dai un filo\nalla tua lettura.",
                "Encontre o fio\nda sua leitura.",
              )}
            </h3>
            <p>
              {l(
                "Capisci il contesto, riconosci i temi e collega le storie. Il tuo primo percorso comincia da Matteo e dai quattro Vangeli.",
                "Entenda o contexto, reconheça os temas e conecte as histórias. Seu primeiro percurso começa em Mateus e nos quatro Evangelhos.",
              )}
            </p>
            <div className="onboard-language">
              <button
                className={`button ${language === "it" ? "primary" : "secondary"}`}
                aria-pressed={language === "it"}
                onClick={() => changeLanguage("it")}
              >
                Italiano
              </button>
              <button
                className={`button ${language === "pt" ? "primary" : "secondary"}`}
                aria-pressed={language === "pt"}
                onClick={() => changeLanguage("pt")}
              >
                Português
              </button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h3>
              {l(
                "Prima il contesto.\nPoi la lettura.",
                "Primeiro o contexto.\nDepois a leitura.",
              )}
            </h3>
            <p>
              {l(
                "Prova la Mappa: tocca un tema per capire il filo del Vangelo di Matteo.",
                "Experimente o Mapa: toque em um tema para entender o fio do Evangelho de Mateus.",
              )}
            </p>
            <MappaSample language={language} compact />
          </>
        )}
        {step === 2 && <GospelComparison language={language} preview />}
        {step === 3 && (
          <>
            <span className="eyebrow">
              {l("IL TUO MOMENTO DI STUDIO", "SEU MOMENTO DE ESTUDO")}
            </span>
            <h3>
              {l(
                "Un passo alla volta.\nAl tuo ritmo.",
                "Um passo por vez.\nNo seu ritmo.",
              )}
            </h3>
            <p>
              {l(
                "Inizia da Matteo. Esplora i collegamenti e conserva ciò che scopri nel tuo Quaderno.",
                "Comece por Mateus. Explore as conexões e guarde o que descobrir no seu Caderno.",
              )}
            </p>
            <label htmlFor="onboarding-name">
              {l("Il tuo nome (facoltativo)", "Seu nome (opcional)")}
            </label>
            <input
              id="onboarding-name"
              className="onboarding-name"
              autoComplete="given-name"
              maxLength={60}
              value={name}
              placeholder={l("Come ti chiami?", "Como você se chama?")}
              onChange={(event) => setName(event.target.value)}
            />
            <p className="mappa-field-label">
              {l("Da dove vuoi cominciare?", "Por onde quer começar?")}
            </p>
            <div className="mappa-goals">
              {goals.map(([id, Icon, it, pt]) => (
                <button
                  key={id}
                  className={`routine-option ${goal === id ? "selected" : ""}`}
                  aria-pressed={goal === id}
                  onClick={() => setGoal(id)}
                >
                  <Icon size={17} />
                  <span>{l(it, pt)}</span>
                  {goal === id && <Check size={15} />}
                </button>
              ))}
            </div>
            <p className="mappa-field-label">
              {l("Il tuo tempo, ogni giorno", "Seu tempo, todos os dias")}
            </p>
            <div className="routine-time">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  className={`routine-option ${minutes === n ? "selected" : ""}`}
                  aria-pressed={minutes === n}
                  onClick={() => setMinutes(n)}
                >
                  {n} min
                </button>
              ))}
            </div>
            <p className="mappa-editorial-note">
              {replay
                ? l(
                    "Questa simulazione non salva nome, lingua o routine. Al termine torni agli strumenti di sviluppo.",
                    "Esta simulação não salva nome, idioma ou rotina. Ao concluir, você volta às ferramentas de desenvolvimento.",
                  )
                : l(
                    "Nel prossimo passaggio trovi i piani e le condizioni dell’eventuale prova gratuita, secondo la tua idoneità.",
                    "Na próxima etapa você encontra os planos e as condições de um eventual teste grátis, conforme sua elegibilidade.",
                  )}
            </p>
          </>
        )}
        <div className="mappa-onboarding-actions">
          <button
            className="button primary wide"
            onClick={() => (step < 3 ? move(step + 1) : finish(true))}
          >
            {step === 0
              ? l("Scopri la Mappa", "Conhecer o Mapa")
              : step < 3
                ? l("Continua", "Continuar")
                : replay && !previewPaywall
                  ? l("Concludi il test", "Concluir teste")
                  : l("Scopri i piani Premium", "Ver planos Premium")}
            <ArrowRight size={17} />
          </button>
          {step > 0 && (
            <button className="text-button" onClick={() => move(step - 1)}>
              {l("Indietro", "Voltar")}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
