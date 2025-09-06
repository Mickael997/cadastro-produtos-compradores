const { getConnection, sql } = require("../db");

async function listarCompradores() {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Compradores");
  return result.recordset;
}

async function encontrarCompradorPorDocumento(documento) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("documento", sql.VarChar, documento)
    .query("SELECT * FROM Compradores WHERE documento = @documento");
  return result.recordset[0];
}

async function existeOutroCompradorComMesmoDocumento(id, documento) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("documento", sql.VarChar, documento)
    .query("SELECT TOP 1 1 AS ok FROM Compradores WHERE id <> @id AND documento = @documento");
  return result.recordset.length > 0;
}

async function criarComprador(nome, documento) {
  const pool = await getConnection();
  await pool
    .request()
    .input("nome", sql.VarChar, nome)
    .input("documento", sql.VarChar, documento)
    .query("INSERT INTO Compradores (nome, documento) VALUES (@nome, @documento)");
}

async function atualizarComprador(id, nome, documento) {
  const pool = await getConnection();
  await pool
    .request()
    .input("id", sql.Int, id)
    .input("nome", sql.VarChar, nome)
    .input("documento", sql.VarChar, documento)
    .query("UPDATE Compradores SET nome = @nome, documento = @documento WHERE id = @id");
}

async function excluirComprador(id) {
  const pool = await getConnection();
  await pool.request().input("id", sql.Int, id).query("DELETE FROM Compradores WHERE id = @id");
}

module.exports = {
  listarCompradores,
  encontrarCompradorPorDocumento,
  existeOutroCompradorComMesmoDocumento,
  criarComprador,
  atualizarComprador,
  excluirComprador,
};


