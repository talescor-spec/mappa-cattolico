import React, { useCallback, useEffect, useState } from "react";
import {
  Map,
  Leaf,
  ArrowUpRight,
  BookOpen,
  Heart,
  User,
  ChevronRight,
  CloudOff,
  PenLine,
  WifiOff,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { StudyProvider, useStudy } from "./contexts/StudyContext";
import { useAuth } from "./contexts/AuthContext";
import { bookNames, dailyReading } from "./data/content";
import { safeGet, safeSet, safeGetJSON, safeSetJSON } from "./utils/storage";
import useBible from "./hooks/useBible";
import Bible from "./components/Bible";
import Notebook from "./components/Notebook";
import Prayer from "./components/Prayer";
import Profile from "./components/Profile";
import { Header, Mark, Modal, Row } from "./components/UI";
import { PremiumProvider, usePremium } from "./contexts/PremiumContext";
import { PremiumOffer } from "./components/Premium";
import Onboarding from "./components/Onboarding";
import MappaHome from "./components/Mappa";
import HardPaywallGate from "./components/HardPaywallGate";
import { isIOSNative } from "./services/purchases";
import {
  ENTRY_ACCESS_KEY,
  initializeEntryAccess,
  entryScreen,
} from "./utils/entryAccess";
import useReviewMoments from "./hooks/useReviewMoments";
import {
  configureReminders,
  engagement,
  hasEngagement,
  REMINDERS_KEY,
} from "./services/engagement";
import "./styles.css";
import "./mappa.css";
export function Fideora() {
  const { language, changeLanguage, l } = useLanguage();
  const { user } = useAuth();
  const { request, checking, isPremium, busy, offer, message, billingProvider } = usePremium();
  const [entryMode] = useState(() =>
    initializeEntryAccess({
      native: isIOSNative(),
      read: safeGet,
      write: safeSet,
    }),
  );
  const { storageError } = useStudy();
  const [page, setPage] = useState("today"),
    [location, setLocation] = useState(() =>
      safeGetJSON("fideoraLastReading", { book: "John", chapter: 1 }),
    ),
    [sources, setSources] = useState(false),
    [legal, setLegal] = useState(null),
    [online, setOnline] = useState(navigator.onLine),
    [onboard, setOnboard] = useState(() => safeGet("fideoraOnboarded") !== "1"),
    [reminderRoute, setReminderRoute] = useState(""),
    [guidedPrayer, setGuidedPrayer] = useState(false);
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
  const navigate = useCallback((target) => {
    setPage(target);
    window.scrollTo(0, 0);
  }, []);
  const read = useCallback(
    (p) => {
      if (p.language) changeLanguage(p.language);
      const value = { book: p.book, chapter: p.chapter, verse: p.verse };
      setLocation(value);
      safeSetJSON("fideoraLastReading", value);
      navigate("bible");
    },
    [changeLanguage, navigate],
  );
  const screen = entryScreen({ onboard, mode: entryMode, checking, isPremium });
  const onGuidedPrayerOpened = useCallback(() => setGuidedPrayer(false), []);
  const onCompleted = useReviewMoments({
    ready:
      screen === "content" && !checking && !sources && !legal && !reminderRoute,
    blocked: Boolean(
      busy || offer || message === "error" || storageError || error,
    ),
    atHome: page === "today",
    locale: language,
  });
  useEffect(() => {
    if (!hasEngagement()) return;
    const settings = safeGetJSON(REMINDERS_KEY);
    if (settings.reading || settings.prayer)
      void configureReminders(settings, language).catch(() => {});
  }, [language]);
  useEffect(() => {
    if (!hasEngagement()) return;
    let mounted = true;
    const take = async () => {
      if (!mounted) return;
      const { route } = await engagement.takeReminderRoute();
      if (mounted && (route === "reading" || route === "prayer"))
        setReminderRoute(route);
    };
    const subscription = engagement.addListener(
      "reminderTapped",
      () => void take().catch(() => {}),
    );
    subscription.then(take).catch(() => {});
    return () => {
      mounted = false;
      subscription.then((handle) => handle.remove()).catch(() => {});
    };
  }, []);
  useEffect(() => {
    if (screen !== "content" || checking || busy || offer || !reminderRoute)
      return;
    if (reminderRoute === "reading") {
      const daily = dailyReading();
      read({ ...daily, verse: daily.start });
    } else {
      setGuidedPrayer(true);
      navigate("pray");
    }
    setReminderRoute("");
  }, [screen, checking, busy, offer, reminderRoute, read, navigate]);
  if (screen === "onboarding")
    return (
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
  if (screen !== "content")
    return <HardPaywallGate checking={screen === "checking"} />;
  const tabs = [
    ["today", Map, l("Mappa", "Mapa")],
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
            <MappaHome
              bible={bible}
              onRead={read}
              onPray={() => navigate("pray")}
              onStudy={() => navigate("notebook")}
              onCompleted={onCompleted}
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
          {page === "pray" && (
            <Prayer
              onCompleted={onCompleted}
              guidedPrayer={guidedPrayer}
              onGuidedPrayerOpened={onGuidedPrayerOpened}
            />
          )}
          {page === "profile" && (
            <Profile onSources={() => setSources(true)} onLegal={kind => billingProvider === 'hotmart' ? window.location.assign(`/${kind}.html?lang=${language}`) : setLegal(kind)} />
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
