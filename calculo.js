// Seletores globais
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

// Correções por Mobile
const mobileCorrecao = {
  armor: 0,
  mage: -0.05,
  asate: +0.05,
  raon: +0.1
};

// Renderiza régua
for (let i = 0; i < 20; i++) {
  const div = document.createElement('div');
  regua.appendChild(div);
}

// Eventos da régua
regua.addEventListener('mousemove', (e) => {
  const bounds = regua.getBoundingClientRect();
  const posX = e.clientX - bounds.left;
  const total = 800;
  const porcentagem = Math.min(Math.max(posX, 0), total);
  distanciaSelecionada = porcentagem;

  // Acende barras
  const segmentos = regua.querySelectorAll('div');
  const acenderIndex = Math.floor((porcentagem / total) * 20);
  segmentos.forEach((el, idx) => {
    el.classList.toggle('aceso', idx <= acenderIndex);
  });

  tentaCalcular();
});

// Renderiza botões de vento
function criaBotaoVento(valor, tipo) {
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
  ventoContra.appendChild(criaBotaoVento(i, 'contra'));
  ventoFavor.appendChild(criaBotaoVento(i, 'favor'));
}
ventoFavor.appendChild(criaBotaoVento(0, 'neutro')); // zero no centro

// Seleção de Mobile
mobileBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mobileBtns.forEach(m => m.classList.remove('selecionado'));
    btn.classList.add('selecionado');
    mobileSelecionado = btn.id;
    alertaMobile.style.display = 'none';
    tentaCalcular();
  });
});

// Função principal de cálculo
function tentaCalcular() {
  if (distanciaSelecionada === null || ventoSelecionado === null || mobileSelecionado === null) {
    return;
  }

  // Cálculo de distância em "ângulos"
  const distanciaPixel = distanciaSelecionada; // 800px = 1 sd
  const anguloDistancia = (distanciaPixel / 800) * 20; // 20 = 100px = 5 ang -> 400px = 20 ang -> 800px = 40 ang

  // Correção de vento
  const anguloBase = 90 - anguloDistancia;

  let fatorVento = 1;
  const anguloReal = anguloBase + (
    ventoSelecionado.tipo === 'favor' ? 
      getWindAjuste(anguloBase, ventoSelecionado.valor) : 
      -getWindAjuste(anguloBase, ventoSelecionado.valor)
  );

  // Correção do mobile
  const ajusteMobile = mobileCorrecao[mobileSelecionado] || 0;
  let anguloFinal = anguloReal + ajusteMobile;

  // Formatação e validação
  anguloFinal = Math.round(anguloFinal);
  let invalido = false;
  if (anguloFinal < 1 || anguloFinal > 89) {
    invalido = true;
  }

  // Atualiza tela
  resultadoAngulo.textContent = `${invalido ? '⚠️' : ''}${pad(anguloFinal)}°${invalido ? '⚠️' : ''}`;
  resultadoAngulo.classList.toggle('resultado-invalido', invalido);

  resultadoInfo.textContent = `Distância: ${Math.round(distanciaPixel)}px | Vento: ${ventoSelecionado.tipo === 'neutro' ? '0' : ventoSelecionado.tipo + ' ' + ventoSelecionado.valor}`;
}

// Ajuste de vento baseado no gráfico (ban pao)
function getWindAjuste(anguloBase, windStrength) {
  if (anguloBase >= 80) return windStrength * 0.5;       // Ban pao 1/2 sd
  if (anguloBase >= 70) return windStrength * 1;         // Ban pao 1 sd
  return windStrength * 1.2; // Fora do ideal, compensação bruta
}

// Formatação de 2 dígitos
function pad(n) {
  return n < 10 ? '0' + n : n;
}
