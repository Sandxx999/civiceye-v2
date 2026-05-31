import { Plus, Search } from "lucide-react";
import { translations } from "../utils/constants";

export default function Success({ ticketId, onTrack, onNew, language }) {
  const t = translations[language];

  return (
    <section className="success panel">
      <h2>{t.success}</h2>
      <p>{t.ticket_ready}</p>
      <div className="success-code">{ticketId}</div>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <button className="primary-btn" onClick={onTrack}><Search size={18} /> {t.track_btn}</button>
        <button className="ghost-btn" onClick={onNew}><Plus size={18} /> {t.new_btn}</button>
      </div>
    </section>
  );
}

