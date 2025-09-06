const Comprador = require("../models/compradorModel");
const { validarDocumento } = require("../utils/validation");

async function listar(req, res) {
  try {
    const compradores = await Comprador.listarCompradores();
    res.json(compradores);
  } catch (err) {
    res.status(500).send("Erro ao listar compradores");
  }
}

async function criar(req, res) {
  const { nome, documento } = req.body;
  if (!nome || !documento) return res.status(400).send("Campos obrigatórios");
  if (!validarDocumento(documento)) return res.status(400).send("CPF ou CNPJ inválido");

  try {
    const existente = await Comprador.encontrarCompradorPorDocumento(documento);
    if (existente) return res.status(409).send("Já existe um comprador com esse CPF/CNPJ");
    await Comprador.criarComprador(nome, documento);
    res.status(201).send("Comprador cadastrado com sucesso");
  } catch (err) {
    if (err.number === 2627) return res.status(409).send("Já existe um comprador com esse CPF/CNPJ");
    res.status(500).send("Erro ao cadastrar comprador");
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, documento } = req.body;
  if (!nome || !documento) return res.status(400).send("Nome e documento são obrigatórios");
  if (!validarDocumento(documento)) return res.status(400).send("CPF ou CNPJ inválido");

  try {
    const conflito = await Comprador.existeOutroCompradorComMesmoDocumento(id, documento);
    if (conflito) return res.status(409).send("Já existe um comprador com esse CPF/CNPJ");
    await Comprador.atualizarComprador(id, nome, documento);
    res.send("Comprador atualizado com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao atualizar comprador");
  }
}

async function remover(req, res) {
  const { id } = req.params;
  try {
    await Comprador.excluirComprador(id);
    res.send("Comprador excluído");
  } catch (err) {
    if (err && err.number === 547) {
      // Violação de chave estrangeira
      return res.status(409).send("Não é possível excluir: existem registros relacionados a este comprador.");
    }
    res.status(500).send("Erro ao excluir comprador");
  }
}

module.exports = { listar, criar, atualizar, remover };


