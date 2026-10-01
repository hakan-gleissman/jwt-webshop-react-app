import { LogIn, ShieldCheck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/authService";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      navigate("/shop", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro" aria-labelledby="login-heading">
        <div className="brand-mark" aria-hidden="true">
          <ShoppingBag size={28} />
        </div>
        <p className="eyebrow">Sprint Shop</p>
        <h1 id="login-heading">Logga in till webbshoppen</h1>
        <p className="login-description">
          Utforska sortimentet och bygg din kundvagn med ditt befintliga konto.
        </p>
        <div className="security-note">
          <ShieldCheck size={20} aria-hidden="true" />
          <span>Inloggningen hanteras av JWT-autentiseringsservern.</span>
        </div>
      </section>

      <section className="login-panel" aria-label="Inloggningsformulär">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Användarnamn</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Användarnamn"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Lösenord"
              required
            />
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="login-button">
            <LogIn size={18} aria-hidden="true" />
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>
        <p className="app-version">v{__APP_VERSION__}</p>
      </section>
    </main>
  );
}
