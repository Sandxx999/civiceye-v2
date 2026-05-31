import os
from flask import Blueprint, request, send_from_directory, current_app

from ..services.complaint_service import create_complaint, get_complaint
from ..utils.response import fail, ok
from ..utils.validators import validate_complaint

complaint_bp = Blueprint("complaints", __name__)


@complaint_bp.get("/voice/<ticket_id>")
def get_voice(ticket_id):
    if os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
        upload_dir = "/tmp/uploads/voice_notes"
    else:
        upload_dir = os.path.join(current_app.root_path, "..", "uploads", "voice_notes")
    
    filename = f"{ticket_id.upper()}_voice.webm"
    return send_from_directory(upload_dir, filename)


@complaint_bp.post("/complaints")
def submit_complaint():
    if request.is_json:
        payload = request.get_json()
    else:
        # Handle multipart/form-data
        payload = request.form.to_dict()
        
        # Parse JSON string back to dict if it exists
        if "location" in payload and isinstance(payload["location"], str):
            import json
            try:
                payload["location"] = json.loads(payload["location"])
            except:
                payload["location"] = {}
        
        # Handle attachments
        attachments = []
        for key in request.files:
            if key.startswith("attachment_"):
                attachments.append(request.files[key].filename)
        payload["attachments"] = attachments

        # Handle voice note
        if "voice_note" in request.files:
            payload["voice_note"] = request.files["voice_note"]

    # Debug log to see what the backend is actually receiving
    print(f"DEBUG: Received payload keys: {list(payload.keys())}")
    
    error = validate_complaint(payload)
    if error:
        return fail(error, 422)
    return ok(create_complaint(payload), "complaint submitted", 201)


@complaint_bp.get("/complaints/<ticket_id>")
def track_complaint(ticket_id):
    complaint = get_complaint(ticket_id.upper())
    if not complaint:
        return fail("Ticket not found", 404)
    return ok(complaint)

