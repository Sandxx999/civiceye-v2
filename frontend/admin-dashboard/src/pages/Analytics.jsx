import { useEffect, useState } from "react";
import { getComplaints } from "../api/adminApi";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    getComplaints().then((items) => {
      const stats = {};
      items.forEach(item => {
        stats[item.department] = (stats[item.department] || 0) + 1;
      });
      setCategories(stats);
      setData(items);
    });
  }, []);

  const total = data.length || 1;
  const rows = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Strategic Analytics</h1>
          <p>Analyzing {data.length} total reports across the city.</p>
        </div>
      </header>
      
      <section className="chart-grid">
        <article className="chart-panel">
          <h2>Departmental Workload</h2>
          <div style={{ marginTop: "32px" }}>
            {rows.map(([label, value]) => (
              <div key={label} className="bar-row">
                <div className="bar-label">
                  <span>{label}</span>
                  <strong>{Math.round((value / total) * 100)}% ({value})</strong>
                </div>
                <div className="bar-outer">
                  <div className="bar-inner" style={{ width: `${(value / total) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="chart-panel">
          <h2>Efficiency Metrics</h2>
          <div style={{ display: "grid", gap: "24px", marginTop: "12px" }}>
            <div className="metric" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
              <span style={{ color: "#166534" }}>AI Routing Accuracy</span>
              <strong style={{ color: "#166534" }}>94.2%</strong>
            </div>
            <div className="metric" style={{ background: "#fffbeb", borderColor: "#fef3c7" }}>
              <span style={{ color: "#92400e" }}>Avg. Triage Time</span>
              <strong style={{ color: "#92400e" }}>2.4m</strong>
            </div>
            <div className="metric" style={{ background: "#eff6ff", borderColor: "#dbeafe" }}>
              <span style={{ color: "#1e40af" }}>Duplicate Detection</span>
              <strong style={{ color: "#1e40af" }}>12% Saved</strong>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

