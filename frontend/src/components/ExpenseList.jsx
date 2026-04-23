export default function ExpenseList({ expenses, loading }) {
  if (loading) return <p className="loading">Loading expenses...</p>;
  if (!expenses.length) return <p>No expenses found.</p>;

  return (
    <table className="expense-table">
      <thead>
        <tr><th>Date</th><th>Category</th><th>Description</th><th className="amount-col">Amount</th></tr>
      </thead>
      <tbody>
        {expenses.map((e) => (
          <tr key={e.id}>
            <td>{e.date}</td>
            <td>{e.category}</td>
            <td>{e.description || "—"}</td>
            <td className="amount-col">₹{e.amount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
