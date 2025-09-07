require("dotenv").config();

const express = require("express");
const cors = require("cors");
const produtosRoutes = require("./routes/produtos");
const compradoresRoutes = require("./routes/compradores");
const { closePool } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/produtos", produtosRoutes);
app.use("/compradores", compradoresRoutes);

const authRoutes = require("./routes/auth");
app.use("/login", authRoutes);

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Backend rodando em http://localhost:${PORT}`)
);

async function gracefulShutdown(signal) {
  try {
    console.log(`\n${signal} recebido. Encerrando com elegância...`);
    await closePool();
    server.close(() => {
      console.log("HTTP server fechado.");
      process.exit(0);
    });
  } catch (err) {
    console.error("Erro no shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
