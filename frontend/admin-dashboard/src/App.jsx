import { useState, useEffect } from "react";
import { BarChart3, LayoutDashboard, RadioTower, LogOut } from "lucide-react";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [page, setPage] = useState("dashboard");

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand"><RadioTower size={28} /><span>CivicEye</span></div>
        <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}><LayoutDashboard size={18} /> Dashboard</button>
        <button className={page === "analytics" ? "active" : ""} onClick={() => setPage("analytics")}><BarChart3 size={18} /> Analytics</button>
        <div style={{ marginTop: "auto" }}>
          <button onClick={logout}><LogOut size={18} /> Logout</button>
        </div>
      </aside>
      <main>
        {page === "dashboard" ? <Dashboard /> : <Analytics />}
      </main>
    </div>
  );
}

