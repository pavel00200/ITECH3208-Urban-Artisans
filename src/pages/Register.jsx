import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name:            "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // front-end validation before touching the server
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("https://urban-artisans-api.onrender.com/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // log the user in right away after registering
        login({ id: data.id, name: data.name, email: data.email });
        navigate("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Cannot reach the server. Make sure it is running on port 4000.");
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

        <h1 className="login-heading">Create account</h1>
        <p className="login-sub">Join Urban Artisans today</p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <div className="field-group">
            <label className="field-label">Full name</label>
            <input
              type="text"
              name="name"
              className="field-input"
              placeholder="John Smith"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              name="email"
              className="field-input"
              placeholder="john@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              className="field-input"
              placeholder="••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              className="field-input"
              placeholder="••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>

        </form>

        <p className="login-register">
          Already have an account?{" "}
          <Link to="/login" className="link">Login here</Link>
        </p>

        <p className="login-back">
          <Link to="/" className="link">← Back to Home</Link>
        </p>

      </div>
    </div>
  );
}