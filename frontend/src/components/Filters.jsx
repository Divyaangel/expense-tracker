const CATEGORIES = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Shopping", "Other"];

export default function Filters({ category, sort, onCategoryChange, onSortChange }) {
  return (
    <div className="filters">
      <label>
        Filter by category
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">All</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>
        Sort
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="">Latest added</option>
          <option value="date_desc">Date (newest first)</option>
        </select>
      </label>
    </div>
  );
}
