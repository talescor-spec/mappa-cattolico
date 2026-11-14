import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { configureReminders, REMINDERS_KEY } from "../services/engagement";
import { safeGetJSON, safeSetJSON } from "../utils/storage";

export default function Reminders() {
  const { language, l } = useLanguage();
  const [reading, setReading] = useState(() => safeGetJSON(REMINDERS_KEY).reading || "");
  const [prayer, setPrayer] = useState(() => safeGetJSON(REMINDERS_KEY).prayer || "");
  const [status, setStatus] = useState("");
  const save = async (event) => {
    event.preventDefault();
    setStatus("saving");
    try {
      const result = await configureReminders({ reading, prayer }, language, true);
      if (!safeSetJSON(REMINDERS_KEY, { reading, prayer })) throw Error("Storage unavailable");
      setStatus(result.status);
    } catch {
      setStatus("error");
    }
  };
  return (
    <section className="card">
      <h2><Bell size={18} aria-hidden="true" /> {l("Promemoria", "Lembretes")}</h2>
      <p className="caption">{l("Scegli quando dedicare un momento alla lettura o alla preghiera.", "Escolha um horário para a leitura ou oração.")}</p>
      <form onSubmit={save}>
        <fieldset disabled={status === "saving"} className="reminder-options">
          <label>
            <input type="checkbox" checked={Boolean(reading)} onChange={e => setReading(e.target.checked ? "08:00" : "")} />
            {l("Lettura quotidiana", "Leitura diária")}
          </label>
          {reading && <input aria-label={l("Ora della lettura", "Horário da leitura")} type="time" value={reading} required onChange={e => { if (e.target.value) setReading(e.target.value); }} />}
          <label>
            <input type="checkbox" checked={Boolean(prayer)} onChange={e => setPrayer(e.target.checked ? "19:00" : "")} />
            {l("Preghiera guidata", "Oração guiada")}
          </label>
          {prayer && <input aria-label={l("Ora della preghiera", "Horário da oração")} type="time" value={prayer} required onChange={e => { if (e.target.value) setPrayer(e.target.value); }} />}
        </fieldset>
        <button type="submit" className="button secondary" disabled={status === "saving"}>
          {l("Salva promemoria", "Salvar lembretes")}
        </button>
        <p role="status" className="caption">
          {status === "scheduled" && l("Promemoria attivi.", "Lembretes ativos.")}
          {status === "disabled" && l("Promemoria disattivati.", "Lembretes desativados.")}
          {status === "blocked" && l("Abilita le notifiche di Fideora nelle Impostazioni dell’iPhone.", "Ative as notificações do Fideora nos Ajustes do iPhone.")}
          {status === "error" && l("Non è stato possibile salvare. Riprova.", "Não foi possível salvar. Tente novamente.")}
        </p>
      </form>
    </section>
  );
}
