import { Activity, AlertCircle, CheckCircle, UserCheck } from "lucide-react";

export default function DashboardStats({ stats }) {
  const items = [
    { label: "Active cases", value: stats.open || 0, icon: Activity },
    { label: "High priority", value: stats.high_priority || 0, icon: AlertCircle },
    { label: "Resolved", value: stats.resolved || 0, icon: CheckCircle },
    { label: "Assigned", value: stats.assigned || 0, icon: UserCheck },
  ];

  return (
    <div className="stats">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="metric">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span>{item.label}</span>
              <Icon size={18} className="muted" />
            </div>
            <strong>{item.value}</strong>
          </div>
        );
      })}
    </div>
  );
}

