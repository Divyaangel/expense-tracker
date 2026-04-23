import { useState, useEffect, useCallback } from "react";
import { fetchExpenses } from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Filters from "./components/Filters";
import Summary from "./components/Summary";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date_desc");
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

  useEffect(() => { load(); }, [load]);

  return (
    <div className="container">
      <h1>💰 Expense Tracker</h1>
      <ExpenseForm onCreated={load} />
      <hr />
      <Filters category={category} sort={sort} onCategoryChange={setCategory} onSortChange={setSort} />
      {error && <p className="error" role="alert">{error}</p>}
      <Summary expenses={expenses} />
      <ExpenseList expenses={expenses} loading={loading} />
    </div>
  );
}
