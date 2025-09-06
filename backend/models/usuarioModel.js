const { getConnection, sql } = require("../db");

async function encontrarPorUsername(username) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("username", sql.VarChar, username)
    .query("SELECT * FROM Usuarios WHERE username = @username");
  return result.recordset[0];
}

module.exports = { encontrarPorUsername };


