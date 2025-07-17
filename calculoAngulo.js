export function calcularAngulo(distanciaPx, ventoValor, ventoLado) {
  // distanciaPx: posição do mouse na régua (0 a 800)
  // ventoValor: 0 a 26
  // ventoLado: 'favor' ou 'contra'

  const meioSD = 400; // metade da régua, corresponde a meio SD
  const distanciaPowerBar = distanciaPx / meioSD; // ex: 1.2

  // distância em ângulo (cada 0.2 power bar = 1 ângulo; 1 power bar = 5 barras = 25 ângulos)
  const distanciaAngulo = distanciaPowerBar * 25;

  // calcular ângulo base
  let baseAngle = 90 - distanciaAngulo;

  // ajuste da força em barras baseado no ângulo base aproximado
  let barras = 2;
  if (baseAngle >= 80 && baseAngle <= 90) {
    barras = 2;
  } else if (baseAngle >= 75 && baseAngle < 80) {
    barras = 2.05;
  } else if (baseAngle >= 70 && baseAngle < 75) {
    barras = 2.1;
  } else {
    // ângulo fora do intervalo válido
    return null;
  }

  // ajuste do vento baseado no ângulo base
  let ajusteVento = 0;
  if (baseAngle >= 80) {
    // usar 1/2 SD chart - vento reduzido 65%
    ajusteVento = ventoValor * 0.65;
  } else if (baseAngle >= 70 && baseAngle < 80) {
    // usar 1 SD chart - vento direto
    ajusteVento = ventoValor;
  }

  // vento contra é negativo, vento a favor positivo
  if (ventoLado === 'contra') {
    ajusteVento = -ajusteVento;
  }

  // cálculo do ângulo final
  let anguloCalculado = 90 - distanciaAngulo + ajusteVento;

  // se passar de 90, fazer reflexo
  if (anguloCalculado > 90) {
    anguloCalculado = 180 - anguloCalculado;
  }

  return Math.round(anguloCalculado);
}
