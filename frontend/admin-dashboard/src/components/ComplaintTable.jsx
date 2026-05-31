import { Volume2 } from "lucide-react";
import PriorityBadge from "./PriorityBadge";

export default function ComplaintTable({ complaints, selected, onSelect }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Issue</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((item) => (
            <tr key={item.ticket_id} className={selected?.ticket_id === item.ticket_id ? "selected" : ""} onClick={() => onSelect(item)}>
              <td><span className="ticket">{item.ticket_id}</span></td>
              <td>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div className="muted" style={{ fontSize: "12px", marginTop: "2px" }}>{item.location?.address || "Location pending"}</div>
              </td>
              <td>{item.department}</td>
              <td><PriorityBadge value={item.priority} /></td>
              <td>
                <span style={{ fontWeight: 500 }}>{item.status}</span>
              </td>
              <td style={{ textAlign: "right", paddingRight: "20px" }}>
                {item.description.includes("[Voice Transcript]") && (
                  <Volume2 size={16} color="var(--blue)" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

