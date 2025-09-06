import { useEffect, useState } from "react";
import api from "../services/api";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import WarningIcon from "../components/WarningIcon";

function Produtos() {
  //Passamos as variáveis
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Alimentos");
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("Alimentos");
  const [modalError, setModalError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const [modal, setModal] = useState({ open: false, title: "", content: null, type: null });
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  //Puxa a lista dos produtos
  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    try {
      const res = await api.get("/produtos");
      // Ordena por ID ascendente
      const listaOrdenada = res.data.sort((a, b) => (a.id || 0) - (b.id || 0));
      setProdutos(listaOrdenada);
    } catch (err) {
      alert("Erro ao buscar produtos");
    }
  };

  const abrirModalNovoProduto = () => {
    setNome("");
    setCategoria("Alimentos");
    setModalError("");
    setModal({ open: true, title: "Novo Produto", type: "new" });
  };

  const excluirProduto = async (id, nome) => {
    setModal({
      open: true,
      title: "Excluir Produto",
      type: "danger",
      content: (
        <>
          <p>Tem certeza que deseja excluir o produto "{nome}"?</p>
          <p>Esta ação não pode ser desfeita.</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Cancelar</button>
            <button
              className="btn-danger"
              onClick={async () => {
                try {
                  await api.delete(`/produtos/${id}`);
                  setModal({ open: false });
                  buscarProdutos();
                  setToast({ open: true, type: "error", message: "Produto excluído" });
                } catch (err) {
                  setModal({ open: false });
                  setToast({ open: true, type: "error", message: "Erro ao excluir produto" });
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

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setNovoNome(produto.nome);
    setNovaCategoria(produto.categoria);
  };

  const abrirModalEditarProduto = (produto) => {
    setNovoNome(produto.nome);
    setNovaCategoria(produto.categoria);
    setEditandoId(produto.id);
    setModal({ open: true, title: "Editar Produto", type: "edit" });
  };

  const salvarEdicaoProduto = async (id) => {
    setModal({
      open: true,
      title: "Salvar alterações",
      type: "default",
      content: (
        <>
          <p>Deseja salvar as alterações deste produto?</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setModal({ open: false })}>Cancelar</button>
            <button
              className="btn-primary"
              onClick={async () => {
                try {
                  await api.put(`/produtos/${id}`, { nome: novoNome, categoria: novaCategoria });
                  setEditandoId(null);
                  setModal({ open: false });
                  buscarProdutos();
                  setToast({ open: true, type: "success", message: "Produto atualizado" });
                } catch (err) {
                  setModal({ open: false });
                  setToast({ open: true, type: "error", message: err.response?.data || "Erro ao atualizar produto" });
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

  //Filtro de busca pelo nome ou categoria
  //toLowerCase converte para minúsculo
  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      p.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  //A parte visual que aparece na página
  return (
    <div className="container">
      <div className="card produtos-card">
        <div className="produtos-header">
          <div className="produtos-title">
            <span className="produtos-icon">📦</span>
            <div>
              <h2>Produtos</h2>
              <p className="subtitle">Gerencie seu catálogo de produtos</p>
            </div>
          </div>
          {user?.role === "admin" && (
            <button onClick={abrirModalNovoProduto} className="btn-primary">+ Novo Produto</button>
          )}
        </div>

        <div className="search-bar">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {produtos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">Nenhum produto cadastrado</h3>
            <p className="empty-subtitle">Comece adicionando seu primeiro produto</p>
            {user?.role === "admin" && (
              <div className="empty-actions">
                <button onClick={abrirModalNovoProduto} className="btn-primary">+ Adicionar Produto</button>
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
                <div className="col cat">Categoria</div>
                {user?.role === 'admin' && <div className="col actions">Ações</div>}
              </div>
              {produtosFiltrados.map((p) => (
                <div key={p.id} className="table-row">
                  <div className="col id">{p.id}</div>
                  <div className="col name">
                    <strong>{p.nome}</strong>
                  </div>
                  <div className="col cat">
                    <span className={`badge ${p.categoria.toLowerCase()}`}>{p.categoria}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="col actions">
                      <button className="icon-btn edit" title="Editar" onClick={() => abrirModalEditarProduto(p)}>✏️</button>
                      <button className="icon-btn delete" title="Excluir" onClick={() => excluirProduto(p.id, p.nome)}>🗑️</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {produtosFiltrados.length === 0 && (
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
                  placeholder="Nome do produto"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={modalError ? "input-error" : undefined}
                />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpeza">Limpeza</option>
                </select>
              </div>
              {modalError && <div className="field-error">{modalError}</div>}
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => { setModalError(""); setNome(""); setCategoria("Alimentos"); setModal({ open: false }); }}>Cancelar</button>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    if (!nome) {
                      setToast({ open: true, type: "error", message: "Informe o nome do produto" });
                      return;
                    }
                    try {
                      setModalError("");
                      await api.post("/produtos", { nome, categoria });
                      setNome("");
                      setCategoria("Alimentos");
                      setModal({ open: false });
                      buscarProdutos();
                      setToast({ open: true, type: "success", message: "Produto adicionado com sucesso" });
                    } catch (err) {
                      const msg = err.response?.data || "Erro ao cadastrar produto";
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
                  placeholder="Nome do produto"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className={modalError ? "input-error" : undefined}
                />
                <select value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)}>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpeza">Limpeza</option>
                </select>
              </div>
              {modalError && <div className="field-error">{modalError}</div>}
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => { setModalError(""); setModal({ open: false })}}>Cancelar</button>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    try {
                      setModalError("");
                      await api.put(`/produtos/${editandoId}`, { nome: novoNome, categoria: novaCategoria });
                      setEditandoId(null);
                      setModal({ open: false });
                      buscarProdutos();
                      setToast({ open: true, type: "success", message: "Produto atualizado" });
                    } catch (err) {
                      const msg = err.response?.data || "Erro ao atualizar produto";
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

export default Produtos;
