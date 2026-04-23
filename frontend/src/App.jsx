import { useState, useEffect, useCallback } from "react";
import { fetchExpenses, isLoggedIn, getUser, logout } from "./api";
import AuthPage from "./components/AuthPage";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Filters from "./components/Filters";
import Summary from "./components/Summary";
import Pagination from "./components/Pagination";
import Toast from "./components/Toast";

export default function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses({ category: category || undefined, sort: sort || undefined, page });
      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load expenses. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [category, sort, page]);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  // Reset to page 0 when filters change
  const handleCategoryChange = (c) => { setCategory(c); setPage(0); };
  const handleSortChange = (s) => { setSort(s); setPage(0); };

  const handleCreated = () => { setPage(0); load(); };
  const handleCreateError = (msg) => setToast(msg);

  if (!authed) return <AuthPage onAuth={() => setAuthed(true)} />;

  const user = getUser();

  return (
    <div className="container">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="header">
        <h1>💰 Expense Tracker</h1>
        <div className="user-info">
          <span>Hi, {user?.name}</span>
          <button className="link-btn" onClick={() => { logout(); setAuthed(false); }}>Logout</button>
        </div>
      </div>
      <ExpenseForm onCreated={handleCreated} onError={handleCreateError} />
      <hr />
      <Filters category={category} sort={sort} onCategoryChange={handleCategoryChange} onSortChange={handleSortChange} />
      {error && <p className="error" role="alert">{error}</p>}
      <Summary expenses={expenses} />
      <ExpenseList expenses={expenses} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
