const express = require("express");
const cors = require("cors");
const produtosRoutes = require("./routes/produtos");
const compradoresRoutes = require("./routes/compradores");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/produtos", produtosRoutes);
app.use("/compradores", compradoresRoutes);

const authRoutes = require("./routes/auth");
app.use("/login", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Backend rodando em http://localhost:${PORT}`));
