import { useState } from "react";
import { Lock, User } from "lucide-react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
      const { data } = await axios.post(`${baseURL}/auth/login`, { email, password });
      localStorage.setItem("admin_token", data.data.token);
      onLogin(data.data.token);
    } catch (err) {
      setError("Invalid credentials. Try any for demo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>CivicEye Admin</h1>
        <p>Sign in to manage city operations</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@city.gov" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div className="muted" style={{ color: "var(--coral)", textAlign: "center" }}>{error}</div>}
          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
