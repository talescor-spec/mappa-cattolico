import React, { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  Heart,
  User,
  ArrowUpRight,
  ChevronRight,
  Check,
  Sun,
  CloudOff,
  Leaf,
  PenLine,
  Library,
  WifiOff,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { StudyProvider, useStudy } from "./contexts/StudyContext";
import { useAuth } from "./contexts/AuthContext";
import {
  dailyReading,
  bookNames,
  localDateKey,
  mysteryToday,
} from "./data/content";
import { safeGet, safeSet, safeGetJSON, safeSetJSON } from "./utils/storage";
import useBible from "./hooks/useBible";
import Bible from "./components/Bible";
import Notebook from "./components/Notebook";
import Prayer from "./components/Prayer";
import Profile from "./components/Profile";
import { Header, Mark, Modal, Row } from "./components/UI";
import { PremiumProvider, usePremium } from "./contexts/PremiumContext";
import { PremiumCard, PremiumOffer } from "./components/Premium";
import Onboarding from "./components/Onboarding";
import HardPaywallGate from "./components/HardPaywallGate";
import { isIOSNative } from "./services/purchases";
import { ENTRY_ACCESS_KEY, initializeEntryAccess, entryScreen } from "./utils/entryAccess";
import "./styles.css";
function HomePage({ bible, onRead, onPray, onStudy }) {
  const { isPremium } = usePremium();
  const { l, language, t, getFormattedDate } = useLanguage();
  const { entries, write, ready } = useStudy();
  const index = language === "it" ? 0 : 1;
  const daily = dailyReading();
  const b = bible?.books.find((b) => b.book === daily.book);
  const first = b?.chapters
    .find((c) => c.chapter === daily.chapter)
    ?.verses.find((v) => v.number === daily.start);
  const name = safeGet("fideoraUserName");
  const today = localDateKey();
  const done = entries.some((e) => e.id === `reading:${today}`);
  return (
    <>
      <Header
        eyebrow={getFormattedDate()}
        title={
          name
            ? l(`Un momento per te, ${name}.`, `Um momento para você, ${name}.`)
            : l("Fai spazio alla tua fede.", "Abra espaço para sua fé.")
        }
        subtitle={l(
          "Un incontro con la Parola. Un piccolo passo, ogni giorno.",
          "Um encontro com a Palavra. Um pequeno passo, todos os dias.",
        )}
      />
      <div className="home-grid">
        <section className="daily-card">
          <div className="section-line">
            <span className="eyebrow">
              {l("LA LETTURA DI OGGI", "A LEITURA DE HOJE")}
            </span>
            <BookOpen size={22} />
          </div>
          <p className="daily-reference">
            {b ? bookNames[language][b.bookId - 1] : ""} {daily.chapter},
            {daily.start}–{daily.end}
          </p>
          <h2>{daily.title[index]}</h2>
          {first && <blockquote>{first.text}</blockquote>}
          <div className="daily-bottom">
            <button
              className="button light"
              onClick={() => onRead({ ...daily, verse: daily.start })}
            >
              {l("Apri la lettura", "Abrir a leitura")}
              <ArrowUpRight size={16} />
            </button>
            <span>5 {l("minuti per te", "minutos para você")}</span>
          </div>
          <div className="daily-art" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>
        <section className="card reflection-card">
          <span className="mini-icon">
            <Leaf size={20} />
          </span>
          <p className="eyebrow">
            {l("DA PORTARE CON TE", "PARA LEVAR COM VOCÊ")}
          </p>
          <h2>{l("Dalla Parola alla vita.", "Da Palavra à vida.")}</h2>
          <p>{daily.reflection[index]}</p>
          <button
            className={`button ${done ? "secondary" : "primary"}`}
            disabled={!ready || done}
            onClick={() =>
              write(`reading:${today}`, "reading", {
                date: today,
                book: daily.book,
                chapter: daily.chapter,
              })
            }
          >
            {done ? <Check size={16} /> : <Sun size={16} />}
            {done
              ? l("Un passo compiuto", "Um passo concluído")
              : l("Ho meditato oggi", "Meditei hoje")}
          </button>
        </section>
      </div>
      <p className="daily-disclaimer">
        {l(
          "Selezione devozionale Fideora · ciclo di 14 letture. Non corrisponde al lezionario della Messa.",
          "Seleção devocional Fideora · ciclo de 14 leituras. Não corresponde ao lecionário da Missa.",
        )}
      </p>
      <div className="section-line section-gap">
        <h2>
          {l("Scegli il tuo prossimo passo.", "Escolha seu próximo passo.")}
        </h2>
        <span className="caption">
          {l("Senza fretta. Con presenza.", "Sem pressa. Com presença.")}
        </span>
      </div>
      <div className="feature-grid">
        <button
          className="card feature-card"
          onClick={() => onRead({ book: "Gen", chapter: 1 })}
        >
          <span className="mini-icon">
            <BookOpen size={22} />
          </span>
          <h3>{l("Leggi e comprendi", "Leia e compreenda")}</h3>
          <p>
            {l(
              "La Bibbia, le tue note, le parole delle origini.",
              "A Bíblia, suas notas, as palavras das origens.",
            )}
          </p>
          <span className="text-button">
            {l("Esplora la Bibbia", "Explorar a Bíblia")}
            <ArrowUpRight size={16} />
          </span>
        </button>
        <button className="card feature-card" onClick={onPray}>
          <span className="mini-icon amber">
            <Heart size={22} />
          </span>
          <h3>{l("Fermati e prega", "Pare e reze")}</h3>
          <p>
            {t(mysteryToday())}.{" "}
            {l("Un’intenzione da affidare.", "Uma intenção para entregar.")}
          </p>
          <span className="text-button">
            {l("Trova il tuo silenzio", "Encontre seu silêncio")}
            <ArrowUpRight size={16} />
          </span>
        </button>
        <button className="card feature-card" onClick={onStudy}>
          <span className="mini-icon lavender">
            <PenLine size={22} />
          </span>
          <h3>{l("Custodisci un pensiero", "Guarde um pensamento")}</h3>
          <p>
            {l(
              "Un quaderno per ciò che la Parola risveglia.",
              "Um caderno para o que a Palavra desperta.",
            )}
          </p>
          <span className="text-button">
            {l("Apri il quaderno", "Abrir o caderno")}
            <ArrowUpRight size={16} />
          </span>
        </button>
      </div>
      {!isPremium && <PremiumCard feature="welcome" compact />}
      <footer className="home-footer">
        <Mark />
        <p>{l("La tua fede, ogni giorno.", "Sua fé, todos os dias.")}</p>
        <span>FIDEORA</span>
      </footer>
    </>
  );
}
export function Fideora() {
  const { language, changeLanguage, l } = useLanguage();
  const { user } = useAuth();
  const { request, checking, isPremium } = usePremium();
  const [entryMode] = useState(() => initializeEntryAccess({
    native: isIOSNative(), read: safeGet, write: safeSet,
  }));
  const { storageError } = useStudy();
  const [page, setPage] = useState("today"),
    [location, setLocation] = useState(() =>
      safeGetJSON("fideoraLastReading", { book: "John", chapter: 1 }),
    ),
    [sources, setSources] = useState(false),
    [legal, setLegal] = useState(null),
    [online, setOnline] = useState(navigator.onLine),
    [onboard, setOnboard] = useState(() => safeGet("fideoraOnboarded") !== "1");
  const { bible, error, retry } = useBible(language);
  useEffect(() => {
    const up = () => setOnline(true),
      down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  const navigate = (target) => {
    setPage(target);
    window.scrollTo(0, 0);
  };
  const read = (p) => {
    if (p.language) changeLanguage(p.language);
    const value = { book: p.book, chapter: p.chapter, verse: p.verse };
    setLocation(value);
    safeSetJSON("fideoraLastReading", value);
    navigate("bible");
  };
  const screen = entryScreen({ onboard, mode: entryMode, checking, isPremium });
  if (screen === "onboarding") return (
    <Onboarding
      bible={bible}
      hardPaywall={entryMode === "hard"}
      onFinish={(showPremium) => {
        // Never persist completion without the hard cohort marker: a partial
        // storage failure must not classify this new install as a legacy one.
        if (entryMode !== "hard" || safeSet(ENTRY_ACCESS_KEY, "hard"))
          safeSet("fideoraOnboarded", "1");
        setOnboard(false);
        if (entryMode !== "hard" && showPremium) request("welcome");
      }}
    />
  );
  if (screen !== "content") return <HardPaywallGate checking={screen === "checking"} />;
  const tabs = [
    ["today", Home, l("Oggi", "Hoje")],
    ["bible", BookOpen, l("Bibbia", "Bíblia")],
    ["notebook", PenLine, l("Quaderno", "Caderno")],
    ["pray", Heart, l("Prega", "Rezar")],
    ["profile", User, l("Profilo", "Perfil")],
  ];
  return (
    <div className="app">
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("today");
          }}
        >
          <Mark />
          <span>
            Fideora
            <small>
              {l("LA TUA FEDE, OGNI GIORNO", "SUA FÉ, TODOS OS DIAS")}
            </small>
          </span>
        </a>
        <nav aria-label={l("Navigazione principale", "Navegação principal")}>
          {tabs.map(([id, Icon, label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              aria-current={page === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
              {page === id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="sidebar-leaf">
            <Leaf size={24} />
          </span>
          <p>{l("Coltiva ciò che conta.", "Cultive o que importa.")}</p>
          <button className="text-button" onClick={() => setLegal("support")}>
            {l("Siamo qui per te", "Estamos aqui para você")}
            <ArrowUpRight size={14} />
          </button>
          <span className="sidebar-version">FIDEORA · 1.0</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Mark />
            <strong>Fideora</strong>
          </div>
          <span className="desktop-label">
            {tabs.find((t) => t[0] === page)[2]}
          </span>
          <div className="topbar-actions">
            <label className="sr-only" htmlFor="header-language">
              {l("Lingua", "Idioma")}
            </label>
            <select
              id="header-language"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>
            <button
              className="avatar-button"
              aria-label={l("Apri profilo", "Abrir perfil")}
              onClick={() => navigate("profile")}
            >
              <User size={18} />
            </button>
          </div>
        </header>
        {!online && (
          <div className="offline-banner" role="status">
            <WifiOff size={15} />
            {l(
              "Sei offline. Le letture scaricate e i tuoi appunti restano disponibili.",
              "Você está offline. As leituras baixadas e suas anotações continuam disponíveis.",
            )}
          </div>
        )}
        {storageError && (
          <div className="offline-banner" role="alert">
            {l(
              "Memoria del dispositivo piena o non disponibile. Esporta i dati prima di chiudere.",
              "Memória do dispositivo cheia ou indisponível. Exporte seus dados antes de fechar.",
            )}
          </div>
        )}
        <main id="main-content" key={`${user?.id || "guest"}:${page}`}>
          {page === "today" && (
            <HomePage
              bible={bible}
              onRead={read}
              onPray={() => navigate("pray")}
              onStudy={() => navigate("notebook")}
            />
          )}
          {page === "bible" && (
            <Bible
              bible={bible}
              error={error}
              retry={retry}
              location={location}
              onLocation={(value) => {
                setLocation(value);
                safeSetJSON("fideoraLastReading", value);
              }}
              onSources={() => setSources(true)}
            />
          )}
          {page === "notebook" && <Notebook bible={bible} onRead={read} />}
          {page === "pray" && <Prayer />}
          {page === "profile" && (
            <Profile onSources={() => setSources(true)} onLegal={setLegal} />
          )}
        </main>
        <nav
          className="bottom-nav"
          aria-label={l("Navigazione mobile", "Navegação móvel")}
        >
          {tabs.map(([id, Icon, label]) => (
            <button
              key={id}
              aria-current={page === id ? "page" : undefined}
              className={page === id ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
      <PremiumOffer />
      {sources && (
        <Modal
          title={l("Edizioni e fonti", "Edições e fontes")}
          wide
          onClose={() => setSources(false)}
        >
          <div className="prose">
            <h3>{l("Testi biblici", "Textos bíblicos")}</h3>
            <p>
              {l(
                "Italiano: Bibbia Diodati (1649). Português: Almeida (edizione 1819). Entrambe sono edizioni storiche in pubblico dominio.",
                "Italiano: Bíblia Diodati (1649). Português: Almeida (edição de 1819). Ambas são edições históricas em domínio público.",
              )}
            </p>
            <p>
              {l(
                "Queste edizioni non includono i sette libri deuterocanonici del canone cattolico e non sono il testo ufficiale della liturgia. La numerazione dei Salmi segue l’edizione del lettore.",
                "Estas edições não incluem os sete livros deuterocanônicos do cânon católico e não são o texto oficial da liturgia. A numeração dos Salmos segue a edição do leitor.",
              )}
            </p>
            <a
              href="https://github.com/midvash/bible-data"
              target="_blank"
              rel="noreferrer"
            >
              {l(
                "Consulta il corpus e le licenze",
                "Consultar o corpus e as licenças",
              )}{" "}
              ↗
            </a>
            <h3>{l("Studio e preghiera", "Estudo e oração")}</h3>
            <p>
              {l(
                "Le riflessioni, le quattro guide e le tracce delle novene sono contenuti editoriali originali Fideora. Il glossario essenziale contiene otto schede introduttive con identificatori Strong (1890), non un interlineare completo. Le citazioni vanno lette nel loro contesto.",
                "As reflexões, os quatro guias e os roteiros das novenas são conteúdo editorial original Fideora. O glossário essencial contém oito verbetes introdutórios com identificadores Strong (1890), não um interlinear completo. As citações devem ser lidas em contexto.",
              )}
            </p>
            <p>
              {l(
                "La lettura proposta ogni giorno segue un ciclo devozionale di 14 brani. Non è il Vangelo del giorno del calendario liturgico. Fideora è un progetto indipendente, non un servizio ufficiale della Chiesa.",
                "A leitura sugerida a cada dia segue um ciclo devocional de 14 passagens. Não é o Evangelho do dia do calendário litúrgico. Fideora é um projeto independente, não um serviço oficial da Igreja.",
              )}
            </p>
          </div>
        </Modal>
      )}
      {legal && (
        <Modal
          title={l(
            legal === "privacy"
              ? "Privacy"
              : legal === "terms"
                ? "Termini di utilizzo"
                : "Aiuto e supporto",
            legal === "privacy"
              ? "Privacidade"
              : legal === "terms"
                ? "Termos de uso"
                : "Ajuda e suporte",
          )}
          wide
          onClose={() => setLegal(null)}
        >
          <iframe
            title={legal}
            src={`/${legal}.html?lang=${language}`}
            className="legal-frame"
          />
          <a
            href={`/${legal}.html?lang=${language}`}
            target="_blank"
            rel="noreferrer"
            className="text-button"
          >
            {l("Apri pagina completa", "Abrir página completa")}
            <ArrowUpRight size={14} />
          </a>
        </Modal>
      )}
    </div>
  );
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <div className="fatal">
          <h1>Fideora</h1>
          <p>
            Non è stato possibile aprire questa schermata.
            <br />
            Não foi possível abrir esta tela.
          </p>
          <button
            className="button primary"
            onClick={() => window.location.reload()}
          >
            Riprova / Tentar novamente
          </button>
        </div>
      );
    return this.props.children;
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <PremiumProvider>
          <StudyProvider>
            <Fideora />
          </StudyProvider>
        </PremiumProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
