import React, { useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  User,
  Download,
  Shield,
  LifeBuoy,
  BookOpen,
  FileText,
  Mail,
  Star,
  ChevronRight,
} from "lucide-react";
import { version as appVersion } from "../../package.json";
import { useLanguage, languages } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useStudy } from "../contexts/StudyContext";
import { safeGet, safeSet, sanitizeDisplayName } from "../utils/storage";
import { Header, Row, Modal } from "./UI";
import AccountPanel from "./AccountPanel";
import { SubscriptionPanel } from "./Premium";
import Reminders from "./Reminders";
import DevelopmentTools from "./DevelopmentTools";
import {
  engagement,
  hasEngagement,
  recordReviewMetric,
} from "../services/engagement";
export default function Profile({ onSources, onLegal, restricted = false }) {
  const { language, changeLanguage, l } = useLanguage();
  const { user } = useAuth();
  const { entries } = useStudy();
  const supportEmail = "support@fideora.app";
  const supportSubject = encodeURIComponent(
    l("Feedback su Fideora", "Feedback sobre o Fideora"),
  );
  const [name, setName] = useState(() => safeGet("fideoraUserName")),
    [saved, setSaved] = useState(false),
    [exporting, setExporting] = useState(false),
    [exportError, setExportError] = useState(false),
    [reviewLinkError, setReviewLinkError] = useState(false);
  const openReview = async () => {
    setReviewLinkError(false);
    recordReviewMetric("review_link_clicked", language);
    try {
      const { opened } = await engagement.openReviewPage();
      setReviewLinkError(!opened);
    } catch {
      setReviewLinkError(true);
    }
  };
  const exportData = async () => {
    setExporting(true);
    setExportError(false);
    try {
      const content = JSON.stringify(
        {
          app: "Fideora",
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
          profile: { name, language },
          entries,
          rosary: JSON.parse(safeGet("rosaryProgress", "{}")),
          novenas: JSON.parse(safeGet("novenaProgress", "{}")),
        },
        null,
        2,
      );
      if (Capacitor.isNativePlatform()) {
        const { Filesystem, Directory } = await import("@capacitor/filesystem");
        const { Share } = await import("@capacitor/share");
        const { uri } = await Filesystem.writeFile({
          path: "fideora-export.json",
          data: content,
          directory: Directory.Cache,
          encoding: "utf8",
        });
        await Share.share({ title: "Fideora", url: uri });
      } else {
        const url = URL.createObjectURL(
          new Blob([content], { type: "application/json" }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "fideora-export.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch {
      setExportError(true);
    } finally {
      setExporting(false);
    }
  };
  return (
    <>
      <Header
        eyebrow={l("IL TUO SPAZIO", "SEU ESPAÇO")}
        title={l("A modo tuo.", "Do seu jeito.")}
        subtitle={l(
          "Le tue preferenze. La tua esperienza di fede.",
          "Suas preferências. Sua experiência de fé.",
        )}
      />
      {!restricted && <DevelopmentTools />}
      <div className="profile-layout">
        <div>
          <section className="card">
            <div className="profile-avatar">
              <User size={30} />
            </div>
            <h2>{name || l("Benvenuto in Fideora", "Bem-vindo ao Fideora")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const next = sanitizeDisplayName(name);
                safeSet("fideoraUserName", next);
                setName(next);
                setSaved(true);
              }}
            >
              <label htmlFor="display-name">
                {l("Come ti chiami?", "Como você se chama?")}
              </label>
              <input
                id="display-name"
                value={name}
                maxLength={60}
                autoComplete="given-name"
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
              <button className="button secondary">
                {saved ? l("Salvato", "Salvo") : l("Salva nome", "Salvar nome")}
              </button>
            </form>
            <hr />
            <label htmlFor="profile-language">
              {l("Lingua dell’app", "Idioma do aplicativo")}
            </label>
            <select
              id="profile-language"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              {Object.entries(languages).map(([code, item]) => (
                <option value={code} key={code}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="caption">
              {user
                ? l(
                    "Profilo associato al tuo account.",
                    "Perfil associado à sua conta.",
                  )
                : l(
                    "Profilo su questo dispositivo. Puoi attivare la sincronizzazione via email qui sotto.",
                    "Perfil neste dispositivo. Você pode ativar a sincronização por e-mail abaixo.",
                  )}
            </p>
          </section>
          <button
            className="button secondary export-button"
            disabled={exporting}
            onClick={exportData}
          >
            <Download size={17} />
            {l("Esporta i miei dati", "Exportar meus dados")}
          </button>
          {exportError && (
            <p role="alert">
              {l(
                "Esportazione non riuscita. Riprova.",
                "Não foi possível exportar. Tente novamente.",
              )}
            </p>
          )}
        </div>
        <div>
          {!restricted && <SubscriptionPanel />}
          {!restricted && hasEngagement() && <Reminders />}
          <AccountPanel />
          <section className="card rows legal-rows">
            {hasEngagement() && (
              <Row
                icon={Star}
                title={l(
                  "Valuta Fideora sull’App Store",
                  "Avaliar Fideora na App Store",
                )}
                onClick={openReview}
              />
            )}
            <Row
              icon={Mail}
              title={l(
                "Invia un feedback all’assistenza",
                "Enviar feedback ao suporte",
              )}
              subtitle={supportEmail}
              href={`mailto:${supportEmail}?subject=${supportSubject}`}
            />
            <Row
              icon={Shield}
              title={l("Privacy", "Privacidade")}
              onClick={() => onLegal("privacy")}
            />
            <Row
              icon={FileText}
              title={l("Termini di utilizzo", "Termos de uso")}
              onClick={() => onLegal("terms")}
            />
            <Row
              icon={LifeBuoy}
              title={l("Aiuto e supporto", "Ajuda e suporte")}
              onClick={() => onLegal("support")}
            />
            <Row
              icon={BookOpen}
              title={l("Edizioni e fonti", "Edições e fontes")}
              onClick={onSources}
            />
          </section>
          {reviewLinkError && (
            <p role="alert">
              {l(
                "Non è stato possibile aprire l’App Store. Riprova.",
                "Não foi possível abrir a App Store. Tente novamente.",
              )}
            </p>
          )}
          <p className="version">
            Fideora · {appVersion}
            <br />
            {l("Coltiva ciò che conta.", "Cultive o que importa.")}
          </p>
        </div>
      </div>
    </>
  );
}
