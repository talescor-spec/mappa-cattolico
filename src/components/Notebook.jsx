import React, { useState } from "react";
import {
  Plus,
  FileText,
  Bookmark,
  Trash2,
  Pin,
  BookOpen,
  ArrowUpRight,
  Search,
  Check,
  Highlighter,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useStudy } from "../contexts/StudyContext";
import { bookNames, guides, lexicon } from "../data/content";
import { Header, Modal, Empty } from "./UI";
export default function Notebook({ bible, onRead }) {
  const { language, l } = useLanguage();
  const { entries, write, remove, ready } = useStudy();
  const index = language === "it" ? 0 : 1;
  const [tab, setTab] = useState("notes"),
    [query, setQuery] = useState(""),
    [editing, setEditing] = useState(null),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [deleting, setDeleting] = useState(null),
    [guide, setGuide] = useState(null),
    [word, setWord] = useState(null),
    [saved, setSaved] = useState(false);
  const notes = entries
    .filter(
      (e) =>
        e.kind === "note" &&
        `${e.payload.title} ${e.payload.body}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(b.payload.pinned) - Number(a.payload.pinned) ||
        Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
    );
  const verses = entries.filter(
    (e) =>
      e.kind === "verse" &&
      (e.payload.bookmarked || e.payload.note || e.payload.color),
  );
  const open = (entry) => {
    setEditing(
      entry || { id: `note:${crypto.randomUUID()}`, kind: "note", payload: {} },
    );
    setTitle(entry?.payload.title || "");
    setBody(entry?.payload.body || "");
    setSaved(false);
  };
  const persist = () => {
    write(editing.id, "note", {
      ...editing.payload,
      title: title.trim() || l("Senza titolo", "Sem título"),
      body,
    });
    setSaved(true);
  };
  const formatRef = (p) => {
    const b = bible?.books.find((b) => b.book === p.book);
    return `${b ? bookNames[language][b.bookId - 1] : p.book} ${p.chapter},${p.verse}`;
  };
  return (
    <>
      <Header
        eyebrow={l("RACCOGLI CIÒ CHE RESTA", "GUARDE O QUE PERMANECE")}
        title={l("Il tuo quaderno.", "Seu caderno.")}
        subtitle={l(
          "Parole incontrate. Pensieri da custodire.",
          "Palavras encontradas. Pensamentos para guardar.",
        )}
        action={
          <button
            className="button primary"
            disabled={!ready}
            onClick={() => open()}
          >
            <Plus size={17} />
            {l("Nuovo studio", "Novo estudo")}
          </button>
        }
      />
      <div className="segmented">
        {[
          ["notes", l("Studi", "Estudos")],
          ["saved", l("Versetti", "Versículos")],
          ["library", l("Biblioteca", "Biblioteca")],
        ].map(([id, text]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            {text}
          </button>
        ))}
      </div>
      {tab === "notes" && (
        <>
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label={l("Cerca nei tuoi studi", "Buscar em seus estudos")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={l(
                "Cerca nei tuoi studi…",
                "Busque em seus estudos…",
              )}
            />
          </div>
          {notes.length ? (
            <div className="note-grid">
              {notes.map((entry) => (
                <article className="card note-card" key={entry.id}>
                  <div className="note-meta">
                    <span>
                      <FileText size={14} />
                      {new Date(entry.updatedAt).toLocaleDateString(
                        language === "it" ? "it-IT" : "pt-BR",
                      )}
                    </span>
                    <button
                      className={`icon-button ${entry.payload.pinned ? "pinned" : ""}`}
                      aria-pressed={!!entry.payload.pinned}
                      aria-label={l("Fissa studio", "Fixar estudo")}
                      onClick={() =>
                        write(entry.id, "note", {
                          ...entry.payload,
                          pinned: !entry.payload.pinned,
                        })
                      }
                    >
                      <Pin size={16} />
                    </button>
                  </div>
                  <button className="note-open" onClick={() => open(entry)}>
                    <h3>{entry.payload.title}</h3>
                    <p>
                      {entry.payload.body?.slice(0, 160) ||
                        l(
                          "Apri e comincia a scrivere.",
                          "Abra e comece a escrever.",
                        )}
                    </p>
                  </button>
                  <button
                    className="icon-button delete-note"
                    aria-label={l("Elimina studio", "Excluir estudo")}
                    onClick={() => setDeleting(entry)}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              icon={FileText}
              title={l("Una pagina tutta tua.", "Uma página só sua.")}
              text={l(
                "Conserva una riflessione, prepara uno studio o scrivi la tua preghiera.",
                "Guarde uma reflexão, prepare um estudo ou escreva sua oração.",
              )}
              action={
                <button
                  className="button secondary"
                  disabled={!ready}
                  onClick={() => open()}
                >
                  <Plus size={16} />
                  {l("Inizia a scrivere", "Começar a escrever")}
                </button>
              }
            />
          )}
        </>
      )}
      {tab === "saved" &&
        (verses.length ? (
          <div className="saved-list">
            {verses.map((entry) => (
              <article className="card" key={entry.id}>
                <div className="section-line">
                  <span className="eyebrow">
                    {entry.payload.language === "it" ? "ITALIANO" : "PORTUGUÊS"}
                  </span>
                  <button
                    className="icon-button"
                    aria-label={l("Elimina annotazione", "Excluir anotação")}
                    onClick={() => setDeleting(entry)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <button
                  className="saved-ref"
                  onClick={() => onRead(entry.payload)}
                >
                  {formatRef(entry.payload)} <ArrowUpRight size={16} />
                </button>
                {entry.payload.note && (
                  <p className="preserve-text">{entry.payload.note}</p>
                )}
                <div className="saved-flags">
                  {entry.payload.bookmarked && (
                    <span>
                      <Bookmark size={13} />
                      {l("Preferito", "Favorito")}
                    </span>
                  )}
                  {entry.payload.color && (
                    <span>
                      <Highlighter size={13} />
                      {l("Evidenziato", "Destacado")}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            icon={Bookmark}
            title={l(
              "Le parole da ritrovare.",
              "As palavras para reencontrar.",
            )}
            text={l(
              "Tocca un versetto nella Bibbia per aggiungere una nota, un colore o un preferito.",
              "Toque em um versículo na Bíblia para adicionar uma nota, uma cor ou um favorito.",
            )}
            action={
              <button
                className="button secondary"
                onClick={() => onRead({ book: "John", chapter: 1 })}
              >
                <BookOpen size={16} />
                {l("Apri la Bibbia", "Abrir a Bíblia")}
              </button>
            }
          />
        ))}
      {tab === "library" && (
        <>
          <div className="section-line">
            <h2>
              {l(
                "Piccole guide, letture profonde.",
                "Pequenos guias, leituras profundas.",
              )}
            </h2>
            <span className="caption">
              {l("A cura di Fideora", "Editorial Fideora")}
            </span>
          </div>
          <div className="guide-grid">
            {guides.map((g, i) => (
              <button
                key={i}
                className="card guide-card"
                onClick={() => setGuide(g)}
              >
                <span className="guide-number">0{i + 1}</span>
                <BookOpen size={24} />
                <h3>{g.title[index]}</h3>
                <span className="text-button">
                  {l("Leggi la guida", "Ler o guia")}
                  <ArrowUpRight size={15} />
                </span>
              </button>
            ))}
          </div>
          <h2>{l("Le parole delle origini", "As palavras das origens")}</h2>
          <p className="muted">
            {l(
              "Otto schede introduttive con riferimenti biblici.",
              "Oito verbetes introdutórios com referências bíblicas.",
            )}
          </p>
          <div className="word-grid">
            {lexicon.map((w) => (
              <button
                key={w.id}
                className="card word-card"
                onClick={() => setWord(w)}
              >
                <span className="original-word" dir="auto">
                  {w.word}
                </span>
                <strong>{w.translit}</strong>
                <small>
                  {w.lang[index]} · {w.strong}
                </small>
              </button>
            ))}
          </div>
        </>
      )}
      {editing && (
        <Modal
          wide
          title={l("Quaderno di studio", "Caderno de estudo")}
          onClose={() => {
            if (!saved && (title.trim() || body.trim())) persist();
            setEditing(null);
          }}
        >
          <label htmlFor="study-title">{l("Titolo", "Título")}</label>
          <input
            id="study-title"
            value={title}
            maxLength={160}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaved(false);
            }}
            placeholder={l(
              "Dai un titolo al tuo pensiero",
              "Dê um título ao seu pensamento",
            )}
          />
          <label htmlFor="study-body">
            {l("Riflessione, studio o preghiera", "Reflexão, estudo ou oração")}
          </label>
          <textarea
            className="study-editor"
            id="study-body"
            value={body}
            maxLength={30000}
            rows={14}
            onChange={(e) => {
              setBody(e.target.value);
              setSaved(false);
            }}
            placeholder={l(
              "Una parola che mi accompagna…\n\nChe cosa dice il testo?\nChe cosa mi invita a vivere?",
              "Uma palavra que me acompanha…\n\nO que o texto diz?\nO que me convida a viver?",
            )}
          />
          <div className="section-line">
            <small className="caption">
              {body.length.toLocaleString()} / 30.000
            </small>
            <button
              className="button primary"
              disabled={!ready}
              onClick={persist}
            >
              {saved ? <Check size={16} /> : <FileText size={16} />}
              {saved
                ? l("Salvato", "Salvo")
                : l("Salva studio", "Salvar estudo")}
            </button>
          </div>
        </Modal>
      )}
      {deleting && (
        <Modal
          title={l("Eliminare questo elemento?", "Excluir este item?")}
          onClose={() => setDeleting(null)}
        >
          <p>
            {l(
              "L’elemento verrà rimosso anche dagli altri dispositivi quando la sincronizzazione è attiva.",
              "O item também será removido dos outros dispositivos quando a sincronização estiver ativa.",
            )}
          </p>
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
      {guide && (
        <Modal wide title={guide.title[index]} onClose={() => setGuide(null)}>
          <p className="eyebrow">
            FIDEORA · {l("GUIDA ALLA LETTURA", "GUIA DE LEITURA")}
          </p>
          <div className="prose">
            {guide.body[index].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <button
            className="button primary"
            onClick={() => {
              onRead({
                book: guide.ref[0],
                chapter: guide.ref[1],
                verse: guide.ref[2],
              });
              setGuide(null);
            }}
          >
            <BookOpen size={16} />
            {l("Leggi il brano", "Ler a passagem")}
          </button>
        </Modal>
      )}
      {word && (
        <Modal title={word.translit} onClose={() => setWord(null)}>
          <div className="lexicon-detail">
            <p className="eyebrow">
              {word.lang[index]} · {word.strong}
            </p>
            <h3 dir="auto">{word.word}</h3>
            <p>{word.meaning[index]}</p>
            {word.refs.map(([b, c, v]) => (
              <button
                className="button secondary"
                key={`${b}${c}${v}`}
                onClick={() => {
                  onRead({ book: b, chapter: c, verse: v });
                  setWord(null);
                }}
              >
                {formatRef({ book: b, chapter: c, verse: v })}
                <ArrowUpRight size={15} />
              </button>
            ))}
            <p className="caption">
              {l(
                "Lessico Strong (1890); scheda editoriale Fideora. Il significato dipende dal contesto.",
                "Léxico Strong (1890); verbete editorial Fideora. O sentido depende do contexto.",
              )}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
