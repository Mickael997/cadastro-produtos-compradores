const { getConnection, sql } = require("../db");

async function listarProdutos() {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Produtos");
  return result.recordset;
}

async function encontrarProdutoPorNomeECategoria(nome, categoria) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("nome", sql.VarChar, nome)
    .input("categoria", sql.VarChar, categoria)
    .query("SELECT * FROM Produtos WHERE nome = @nome AND categoria = @categoria");
  return result.recordset[0];
}

// Busca por nome (case-insensitive), independente da categoria
async function encontrarProdutoPorNome(nome) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("nome", sql.VarChar, nome)
    .query("SELECT TOP 1 * FROM Produtos WHERE LOWER(nome) = LOWER(@nome)");
  return result.recordset[0];
}

// Verifica se existe outro produto (id diferente) com o mesmo nome (case-insensitive)
async function existeOutroProdutoComMesmoNome(id, nome) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("nome", sql.VarChar, nome)
    .query("SELECT TOP 1 1 AS ok FROM Produtos WHERE id <> @id AND LOWER(nome) = LOWER(@nome)");
  return result.recordset.length > 0;
}

async function criarProduto(nome, categoria) {
  const pool = await getConnection();
  await pool
    .request()
    .input("nome", sql.VarChar, nome)
    .input("categoria", sql.VarChar, categoria)
    .query("INSERT INTO Produtos (nome, categoria) VALUES (@nome, @categoria)");
}

async function atualizarProduto(id, nome, categoria) {
  const pool = await getConnection();
  await pool
    .request()
    .input("id", sql.Int, id)
    .input("nome", sql.VarChar, nome)
    .input("categoria", sql.VarChar, categoria)
    .query("UPDATE Produtos SET nome = @nome, categoria = @categoria WHERE id = @id");
}

async function excluirProduto(id) {
  const pool = await getConnection();
  await pool.request().input("id", sql.Int, id).query("DELETE FROM Produtos WHERE id = @id");
}

module.exports = {
  listarProdutos,
  encontrarProdutoPorNomeECategoria,
  encontrarProdutoPorNome,
  existeOutroProdutoComMesmoNome,
  criarProduto,
  atualizarProduto,
  excluirProduto,
};


