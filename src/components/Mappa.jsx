import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  PenLine,
  Plus,
  Minus,
  Heart,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useStudy } from "../contexts/StudyContext";
import { usePremium } from "../contexts/PremiumContext";
import { useAuth } from "../contexts/AuthContext";
import { safeGet, safeGetJSON, safeSetJSON } from "../utils/storage";
import { GOSPELS, MATTHEW, MAPPA_SOURCES, mappaNote } from "../data/mappa.js";
import { dailyReading, localDateKey } from "../data/content";

const choose = (value, language) => value[language === "pt" ? 1 : 0];

export function MappaArtwork({ compact = false }) {
  return (
    <div className={`mappa-art ${compact ? "compact" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 340 240" fill="none">
        <path
          d="M46 182V59c41-16 82-12 124 10 42-22 83-26 124-10v123c-41-16-82-12-124 10-42-22-83-26-124-10Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M170 69v123M63 74c30-9 60-5 89 8M63 88c30-9 60-5 89 8M188 82c29-13 59-17 89-8M188 96c29-13 59-17 89-8"
          stroke="currentColor"
          strokeWidth=".7"
          opacity=".5"
        />
        <path
          d="M95 129h36l39 23 39-23h36M95 129v24m150-24v24M170 152v22"
          stroke="currentColor"
          opacity=".65"
        />
        <circle cx="95" cy="129" r="5" fill="#f7f5f0" stroke="currentColor" />
        <circle cx="245" cy="129" r="5" fill="#f7f5f0" stroke="currentColor" />
        <circle cx="170" cy="152" r="6" fill="#f7f5f0" stroke="currentColor" />
        <path
          d="M46 188c41-16 82-12 124 10 42-22 83-26 124-10"
          stroke="currentColor"
          strokeWidth=".7"
          opacity=".45"
        />
      </svg>
      <span className="mappa-art-index">I — IV</span>
    </div>
  );
}

export function MappaSample({ language = "it", compact = false }) {
  const [expanded, setExpanded] = useState("fulfilment");
  return (
    <section
      className={`mappa-sample ${compact ? "compact" : ""}`}
      aria-label={
        language === "it"
          ? "Anteprima della Mappa di Matteo"
          : "Demonstração do Mapa de Mateus"
      }
    >
      <div className="mappa-sample-heading">
        <span className="eyebrow">
          {language === "it"
            ? "NUOVO TESTAMENTO · VANGELI"
            : "NOVO TESTAMENTO · EVANGELHOS"}
        </span>
        <span>01 / 04</span>
      </div>
      <h3>
        {language === "it" ? "Matteo" : "Mateus"}
        <span>28 {language === "it" ? "capitoli" : "capítulos"}</span>
      </h3>
      <p>{choose(MATTHEW.summary, language)}</p>
      <div className="mappa-theme-list">
        {MATTHEW.themes.map((theme) => (
          <div className="mappa-theme" key={theme.id}>
            <button
              aria-expanded={expanded === theme.id}
              onClick={() => setExpanded(expanded === theme.id ? "" : theme.id)}
            >
              <span>{choose(theme.title, language)}</span>
              {expanded === theme.id ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            {expanded === theme.id && (
              <div>
                <p>{choose(theme.body, language)}</p>
                <small>{theme.reference}</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function GospelComparison({
  language = "it",
  onRead,
  onMatthew,
  preview = false,
}) {
  const [selected, setSelected] = useState("matteo");
  const gospel = GOSPELS.find((item) => item.id === selected);
  const it = language === "it";
  return (
    <section className="mappa-comparison">
      <div className="mappa-section-intro">
        <span className="eyebrow">
          {it ? "UNO SGUARDO D’INSIEME" : "UMA VISÃO DO CONJUNTO"}
        </span>
        <h2>
          {it
            ? "Quattro Vangeli.\nQuattro prospettive."
            : "Quatro Evangelhos.\nQuatro perspectivas."}
        </h2>
        <p>
          {it
            ? "La vita di Gesù, raccontata con accenti diversi. Scegli un Vangelo per scoprirne la prospettiva."
            : "A vida de Jesus, contada com diferentes ênfases. Escolha um Evangelho para conhecer sua perspectiva."}
        </p>
      </div>
      <div
        className="mappa-gospel-tabs"
        role="tablist"
        aria-label={it ? "I quattro Vangeli" : "Os quatro Evangelhos"}
      >
        {GOSPELS.map((item, index) => (
          <button
            key={item.id}
            id={`gospel-tab-${item.id}`}
            role="tab"
            tabIndex={item.id === selected ? 0 : -1}
            aria-selected={item.id === selected}
            aria-controls="gospel-panel"
            className={item.id === selected ? "selected" : ""}
            onClick={() => setSelected(item.id)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 3
                    : (index + (event.key === "ArrowRight" ? 1 : 3)) % 4;
              setSelected(GOSPELS[next].id);
              event.currentTarget.parentElement.children[next]?.focus();
            }}
          >
            <span>0{index + 1}</span>
            {choose(item.name, language)}
          </button>
        ))}
      </div>
      <div
        className="mappa-gospel-panel"
        id="gospel-panel"
        role="tabpanel"
        aria-labelledby={`gospel-tab-${gospel.id}`}
      >
        <span className="mappa-kicker">
          {gospel.chapters} {it ? "capitoli" : "capítulos"}
        </span>
        <h3>{choose(gospel.focus, language)}</h3>
        <p>{choose(gospel.summary, language)}</p>
        <p>{choose(gospel.detail, language)}</p>
        <span className="mappa-reference">
          {choose(gospel.reference.label, language)}
        </span>
        {!preview && onRead && (
          <button
            className="mappa-link"
            onClick={() =>
              onRead({
                book: gospel.book,
                chapter: gospel.reference.chapter,
                verse: gospel.reference.verse,
              })
            }
          >
            {it ? "Leggi il riferimento" : "Ler a referência"}
            <ArrowUpRight size={16} />
          </button>
        )}
        {gospel.id === "matteo" && onMatthew && (
          <button className="mappa-link" onClick={onMatthew}>
            {it ? "Apri la Mappa di Matteo" : "Abrir o Mapa de Mateus"}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
      <p className="mappa-editorial-note">
        {it
          ? "Questi accenti aiutano a orientarsi: non esauriscono la ricchezza di ciascun Vangelo."
          : "Essas ênfases ajudam a se orientar: não esgotam a riqueza de cada Evangelho."}
      </p>
    </section>
  );
}

export function MatthewDetail({
  language = "it",
  onRead,
  onCompare,
  onSave,
  ready = true,
  saved = false,
  full = true,
  onPremium,
}) {
  const [reflection, setReflection] = useState("");
  const [sources, setSources] = useState(false);
  const it = language === "it";
  return (
    <article className="mappa-book-detail">
      <div className="mappa-section-intro">
        <span className="eyebrow">
          {it ? "LA MAPPA DI UN LIBRO" : "O MAPA DE UM LIVRO"}
        </span>
        <h1>
          {it ? "Il Vangelo\nsecondo Matteo." : "O Evangelho\nsegundo Mateus."}
        </h1>
        <p>
          {it
            ? "Le promesse, il Regno, il cammino dei discepoli."
            : "As promessas, o Reino, a caminhada dos discípulos."}
        </p>
      </div>
      <MappaSample language={language} />
      {!full ? (
        <div className="mappa-upgrade">
          <h2>{it ? "Continua il tuo studio." : "Continue seu estudo."}</h2>
          <p>
            {it
              ? "Approfondisci la struttura, i personaggi e i collegamenti. Conserva le tue riflessioni con Fideora Premium."
              : "Aprofunde a estrutura, os personagens e as conexões. Guarde suas reflexões com o Fideora Premium."}
          </p>
          <button className="button primary" onClick={onPremium}>
            {it ? "Scopri Premium" : "Conhecer Premium"}
            <ArrowUpRight size={16} />
          </button>
        </div>
      ) : (
        <>
          <section className="mappa-section">
            <div className="mappa-section-label">
              <span>01</span>
              <h2>{it ? "Il filo del racconto" : "O fio do relato"}</h2>
            </div>
            <ol className="mappa-timeline">
              {MATTHEW.structure.map((item) => (
                <li key={item.chapters}>
                  <span className="mappa-timeline-range">
                    {it ? "CAP." : "CAP."} {item.chapters}
                  </span>
                  <div>
                    <h3>{choose(item.title, language)}</h3>
                    <p>{choose(item.text, language)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="mappa-section">
            <div className="mappa-section-label">
              <span>02</span>
              <h2>{it ? "Le persone" : "As pessoas"}</h2>
            </div>
            <div className="mappa-person-list">
              {MATTHEW.people.map((item) => (
                <div key={item.name[0]}>
                  <h3>{choose(item.name, language)}</h3>
                  <p>{choose(item.role, language)}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mappa-section">
            <div className="mappa-section-label">
              <span>03</span>
              <h2>
                {it ? "Passaggi da esplorare" : "Passagens para explorar"}
              </h2>
            </div>
            <div className="mappa-passage-list">
              {MATTHEW.passages.map((item) => (
                <button
                  key={item.ref}
                  onClick={() => onRead?.(item)}
                  disabled={!onRead}
                >
                  <span>
                    <small>{item.ref}</small>
                    <strong>{choose(item.label, language)}</strong>
                  </span>
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </div>
          </section>
          <section className="mappa-connection">
            <span className="eyebrow">
              {it ? "COLLEGA LE PROSPETTIVE" : "CONECTE AS PERSPECTIVAS"}
            </span>
            <h2>{it ? "E gli altri Vangeli?" : "E os outros Evangelhos?"}</h2>
            <p>
              {it
                ? "Metti a confronto Matteo, Marco, Luca e Giovanni e scopri le diverse prospettive su Gesù."
                : "Compare Mateus, Marcos, Lucas e João e descubra diferentes perspectivas sobre Jesus."}
            </p>
            <button className="mappa-link" onClick={onCompare}>
              {it
                ? "Confronta i quattro Vangeli"
                : "Comparar os quatro Evangelhos"}
              <ArrowRight size={17} />
            </button>
          </section>
          <section className="mappa-section mappa-reflection">
            <div className="mappa-section-label">
              <span>04</span>
              <h2>{it ? "Portalo nella tua vita" : "Leve para sua vida"}</h2>
            </div>
            <p className="mappa-reflection-question">
              {choose(MATTHEW.question, language)}
            </p>
            {onSave && (
              <>
                <label htmlFor="mappa-reflection">
                  {it ? "La tua riflessione" : "Sua reflexão"}
                </label>
                <textarea
                  id="mappa-reflection"
                  rows={4}
                  maxLength={10000}
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  placeholder={
                    it
                      ? "Un pensiero da custodire…"
                      : "Um pensamento para guardar…"
                  }
                />
                <button
                  className="button primary"
                  disabled={!ready || !reflection.trim()}
                  onClick={() => {
                    if (onSave(reflection)) setReflection("");
                  }}
                >
                  <PenLine size={16} />
                  {it ? "Salva nel Quaderno" : "Salvar no Caderno"}
                </button>
                {saved && (
                  <p className="mappa-save-confirmation" role="status">
                    <Check size={16} />
                    {it
                      ? "Riflessione salvata nel tuo Quaderno."
                      : "Reflexão salva no seu Caderno."}
                  </p>
                )}
              </>
            )}
          </section>
        </>
      )}
      <div className="mappa-sources">
        <button
          aria-expanded={sources}
          className="mappa-link"
          onClick={() => setSources(!sources)}
        >
          {it ? "Note editoriali e fonti" : "Notas editoriais e fontes"}
          {sources ? <Minus size={15} /> : <Plus size={15} />}
        </button>
        {sources && (
          <div>
            <p>
              {it
                ? "Scheda introduttiva originale Fideora. I riferimenti aprono l’edizione storica del lettore; non riproduciamo qui il testo CEI."
                : "Ficha introdutória original Fideora. As referências abrem a edição histórica do leitor; não reproduzimos aqui o texto CEI."}
            </p>
            {MAPPA_SOURCES.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.name} · BibbiaEdu ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function MappaHome({
  bible,
  onRead,
  onPray,
  onStudy,
  onCompleted,
}) {
  const { language, l, getFormattedDate } = useLanguage();
  const { user } = useAuth();
  const { can, request } = usePremium();
  const { entries, write, ready } = useStudy();
  const [view, setView] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const storageKey = `fideoraMappa:${user?.id || "guest"}`;
  const [visited, setVisited] = useState(
    () => safeGetJSON(storageKey).matteo === true,
  );
  const [hasName] = useState(() => Boolean(safeGet("fideoraUserName")));
  const daily = dailyReading();
  const day = localDateKey();
  const done = entries.some((entry) => entry.id === `reading:${day}`);
  const open = (next) => {
    if (next === "matteo") {
      safeSetJSON(storageKey, { matteo: true });
      setVisited(true);
    }
    setView(next);
    window.scrollTo?.(0, 0);
  };
  const read = (reference) => {
    if (can("bible")) onRead(reference);
    else request("mappa");
  };
  const save = (value) => {
    const note = mappaNote(language, value);
    if (!note) return false;
    // Note IDs are local record keys, never authentication or billing authority.
    // iOS 15.0–15.3 lacks crypto.randomUUID.
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const ok = write(`note:${id}`, "note", note);
    setSaved(Boolean(ok));
    setSaveError(!ok);
    return Boolean(ok);
  };
  const back = (
    <button className="mappa-back" onClick={() => open("overview")}>
      <ArrowLeft size={17} />
      {l("La tua Mappa", "Seu Mapa")}
    </button>
  );
  if (view === "matteo")
    return (
      <div className="mappa-experience">
        {back}
        <MatthewDetail
          language={language}
          onRead={read}
          onCompare={() => open("gospels")}
          onSave={save}
          saved={saved}
          ready={ready}
          full={can("guides")}
          onPremium={() => request("mappa")}
        />
        {saveError && (
          <p role="alert">
            {l(
              "Non è stato possibile salvare. Riprova.",
              "Não foi possível salvar. Tente novamente.",
            )}
          </p>
        )}
      </div>
    );
  if (view === "gospels")
    return (
      <div className="mappa-experience">
        {back}
        <GospelComparison
          language={language}
          onRead={read}
          onMatthew={() => open("matteo")}
        />
      </div>
    );
  return (
    <div className="mappa-experience">
      <header className="mappa-welcome">
        <span className="eyebrow">{getFormattedDate()}</span>
        <span>
          {hasName
            ? l("Il tuo spazio di studio", "Seu espaço de estudo")
            : "FIDEORA"}
        </span>
      </header>
      <section className="mappa-hero">
        <div className="mappa-hero-copy">
          <span className="eyebrow">MAPPA DELLA BIBBIA</span>
          <h1>
            {l(
              "Ogni libro,\nun posto nella storia.",
              "Cada livro,\num lugar na história.",
            )}
          </h1>
          <p>
            {l(
              "Comprendi la Bibbia, un libro alla volta. Inizia dai Vangeli e scopri come si collegano.",
              "Compreenda a Bíblia, um livro por vez. Comece pelos Evangelhos e descubra suas conexões.",
            )}
          </p>
          <button className="button primary" onClick={() => open("matteo")}>
            {visited
              ? l("Continua con Matteo", "Continuar com Mateus")
              : l("Esplora Matteo", "Explorar Mateus")}
            <ArrowRight size={17} />
          </button>
        </div>
        <MappaArtwork />
      </section>
      <div className="mappa-heading-line">
        <h2>{l("Il tuo primo percorso", "Seu primeiro percurso")}</h2>
        <span>{l("I Vangeli", "Os Evangelhos")}</span>
      </div>
      <div className="mappa-paths">
        <button className="mappa-path" onClick={() => open("matteo")}>
          <span className="mappa-path-number">01</span>
          <div>
            <span className="eyebrow">
              {l("LA MAPPA DI UN LIBRO", "O MAPA DE UM LIVRO")}
            </span>
            <h3>
              {l(
                "Dentro il Vangelo\ndi Matteo",
                "Dentro do Evangelho\nde Mateus",
              )}
            </h3>
            <p>
              {l(
                "Il contesto, i temi e il filo del racconto.",
                "O contexto, os temas e o fio do relato.",
              )}
            </p>
            <span className="mappa-path-action">
              {visited
                ? l("Riprendi lo studio", "Retomar o estudo")
                : l("Inizia a esplorare", "Começar a explorar")}
              <ArrowUpRight size={16} />
            </span>
          </div>
        </button>
        <button className="mappa-path" onClick={() => open("gospels")}>
          <span className="mappa-path-number">02</span>
          <div>
            <span className="eyebrow">
              {l("METTI IN RELAZIONE", "FAÇA CONEXÕES")}
            </span>
            <h3>
              {l(
                "Quattro Vangeli,\nquattro prospettive",
                "Quatro Evangelhos,\nquatro perspectivas",
              )}
            </h3>
            <p>
              {l(
                "Scopri gli accenti di ogni evangelista.",
                "Conheça as ênfases de cada evangelista.",
              )}
            </p>
            <span className="mappa-path-action">
              {l("Apri il confronto", "Abrir comparação")}
              <ArrowUpRight size={16} />
            </span>
          </div>
        </button>
      </div>
      <section className="mappa-daily">
        <div className="mappa-daily-heading">
          <BookOpen size={20} />
          <span className="eyebrow">
            {l("LA LETTURA DI OGGI", "A LEITURA DE HOJE")}
          </span>
        </div>
        <div>
          <h2>{choose(daily.title, language)}</h2>
          <p>{choose(daily.reflection, language)}</p>
        </div>
        <div className="mappa-daily-actions">
          <button
            className="mappa-link"
            onClick={() => onRead({ ...daily, verse: daily.start })}
          >
            {l("Apri la lettura", "Abrir a leitura")}
            <ArrowUpRight size={16} />
          </button>
          <button
            className="mappa-link"
            disabled={!ready || done}
            onClick={() => {
              if (
                write(`reading:${day}`, "reading", {
                  date: day,
                  book: daily.book,
                  chapter: daily.chapter,
                }) !== false
              )
                onCompleted?.("reading");
            }}
          >
            <Check size={16} />
            {done ? l("Meditata", "Meditada") : l("Ho meditato", "Meditei")}
          </button>
        </div>
      </section>
      <div className="mappa-quiet-links">
        <button onClick={onStudy}>
          <PenLine size={18} />
          {l("Il tuo Quaderno", "Seu Caderno")}
          <ChevronRight size={15} />
        </button>
        <button onClick={onPray}>
          <Heart size={18} />
          {l("Un momento di preghiera", "Um momento de oração")}
          <ChevronRight size={15} />
        </button>
      </div>
      <p className="mappa-editorial-note">
        {l(
          "Primo percorso della Mappa: Matteo e i quattro Vangeli. Lettura quotidiana da un ciclo devozionale di 14 brani, distinto dal lezionario della Messa.",
          "Primeiro percurso do Mapa: Mateus e os quatro Evangelhos. Leitura diária de um ciclo devocional de 14 passagens, distinto do lecionário da Missa.",
        )}
      </p>
    </div>
  );
}
