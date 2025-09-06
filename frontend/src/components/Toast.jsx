import { useEffect } from "react";

function Toast({ open, type = "success", message = "", onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 2500);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default Toast;


