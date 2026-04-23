import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUser, logout } from "../api";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const authed = isLoggedIn();
  const user = authed ? getUser() : null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to={authed ? "/dashboard" : "/"} className="navbar-brand">💰 Expense Tracker</Link>
          <div className="navbar-right">
            {authed ? (
              <>
                <span className="navbar-user">👤 {user?.name}</span>
                <button className="btn-outline-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline-sm">Sign In</Link>
                <Link to="/register" className="btn-solid-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {children}
      <footer className="footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Expense Tracker — Built with ❤️</p>
          <p>Contact us at <a href="mailto:contact@fenmo.ai">contact@fenmo.ai</a> · <a href="https://fenmo.ai" target="_blank" rel="noopener noreferrer">fenmo.ai</a></p>
        </div>
      </footer>
    </div>
  );
}
