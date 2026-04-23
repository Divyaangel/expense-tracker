import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login, isLoggedIn } from "../api";
import Layout from "../components/Layout";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
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
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to manage your expenses</p>
          {error && <p className="error" role="alert">{error}</p>}
          <form onSubmit={handleSubmit}>
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
            <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Sign In"}</button>
          </form>
          <p className="auth-toggle">
            Don't have an account? <Link to="/register" className="link-btn">Register</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}
