import { CheckCircle2, Send, Play, Info } from "lucide-react";
import PriorityBadge from "./PriorityBadge";

export default function ComplaintDetailsDrawer({ complaint, onStatusChange }) {
  if (!complaint) {
    return <aside className="drawer"><h2>Complaint details</h2><p className="muted">Select a ticket from the stream.</p></aside>;
  }

  const voiceUrl = complaint.ticket_id ? `/api/voice/${complaint.ticket_id}` : null;

  return (
    <aside className="drawer">
      <PriorityBadge value={complaint.priority} />
      <h2>{complaint.title}</h2>
      <p className="muted">{complaint.description}</p>
      <div className="detail-row"><span>Ticket</span><strong>{complaint.ticket_id}</strong></div>
      <div className="detail-row"><span>Status</span><strong>{complaint.status}</strong></div>
      <div className="detail-row"><span>Department</span><strong>{complaint.department}</strong></div>
      <div className="detail-row"><span>Address</span><strong>{complaint.location?.address || "Pending"}</strong></div>

      {complaint.description.includes("[Voice Transcript]") && (
        <div className="voice-player" style={{ marginTop: "20px", padding: "12px", background: "#f8fafc", border: "1px solid var(--line)", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Play size={16} fill="var(--aqua)" />
            <strong style={{ fontSize: "14px" }}>Voice Recording</strong>
          </div>
          <audio controls src={voiceUrl} style={{ width: "100%", height: "32px" }}>
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      <div className="hero-actions">
        {complaint.status !== "Assigned" && complaint.status !== "Resolved" && (
          <button className="primary-btn" onClick={() => onStatusChange("Assigned")}><Send size={18} /> Assign</button>
        )}
        {complaint.status !== "Resolved" && (
          <button className="ghost-btn" onClick={() => onStatusChange("Resolved")}><CheckCircle2 size={18} /> Resolve</button>
        )}
      </div>
    </aside>
  );
}

