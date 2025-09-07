export function formatarDocumento(valor) {
  if (!valor) return "";

  // Remove tudo que não for número
  // Ou seja pontos, traços, letras
  const digits = valor.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 11) {
    // Formatação para CPF
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Formatação para CNPJ
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
}
