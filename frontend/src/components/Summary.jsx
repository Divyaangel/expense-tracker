export default function Summary({ expenses }) {
  if (!expenses.length) return null;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="summary">
      <h3>Total: ₹{total.toFixed(2)}</h3>
      <details>
        <summary>By category</summary>
        <ul>
          {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
            <li key={cat}>{cat}: ₹{amt.toFixed(2)}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
