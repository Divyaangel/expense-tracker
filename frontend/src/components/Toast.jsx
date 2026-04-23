import { useState, useEffect } from "react";

export default function Toast({ message, type = "error", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); onClose(); }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{type === "success" ? "✅ " : "⚠️ "}{message}</span>
      <button onClick={() => { setVisible(false); onClose(); }} aria-label="Close">✕</button>
    </div>
  );
}
