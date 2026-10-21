import React, { useState } from "react";
import { BookOpen, Heart, PenLine, Check, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { safeSetJSON } from "../utils/storage";
import { Mark, Modal } from "./UI";
export default function Onboarding({ bible, onFinish }) {
  const { l, language, changeLanguage } = useLanguage();
  const [step, setStep] = useState(0),
    [goal, setGoal] = useState("read"),
    [minutes, setMinutes] = useState(5);
  const goals = [
    ["read", BookOpen, "Leggere con costanza", "Ler com constância"],
    [
      "study",
      PenLine,
      "Comprendere e approfondire",
      "Compreender e aprofundar",
    ],
    [
      "pray",
      Heart,
      "Ritrovare un momento di preghiera",
      "Encontrar um momento de oração",
    ],
  ];
  const passage = bible?.books.find((b) => b.book === "John")?.chapters[0]
    ?.verses[0]?.text;
  const finish = (premium) => {
    safeSetJSON("fideoraRoutine", { goal, minutes });
    onFinish(premium);
  };
  return (
    <Modal
      title={l(
        "Il tuo cammino, un passo alla volta.",
        "Sua caminhada, um passo por vez.",
      )}
      onClose={() => finish(false)}
    >
      <div className="onboarding">
        <div className="onboarding-progress" aria-label={`${step + 1} / 3`}>
          {[0, 1, 2].map((n) => (
            <span key={n} className={n <= step ? "active" : ""} />
          ))}
        </div>
        {step === 0 && (
          <>
            <Mark />
            <h3>
              {l("Che cosa desideri coltivare?", "O que você deseja cultivar?")}
            </h3>
            <p>
              {l(
                "Scegli da dove iniziare. Il tuo obiettivo resta su questo dispositivo.",
                "Escolha por onde começar. Seu objetivo fica neste dispositivo.",
              )}
            </p>
            <div className="onboard-language">
              <button
                className={`button ${language === "it" ? "primary" : "secondary"}`}
                onClick={() => changeLanguage("it")}
              >
                Italiano
              </button>
              <button
                className={`button ${language === "pt" ? "primary" : "secondary"}`}
                onClick={() => changeLanguage("pt")}
              >
                Português
              </button>
            </div>
            <div className="onboard-options">
              {goals.map(([id, Icon, it, pt]) => (
                <button
                  key={id}
                  className={`routine-option ${goal === id ? "selected" : ""}`}
                  aria-pressed={goal === id}
                  onClick={() => setGoal(id)}
                >
                  <Icon size={20} />
                  <span>{l(it, pt)}</span>
                  {goal === id && <Check size={17} />}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h3>
              {l(
                "Un piccolo spazio, ogni giorno.",
                "Um pequeno espaço, todos os dias.",
              )}
            </h3>
            <p>
              {l(
                "Quanto tempo vuoi dedicare al tuo momento di lettura e preghiera?",
                "Quanto tempo você quer dedicar ao seu momento de leitura e oração?",
              )}
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
            <blockquote className="onboard-scripture">
              {passage ||
                l(
                  "Leggi. Medita. Prega. Rimani in silenzio.",
                  "Leia. Medite. Reze. Permaneça em silêncio.",
                )}
            </blockquote>
            {passage && (
              <small>
                Giovanni / João 1,1 ·{" "}
                {language === "it" ? "Diodati 1649" : "Almeida 1819"}
              </small>
            )}
          </>
        )}
        {step === 2 && (
          <>
            <span className="completion-mark">
              <Check />
            </span>
            <h3>
              {l(
                "Il tuo prossimo passo è semplice.",
                "Seu próximo passo é simples.",
              )}
            </h3>
            <p>
              {minutes}{" "}
              {l(
                "minuti che scegli di dedicare alla tua fede.",
                "minutos que você escolhe dedicar à sua fé.",
              )}
            </p>
            <ol className="routine-plan">
              <li>
                {l(
                  "Leggi il brano gratuito di oggi.",
                  "Leia a passagem gratuita de hoje.",
                )}
              </li>
              <li>
                {goal === "study"
                  ? l(
                      "Raccogli una domanda da approfondire.",
                      "Guarde uma pergunta para aprofundar.",
                    )
                  : goal === "pray"
                    ? l(
                        "Porta una persona nella tua preghiera.",
                        "Leve uma pessoa em sua oração.",
                      )
                    : l(
                        "Scegli una frase da portare con te.",
                        "Escolha uma frase para levar com você.",
                      )}
              </li>
              <li>
                {l(
                  "Concludi con un momento di silenzio.",
                  "Conclua com um momento de silêncio.",
                )}
              </li>
            </ol>
            <p>
              {l(
                "Con Premium puoi andare oltre: studio personale, letture libere e preghiera guidata.",
                "Com Premium você pode ir além: estudo pessoal, leitura livre e oração guiada.",
              )}
            </p>
          </>
        )}
        <button
          className="button primary wide"
          onClick={() => (step < 2 ? setStep(step + 1) : finish(true))}
        >
          {step < 2
            ? l("Continua", "Continuar")
            : l(
                "Scopri il percorso completo",
                "Conhecer a experiência completa",
              )}
          <ChevronRight size={17} />
        </button>
        {step > 0 && (
          <button className="text-button" onClick={() => setStep(step - 1)}>
            {l("Indietro", "Voltar")}
          </button>
        )}
        <button
          className="text-button free-choice"
          onClick={() => finish(false)}
        >
          {l(
            "Inizia con la lettura gratuita",
            "Começar com a leitura gratuita",
          )}
        </button>
      </div>
    </Modal>
  );
}
