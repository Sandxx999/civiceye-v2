import json
from datetime import datetime, timezone

import requests
from flask import current_app

from ..extensions import get_connection
from .duplicate_detection_service import duplicate_hint
from .geocoding_service import normalize_location
from .ticket_service import generate_ticket_id


DEPARTMENT_BY_HINT = {
    "Road Damage": "Roads",
    "Garbage": "Sanitation",
    "Street Light": "Utilities",
    "Water Leak": "Water",
    "Drainage": "Water",
    "Public Safety": "Public Safety",
}


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def fallback_analysis(payload):
    text = f"{payload.get('title', '')} {payload.get('description', '')}".lower()
    priority = "High" if any(word in text for word in ("danger", "accident", "open", "fire", "urgent")) else "Medium"
    hint = payload.get("category_hint") or "Other"
    return {
        "category": hint,
        "department": DEPARTMENT_BY_HINT.get(hint, "General"),
        "priority": priority,
        "summary": payload.get("description", "")[:180] or payload.get("title", ""),
        "duplicate_confidence": duplicate_hint(payload.get("description", "")),
    }


def analyze(payload):
    try:
        voice_note = payload.pop("voice_note", None)
        if voice_note and hasattr(voice_note, "read"):
            # Multi-part request if voice note is a file
            files = {"voice_note": (voice_note.filename, voice_note.read(), voice_note.content_type)}
            # We need to send the rest of the payload too
            # FastAPI expects fields as form data or we can send json as a string
            data = {"payload": json.dumps(payload)}
            response = requests.post(f"{current_app.config['AI_SERVICE_URL']}/analyze", data=data, files=files, timeout=10)
        else:
            response = requests.post(f"{current_app.config['AI_SERVICE_URL']}/analyze", json=payload, timeout=4)
        
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"AI Service Error: {e}")
        return fallback_analysis(payload)


def row_to_dict(row):
    item = dict(row)
    item["location"] = json.loads(item.pop("location_json"))
    item["attachments"] = json.loads(item.pop("attachments_json"))
    item["timeline"] = json.loads(item.pop("timeline_json"))
    return item


import os

def create_complaint(payload):
    # Handle voice note saving before analysis pops it
    voice_note = payload.get("voice_note")
    voice_path = None
    if voice_note and hasattr(voice_note, "read"):
        ticket_id_temp = generate_ticket_id() # Use a stable ID for the filename
        
        if os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
            upload_dir = "/tmp/uploads/voice_notes"
        else:
            upload_dir = os.path.join(current_app.root_path, "..", "uploads", "voice_notes")
            
        os.makedirs(upload_dir, exist_ok=True)
        filename = f"{ticket_id_temp}_voice.webm"
        voice_path = os.path.join(upload_dir, filename)
        
        # Save a copy locally
        voice_note.save(voice_path)
        # Reset file pointer for the subsequent AI service call
        voice_note.seek(0)

    analysis = analyze(payload)
    created = now_iso()
    ticket_id = ticket_id_temp if voice_path else generate_ticket_id()
    location = normalize_location(payload.get("location"))
    timeline = [{"label": "Complaint received", "at": created}, {"label": f"Routed to {analysis['department']}", "at": created}]
    
    # Add transcript to description if it exists
    final_description = payload.get("description", "").strip()
    if analysis.get("transcript"):
        final_description += f"\n\n[Voice Transcript]: {analysis['transcript']}"

    record = {
        "ticket_id": ticket_id,
        "title": payload["title"].strip(),
        "description": final_description,
        "category": analysis["category"],
        "department": analysis["department"],
        "priority": analysis["priority"],
        "status": "New",
        "summary": analysis["summary"],
        "duplicate_confidence": int(analysis["duplicate_confidence"]),
        "language": payload.get("language", "en"),
        "citizen_name": payload.get("citizen_name", ""),
        "phone": payload.get("phone", ""),
        "location_json": json.dumps(location),
        "attachments_json": json.dumps(payload.get("attachments", [])),
        "timeline_json": json.dumps(timeline),
        "created_at": created,
        "updated_at": created,
    }
    columns = ", ".join(record.keys())
    placeholders = ", ".join(["?"] * len(record))
    with get_connection(current_app.config["DATABASE_PATH"]) as connection:
        connection.execute(f"INSERT INTO complaints ({columns}) VALUES ({placeholders})", tuple(record.values()))
        row = connection.execute("SELECT * FROM complaints WHERE ticket_id = ?", (ticket_id,)).fetchone()
    return row_to_dict(row)


def get_complaint(ticket_id):
    with get_connection(current_app.config["DATABASE_PATH"]) as connection:
        row = connection.execute("SELECT * FROM complaints WHERE ticket_id = ?", (ticket_id,)).fetchone()
    return row_to_dict(row) if row else None


def list_complaints(filters):
    query = "SELECT * FROM complaints WHERE 1=1"
    params = []
    if filters.get("status"):
        query += " AND status = ?"; params.append(filters["status"])
    if filters.get("priority"):
        query += " AND priority = ?"; params.append(filters["priority"])
    if filters.get("department"):
        query += " AND department = ?"; params.append(filters["department"])
    if filters.get("q"):
        query += " AND (title LIKE ? OR ticket_id LIKE ? OR location_json LIKE ?)"
        term = f"%{filters['q']}%"
        params.extend([term, term, term])
    query += " ORDER BY created_at DESC"
    with get_connection(current_app.config["DATABASE_PATH"]) as connection:
        rows = connection.execute(query, params).fetchall()
    return [row_to_dict(row) for row in rows]


def update_status(ticket_id, status):
    current = get_complaint(ticket_id)
    if not current:
        return None
    updated = now_iso()
    timeline = current["timeline"] + [{"label": f"Status changed to {status}", "at": updated}]
    with get_connection(current_app.config["DATABASE_PATH"]) as connection:
        connection.execute("UPDATE complaints SET status = ?, timeline_json = ?, updated_at = ? WHERE ticket_id = ?", (status, json.dumps(timeline), updated, ticket_id))
    return get_complaint(ticket_id)


def stats():
    complaints = list_complaints({})
    return {
        "open": len([item for item in complaints if item["status"] != "Resolved"]),
        "high_priority": len([item for item in complaints if item["priority"] == "High"]),
        "resolved": len([item for item in complaints if item["status"] == "Resolved"]),
        "assigned": len([item for item in complaints if item["status"] == "Assigned"]),
        "duplicate_risk": round(sum(item["duplicate_confidence"] for item in complaints) / len(complaints)) if complaints else 0,
    }

