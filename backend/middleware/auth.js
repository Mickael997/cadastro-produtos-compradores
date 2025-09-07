const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Token não fornecido");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Token inválido ou expirado");
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send("Não autenticado");
    if (req.user.role !== role) return res.status(403).send("Acesso negado");
    next();
  };
}

module.exports = { verifyToken, requireRole };


