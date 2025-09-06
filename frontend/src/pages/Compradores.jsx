import { useEffect, useState } from "react";
import api from "../services/api";
import { formatarDocumento } from "../utils/formatarDocumento";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import WarningIcon from "../components/WarningIcon";

function Compradores() {
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [compradores, setCompradores] = useState([]);
  const [filtro, setFiltro] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoDocumento, setNovoDocumento] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const [modal, setModal] = useState({ open: false, title: "", content: null, type: null });
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    buscarCompradores();
  }, []);

  const buscarCompradores = async () => {
    try {
      const res = await api.get("/compradores");
      const listaOrdenada = res.data.sort((a, b) => (a.id || 0) - (b.id || 0));
      setCompradores(listaOrdenada);
    } catch (err) {
      alert("Erro ao buscar compradores");
    }
  };


  const abrirModalNovoComprador = () => {
    setNome("");
    setDocumento("");
    setModal({ open: true, title: "Novo Comprador", type: "new" });
  };

  const iniciarEdicao = (comprador) => {
    setEditandoId(comprador.id);
    setNovoNome(comprador.nome);
    setNovoDocumento(comprador.documento);
  };

  const abrirModalEditarComprador = (comprador) => {
    setNovoNome(comprador.nome);
    setNovoDocumento(comprador.documento);
    setEditandoId(comprador.id);
    setModal({ open: true, title: "Editar Comprador", type: "edit" });
  };

  const salvarEdicaoComprador = async (id) => {
    setModal({
      open: true,
      title: "Salvar alterações",
      type: "default",
      content: (
        <>
          <p>Tem certeza que deseja salvar as alterações deste comprador?</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Cancelar</button>
            <button
              className="btn-primary"
              onClick={async () => {
                try {
                  await api.put(`/compradores/${id}`, { nome: novoNome, documento: novoDocumento });
                  setEditandoId(null);
                  setModal({ open: false });
                  buscarCompradores();
                  setToast({ open: true, type: "success", message: "Comprador atualizado" });
                } catch (err) {
                  setModal({ open: false });
                  setToast({ open: true, type: "error", message: err.response?.data || "Erro ao atualizar comprador" });
                }
              }}
            >
              Salvar
            </button>
          </div>
        </>
      ),
    });
  };

  const excluirComprador = async (id, nome) => {
    setModal({
      open: true,
      title: "Excluir Comprador",
      type: "danger",
      content: (
        <>
          <p>Tem certeza que deseja excluir o comprador "{nome}"?</p>
          <p>Esta ação não pode ser desfeita.</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Cancelar</button>
            <button
              className="btn-danger"
              onClick={async () => {
                try {
                  await api.delete(`/compradores/${id}`);
                  setModal({ open: false });
                  buscarCompradores();
                  setToast({ open: true, type: "error", message: "Comprador excluído" });
                } catch (err) {
                  setModal({ open: false });
                  setToast({ open: true, type: "error", message: "Erro ao excluir comprador" });
                }
              }}
            >
              Excluir
            </button>
          </div>
        </>
      ),
    });
  };


  const compradoresFiltrados = compradores.filter(
    (c) =>
      c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      c.documento.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <div className="card produtos-card">
        <div className="produtos-header">
          <div className="produtos-title">
            <span className="produtos-icon">👥</span>
            <div>
              <h2>Compradores</h2>
              <p className="subtitle">Gerencie seu catálogo de compradores</p>
            </div>
          </div>
          {user?.role === "admin" && (
            <button onClick={abrirModalNovoComprador} className="btn-primary">+ Novo Comprador</button>
          )}
        </div>

        <div className="search-bar">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Buscar por nome ou CPF/CNPJ..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {compradores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">Nenhum comprador cadastrado</h3>
            <p className="empty-subtitle">Comece adicionando seu primeiro comprador</p>
            {user?.role === "admin" && (
              <div className="empty-actions">
                <button onClick={abrirModalNovoComprador} className="btn-primary">+ Adicionar Comprador</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="scroll-area">
            <div className={`table ${user?.role === 'admin' ? '' : 'no-actions'}`}>
              <div className="table-row table-header">
                <div className="col id">ID</div>
                <div className="col name">Nome</div>
                <div className="col cat">Documento</div>
                {user?.role === 'admin' && <div className="col actions">Ações</div>}
              </div>
              {compradoresFiltrados.map((c) => (
                <div key={c.id} className="table-row">
                  <div className="col id">{c.id}</div>
                  <div className="col name"><strong>{c.nome}</strong></div>
                  <div className="col cat">{c.documento}</div>
                  {user?.role === 'admin' && (
                    <div className="col actions">
                      <button className="icon-btn edit" title="Editar" onClick={() => abrirModalEditarComprador(c)}>✏️</button>
                      <button className="icon-btn delete" title="Excluir" onClick={() => excluirComprador(c.id, c.nome)}>🗑️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {compradoresFiltrados.length === 0 && (
              <div className="empty-state" style={{ marginTop: 12 }}>
                <div className="empty-icon">🔎</div>
                <h3 className="empty-title">Nenhum resultado para a busca</h3>
                <p className="empty-subtitle">Tente outros termos ou limpe o filtro</p>
              </div>
            )}
            </div>
          </>
        )}

        <Modal isOpen={modal.open} title={modal.title} icon={modal.type === "danger" ? <WarningIcon /> : null} onClose={() => setModal({ open: false })}>
          {modal.type === "new" && (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nome do comprador"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={modalError ? "input-error" : undefined}
                />
                <input
                  type="text"
                  placeholder="CPF/CNPJ"
                  value={documento}
                  onChange={(e) => setDocumento(formatarDocumento(e.target.value))}
                />
              </div>
              {modalError && <div className="field-error">{modalError}</div>}
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => { setModalError(""); setNome(""); setDocumento(""); setModal({ open: false }) }}>Cancelar</button>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    if (!nome || !documento) {
                      setToast({ open: true, type: "error", message: "Preencha todos os campos" });
                      return;
                    }
                    try {
                      setModalError("");
                      await api.post("/compradores", { nome, documento });
                      setNome("");
                      setDocumento("");
                      setModal({ open: false });
                      buscarCompradores();
                      setToast({ open: true, type: "success", message: "Comprador adicionado com sucesso" });
                    } catch (err) {
                      const msg = err.response?.data || "Erro ao cadastrar comprador";
                      setModalError(msg);
                    }
                  }}
                >
                  Adicionar
                </button>
              </div>
            </>
          )}
          {modal.type === "edit" && (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nome do comprador"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className={modalError ? "input-error" : undefined}
                />
                <input
                  type="text"
                  placeholder="CPF/CNPJ"
                  value={novoDocumento}
                  onChange={(e) => setNovoDocumento(formatarDocumento(e.target.value))}
                />
              </div>
              {modalError && <div className="field-error">{modalError}</div>}
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => { setModalError(""); setModal({ open: false })}}>Cancelar</button>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    try {
                      setModalError("");
                      await api.put(`/compradores/${editandoId}`, { nome: novoNome, documento: novoDocumento });
                      setEditandoId(null);
                      setModal({ open: false });
                      buscarCompradores();
                      setToast({ open: true, type: "success", message: "Comprador atualizado" });
                    } catch (err) {
                      const msg = err.response?.data || "Erro ao atualizar comprador";
                      setModalError(msg);
                    }
                  }}
                >
                  Salvar
                </button>
              </div>
            </>
          )}
          {(modal.type === "danger" || modal.type === "confirm") && modal.content}
        </Modal>
        <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, open: false })} />
      </div>
    </div>
  );
}

export default Compradores;
