const LB_PER_KG = 2.2046226218;

export function kgToLb(kg: number): number {
  return roundOneDecimal(kg * LB_PER_KG);
}

export function lbToKg(lb: number): number {
  return roundOneDecimal(lb / LB_PER_KG);
}

export function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function toCanonicalLoadKg(
  load: number,
  unitSystem: 'metric' | 'imperial',
): number {
  if (load < 0) {
    throw new Error('Load must be >= 0');
  }
  return unitSystem === 'imperial' ? lbToKg(load) : roundOneDecimal(load);
}
