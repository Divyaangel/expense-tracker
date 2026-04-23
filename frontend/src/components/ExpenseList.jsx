const CATEGORY_COLORS = {
  Food: "#ef4444", Transport: "#f59e0b", Entertainment: "#8b5cf6",
  Utilities: "#3b82f6", Health: "#10b981", Shopping: "#ec4899", Other: "#6b7280",
};

export default function ExpenseList({ expenses, loading, onDelete }) {
  if (loading) return <p className="loading">Loading expenses...</p>;
  if (!expenses.length) return <div className="empty-state">🎉 No expenses yet — add your first one above!</div>;

  return (
    <table className="expense-table">
      <thead>
        <tr><th>Date</th><th>Category</th><th>Description</th><th className="amount-col">Amount</th><th></th></tr>
      </thead>
      <tbody>
        {expenses.map((e) => (
          <tr key={e.id}>
            <td>{e.date}</td>
            <td><span className="badge" style={{ background: CATEGORY_COLORS[e.category] || "#6b7280" }}>{e.category}</span></td>
            <td>{e.description || "—"}</td>
            <td className="amount-col">₹{e.amount.toFixed(2)}</td>
            <td><button className="delete-btn" onClick={() => onDelete(e.id)} title="Delete" aria-label="Delete expense">🗑️</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
