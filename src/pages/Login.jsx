import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // basic front-end check before hitting the server
  function validate() {
    if (!email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  const validationError = validate();
  if (validationError) {
    setError(validationError);
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("https://itech3208-urban-artisans.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // ⚡ include id here
      login({
        id: data.id,
        name: data.name,
        email: data.email,
      });

      navigate("/checkout");
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  } catch (err) {
    setError("Cannot reach the server. Make sure it is running.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <Link to="/" className="login-logo">
            <span className="brand-urban">Urban</span>
            <span className="brand-artisans">Artisans</span>
          </Link>
        </div>

        <h1 className="login-heading">Welcome back</h1>
        <p className="login-sub">Sign in to continue to checkout</p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email" className="field-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="test@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="field-input"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="login-hint">
            <span>Demo: </span>
            <code>test@gmail.com</code> / <code>123456</code>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="login-back">
          <Link to="/" className="link">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}