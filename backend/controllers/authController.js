const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarioModel");

const SECRET = "segredo_super_forte";

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Usuário e senha são obrigatórios");

  try {
    const user = await Usuario.encontrarPorUsername(username);
    if (!user) return res.status(401).send("Usuário ou senha inválidos");

    const senhaValida = await bcrypt.compare(password, user.passwordHash);
    if (!senhaValida) return res.status(401).send("Usuário ou senha inválidos");

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).send("Erro ao autenticar");
  }
}

function me(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Token não fornecido");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    res.json(decoded);
  } catch (err) {
    res.status(401).send("Token inválido ou expirado");
  }
}

module.exports = { login, me };


