// calculo.js

// variáveis de estado
let selectedDistancePx = 0;
let selectedWind = 0;
let selectedMobile = '';

// referências aos elementos
const ruler = document.getElementById('ruler');
const angleEl = document.getElementById('angle-result');
const alertMobile = document.getElementById('alert-mobile');
const mobileSelect = document.getElementById('mobile-select');
const windsLeft = document.getElementById('winds-left');
const windsRight = document.getElementById('winds-right');

// popula 26 ventos “contra” (esquerda) e 26 ventos “a favor” (direita)
for (let i = 1; i <= 26; i++) {
  // vento contra
  const btnC = document.createElement('div');
  btnC.className = 'wind-button wind-against';
  btnC.dataset.wind = -i;
  btnC.textContent = `${i}°`;
  windsLeft.appendChild(btnC);
  // vento a favor
  const btnF = document.createElement('div');
  btnF.className = 'wind-button wind-favor';
  btnF.dataset.wind = i;
  btnF.textContent = `${i}°`;
  windsRight.appendChild(btnF);
}

// popula 20 segmentos da régua
for (let i = 0; i < 20; i++) {
  const seg = document.createElement('div');
  seg.className = 'ruler-segment';
  seg.dataset.index = i;
  ruler.appendChild(seg);
}

// função que “acende” segmentos até a posição x
function updateSegments(x) {
  const rect = ruler.getBoundingClientRect();
  const total = rect.width;
  const perSeg = total / 20;
  const count = Math.ceil(Math.max(0, Math.min(x, total)) / perSeg);
  document.querySelectorAll('.ruler-segment').forEach(seg => {
    const idx = Number(seg.dataset.index) + 1;
    if (idx <= count) seg.classList.add('active');
    else seg.classList.remove('active');
  });
}

// event: movimento do mouse sobre a régua
ruler.addEventListener('mousemove', e => {
  const rect = ruler.getBoundingClientRect();
  selectedDistancePx = e.clientX - rect.left;
  updateSegments(selectedDistancePx);
  calculateAndDisplay();
});

// event: hover em qualquer botão de vento
document.body.addEventListener('mouseenter', e => {
  const t = e.target;
  if (t.classList.contains('wind-button') && t.dataset.wind != null) {
    // marca seleção
    selectedWind = Number(t.dataset.wind);
    document.querySelectorAll('.wind-button.selected').forEach(b => b.classList.remove('selected'));
    t.classList.add('selected');
    calculateAndDisplay();
  }
}, true);

// event: seleção de Mobile
mobileSelect.addEventListener('change', e => {
  selectedMobile = e.target.value;
  if (selectedMobile) alertMobile.style.display = 'none';
  calculateAndDisplay();
});

// cálculo do ângulo
function calculateAndDisplay() {
  if (!selectedMobile) return;    // só após escolher Mobile

  // 1) distância → ângulo bruto
  const rawAngle = 90 - (selectedDistancePx / 20);

  // 2) fator vento
  let windStrength = 0;
  if (rawAngle >= 80 && rawAngle <= 90) {
    const w = Math.abs(selectedWind);
    windStrength = (w <= 10 ? 0.6 : w <= 25 ? 0.65 : 0.6);
  } else if (rawAngle >= 70 && rawAngle < 80) {
    windStrength = 1.0;
  }

  // 3) correção de vento
  const windCorr = Math.floor(Math.abs(selectedWind) * windStrength);
  let finalAngle = rawAngle + (selectedWind > 0 ? windCorr : -windCorr);

  // 4) arredonda e formata
  finalAngle = Math.round(finalAngle);
  const outOfRange = finalAngle < 1 || finalAngle > 89;
  const txt = outOfRange
    ? `⚠ ${String(finalAngle).padStart(2, '0')} ⚠`
    : String(finalAngle).padStart(2, '0');

  angleEl.textContent = txt;
  angleEl.classList.toggle('out-of-range', outOfRange);
}
