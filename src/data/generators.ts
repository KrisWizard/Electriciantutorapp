import type { CalcProblem } from './types'

/** Norsk tallformat med komma og maks `d` desimaler. */
export function fmt(n: number, d = 2): string {
  return n.toLocaleString('nb-NO', { maximumFractionDigits: d, useGrouping: false })
}

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
const RHO = 0.0175 // Ω·mm²/m, kobber

export interface Generator {
  id: string
  navn: string
  lag: () => CalcProblem
}

export const GENERATORS: Generator[] = [
  {
    id: 'ohm-i',
    navn: 'Ohms lov – strøm',
    lag: () => {
      const U = pick([12, 24, 48, 230, 400])
      const R = pick([2, 4, 5, 8, 10, 20, 23, 40, 46, 50, 100])
      const I = U / R
      return {
        tittel: 'Ohms lov',
        tekst: `En resistans på ${R} Ω er koblet til ${U} V. Hvor stor er strømmen?`,
        svar: I,
        enhet: 'A',
        losning: `I = U / R = ${U} / ${R} = ${fmt(I)} A`,
      }
    },
  },
  {
    id: 'ohm-r',
    navn: 'Ohms lov – resistans',
    lag: () => {
      const U = pick([12, 24, 230, 400])
      const I = pick([0.5, 1, 2, 4, 5, 10, 16])
      const R = U / I
      return {
        tittel: 'Ohms lov',
        tekst: `Det går ${fmt(I)} A gjennom en last som er koblet til ${U} V. Hva er resistansen?`,
        svar: R,
        enhet: 'Ω',
        losning: `R = U / I = ${U} / ${fmt(I)} = ${fmt(R)} Ω`,
      }
    },
  },
  {
    id: 'effekt-1f',
    navn: 'Enfase effekt – strøm',
    lag: () => {
      const P = pick([500, 750, 1000, 1200, 1500, 2000, 2300, 3000])
      const U = 230
      const I = P / U
      return {
        tittel: 'Enfase effekt',
        tekst: `En panelovn på ${P} W er koblet til ${U} V (cos φ = 1). Hvor stor strøm trekker den?`,
        svar: I,
        enhet: 'A',
        losning: `I = P / U = ${P} / ${U} = ${fmt(I)} A`,
      }
    },
  },
  {
    id: 'effekt-3f',
    navn: 'Trefase effekt – strøm',
    lag: () => {
      const P = pick([5.5, 7.5, 9, 11, 15, 22])
      const U = pick([230, 400])
      const cos = pick([0.8, 0.85, 0.9, 1])
      const I = (P * 1000) / (Math.sqrt(3) * U * cos)
      return {
        tittel: 'Trefase effekt',
        tekst: `En symmetrisk trefaselast på ${fmt(P)} kW er koblet til ${U} V (linjespenning), cos φ = ${fmt(cos)}. Hvor stor er linjestrømmen?`,
        svar: I,
        enhet: 'A',
        losning: `I = P / (√3 · U · cos φ) = ${fmt(P * 1000)} / (1,732 · ${U} · ${fmt(cos)}) = ${fmt(I, 1)} A`,
      }
    },
  },
  {
    id: 'parallell',
    navn: 'Parallellkobling',
    lag: () => {
      const R1 = pick([10, 20, 30, 40, 60, 100])
      const R2 = pick([10, 15, 20, 30, 60, 120])
      const R = (R1 * R2) / (R1 + R2)
      return {
        tittel: 'Parallellkobling',
        tekst: `To motstander på ${R1} Ω og ${R2} Ω kobles i parallell. Hva er totalresistansen?`,
        svar: R,
        enhet: 'Ω',
        losning: `R = (R₁ · R₂) / (R₁ + R₂) = (${R1} · ${R2}) / (${R1} + ${R2}) = ${fmt(R)} Ω`,
      }
    },
  },
  {
    id: 'serie',
    navn: 'Seriekobling – strøm',
    lag: () => {
      const U = pick([12, 24, 230])
      const R1 = pick([2, 4, 6, 10, 20])
      const R2 = pick([3, 5, 8, 12, 26])
      const R3 = pick([1, 5, 10, 14])
      const R = R1 + R2 + R3
      const I = U / R
      return {
        tittel: 'Seriekobling',
        tekst: `Tre motstander på ${R1} Ω, ${R2} Ω og ${R3} Ω står i serie over ${U} V. Hvor stor er strømmen?`,
        svar: I,
        enhet: 'A',
        losning: `R_tot = ${R1} + ${R2} + ${R3} = ${R} Ω\nI = U / R_tot = ${U} / ${R} = ${fmt(I)} A`,
      }
    },
  },
  {
    id: 'ledermotstand',
    navn: 'Lederresistans',
    lag: () => {
      const l = pick([10, 15, 20, 25, 30, 40, 50])
      const A = pick([1.5, 2.5, 4, 6])
      const R = (RHO * l) / A
      return {
        tittel: 'Lederresistans',
        tekst: `Hva er resistansen i én kobberleder som er ${l} m lang og har tverrsnitt ${fmt(A)} mm²? (ρ = 0,0175 Ω·mm²/m)`,
        svar: R,
        enhet: 'Ω',
        losning: `R = ρ · l / A = 0,0175 · ${l} / ${fmt(A)} = ${fmt(R, 3)} Ω`,
      }
    },
  },
  {
    id: 'spfall-1f',
    navn: 'Spenningsfall enfase',
    lag: () => {
      const l = pick([15, 20, 25, 30, 35, 40])
      const I = pick([10, 13, 16])
      const A = pick([1.5, 2.5, 4])
      const dU = (2 * l * I * RHO) / A
      const pst = (dU / 230) * 100
      return {
        tittel: 'Spenningsfall (enfase, 230 V)',
        tekst: `En kurs på ${l} m med ${fmt(A)} mm² kobber belastes med ${I} A (resistiv last). Hvor mange prosent er spenningsfallet? (ρ = 0,0175, U = 230 V)`,
        svar: pst,
        enhet: '%',
        losning: `ΔU = 2 · l · I · ρ / A = 2 · ${l} · ${I} · 0,0175 / ${fmt(A)} = ${fmt(dU)} V\nΔU % = ${fmt(dU)} / 230 · 100 = ${fmt(pst)} %`,
      }
    },
  },
  {
    id: 'energi',
    navn: 'Energi og kostnad',
    lag: () => {
      const P = pick([800, 1000, 1500, 2000, 2500])
      const t = pick([2, 3, 4, 5, 8])
      const pris = pick([1, 1.25, 1.5, 2])
      const kost = (P / 1000) * t * pris
      return {
        tittel: 'Energi og kostnad',
        tekst: `En ovn på ${P} W står på i ${t} timer. Strømprisen er ${fmt(pris)} kr/kWh. Hva koster det?`,
        svar: kost,
        enhet: 'kr',
        losning: `W = ${fmt(P / 1000)} kW · ${t} h = ${fmt((P / 1000) * t)} kWh\nKostnad = ${fmt((P / 1000) * t)} · ${fmt(pris)} = ${fmt(kost)} kr`,
      }
    },
  },
]

/** Godtar svar innenfor ±2 % (eller ±0,01 for små tall). */
export function erRiktig(gitt: number, fasit: number): boolean {
  const tol = Math.max(Math.abs(fasit) * 0.02, 0.01)
  return Math.abs(gitt - fasit) <= tol
}
