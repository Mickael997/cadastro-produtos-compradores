const bcrypt = require("bcryptjs");
const { getConnection, sql } = require("./db");

async function criarUsuario(username, senha, role) {
  const pool = await getConnection();

  // Verifica se já existe
  const existente = await pool
    .request()
    .input("username", sql.VarChar, username)
    .query("SELECT * FROM Usuarios WHERE username = @username");

  if (existente.recordset.length > 0) {
    console.log(`Usuário ${username} já existe, pulando...`);
    return;
  }

  const hash = await bcrypt.hash(senha, 10);
  await pool
    .request()
    .input("username", sql.VarChar, username)
    .input("passwordHash", sql.VarChar, hash)
    .input("role", sql.VarChar, role)
    .query("INSERT INTO Usuarios (username, passwordHash, role) VALUES (@username, @passwordHash, @role)");

  console.log(`Usuário ${username} criado!`);
}

criarUsuario("admin", "123", "admin");
criarUsuario("user", "123", "user");
