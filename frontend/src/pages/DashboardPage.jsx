import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { fetchExpenses, isLoggedIn } from "../api";
import Layout from "../components/Layout";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Filters from "../components/Filters";
import Summary from "../components/Summary";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const authed = isLoggedIn();

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

  if (!authed) return <Navigate to="/login" replace />;

  const handleCategoryChange = (c) => { setCategory(c); setPage(0); };
  const handleSortChange = (s) => { setSort(s); setPage(0); };
  const handleCreated = () => { setPage(0); load(); };

  return (
    <Layout>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <main className="container">
        <div className="section-card">
          <ExpenseForm onCreated={handleCreated} onError={(msg) => setToast(msg)} />
        </div>
        <div className="section-card">
          <h2 className="section-title">📊 Your Expenses</h2>
          <Filters category={category} sort={sort} onCategoryChange={handleCategoryChange} onSortChange={handleSortChange} />
          {error && <p className="error" role="alert">{error}</p>}
          <Summary expenses={expenses} />
          <ExpenseList expenses={expenses} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </main>
    </Layout>
  );
}
