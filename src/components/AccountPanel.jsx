import React, { useState } from "react";
import { Cloud, LogOut, Mail, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useStudy } from "../contexts/StudyContext";
import { usePremium } from "../contexts/PremiumContext";
import { safeGet } from "../utils/storage";
import { Modal } from "./UI";
export default function AccountPanel() {
  const { language, l } = useLanguage();
  const {
    user,
    loading,
    syncStatus,
    sendMagicLink,
    verifyEmailCode,
    signOut,
    deleteAccount,
  } = useAuth();
  const study = useStudy();
  const { isPremium } = usePremium();
  const [connect, setConnect] = useState(false);
  const [email, setEmail] = useState(""),
    [code, setCode] = useState(""),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [confirm, setConfirm] = useState(false);
  const act = async (fn) => {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch {
      setMessage(
        l(
          "Operazione non riuscita. Controlla la connessione e riprova.",
          "Não foi possível concluir. Verifique a conexão e tente novamente.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card account-card">
      <div className="account-heading">
        <ShieldCheck size={22} />
        <div>
          <h3>{user ? l("Il tuo account Fideora", "Sua conta Fideora") : l("Sincronizza i tuoi dati", "Sincronize seus dados")}</h3>
          <p>
            {l(
              "Collega la tua email per ritrovare profilo e progressi su un altro dispositivo. La sincronizzazione è facoltativa.",
              "Vincule seu e-mail para recuperar perfil e progresso em outro dispositivo. A sincronização é opcional.",
            )}
          </p>
        </div>
      </div>
      {!user && isPremium && !connect && !sent ? (
        <button type="button" className="button secondary" onClick={() => setConnect(true)}>
          <Cloud size={16} />
          {l("Attiva sincronizzazione", "Ativar sincronização")}
        </button>
      ) : !user ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act(async () => {
              await sendMagicLink({ email, locale: language, displayName: safeGet("fideoraUserName") });
              setSent(true);
              setMessage(
                l(
                  "Controlla la tua email: apri il link o copialo e incollalo qui per accedere su questo dispositivo.",
                  "Confira seu e-mail: abra o link ou copie e cole aqui para entrar neste dispositivo.",
                ),
              );
            });
          }}
        >
          <label htmlFor="account-email">
            {l("Indirizzo email", "Endereço de e-mail")}
          </label>
          <input
            id="account-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSent(false);
            }}
            disabled={busy}
            placeholder="nome@email.com"
          />
          <button
            className="button primary"
            disabled={loading || busy || !email.trim()}
          >
            <Mail size={16} />
            {busy
              ? l("Invio…", "Enviando…")
              : sent
                ? l("Invia di nuovo", "Enviar novamente")
                : l("Collega la tua email", "Vincular meu e-mail")}
          </button>
          {sent && (
            <div className="otp-form">
              <label htmlFor="email-code">
                {l(
                  "Codice o link copiato dall’email",
                  "Código ou link copiado do e-mail",
                )}
              </label>
              <input
                id="email-code"
                autoComplete="one-time-code"
                maxLength={2048}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="button"
                className="button secondary"
                disabled={busy || code.length < 6}
                onClick={() => act(() => verifyEmailCode(email, code))}
              >
                {l("Conferma accesso", "Confirmar acesso")}
              </button>
            </div>
          )}
          <p className="caption">
            {l(
              "L’accesso crea un account se non ne hai già uno. Leggi Termini e Privacy qui sotto prima di continuare.",
              "O acesso cria uma conta caso você ainda não tenha uma. Leia os Termos e a Privacidade abaixo antes de continuar.",
            )}
          </p>
        </form>
      ) : (
        <>
          <p className="account-email">{user.email}</p>
          <p className="sync-label">
            <Cloud size={15} />
            {syncStatus === "synced"
              ? l(
                  "Profilo e progresso sincronizzati",
                  "Perfil e progresso sincronizados",
                )
              : syncStatus === "error"
                ? l(
                    "Sincronizzazione non riuscita. I dati locali restano disponibili.",
                    "Falha na sincronização. Seus dados locais continuam disponíveis.",
                  )
                : l("Sincronizzazione del profilo…", "Sincronizando perfil…")}
          </p>
          <label className="switch-row">
            <span>
              <strong>
                {l("Sincronizza il quaderno", "Sincronizar caderno")}
              </strong>
              <small>
                {l(
                  "Include note, versetti e intenzioni. Possono contenere informazioni personali sulla fede. Disattivare interrompe i nuovi invii; non cancella i dati già sincronizzati.",
                  "Inclui notas, versículos e intenções. Podem conter informações pessoais sobre a fé. Desativar interrompe novos envios; não exclui dados já sincronizados.",
                )}
              </small>
            </span>
            <input
              type="checkbox"
              checked={study.consent}
              onChange={(e) => study.setCloudConsent(e.target.checked)}
            />
          </label>
          {study.consent && (
            <button
              className="button secondary"
              disabled={busy || study.status === "syncing"}
              onClick={() => study.sync()}
            >
              <Cloud size={16} />
              {study.status === "error"
                ? l("Riprova sincronizzazione", "Tentar sincronizar novamente")
                : study.status === "synced"
                  ? l("Quaderno sincronizzato", "Caderno sincronizado")
                  : l("Sincronizza ora", "Sincronizar agora")}
            </button>
          )}
          <div className="button-row">
            <button
              className="text-button"
              disabled={busy || study.status === "syncing"}
              onClick={() => act(signOut)}
            >
              <LogOut size={16} />
              {l("Esci dall’account", "Sair da conta")}
            </button>
            <button
              className="text-button danger"
              disabled={busy}
              onClick={() => setConfirm(true)}
            >
              <Trash2 size={16} />
              {l("Elimina account", "Excluir conta")}
            </button>
          </div>
        </>
      )}
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {confirm && (
        <Modal
          title={l("Eliminare il tuo account?", "Excluir sua conta?")}
          onClose={() => setConfirm(false)}
        >
          <p>
            {l(
              "Il profilo, il progresso e tutti i dati Fideora sincronizzati saranno eliminati definitivamente. Anche i dati locali di questo account verranno rimossi.",
              "O perfil, o progresso e todos os dados Fideora sincronizados serão excluídos permanentemente. Os dados locais desta conta também serão removidos.",
            )}
          </p>
          <p>
            {l(
              "Un eventuale abbonamento Apple non viene annullato eliminando l’account: gestiscilo nelle impostazioni Apple.",
              "Uma eventual assinatura Apple não é cancelada ao excluir a conta: gerencie-a nos Ajustes da Apple.",
            )}
          </p>
          <a
            href="https://apps.apple.com/account/subscriptions"
            target="_blank"
            rel="noreferrer"
          >
            {l("Gestisci abbonamenti Apple", "Gerenciar assinaturas Apple")}
          </a>
          <div className="button-row">
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setConfirm(false)}
            >
              {l("Annulla", "Cancelar")}
            </button>
            <button
              className="button danger-button"
              disabled={busy}
              onClick={() => act(deleteAccount)}
            >
              {busy
                ? "…"
                : l("Elimina definitivamente", "Excluir permanentemente")}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
