import React, { useState } from 'react';
import { Check, Cloud, LogOut, Mail, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { safeGet } from '../utils/storage';

const copy = {
  it: {
    title: 'Account Fideora', subtitle: 'Sincronizza i tuoi progressi in modo sicuro tra i dispositivi.', email: 'Email', send: 'Invia link di accesso', sending: 'Invio…', sent: 'Controlla la tua email. Ti abbiamo inviato un link sicuro per accedere.', signed: 'Account connesso', synced: 'Progressi sincronizzati', syncing: 'Sincronizzazione…', error: 'Sincronizzazione non riuscita', signOut: 'Esci', delete: 'Elimina account', deleteTitle: 'Eliminare definitivamente il tuo account?', deleteBody: 'Profilo e progressi Fideora verranno eliminati. Se hai un abbonamento Apple attivo, l’eliminazione dell’account non annulla automaticamente l’abbonamento: gestiscilo nelle impostazioni Apple.', cancel: 'Annulla', confirm: 'Elimina definitivamente', invalid: 'Inserisci un indirizzo email valido.', generic: 'Non è stato possibile completare l’operazione. Riprova.'
  },
  fr: {
    title: 'Compte Fideora', subtitle: 'Synchronisez vos progrès en toute sécurité entre vos appareils.', email: 'E-mail', send: 'Envoyer le lien de connexion', sending: 'Envoi…', sent: 'Consultez votre e-mail. Nous vous avons envoyé un lien sécurisé pour vous connecter.', signed: 'Compte connecté', synced: 'Progression synchronisée', syncing: 'Synchronisation…', error: 'Échec de synchronisation', signOut: 'Se déconnecter', delete: 'Supprimer le compte', deleteTitle: 'Supprimer définitivement votre compte ?', deleteBody: 'Votre profil et votre progression Fideora seront supprimés. Si vous avez un abonnement Apple actif, supprimer le compte ne l’annule pas automatiquement : gérez-le dans les réglages Apple.', cancel: 'Annuler', confirm: 'Supprimer définitivement', invalid: 'Saisissez une adresse e-mail valide.', generic: 'Impossible de terminer cette opération. Réessayez.'
  },
  es: {
    title: 'Cuenta Fideora', subtitle: 'Sincroniza tu progreso de forma segura entre dispositivos.', email: 'Correo electrónico', send: 'Enviar enlace de acceso', sending: 'Enviando…', sent: 'Revisa tu correo. Te enviamos un enlace seguro para iniciar sesión.', signed: 'Cuenta conectada', synced: 'Progreso sincronizado', syncing: 'Sincronizando…', error: 'Error de sincronización', signOut: 'Cerrar sesión', delete: 'Eliminar cuenta', deleteTitle: '¿Eliminar tu cuenta de forma permanente?', deleteBody: 'Se eliminarán tu perfil y progreso de Fideora. Si tienes una suscripción activa de Apple, eliminar la cuenta no la cancela automáticamente: adminístrala en los ajustes de Apple.', cancel: 'Cancelar', confirm: 'Eliminar definitivamente', invalid: 'Introduce un correo electrónico válido.', generic: 'No se pudo completar la operación. Inténtalo de nuevo.'
  },
  pt: {
    title: 'Conta Fideora', subtitle: 'Sincronize seu progresso com segurança entre dispositivos.', email: 'E-mail', send: 'Enviar link de acesso', sending: 'Enviando…', sent: 'Confira seu e-mail. Enviamos um link seguro para entrar na Fideora.', signed: 'Conta conectada', synced: 'Progresso sincronizado', syncing: 'Sincronizando…', error: 'Falha na sincronização', signOut: 'Sair da conta', delete: 'Excluir conta', deleteTitle: 'Excluir sua conta permanentemente?', deleteBody: 'Seu perfil e progresso da Fideora serão apagados. Se houver uma assinatura Apple ativa, excluir a conta não cancela a assinatura automaticamente: ela deve ser gerenciada nos Ajustes da Apple.', cancel: 'Cancelar', confirm: 'Excluir permanentemente', invalid: 'Digite um e-mail válido.', generic: 'Não foi possível concluir a operação. Tente novamente.'
  },
  en: {
    title: 'Fideora Account', subtitle: 'Securely sync your progress across devices.', email: 'Email', send: 'Send sign-in link', sending: 'Sending…', sent: 'Check your email. We sent you a secure link to sign in.', signed: 'Account connected', synced: 'Progress synced', syncing: 'Syncing…', error: 'Sync failed', signOut: 'Sign out', delete: 'Delete account', deleteTitle: 'Permanently delete your account?', deleteBody: 'Your Fideora profile and progress will be deleted. If you have an active Apple subscription, deleting your account does not automatically cancel it; manage it in Apple Settings.', cancel: 'Cancel', confirm: 'Delete permanently', invalid: 'Enter a valid email address.', generic: 'We could not complete that action. Please try again.'
  },
  de: {
    title: 'Fideora-Konto', subtitle: 'Synchronisiere deinen Fortschritt sicher auf mehreren Geräten.', email: 'E-Mail', send: 'Anmeldelink senden', sending: 'Wird gesendet…', sent: 'Prüfe deine E-Mail. Wir haben dir einen sicheren Anmeldelink geschickt.', signed: 'Konto verbunden', synced: 'Fortschritt synchronisiert', syncing: 'Synchronisierung…', error: 'Synchronisierung fehlgeschlagen', signOut: 'Abmelden', delete: 'Konto löschen', deleteTitle: 'Konto dauerhaft löschen?', deleteBody: 'Dein Fideora-Profil und dein Fortschritt werden gelöscht. Ein aktives Apple-Abonnement wird dadurch nicht automatisch gekündigt; verwalte es in den Apple-Einstellungen.', cancel: 'Abbrechen', confirm: 'Dauerhaft löschen', invalid: 'Gib eine gültige E-Mail-Adresse ein.', generic: 'Die Aktion konnte nicht abgeschlossen werden. Bitte versuche es erneut.'
  },
};

export default function AccountPanel() {
  const { language } = useLanguage();
  const {
    user,
    loading,
    syncStatus,
    lastError,
    sendMagicLink,
    signOut,
    deleteAccount,
  } = useAuth();
  const c = copy[language] || copy.en;
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const submitEmail = async (event) => {
    event.preventDefault();
    setMessage('');
    setBusy(true);
    try {
      await sendMagicLink({
        email,
        displayName: safeGet('fideoraUserName', ''),
        locale: language,
      });
      setMessage(c.sent);
    } catch (error) {
      setMessage(error?.message === 'invalid_email' ? c.invalid : c.generic);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    setMessage('');
    try {
      await deleteAccount();
    } catch {
      setMessage(c.generic);
      setBusy(false);
    }
  };

  const statusLabel = syncStatus === 'syncing' ? c.syncing : syncStatus === 'error' ? c.error : c.synced;

  return (
    <section className="account-card" aria-busy={busy || loading}>
      <div className="account-heading">
        <span className="account-icon"><ShieldCheck size={18} /></span>
        <div><h3>{c.title}</h3><p>{c.subtitle}</p></div>
      </div>

      {!user ? (
        <form className="account-login" onSubmit={submitEmail}>
          <label htmlFor="fideora-account-email">{c.email}</label>
          <div className="account-email-row">
            <span><Mail size={17} /></span>
            <input
              id="fideora-account-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@email.com"
              disabled={busy || loading}
            />
          </div>
          <button className="button primary wide" type="submit" disabled={busy || loading || !email.trim()}>
            {busy ? c.sending : c.send}
          </button>
          {message && <p className="account-message">{message}</p>}
        </form>
      ) : (
        <div className="account-connected">
          <div className="account-status-row">
            <div><span>{c.signed}</span><strong>{user.email || 'Fideora ID'}</strong></div>
            <span className={`cloud-state ${syncStatus}`}><Cloud size={15} /> {statusLabel}</span>
          </div>
          {lastError && syncStatus === 'error' && <p className="account-message error">{lastError}</p>}
          <button className="account-action" type="button" onClick={() => signOut()} disabled={busy}>
            <LogOut size={16} /><span>{c.signOut}</span>
          </button>
          <button className="account-action danger" type="button" onClick={() => setConfirmDelete(true)} disabled={busy}>
            <Trash2 size={16} /><span>{c.delete}</span>
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="account-delete-box">
          <div className="delete-mark"><Trash2 size={18} /></div>
          <div><h4>{c.deleteTitle}</h4><p>{c.deleteBody}</p></div>
          <div className="delete-actions">
            <button className="button secondary" type="button" onClick={() => setConfirmDelete(false)} disabled={busy}>{c.cancel}</button>
            <button className="button danger-button" type="button" onClick={handleDelete} disabled={busy}>{busy ? '…' : c.confirm}</button>
          </div>
        </div>
      )}

      {user && syncStatus === 'synced' && <div className="account-trust"><Check size={13} /> {c.synced}</div>}
    </section>
  );
}
