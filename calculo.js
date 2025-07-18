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
    if (tipo === "favor") botao.classList.add("ativo-verde");
    else if (tipo === "contra") botao.classList.add("ativo-vermelho");
    else botao.classList.add("ativo-verde"); // vento 0 tratado como neutro/favorável
    calcular();
  });

  if (tipo === "favor") ventoFavor.appendChild(botao);
  else if (tipo === "contra") ventoContra.appendChild(botao);
  else {
    botao.style.margin = "0 auto";
    botao.style.marginTop = "10px";
    document.getElementById("resultado-container").appendChild(botao);
  }
}

function calcular() {
  if (distanciaSelecionada === null || ventoSelecionado === null || !mobileSelecionado) return;

  const distanciaEmAngulo = Math.round(distanciaSelecionada / 20);
  let anguloBase = 90 - distanciaEmAngulo;

  let ajusteVento = 0;
  if (tipoVento === "favor") {
    ajusteVento = calcularAjusteVento(anguloBase, ventoSelecionado);
