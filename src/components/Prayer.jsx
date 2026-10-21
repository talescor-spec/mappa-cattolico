import React, { useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Sun,
  RotateCcw,
  Calendar,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useStudy } from "../contexts/StudyContext";
import {
  mysteryNames,
  mysteryToday,
  novenaThemes,
  novenaInvocations,
  novenaDayPrompts,
  localDateKey,
} from "../data/content";
import {
  safeGetJSON,
  safeSetJSON,
  normalizeRosaryProgress,
  normalizeNovenaProgress,
} from "../utils/storage";
import { Header, Modal, Empty, Row } from "./UI";
import { usePremium } from "../contexts/PremiumContext";
import { PremiumCard } from "./Premium";
export default function Prayer() {
  const { t, l, language } = useLanguage();
  const { isPremium, can, request } = usePremium();
  const { entries, write, remove, ready } = useStudy();
  const index = language === "it" ? 0 : 1;
  const [view, setView] = useState("all"),
    [prayer, setPrayer] = useState(null),
    [mystery, setMystery] = useState(mysteryToday),
    [progress, setProgress] = useState(() =>
      normalizeRosaryProgress(safeGetJSON("rosaryProgress")),
    ),
    [novenaProgress, setNovenaProgress] = useState(() =>
      normalizeNovenaProgress(safeGetJSON("novenaProgress")),
    ),
    [novena, setNovena] = useState(null),
    [newIntention, setNewIntention] = useState(false),
    [intention, setIntention] = useState(""),
    [deleting, setDeleting] = useState(null);
  const today = localDateKey();
  const legacyToday = new Date().toDateString();
  const step =
    progress[today]?.[mystery] ?? progress[legacyToday]?.[mystery] ?? 0;
  const setStep = (value) => {
    const next = normalizeRosaryProgress({
      ...progress,
      [today]: { ...progress[today], [mystery]: value },
    });
    setProgress(next);
    safeSetJSON("rosaryProgress", next);
  };
  const novenas = [1, 2, 3, 4, 5].map((n) => ({
    id: `novena${n}`,
    title: t(`novena${n}`),
    purpose: t(`novena${n}Purpose`),
  }));
  const intentions = entries
    .filter((e) => e.kind === "intention")
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const credo = l(
    "Io credo in Dio, Padre onnipotente, Creatore del cielo e della terra; e in Gesù Cristo, suo unico Figlio, nostro Signore, il quale fu concepito di Spirito Santo, nacque da Maria Vergine, patì sotto Ponzio Pilato, fu crocifisso, morì e fu sepolto; discese agli inferi; il terzo giorno risuscitò da morte; salì al cielo, siede alla destra di Dio Padre onnipotente; di là verrà a giudicare i vivi e i morti. Credo nello Spirito Santo, la santa Chiesa cattolica, la comunione dei santi, la remissione dei peccati, la risurrezione della carne, la vita eterna. Amen.",
    "Creio em Deus Pai todo-poderoso, Criador do céu e da terra, e em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na santa Igreja católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne e na vida eterna. Amém.",
  );
  const traditional = [
    ["ourFather", t("ourFatherText")],
    ["hailMary", t("hailMaryText")],
    ["gloryBe", t("gloryBeText")],
    ["hailQueen", t("hailQueenText")],
  ];
  // 0 Creed; 1 Our Father; 2–4 three Hail Marys; 5 Glory; 6–65 five decades (Our Father, ten Hail Marys, Glory); 66 Salve Regina; 67 complete.
  const decade = Math.max(0, Math.min(4, Math.floor((step - 6) / 12)));
  const position = (step - 6) % 12;
  const currentPrayer =
    step === 0
      ? { title: l("Credo apostolico", "Creio"), text: credo }
      : step === 1 || (step >= 6 && step <= 65 && position === 0)
        ? { title: t("ourFather"), text: t("ourFatherText") }
        : step === 5 || (step >= 6 && step <= 65 && position === 11)
          ? { title: t("gloryBe"), text: t("gloryBeText") }
          : step === 66
            ? { title: t("hailQueen"), text: t("hailQueenText") }
            : { title: t("hailMary"), text: t("hailMaryText") };
  if (view === "rosary" && isPremium)
    return (
      <>
        <button className="text-button back" onClick={() => setView("all")}>
          <ChevronLeft size={16} />
          {t("back")}
        </button>
        <Header
          eyebrow={l("UN GRANO ALLA VOLTA", "UMA CONTA DE CADA VEZ")}
          title={t("rosary")}
          subtitle={t("rosarySubtitle")}
        />
        <label className="sr-only" htmlFor="mystery">
          {t("chooseMystery")}
        </label>
        <select
          className="mystery-select"
          id="mystery"
          value={mystery}
          onChange={(e) => setMystery(e.target.value)}
        >
          {Object.keys(mysteryNames).map((id) => (
            <option key={id} value={id}>
              {t(id)} · {t(`${id}Days`)}
            </option>
          ))}
        </select>
        <section className="card rosary-card">
          <p className="eyebrow">{t(mystery)}</p>
          {step >= 6 && step <= 65 && (
            <h2>
              {decade + 1}. {mysteryNames[mystery][index][decade]}
            </h2>
          )}
          <div className="rosary-beads">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={
                  step === 67 ||
                  (step >= 6 &&
                    step <= 65 &&
                    i < Math.min(10, Math.max(0, position)))
                    ? "filled"
                    : ""
                }
              />
            ))}
          </div>
          {step < 67 ? (
            <>
              <h3>{currentPrayer.title}</h3>
              <p className="prayer-text">{currentPrayer.text}</p>
              <div className="button-row">
                <button
                  className="button secondary"
                  disabled={!ready || step === 0}
                  onClick={() => setStep(step - 1)}
                >
                  <ChevronLeft size={16} />
                  {t("back")}
                </button>
                <button
                  className="button primary"
                  disabled={!ready}
                  onClick={() => setStep(step + 1)}
                >
                  {t("advancePrayer")}
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="completion-mark">
                <Check />
              </span>
              <h2>
                {l(
                  "La preghiera continua nella vita.",
                  "A oração continua na vida.",
                )}
              </h2>
              <p>
                {l(
                  "Hai completato il Rosario. Porta con te un’intenzione e un gesto di carità.",
                  "Você concluiu o Rosário. Leve consigo uma intenção e um gesto de caridade.",
                )}
              </p>
              <button className="button secondary" onClick={() => setStep(0)}>
                <RotateCcw size={16} />
                {t("reset")}
              </button>
            </>
          )}
          <progress value={step} max={67} />
          <p className="caption">
            {step} / 67 · {l("progresso di oggi", "progresso de hoje")}
          </p>
        </section>
      </>
    );
  return (
    <>
      <Header
        eyebrow={l("UNO SPAZIO DI PACE", "UM ESPAÇO DE PAZ")}
        title={l("Ritrova il silenzio.", "Reencontre o silêncio.")}
        subtitle={l(
          "La preghiera comincia da dove sei.",
          "A oração começa onde você está.",
        )}
      />
      <button
        className="rosary-banner"
        onClick={() => (can("rosary") ? setView("rosary") : request("rosary"))}
      >
        <span>
          <p className="eyebrow">
            {l("I MISTERI DI OGGI", "OS MISTÉRIOS DE HOJE")}
          </p>
          <h2>{t(mysteryToday())}</h2>
          <p>
            {t("openRosary")} <ChevronRight size={16} />
          </p>
        </span>
        <span className="rosary-symbol" aria-hidden="true">
          ✧
        </span>
      </button>
      {!isPremium && <PremiumCard feature="rosary" compact />}
      <div className="prayer-columns">
        <section>
          <div className="section-line">
            <h2>{t("prayers")}</h2>
            <span className="caption">
              {l("La voce della tradizione", "A voz da tradição")}
            </span>
          </div>
          <div className="card rows">
            {traditional.map(([id, text]) => (
              <Row
                key={id}
                icon={Heart}
                title={t(id)}
                onClick={() => setPrayer({ title: t(id), text })}
              />
            ))}
            <Row
              icon={Heart}
              title={l("Credo apostolico", "Creio")}
              onClick={() =>
                setPrayer({
                  title: l("Credo apostolico", "Creio"),
                  text: credo,
                })
              }
            />
          </div>
          <h2>{t("novenas")}</h2>
          <div className="card rows">
            {novenas.map((n) => (
              <Row
                key={n.id}
                icon={Calendar}
                title={n.title}
                subtitle={`${novenaProgress[n.id] || 0} / 9 ${l("giorni", "dias")}`}
                onClick={() =>
                  can("devotions") ? setNovena(n) : request("devotions")
                }
              />
            ))}
          </div>
        </section>
        <section>
          <div className="section-line">
            <h2>{l("Le tue intenzioni", "Suas intenções")}</h2>
            <button
              className="icon-button"
              disabled={!ready}
              aria-label={l("Nuova intenzione", "Nova intenção")}
              onClick={() =>
                can("devotions") ? setNewIntention(true) : request("devotions")
              }
            >
              <Plus size={20} />
            </button>
          </div>
          <p className="muted">
            {l(
              "Affida. Ricorda. Ringrazia. Questo spazio è privato.",
              "Entregue. Recorde. Agradeça. Este espaço é privado.",
            )}
          </p>
          {intentions.length ? (
            intentions.map((entry) => (
              <article
                key={entry.id}
                className={`card intention ${entry.payload.answered ? "answered" : ""}`}
              >
                <p className="preserve-text">{entry.payload.text}</p>
                <div className="section-line">
                  <button
                    className="text-button"
                    onClick={() =>
                      write(entry.id, "intention", {
                        ...entry.payload,
                        answered: !entry.payload.answered,
                      })
                    }
                  >
                    <Check size={15} />
                    {entry.payload.answered
                      ? l("In ringraziamento", "Em agradecimento")
                      : l("Segna come esaudita", "Marcar como atendida")}
                  </button>
                  <button
                    className="icon-button"
                    aria-label={l("Elimina intenzione", "Excluir intenção")}
                    onClick={() => setDeleting(entry)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <Empty
              icon={Sun}
              title={l(
                "Che cosa porti nel cuore?",
                "O que você traz no coração?",
              )}
              text={l(
                "Scrivi un’intenzione e ritrovala nella tua preghiera.",
                "Escreva uma intenção e retome-a em sua oração.",
              )}
              action={
                <button
                  className="button secondary"
                  disabled={!ready}
                  onClick={() =>
                    can("devotions")
                      ? setNewIntention(true)
                      : request("devotions")
                  }
                >
                  <Plus size={16} />
                  {l("Aggiungi intenzione", "Adicionar intenção")}
                </button>
              }
            />
          )}
        </section>
      </div>
      {prayer && (
        <Modal title={prayer.title} onClose={() => setPrayer(null)}>
          <p className="prayer-text">{prayer.text}</p>
        </Modal>
      )}
      {novena && isPremium && (
        <Modal title={novena.title} onClose={() => setNovena(null)}>
          <p className="eyebrow">
            {l(
              "PERCORSO DI PREGHIERA · 9 GIORNI",
              "CAMINHO DE ORAÇÃO · 9 DIAS",
            )}
          </p>
          <p>{novena.purpose}</p>
          <div className="novena-dots">
            {Array.from({ length: 9 }, (_, i) => (
              <span
                className={(novenaProgress[novena.id] || 0) > i ? "done" : ""}
                key={i}
              >
                {(novenaProgress[novena.id] || 0) > i ? (
                  <Check size={14} />
                ) : (
                  i + 1
                )}
              </span>
            ))}
          </div>
          <h3>
            {novenaThemes[index][Math.min(8, novenaProgress[novena.id] || 0)]}
          </h3>
          <p>
            {
              novenaDayPrompts[Math.min(8, novenaProgress[novena.id] || 0)][
                index
              ]
            }
          </p>
          <p className="prayer-text">{novenaInvocations[novena.id][index]}</p>
          <p>{t("novenaPrayer")}</p>
          <p>
            {l(
              "Dedica un momento a questa intenzione. Concludi con un Padre Nostro, un’Ave Maria e un Gloria al Padre.",
              "Dedique um momento a esta intenção. Conclua com um Pai-Nosso, uma Ave-Maria e um Glória ao Pai.",
            )}
          </p>
          <p className="caption">
            {l(
              "Traccia devozionale editoriale Fideora. Non è un testo liturgico ufficiale.",
              "Roteiro devocional editorial Fideora. Não é um texto litúrgico oficial.",
            )}
          </p>
          <progress max={9} value={novenaProgress[novena.id] || 0} />
          <button
            className="button primary"
            disabled={
              !ready ||
              (novenaProgress[novena.id] || 0) >= 9 ||
              entries.find((e) => e.id === `novena:${novena.id}`)?.payload
                .lastDay === today
            }
            onClick={() => {
              const next = normalizeNovenaProgress({
                ...novenaProgress,
                [novena.id]: Math.min(9, (novenaProgress[novena.id] || 0) + 1),
              });
              setNovenaProgress(next);
              safeSetJSON("novenaProgress", next);
              write(`novena:${novena.id}`, "novena", { lastDay: today });
            }}
          >
            <Check size={16} />
            {(novenaProgress[novena.id] || 0) >= 9
              ? t("completed")
              : entries.find((e) => e.id === `novena:${novena.id}`)?.payload
                    .lastDay === today
                ? l("Oggi completato", "Hoje concluído")
                : t("markDay")}
          </button>
          {(novenaProgress[novena.id] || 0) >= 9 && (
            <button
              className="text-button"
              onClick={() => {
                const next = { ...novenaProgress, [novena.id]: 0 };
                setNovenaProgress(next);
                safeSetJSON("novenaProgress", next);
                write(`novena:${novena.id}`, "novena", { lastDay: null });
              }}
            >
              {t("reset")}
            </button>
          )}
        </Modal>
      )}
      {newIntention && isPremium && (
        <Modal
          title={l("Una nuova intenzione", "Uma nova intenção")}
          onClose={() => setNewIntention(false)}
        >
          <label htmlFor="intention-text">
            {l("Che cosa desideri affidare?", "O que você deseja entregar?")}
          </label>
          <textarea
            id="intention-text"
            value={intention}
            maxLength={2000}
            rows={5}
            onChange={(e) => setIntention(e.target.value)}
            autoFocus
          />
          <button
            className="button primary"
            disabled={!ready || !intention.trim()}
            onClick={() => {
              write(`intention:${crypto.randomUUID()}`, "intention", {
                text: intention.trim(),
                answered: false,
              });
              setIntention("");
              setNewIntention(false);
            }}
          >
            {l("Custodisci intenzione", "Guardar intenção")}
          </button>
        </Modal>
      )}
      {deleting && (
        <Modal
          title={l("Eliminare l’intenzione?", "Excluir a intenção?")}
          onClose={() => setDeleting(null)}
        >
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setDeleting(null)}
            >
              {l("Annulla", "Cancelar")}
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                remove(deleting);
                setDeleting(null);
              }}
            >
              {l("Elimina", "Excluir")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
