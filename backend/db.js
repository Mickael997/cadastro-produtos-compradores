const sql = require("mssql");

// Validação das variáveis
const requiredEnv = ["DB_USER", "DB_PASSWORD", "DB_SERVER", "DB_NAME"];
const missing = requiredEnv.filter((k) => !process.env[k] || process.env[k].length === 0);
if (missing.length) {
  throw new Error(
    `Variáveis de ambiente ausentes: ${missing.join(", ")}. Configure-as no arquivo .env.`
  );
}

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === "true",
    trustServerCertificate: String(process.env.DB_TRUST_CERT).toLowerCase() === "true",
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX),
    min: Number(process.env.DB_POOL_MIN),
    idleTimeoutMillis: Number(process.env.DB_POOL_IDLE),
  },
};

let poolPromise;

function getConnection() {
  if (!poolPromise) {
    poolPromise = sql
      .connect(config)
      .then((pool) => {
        return pool;
      })
      .catch((err) => {
        poolPromise = undefined;
        console.error("Erro ao conectar no SQL Server:", err);
        throw err;
      });
  }
  return poolPromise;
}

async function closePool() {
  try {
    if (sql?.connected) {
      await sql.close();
    }
  } catch (err) {
    console.error("Erro ao fechar pool do SQL Server:", err);
  }
}

module.exports = { sql, getConnection, closePool };
