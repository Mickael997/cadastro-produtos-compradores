import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await api.post("/login", { username, password });

      // Salva o token e dados no localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        username: res.data.username,
        role: res.data.role
      }));

      setUser({ username: res.data.username, role: res.data.role });
      setToast({ open: true, type: "success", message: "Login realizado com sucesso" });
      setTimeout(() => navigate("/produtos"), 400);
    } catch (err) {
      const msg = err.response?.data || "Erro ao fazer login";
      setToast({ open: true, type: "error", message: msg });
    }
  };

  return (
    <div className="container login-container">
      <div className="card login-card">
        <h2>Login</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="btn-primary">
            Entrar
          </button>
        </div>
      </div>
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}

export default Login;
