import { useState, useEffect, useCallback } from "react";
import { fetchExpenses, isLoggedIn, getUser, logout } from "./api";
import AuthPage from "./components/AuthPage";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Filters from "./components/Filters";
import Summary from "./components/Summary";

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses({ category: category || undefined, sort: sort || undefined });
      setExpenses(data);
    } catch {
      setError("Failed to load expenses. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [category, sort]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  if (!authed) return <AuthPage onAuth={() => setAuthed(true)} />;

  const user = getUser();

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Expense Tracker</h1>
        <div className="user-info">
          <span>Hi, {user?.name}</span>
          <button className="link-btn" onClick={() => { logout(); setAuthed(false); }}>Logout</button>
        </div>
      </div>
      <ExpenseForm onCreated={load} />
      <hr />
      <Filters category={category} sort={sort} onCategoryChange={setCategory} onSortChange={setSort} />
      {error && <p className="error" role="alert">{error}</p>}
      <Summary expenses={expenses} />
      <ExpenseList expenses={expenses} loading={loading} />
    </div>
  );
}
