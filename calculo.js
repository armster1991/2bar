const regua = document.getElementById('regua');
const resultadoAngulo = document.getElementById('resultado-angulo');
const resultadoInfo = document.getElementById('resultado-info');
const alertaMobile = document.getElementById('alerta-mobile');
const ventoContra = document.getElementById('vento-contra');
const ventoFavor = document.getElementById('vento-favor');
const mobileBtns = document.querySelectorAll('.mobile-btn');

let distanciaSelecionada = null;
let ventoSelecionado = null;
let mobileSelecionado = null;

const correcaoMobiles = {
  armor: 0,
  mage: -0.05,
  asate: 0.05,
  raon: 0.1
};

// Criar 20 divisões na régua
for (let i = 0; i < 20; i++) {
  const div = document.createElement('div');
  regua.appendChild(div);
}

// Evento de mouse na régua
regua.addEventListener('mousemove', (e) => {
  const bounds = regua.getBoundingClientRect();
  const posX = e.clientX - bounds.left;
  const total = 800;
  const posClamped = Math.min(Math.max(posX, 0), total);
  distanciaSelecionada = posClamped;

  const segmentos = regua.querySelectorAll('div');
  const ativo = Math.floor((posClamped / total) * 20);
  segmentos.forEach((el, idx) => {
    el.classList.toggle('aceso', idx <= ativo);
  });

  tentaCalcular();
});

// Criar botões de vento (1-26 de cada lado + 0)
function criarBotaoVento(valor, tipo) {
  const btn = document.createElement('div');
  btn.classList.add('vento-botao', tipo === 'favor' ? 'verde' : 'vermelho');
  btn.textContent = valor;
  btn.dataset.valor = valor;
  btn.dataset.tipo = tipo;

  btn.addEventListener('mouseenter', () => {
    document.querySelectorAll('.vento-botao').forEach(b => b.classList.remove('selecionado'));
    btn.classList.add('selecionado');
    ventoSelecionado = { valor: parseInt(valor), tipo };
    tentaCalcular();
  });

  return btn;
}

for (let i = 1; i <= 26; i++) {
  ventoContra.appendChild(criarBotaoVento(i, 'contra'));
  ventoFavor.appendChild(criarBotaoVento(i, 'favor'));
}
ventoFavor.appendChild(criarBotaoVento(0, 'neutro'));

// Mobile
mobileBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mobileBtns.forEach(b => b.classList.remove('selecionado'));
    btn.classList.add('selecionado');
    mobileSelecionado = btn.id;
    alertaMobile.style.display = 'none';
    tentaCalcular();
  });
});

// Cálculo principal
function tentaCalcular() {
  if (distanciaSelecionada === null || ventoSelecionado === null || mobileSelecionado === null) return;

  const distanciaPx = distanciaSelecionada;
  const distanciaAngulo = (distanciaPx / 800) * 40; // cada 20px = 1 ângulo
  const anguloBase = 90 - distanciaAngulo;

  // Correção de vento
  const coef = getWindCoeficiente(anguloBase);
  let ajusteVento = ventoSelecionado.valor * coef;

  if (ventoSelecionado.tipo === 'contra') {
    anguloFinal = anguloBase - ajusteVento;
  } else if (ventoSelecionado.tipo === 'favor') {
    anguloFinal = anguloBase + ajusteVento;
  } else {
    anguloFinal = anguloBase;
  }

  // Ajuste por Mobile
  anguloFinal += correcaoMobiles[mobileSelecionado] || 0;

  // Arredondamento
  let anguloFinalArredondado = Math.round(anguloFinal);
  let invalido = (anguloFinalArredondado < 1 || anguloFinalArredondado > 89);

  // Exibir resultados
  resultadoAngulo.textContent = `${invalido ? '⚠️' : ''}${formatar(anguloFinalArredondado)}°${invalido ? '⚠️' : ''}`;
  resultadoAngulo.classList.toggle('resultado-invalido', invalido);
  resultadoInfo.textContent = `Distância: ${Math.round(distanciaPx)}px | Vento: ${ventoSelecionado.tipo} ${ventoSelecionado.valor}`;
}

// Coeficiente de vento baseado no ângulo (ban pao)
function getWindCoeficiente(angulo) {
  if (angulo >= 80) return 0.5;  // ½ SD - Wind Chart
  if (angulo >= 70) return 1.0;  // 1 SD
  return 1.2; // não recomendado abaixo de 70, mas forçamos com peso maior
}

// Formatador de ângulos
function formatar(n) {
  return n < 10 ? '0' + n : n;
}
