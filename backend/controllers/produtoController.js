const Produto = require("../models/produtoModel");
const { isCategoriaValida } = require("../utils/validation");

async function listar(req, res) {
  try {
    const produtos = await Produto.listarProdutos();
    res.json(produtos);
  } catch (err) {
    res.status(500).send("Erro ao listar produtos");
  }
}

async function criar(req, res) {
  const { nome, categoria } = req.body;
  if (!nome || !categoria) return res.status(400).send("Nome e categoria são obrigatórios");
  if (nome.length < 2) return res.status(400).send("Nome do produto deve ter pelo menos 2 caracteres");
  if (!isCategoriaValida(categoria)) return res.status(400).send("Categoria inválida. Use: Alimentos, Bebidas ou Limpeza");

  try {
    // validação única por nome (case-insensitive), independente da categoria
    const existente = await Produto.encontrarProdutoPorNome(nome);
    if (existente) return res.status(409).send("Já existe um produto com esse nome");
    await Produto.criarProduto(nome, categoria);
    res.status(201).send("Produto cadastrado com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao cadastrar produto");
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, categoria } = req.body;
  if (!nome || !categoria) return res.status(400).send("Nome e categoria são obrigatórios");
  if (!isCategoriaValida(categoria)) return res.status(400).send("Categoria inválida. Use: Alimentos, Bebidas ou Limpeza");

  try {
    const conflito = await Produto.existeOutroProdutoComMesmoNome(id, nome);
    if (conflito) return res.status(409).send("Já existe um produto com esse nome");
    await Produto.atualizarProduto(id, nome, categoria);
    res.send("Produto atualizado com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao atualizar produto");
  }
}

async function remover(req, res) {
  const { id } = req.params;
  try {
    await Produto.excluirProduto(id);
    res.send("Produto excluído");
  } catch (err) {
    res.status(500).send("Erro ao excluir produto");
  }
}

module.exports = { listar, criar, atualizar, remover };


