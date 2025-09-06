const categoriasPermitidas = ["Alimentos", "Bebidas", "Limpeza"];

function isCategoriaValida(categoria) {
  return categoriasPermitidas.includes(categoria);
}

function validarDocumento(documento) {
  if (!documento) return false;
  const digits = String(documento).replace(/\D/g, "");
  if (digits.length === 11) {
    return /^\d{11}$/.test(digits);
  }
  if (digits.length === 14) {
    return /^\d{14}$/.test(digits);
  }
  return false;
}

module.exports = {
  categoriasPermitidas,
  isCategoriaValida,
  validarDocumento,
};


