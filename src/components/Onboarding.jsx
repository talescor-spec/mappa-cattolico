import React, { useState } from "react";
import { BookOpen, Heart, PenLine, Check, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { safeGet, safeSet, safeSetJSON, sanitizeDisplayName } from "../utils/storage";
import { Mark, Modal } from "./UI";
export default function Onboarding({ bible, onFinish }) {
  const { l, language, changeLanguage } = useLanguage();
  const [step, setStep] = useState(0),
    [name, setName] = useState(() => safeGet("fideoraUserName")),
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
    const displayName = sanitizeDisplayName(name);
    if (displayName) safeSet("fideoraUserName", displayName);
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
        <div className="onboarding-progress" aria-label={`${step + 1} / 4`}>
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className={n <= step ? "active" : ""} />
          ))}
        </div>
        {step === 0 && (
          <>
            <Mark />
            <h3>{l("Come possiamo chiamarti?", "Como podemos chamar você?")}</h3>
            <p>
              {l(
                "Un piccolo spazio tutto tuo. Il nome è facoltativo e puoi cambiarlo nel Profilo.",
                "Um pequeno espaço seu. O nome é opcional e pode ser alterado no Perfil.",
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
            <label htmlFor="onboarding-name">{l("Il tuo nome", "Seu nome")}</label>
            <input
              id="onboarding-name"
              className="onboarding-name"
              autoComplete="given-name"
              maxLength={60}
              value={name}
              placeholder={l("Come ti chiami?", "Como você se chama?")}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}
        {step === 1 && (
          <>
            <h3>{l("Che cosa desideri coltivare?", "O que você deseja cultivar?")}</h3>
            <p>{l("Scegli da dove iniziare.", "Escolha por onde começar.")}</p>
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
        {step === 2 && (
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
                {l("Giovanni 1,1", "João 1,1")} ·{" "}
                {language === "it" ? "Diodati 1649" : "Almeida 1819"}
              </small>
            )}
          </>
        )}
        {step === 3 && (
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
          onClick={() => (step < 3 ? setStep(step + 1) : finish(true))}
        >
          {step < 3
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
      </div>
    </Modal>
  );
}
