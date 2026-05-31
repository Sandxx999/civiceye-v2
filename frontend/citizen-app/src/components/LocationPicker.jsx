import { Crosshair } from "lucide-react";

export default function LocationPicker({ value, onChange, label, demoLabel }) {
  const useDemoLocation = () => {
    onChange({ ...value, address: "MG Road, Ward 12, Civic Center", lat: "17.3850", lng: "78.4867" });
  };

  return (
    <div className="map-picker">
      <label className="field">
        {label || "Address or landmark"}
        <input value={value.address} onChange={(event) => onChange({ ...value, address: event.target.value })} placeholder="Street, ward, landmark" />
      </label>
      <div className="grid-2">
        <label className="field">
          Latitude
          <input value={value.lat} onChange={(event) => onChange({ ...value, lat: event.target.value })} placeholder="17.3850" />
        </label>
        <label className="field">
          Longitude
          <input value={value.lng} onChange={(event) => onChange({ ...value, lng: event.target.value })} placeholder="78.4867" />
        </label>
      </div>
      <button className="ghost-btn" type="button" onClick={useDemoLocation}>
        <Crosshair size={17} /> {demoLabel || "Use demo location"}
      </button>
    </div>
  );
}

