const categoriasPermitidas = ["Alimentos", "Bebidas", "Limpeza"];
const { cpf, cnpj } = require("cpf-cnpj-validator");

function isCategoriaValida(categoria) {
  return categoriasPermitidas.includes(categoria);
}

function validarDocumento(documento) {
  if (!documento) return false;
  const digits = String(documento).replace(/\D/g, "");
  if (digits.length === 11) return cpf.isValid(documento);
  if (digits.length === 14) return cnpj.isValid(documento);
  return false;
}

module.exports = {
  categoriasPermitidas,
  isCategoriaValida,
  validarDocumento,
};


