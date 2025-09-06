const sql = require("mssql");

// Configuração do SQL Server (ajuste para seu ambiente)
const config = {
  user: "sa",               // seu usuário do SQL Server
  password: "123456",    // senha
  server: "localhost",      // servidor
  database: "CadProdComp",
  options: {
    encrypt: false, // coloque true se for Azure
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("Erro na conexão SQL:", err);
  }
}

module.exports = { sql, getConnection };
