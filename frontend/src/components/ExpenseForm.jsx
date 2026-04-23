import { useState } from "react";
import { createExpense } from "../api";

const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Shopping", "Other"];

export default function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState({ amount: "", category: CATEGORIES[0], description: "", date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return setError("Amount must be a positive number");
    if (!form.date) return setError("Date is required");

    const idempotencyKey = `${form.date}-${form.category}-${amount}-${Date.now()}`;
    setSubmitting(true);
    try {
      await createExpense({ amount, category: form.category, description: form.description, date: form.date }, idempotencyKey);
      setForm({ amount: "", category: CATEGORIES[0], description: "", date: "" });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add Expense</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="form-row">
        <label>
          Amount (₹)
          <input type="number" step="0.01" min="0.01" value={form.amount} onChange={update("amount")} required />
        </label>
        <label>
          Category
          <select value={form.category} onChange={update("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={form.date} onChange={update("date")} required />
        </label>
      </div>
      <label>
        Description
        <input type="text" value={form.description} onChange={update("description")} placeholder="Optional" />
      </label>
      <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Add Expense"}</button>
    </form>
  );
}
