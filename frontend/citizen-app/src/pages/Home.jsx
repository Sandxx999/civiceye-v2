import { ArrowRight, Satellite } from "lucide-react";
import { translations } from "../utils/constants";

export default function Home({ onStart, language }) {
  const t = translations[language];

  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>{t.home_title}</h1>
        <p>{t.home_subtitle}</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={onStart}><Satellite size={18} /> {t.start_btn}</button>
          <button className="ghost-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>{t.feed} <ArrowRight size={18} /></button>
        </div>
      </div>
      <div className="city-scan" aria-label="City intelligence visual">
        <span className="tower t1" /><span className="tower t2" /><span className="tower t3" /><span className="tower t4" /><span className="tower t5" />
        <span className="pulse p1" /><span className="pulse p2" /><span className="pulse p3" />
      </div>
    </section>
  );
}

