import { useState } from "react";
import { Send } from "lucide-react";
import { submitComplaint } from "../api/complaintApi";
import { issueTypes, translations } from "../utils/constants";
import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";
import VoiceRecorder from "./VoiceRecorder";

const emptyLocation = { address: "", lat: "", lng: "" };

export default function ComplaintForm({ language, onSuccess }) {
  const [form, setForm] = useState({ title: "", description: "", category_hint: "Road Damage", citizen_name: "", phone: "" });
  const [location, setLocation] = useState(emptyLocation);
  const [files, setFiles] = useState([]);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const t = translations[language];

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category_hint", form.category_hint);
      formData.append("citizen_name", form.citizen_name);
      formData.append("phone", form.phone);
      formData.append("language", language);
      formData.append("location", JSON.stringify(location));
      
      files.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      if (voiceBlob) {
        formData.append("voice_note", voiceBlob, "voice_note.webm");
      }

      const result = await submitComplaint(formData);
      onSuccess(result.ticket_id);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit right now. Check backend service.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <div className="grid-2">
        <label className="field">
          {t.issue_type}
          <select value={form.category_hint} onChange={(event) => update("category_hint", event.target.value)}>
            {issueTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label className="field">
          {t.issue_title}
          <input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Open manhole near bus stop" />
        </label>
      </div>
      <label className="field">
        {t.description}
        <textarea required={!voiceBlob} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe what happened, who is affected, and how urgent it is." />
      </label>
      <div className="grid-2">
        <label className="field">
          {t.name}
          <input value={form.citizen_name} onChange={(event) => update("citizen_name", event.target.value)} placeholder={t.optional} />
        </label>
        <label className="field">
          {t.phone}
          <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder={t.optional} />
        </label>
      </div>
      <LocationPicker value={location} onChange={setLocation} label={t.location} demoLabel={t.demo_loc} />
      <div className="grid-2">
        <VoiceRecorder onTranscript={setVoiceBlob} language={language} />
        <ImageUpload files={files} onChange={setFiles} />
      </div>
      {error && <div className="hint">{error}</div>}
      <button className="primary-btn" type="submit" disabled={busy}>
        <Send size={18} /> {busy ? t.routing : t.submit}
      </button>
    </form>
  );
}

