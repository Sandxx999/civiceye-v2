import { useState } from "react";
import { Activity, MapPin, Radar, Search, ShieldCheck } from "lucide-react";
import Home from "./pages/Home.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";
import TrackComplaint from "./pages/TrackComplaint.jsx";
import Success from "./pages/Success.jsx";
import LanguageToggle from "./components/LanguageToggle.jsx";
import { translations } from "./utils/constants";

export default function App() {
  const [page, setPage] = useState("home");
  const [language, setLanguage] = useState("en");
  const [lastTicket, setLastTicket] = useState("");

  const t = translations[language];

  const tabs = [
    { id: "home", label: t.feed, icon: Activity },
    { id: "submit", label: t.report, icon: Radar },
    { id: "track", label: t.track, icon: Search },
  ];

  const handleSuccess = (ticketId) => {
    setLastTicket(ticketId);
    setPage("success");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage("home")} aria-label="CivicEye home">
          <img src="/logo.svg" alt="" />
          <span>{t.title}</span>
        </button>
        <nav className="nav-tabs" aria-label="Primary">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className={page === tab.id ? "active" : ""} onClick={() => setPage(tab.id)}>
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <LanguageToggle value={language} onChange={setLanguage} />
      </header>

      <main>
        {page === "home" && <Home onStart={() => setPage("submit")} language={language} />}
        {page === "submit" && <SubmitComplaint language={language} onSuccess={handleSuccess} />}
        {page === "track" && <TrackComplaint initialTicket={lastTicket} language={language} />}
        {page === "success" && <Success ticketId={lastTicket} onTrack={() => setPage("track")} onNew={() => setPage("submit")} language={language} />}
      </main>

      <aside className="trust-strip">
        <ShieldCheck size={18} />
        <span>Encrypted intake</span>
        <MapPin size={18} />
        <span>Ward-aware routing</span>
      </aside>
    </div>
  );
}

