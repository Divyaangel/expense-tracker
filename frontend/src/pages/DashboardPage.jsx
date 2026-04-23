import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { fetchExpenses, deleteExpense, isLoggedIn, getUser } from "../api";
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
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const authed = isLoggedIn();
  const user = authed ? getUser() : null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses({ category: category || undefined, sort: sort || undefined, page });
      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
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
  const handleCreated = () => {
    setPage(0);
    load();
    setToast({ message: "Expense added!", type: "success" });
  };
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setToast({ message: "Expense deleted", type: "success" });
      load();
    } catch {
      setToast({ message: "Failed to delete expense", type: "error" });
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="container">
        <div className="welcome-banner">
          <div>
            <h2>Welcome back, {user?.name} 👋</h2>
            <p>{totalItems > 0
              ? `You have ${totalItems} expense${totalItems > 1 ? "s" : ""} totaling ₹${totalAmount.toFixed(2)} on this page`
              : "Start by adding your first expense below!"
            }</p>
          </div>
        </div>
        <div className="section-card">
          <ExpenseForm onCreated={handleCreated} onError={(msg) => setToast({ message: msg, type: "error" })} />
        </div>
        <div className="section-card">
          <h2 className="section-title">📊 Your Expenses</h2>
          <Filters category={category} sort={sort} onCategoryChange={handleCategoryChange} onSortChange={handleSortChange} />
          {error && <p className="error" role="alert">{error}</p>}
          <Summary expenses={expenses} />
          <ExpenseList expenses={expenses} loading={loading} onDelete={handleDelete} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </main>
    </Layout>
  );
}
