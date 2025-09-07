import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "./components/Modal";
import WarningIcon from "./components/WarningIcon";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Produtos from "./pages/Produtos";
import Compradores from "./pages/Compradores";
import Login from "./pages/Login";

function App() {
  //Mantém o usuário logado
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [modal, setModal] = useState({ open: false, title: "", content: null });
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setModal({
      open: true,
      title: "Sair do sistema",
      content: (
        <>
          <p>Tem certeza que deseja encerrar sua sessão?</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Cancelar</button>
            <button
              className="btn-danger"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
                setModal({ open: false });
                setToast({ open: true, type: "info", message: "Sessão encerrada" });
              }}
            >
              Sair
            </button>
          </div>
        </>
      ),
    });
  };

  //Uma rota protegida
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      {user && (
        //NavBar
        <nav>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
            <div className="brand">
              <div className="brand-logo"><img src="/Minerva.png" alt="Logo" /></div>
            </div>
          </div>
        </nav>
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        username={user?.username}
        role={user?.role}
      />

      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          }
        />
        <Route
          path="/compradores"
          element={
            <PrivateRoute>
              <Compradores />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/produtos" : "/login"} />} />
      </Routes>
      <Modal isOpen={modal.open} title={modal.title} icon={<WarningIcon />} onClose={() => setModal({ open: false })}>
        {modal.content}
      </Modal>
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, open: false })} />
    </Router>
  );
}

export default App;
