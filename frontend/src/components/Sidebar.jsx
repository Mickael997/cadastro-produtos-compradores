import { NavLink } from "react-router-dom";

function Sidebar({ open, onClose, onLogout, username, role }) {
  return (
    <>
      <div className={`sidebar-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button className="close-btn" aria-label="Fechar menu" onClick={onClose}>×</button>
        <div style={{ padding: "8px 12px", color: "#111827", fontWeight: 600 }}>
          {username} ({role})
        </div>
        <div className="separator" />
        <NavLink to="/produtos" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClose}>Produtos</NavLink>
        <NavLink to="/compradores" className={({ isActive }) => (isActive ? "active" : "")} onClick={onClose}>Compradores</NavLink>
        <div className="sidebar-footer">
          <div className="separator" />
          <button className="sidebar-item logout" onClick={() => { onClose(); onLogout(); }}>➜] Logout</button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;


