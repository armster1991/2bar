const regua = document.getElementById("regua");
const anguloResultado = document.getElementById("angulo-resultado");
const alertaMobile = document.getElementById("alerta-mobile");
const mobileSelect = document.getElementById("mobile-select");
const ventoContra = document.getElementById("ventos-contra");
const ventoFavor = document.getElementById("ventos-favor");

let distanciaSelecionada = null;
let ventoSelecionado = null;
let tipoVento = null;
let mobileSelecionado = null;

// Cria segmentos da régua
for (let i = 0; i < 20; i++) {
  const segmento = document.createElement("div");
  segmento.classList.add("regua-segmento");
  regua.appendChild(segmento);
}

regua.addEventListener("mousemove", (e) => {
  const rect = regua.getBoundingClientRect();
  const x = e.clientX - rect.left;
  distanciaSelecionada = Math.min(Math.max(x, 0), 800);
  atualizarRegua(distanciaSelecionada);
  calcular();
});

function atualizarRegua(x) {
  const segmentos = document.querySelectorAll(".regua-segmento");
  const limite = Math.floor((x / 800) * 20);
  segmentos.forEach((seg, i) => {
    seg.classList.toggle("ativo", i <= limite);
  });
}

mobileSelect.addEventListener("change", () => {
  mobileSelecionado = mobileSelect.value;
  if (mobileSelecionado) {
    alertaMobile.style.display = "none";
    calcular();
  }
});

// Cria botões de vento
for (let i = 0; i <= 26; i++) {
  if (i > 0) {
    criarBotaoVento(i, "favor");
    criarBotaoVento(i, "contra");
  } else {
    criarBotaoVento(i, "neutro");
  }
}

function criarBotaoVento(valor, tipo) {
  const botao = document.createElement("div");
  botao.classList.add("vento");
  botao.textContent = `${valor}`;
  botao.addEventListener("mouseenter", () => {
    ventoSelecionado = valor;
    tipoVento = tipo;
    document.querySelectorAll(".vento").forEach(b => b.classList.remove("ativo-verde", "ativo-vermelho"));
    botao.classList.add(tipo === "favor" ? "ativo-verde" : tipo === "contra" ? "ativo-vermelho" : "");
    calcular();
  });

  if (tipo === "favor") ventoFavor.appendChild(botao);
  else if (tipo === "contra") ventoContra.appendChild(botao);
  else {
    botao.style.margin = "0 auto";
    document.getElementById("resultado-container").appendChild(botao);
  }
}
function calcular() {
  if (distanciaSelecionada === null || ventoSelecionado === null || !mobileSelecionado) return;

  // Distância em pixels → ângulo base
  const distanciaEmAngulo = Math.round(distanciaSelecionada / 20); // Cada 20px = 1 ângulo
  let anguloBase = 90 - distanciaEmAngulo;

  // Ajuste por vento
  let ajusteVento = 0;
  if (tipoVento === "favor") {
    ajusteVento = calcularAjusteVento(anguloBase, ventoSelecionado);
    anguloBase += ajusteVento;
  } else if (tipoVento === "contra") {
    ajusteVento = calcularAjusteVento(anguloBase, ventoSelecionado);
    anguloBase -= ajusteVento;
  }

  // Ajuste por Mobile
  anguloBase = ajustarPorMobile(anguloBase, mobileSelecionado);

  // Verificação de limites
  let anguloFinal = Math.round(anguloBase);
  if (anguloFinal < 1 || anguloFinal > 89) {
    anguloResultado.classList.add("alerta");
    anguloResultado.textContent = `⚠️ ${pad(anguloFinal)} ⚠️`;
  } else {
    anguloResultado.classList.remove("alerta");
    anguloResultado.textContent = pad(anguloFinal);
  }
}

// Função para ajustar por Mobile
function ajustarPorMobile(angulo, mobile) {
  switch (mobile) {
    case "armor": return angulo;
    case "asate": return angulo + 0.05;
    case "mage": return angulo - 0.05;
    case "raon": return angulo + 0.1;
    default: return angulo;
  }
}

// Função para calcular o ajuste de vento baseado no ângulo
function calcularAjusteVento(angulo, vento) {
  if (angulo >= 80) return vento * 0.5;     // banpao 1/2 sd
  else if (angulo >= 70) return vento * 1;  // banpao 1 sd
  else return vento * 0.65;                 // extrapolação para ângulos menores
}

// Função para formatar o ângulo com dois dígitos
function pad(n) {
  return n.toString().padStart(2, '0');
}
