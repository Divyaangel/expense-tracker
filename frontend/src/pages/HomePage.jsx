import { Link, Navigate } from "react-router-dom";
import { isLoggedIn } from "../api";
import Layout from "../components/Layout";

export default function HomePage() {
  if (isLoggedIn()) return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <main className="landing">
        <section className="hero">
          <h1>Take Control of<br />Your <span className="highlight">Finances</span></h1>
          <p className="hero-sub">Track every rupee, understand your spending habits, and make smarter financial decisions — all in one simple tool.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">Start Tracking Free →</Link>
            <Link to="/login" className="btn-ghost">I have an account</Link>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Record Expenses</h3>
            <p>Quickly log expenses with amount, category, description, and date. Built for speed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Filter & Sort</h3>
            <p>Find what you need — filter by category, sort by date or amount, paginated for clarity.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Instant Insights</h3>
            <p>See totals and per-category breakdowns at a glance. Know where your money goes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is yours. Encrypted passwords, JWT auth, and per-user data isolation.</p>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to take control?</h2>
          <p>Join now and start understanding your spending in minutes.</p>
          <Link to="/register" className="btn-primary">Create Free Account</Link>
        </section>
      </main>
    </Layout>
  );
}
