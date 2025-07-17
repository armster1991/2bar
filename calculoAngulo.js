export function calcularAngulo(distanciaPx, ventoValor, ventoLado) {
  const meioSD = 400; // metade da régua em pixels
  const distanciaPowerBar = distanciaPx / meioSD; // ex: 1.2 barras
  // Cada barra = 5 ângulos, então:
  const distanciaAngulo = distanciaPowerBar * 25; // 25 = 5*5

  let baseAngle = 90 - distanciaAngulo;

  // Ajuste força em barras baseado no ângulo base
  let barras;
  if (baseAngle >= 80 && baseAngle <= 90) barras = 2.0;
  else if (baseAngle >= 75 && baseAngle < 80) barras = 2.05;
  else if (baseAngle >= 70 && baseAngle < 75) barras = 2.1;
  else return null; // fora do intervalo

  // Ajuste vento baseado no ângulo base
  let ajusteVento = 0;
  if (baseAngle >= 80) ajusteVento = ventoValor * 0.65;
  else if (baseAngle >= 70 && baseAngle < 80) ajusteVento = ventoValor;
  else return null;

  if (ventoLado === 'contra') ajusteVento = -ajusteVento;

  let anguloFinal = 90 - distanciaAngulo + ajusteVento;

  if (anguloFinal > 90) anguloFinal = 180 - anguloFinal;
  if (anguloFinal < 0) anguloFinal = 0;

  return Math.round(anguloFinal);
}
