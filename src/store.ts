import { useCallback, useEffect, useState } from 'react'
import { dagerPaRad, settKvittertMilepel } from './backup'
import type { TopicId } from './data/types'

/** Tilstand for ett kort i spaced repetition (forenklet SM-2). */
export interface CardState {
  ease: number // vanskelighetsfaktor, starter på 2,5
  interval: number // dager til neste repetisjon
  due: number // tidspunkt (ms) kortet skal vises igjen
  reps: number // antall riktige på rad
  lapses: number // antall ganger glemt
}

export type Rating = 'igjen' | 'vanskelig' | 'bra' | 'lett'

export interface TopicStat {
  riktig: number
  totalt: number
}

export interface AppState {
  cards: Record<string, CardState>
  /** Quiz-spørsmål som sist ble besvart feil (feillisten). */
  feil: Record<string, true>
  quizStats: Partial<Record<TopicId | 'regning', TopicStat>>
  /** Datoer (YYYY-MM-DD) det er øvd. */
  dager: string[]
  /** Nye kort introdusert per dato. */
  nyeIdag: { dato: string; antall: number }
}

/** Ikke bytt nøkkel – eksisterende brukere har fremgangen sin her. Sikkerhetskopi bruker en egen fil, ikke denne nøkkelen. */
const KEY = 'elektrikerstudie.v1'
export const NYE_PER_DAG = 15
const DAG = 24 * 60 * 60 * 1000

const tom = (): AppState => ({
  cards: {},
  feil: {},
  quizStats: {},
  dager: [],
  nyeIdag: { dato: '', antall: 0 },
})

export function idag(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...tom(), ...JSON.parse(raw) }
  } catch {
    /* privat modus eller ødelagt data – start på nytt */
  }
  return tom()
}

function save(s: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignorer */
  }
}

/** Neste tilstand for et kort gitt vurderingen. */
export function schedule(prev: CardState | undefined, rating: Rating, now = Date.now()): CardState {
  const s: CardState = prev
    ? { ...prev }
    : { ease: 2.5, interval: 0, due: now, reps: 0, lapses: 0 }

  if (rating === 'igjen') {
    s.reps = 0
    s.lapses += 1
    s.ease = Math.max(1.3, s.ease - 0.2)
    s.interval = 0
    s.due = now + 60 * 1000 // vises igjen i samme økt
    return s
  }

  s.reps += 1
  if (rating === 'vanskelig') s.ease = Math.max(1.3, s.ease - 0.15)
  if (rating === 'lett') s.ease += 0.15

  if (s.reps === 1) s.interval = rating === 'lett' ? 4 : 1
  else if (s.reps === 2) s.interval = rating === 'lett' ? 7 : rating === 'vanskelig' ? 2 : 3
  else {
    const faktor = rating === 'vanskelig' ? 1.2 : rating === 'lett' ? s.ease * 1.3 : s.ease
    s.interval = Math.max(s.interval + 1, Math.round(s.interval * faktor))
  }
  s.due = now + s.interval * DAG
  return s
}

/** Liten global store med localStorage. */
let state = load()
const lyttere = new Set<() => void>()

export function getState() {
  return state
}

export function update(fn: (s: AppState) => AppState) {
  state = fn(state)
  save(state)
  lyttere.forEach((l) => l())
}

export function markerOvd(s: AppState): AppState {
  const d = idag()
  return s.dager.includes(d) ? s : { ...s, dager: [...s.dager, d] }
}

export function useAppState(): AppState {
  const [, setTick] = useState(0)
  const rerender = useCallback(() => setTick((t) => t + 1), [])
  useEffect(() => {
    lyttere.add(rerender)
    return () => {
      lyttere.delete(rerender)
    }
  }, [rerender])
  return state
}

/** Antall dager på rad det er øvd (i dag eller i går teller som aktiv). */
export function streak(dager: string[], now = new Date()): number {
  return dagerPaRad(dager, now)
}

/** Erstatter hele fremgangen etter at en sikkerhetskopi er validert. */
export function erstattFremgang(neste: AppState) {
  const kopi = JSON.parse(JSON.stringify(neste)) as AppState
  update(() => kopi)
}

export function nullstill() {
  settKvittertMilepel(0)
  update(() => tom())
}

export function registrerSvar(s: AppState, topic: TopicId | 'regning', riktig: boolean): AppState {
  const prev = s.quizStats[topic] ?? { riktig: 0, totalt: 0 }
  return {
    ...markerOvd(s),
    quizStats: {
      ...s.quizStats,
      [topic]: { riktig: prev.riktig + (riktig ? 1 : 0), totalt: prev.totalt + 1 },
    },
  }
}
