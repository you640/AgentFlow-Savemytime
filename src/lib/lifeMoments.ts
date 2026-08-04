// Prepočet ušetreného času na relatable "momenty života".
// Srdce produktu: čas nie je abstraktné číslo, ale konkrétne chvíle,
// ktoré majiteľ e-shopu môže venovať tomu, na čom naozaj záleží.

export interface LifeUnit {
  h: number;
  label: string;
}

// Zoradené od najväčšieho po najmenší (greedy dekompozícia).
export const LIFE_UNITS: LifeUnit[] = [
  { h: 8, label: 'celý deň voľna' },
  { h: 3, label: 'večera s rodinou' },
  { h: 2, label: 'tréning so synom' },
  { h: 1.5, label: 'dlhá prechádzka' },
  { h: 1, label: 'kapitola knihy' },
  { h: 0.5, label: 'pokojná káva' },
];

/**
 * Rozloží hodiny na 1–`max` relatable momentov.
 * Napr. 3.5h -> ["večera s rodinou", "pokojná káva"].
 */
export function lifeMoments(hours: number, max = 3): string[] {
  let remaining = Math.max(0, hours);
  const out: string[] = [];

  for (const unit of LIFE_UNITS) {
    while (remaining + 1e-9 >= unit.h && out.length < max) {
      out.push(unit.label);
      remaining = Math.round((remaining - unit.h) * 10) / 10;
    }
    if (out.length >= max) break;
  }

  if (out.length === 0) return ['pár pokojných minút'];
  return out;
}

/** Pekný textový zápis: "tréning so synom + kapitola knihy + pokojná káva". */
export function lifeMomentsText(hours: number, max = 3): string {
  return lifeMoments(hours, max).join(' + ');
}
