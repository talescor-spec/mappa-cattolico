// Review-only entry: excluded from normal web/native bundles. No billing or entitlement overrides.
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { MatthewDetail, GospelComparison } from "./components/Mappa";
import Onboarding from "./components/Onboarding";
import { DevelopmentToolsPanel } from "./components/DevelopmentTools";
import { Mark } from "./components/UI";
import "./styles.css";
import "./mappa.css";
function Review() {
  const { language, changeLanguage, l } = useLanguage();
  const [page, setPage] = useState("matteo"),
    [onboard, setOnboard] = useState(false),
    [development, setDevelopment] = useState(false);
  const [saved, setSaved] = useState(false),
    [notes, setNotes] = useState([]);
  return (
    <div className="mappa-review">
      <header className="topbar">
        <div className="mobile-brand" style={{ display: "flex" }}>
          <Mark />
          <strong>Fideora</strong>
        </div>
        <select
          aria-label="Lingua"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
        </select>
      </header>
      <div className="mappa-review-tools">
        <span>{l("ANTEPRIMA EDITORIALE · V1", "PRÉVIA EDITORIAL · V1")}</span>
        <nav aria-label="Anteprima">
          <a href="/">Home</a>
          <button onClick={() => setPage("matteo")}>Matteo</button>
          <button onClick={() => setPage("gospels")}>
            {l("Confronto", "Comparação")}
          </button>
          <button onClick={() => setOnboard(true)}>Onboarding</button>
          <button onClick={() => setDevelopment(true)}>QA</button>
        </nav>
      </div>
      <main className="mappa-experience">
        {page === "matteo" ? (
          <MatthewDetail
            language={language}
            onCompare={() => {
              setPage("gospels");
              window.scrollTo(0, 0);
            }}
            saved={saved}
            onSave={(value) => {
              setNotes([...notes, value]);
              setSaved(true);
              return true;
            }}
          />
        ) : (
          <GospelComparison
            language={language}
            onMatthew={() => {
              setPage("matteo");
              window.scrollTo(0, 0);
            }}
          />
        )}
        {notes.length > 0 && (
          <section className="mappa-sample" style={{ marginTop: 30 }}>
            <h2>{l("Riflessioni di prova", "Reflexões de demonstração")}</h2>
            <p className="mappa-editorial-note">
              {l(
                "Solo in questa anteprima, fino alla chiusura della pagina.",
                "Somente nesta prévia, até fechar a página.",
              )}
            </p>
            {notes.map((note, i) => (
              <p key={i}>{note}</p>
            ))}
          </section>
        )}
      </main>
      {onboard && <Onboarding hardPaywall onFinish={() => setOnboard(false)} />}
      {development && (
        <DevelopmentToolsPanel
          environment={{ allowed: true, channel: "web-local" }}
          onClose={() => setDevelopment(false)}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <Review />
  </LanguageProvider>,
);
