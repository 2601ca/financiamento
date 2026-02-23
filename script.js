const valorInput    = document.getElementById("valor");
const entradaInput  = document.getElementById("entrada");
const jurosInput    = document.getElementById("juros");
const parcelasInput = document.getElementById("parcelas");
const resultado     = document.getElementById("resultado");
const form          = document.getElementById("form");
const limparBtn     = document.getElementById("limpar");

function formatarMoeda(input) {
  let numeros = input.value.replace(/\D/g, "");
  if (!numeros) {
    input.value = "";
    return;
  }
  let valor = (Number(numeros) / 100).toFixed(2);
  input.value = valor.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function converter(valorStr) {
  if (!valorStr) return 0;
  return Number(valorStr.replace(/\./g, "").replace(",", "."));
}

function moedaBR(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mostrarErro(msg) {
  resultado.innerHTML = `<div class="erro">${msg}</div>`;
}

function calcular(e) {
  e.preventDefault();

  const valor     = converter(valorInput.value);
  const entrada   = converter(entradaInput.value);
  const juros     = Number(jurosInput.value.replace(",", ".")) / 100;
  const parcelas  = parseInt(parcelasInput.value);

  if (valor <= 0)           return mostrarErro("Informe um valor válido do veículo.");
  if (entrada < 0 || entrada > valor) return mostrarErro("Entrada inválida.");
  if (isNaN(juros) || juros < 0) return mostrarErro("Taxa de juros inválida.");
  if (!parcelas || parcelas <= 0) return mostrarErro("Número de parcelas inválido.");

  const financiado = valor - entrada;

  if (financiado === 0) {
    resultado.innerHTML = `<div class="resultado-item"><strong>Entrada cobre 100% do veículo.</strong></div>`;
    return;
  }

  let parcela;
  if (juros === 0) {
    parcela = financiado / parcelas;
  } else {
    parcela = (financiado * juros) / (1 - Math.pow(1 + juros, -parcelas));
  }

  const totalPago   = parcela * parcelas;
  const totalJuros  = totalPago - financiado;

  resultado.innerHTML = `
    <div class="resultado-item"><span>Valor financiado:</span><strong>${moedaBR(financiado)}</strong></div>
    <div class="resultado-item"><span>Parcela estimada:</span><strong>${moedaBR(parcela)}</strong></div>
    <div class="resultado-item"><span>Total pago:</span><strong>${moedaBR(totalPago)}</strong></div>
    <div class="resultado-item"><span>Total em juros:</span><strong>${moedaBR(totalJuros)}</strong></div>
  `;
}

// Formatação em tempo real para campos monetários
[valorInput, entradaInput].forEach(input => {
  input.addEventListener("input", () => formatarMoeda(input));
});

// Eventos
form.addEventListener("submit", calcular);

limparBtn.addEventListener("click", () => {
  form.reset();
  resultado.innerHTML = `<span class="subtitle">Preencha os campos para simular.</span>`;
});
