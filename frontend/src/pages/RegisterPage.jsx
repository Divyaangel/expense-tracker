import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register, isLoggedIn } from "../api";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Layout>
      <main className="container auth-container">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-subtitle">Start tracking your spending today</p>
          {error && <p className="error" role="alert">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" value={form.name} onChange={update("name")} required placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={update("email")} required placeholder="you@example.com" />
            </label>
            <label>
              Password
              <div className="pw-field">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={update("password")} required minLength={6} placeholder="Min 6 characters" />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}>{showPw ? "🙈" : "👁️"}</button>
              </div>
            </label>
            <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Create Account"}</button>
          </form>
          <p className="auth-toggle">
            Already have an account? <Link to="/login" className="link-btn">Sign In</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}
