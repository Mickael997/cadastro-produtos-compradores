import { useEffect } from "react";

function Modal({ isOpen, title, icon = null, children, onClose }) {
  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (isOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        {(title || icon) && (
          <div className="modal-header">
            {icon && <span className="modal-icon">{icon}</span>}
            {title && <h3 className="modal-title">{title}</h3>}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;


