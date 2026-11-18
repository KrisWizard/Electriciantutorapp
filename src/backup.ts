import type { AppState } from './store'

/**
 * Sikkerhetskopi av fremgangen.
 *
 * Filen er en konvolutt. Den lagres ikke i localStorage. Nøkkelen
 * `elektrikerstudie.v1` er uendret og inneholder bare AppState.
 *
 * format 1:
 * {
 *   app: "elektrikerstudie",
 *   format: 1,
 *   eksportert: ISO-8601 (UTC, avsluttet med Z),
 *   data: AppState
 * }
 *
 * En ny versjon som endrer AppState skal øke `format` og migrere eldre kopier
 * her, slik at filer folk allerede har tatt vare på fortsatt kan leses.
 */

export const APP_ID = 'elektrikerstudie'
export const FORMAT = 1
export const DEL_TITTEL = 'Elektrikerstudie – sikkerhetskopi'
export const MAKS_TEKST = 750_000

const DATA_NOKLER = ['cards', 'feil', 'quizStats', 'dager', 'nyeIdag'] as const
const KORT_NOKLER = ['ease', 'interval', 'due', 'reps', 'lapses'] as const
const QUIZ_NOKLER = ['riktig', 'totalt'] as const
const NYE_NOKLER = ['dato', 'antall'] as const
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/

const MAKS_KORT = 5000
const MAKS_FEIL = 5000
const MAKS_QUIZ = 100
const MAKS_DAGER = 20_000

export const MILEPELER = [7, 14, 30, 60, 100] as const
const PAMINNELSE_NOKKEL = 'elektrikerstudie.kopi-paminnelse'

export interface Sikkerhetskopi {
  app: typeof APP_ID
  format: typeof FORMAT
  eksportert: string
  data: AppState
}

export interface Oppsummering {
  kortSett: number
  kortSomSitter: number
  dagerPaRad: number
  dagerOvd: number
  quizSvar: number
  feilListe: number
}

export type ValideringsKode = 'json' | 'stor' | 'app' | 'format' | 'format-ny' | 'innhold'

export type Validering =
  | { ok: true; kopi: Sikkerhetskopi; oppsummering: Oppsummering }
  | { ok: false; kode: ValideringsKode; feil: string }

export type EksportPrimar = 'del' | 'nedlasting' | 'kopi'

export interface EksportValg {
  visDel: boolean
  visNedlasting: boolean
  primar: EksportPrimar
  hint: string
}

function avvis(kode: ValideringsKode, grunn: string): Validering {
  return { ok: false, kode, feil: `${grunn} Ingenting er endret.` }
}

function erRentObjekt(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  const proto = Object.getPrototypeOf(v)
  return proto === Object.prototype || proto === null
}

function sammeNokler(o: object, nokler: readonly string[]): boolean {
  const har = Object.keys(o)
  return har.length === nokler.length && nokler.every((k) => har.includes(k))
}

function tryggNokkel(k: string): boolean {
  return (
    k.length >= 1 &&
    k.length <= 100 &&
    k !== '__proto__' &&
    k !== 'constructor' &&
    k !== 'prototype' &&
    !harStyretegn(k)
  )
}

function harStyretegn(k: string): boolean {
  for (let i = 0; i < k.length; i++) {
    const c = k.charCodeAt(i)
    if (c <= 0x1f || c === 0x7f) return true
  }
  return false
}

function erTall(v: unknown, min: number, max: number): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
}

function erHeltall(v: unknown, min: number, max: number): v is number {
  return erTall(v, min, max) && Number.isInteger(v)
}

function erKalenderdato(v: unknown): v is string {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false
  const [ys, ms, ds] = v.split('-')
  const y = Number(ys)
  const m = Number(ms)
  const d = Number(ds)
  if (y < 1970 || y > 2200) return false
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

function erIso(v: unknown): v is string {
  if (typeof v !== 'string' || !ISO.test(v)) return false
  return Number.isFinite(Date.parse(v))
}

/** Samme regelen som strekket i appen: i dag, ellers i går, og så bakover uten hull. */
export function dagerPaRad(dager: string[], now = new Date()): number {
  const set = new Set(dager)
  const d = new Date(now.getTime())
  const key = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
  if (!set.has(key(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set.has(key(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function oppsummer(data: AppState, now = new Date()): Oppsummering {
  let kortSomSitter = 0
  for (const kort of Object.values(data.cards)) {
    if ((kort?.interval ?? 0) >= 7) kortSomSitter++
  }
  let quizSvar = 0
  for (const rad of Object.values(data.quizStats)) {
    if (rad && typeof rad.totalt === 'number') quizSvar += rad.totalt
  }
  return {
    kortSett: Object.keys(data.cards).length,
    kortSomSitter,
    dagerPaRad: dagerPaRad(data.dager, now),
    dagerOvd: data.dager.length,
    quizSvar,
    feilListe: Object.keys(data.feil).length,
  }
}

export function lagKopi(s: AppState, eksportert: string): Sikkerhetskopi {
  const cards: AppState['cards'] = {}
  for (const [id, kort] of Object.entries(s.cards)) {
    cards[id] = {
      ease: kort.ease,
      interval: kort.interval,
      due: kort.due,
      reps: kort.reps,
      lapses: kort.lapses,
    }
  }
  const feil: AppState['feil'] = {}
  for (const [id, verdi] of Object.entries(s.feil)) {
    if (verdi === true) feil[id] = true
  }
  const quizStats: AppState['quizStats'] = {}
  for (const [id, rad] of Object.entries(s.quizStats)) {
    if (!rad) continue
    quizStats[id as keyof AppState['quizStats']] = { riktig: rad.riktig, totalt: rad.totalt }
  }
  const data: AppState = {
    cards,
    feil,
    quizStats,
    dager: [...s.dager],
    nyeIdag: { dato: s.nyeIdag.dato, antall: s.nyeIdag.antall },
  }
  return { app: APP_ID, format: FORMAT, eksportert, data }
}

export function tilTekst(kopi: Sikkerhetskopi): string {
  return `${JSON.stringify(kopi, null, 2)}\n`
}

export function filnavnForDato(dato: string): string {
  return `elektrikerstudie-sikkerhetskopi-${dato}.json`
}

function lesKort(v: unknown): AppState['cards'] | null {
  if (!erRentObjekt(v)) return null
  const nokler = Object.keys(v)
  if (nokler.length > MAKS_KORT) return null
  const ut: AppState['cards'] = {}
  for (const id of nokler) {
    if (!tryggNokkel(id)) return null
    const kort = v[id]
    if (!erRentObjekt(kort) || !sammeNokler(kort, KORT_NOKLER)) return null
    if (!erTall(kort.ease, 0.1, 1000)) return null
    if (!erTall(kort.interval, 0, 10_000_000)) return null
    if (!erTall(kort.due, -1e15, 1e16)) return null
    if (!erHeltall(kort.reps, 0, 1_000_000) || !erHeltall(kort.lapses, 0, 1_000_000)) return null
    ut[id] = {
      ease: kort.ease,
      interval: kort.interval,
      due: kort.due,
      reps: kort.reps,
      lapses: kort.lapses,
    }
  }
  return ut
}

function lesFeil(v: unknown): AppState['feil'] | null {
  if (!erRentObjekt(v)) return null
  const nokler = Object.keys(v)
  if (nokler.length > MAKS_FEIL) return null
  const ut: AppState['feil'] = {}
  for (const id of nokler) {
    if (!tryggNokkel(id) || v[id] !== true) return null
    ut[id] = true
  }
  return ut
}

function lesQuiz(v: unknown): AppState['quizStats'] | null {
  if (!erRentObjekt(v)) return null
  const nokler = Object.keys(v)
  if (nokler.length > MAKS_QUIZ) return null
  const ut: AppState['quizStats'] = {}
  for (const id of nokler) {
    if (!tryggNokkel(id)) return null
    const rad = v[id]
    if (!erRentObjekt(rad) || !sammeNokler(rad, QUIZ_NOKLER)) return null
    if (!erHeltall(rad.riktig, 0, 10_000_000) || !erHeltall(rad.totalt, 0, 10_000_000)) return null
    if (rad.riktig > rad.totalt) return null
    ut[id as keyof AppState['quizStats']] = { riktig: rad.riktig, totalt: rad.totalt }
  }
  return ut
}

function lesDager(v: unknown): string[] | null {
  if (!Array.isArray(v) || v.length > MAKS_DAGER) return null
  const ut: string[] = []
  for (const dag of v) {
    if (!erKalenderdato(dag)) return null
    ut.push(dag)
  }
  return ut
}

function lesNye(v: unknown): AppState['nyeIdag'] | null {
  if (!erRentObjekt(v) || !sammeNokler(v, NYE_NOKLER)) return null
  if (v.dato !== '' && !erKalenderdato(v.dato)) return null
  if (!erHeltall(v.antall, 0, 100_000)) return null
  return { dato: v.dato, antall: v.antall }
}

function lesData(v: unknown): AppState | null {
  if (!erRentObjekt(v) || !sammeNokler(v, DATA_NOKLER)) return null
  const cards = lesKort(v.cards)
  const feil = lesFeil(v.feil)
  const quizStats = lesQuiz(v.quizStats)
  const dager = lesDager(v.dager)
  const nyeIdag = lesNye(v.nyeIdag)
  if (!cards || !feil || !quizStats || !dager || !nyeIdag) return null
  return { cards, feil, quizStats, dager, nyeIdag }
}

export function lesSikkerhetskopi(tekst: string, now = new Date()): Validering {
  const rensket = tekst.replace(/^\uFEFF/, '').trim()
  if (!rensket) return avvis('json', 'Lim inn eller velg en sikkerhetskopi først.')
  if (rensket.length > MAKS_TEKST) return avvis('stor', 'Kopien er for stor.')
  let raw: unknown
  try {
    raw = JSON.parse(rensket)
  } catch {
    return avvis('json', 'Dette er ikke gyldig JSON.')
  }
  if (!erRentObjekt(raw)) return avvis('app', 'Dette er ikke en sikkerhetskopi fra Elektrikerstudie.')
  if (raw.app !== APP_ID) return avvis('app', 'Dette er ikke en sikkerhetskopi fra Elektrikerstudie.')
  if (typeof raw.format !== 'number' || !Number.isInteger(raw.format)) {
    return avvis('format', 'Kopien har et ukjent format.')
  }
  if (raw.format > FORMAT) {
    return avvis(
      'format-ny',
      'Kopien er laget med en nyere versjon av appen. Oppdater Elektrikerstudie før du henter den inn.',
    )
  }
  if (raw.format !== FORMAT) return avvis('format', 'Kopien har et ukjent format.')
  if (!erIso(raw.eksportert)) return avvis('innhold', 'Kopien er ufullstendig eller ødelagt.')
  const data = lesData(raw.data)
  if (!data) return avvis('innhold', 'Kopien er ufullstendig eller ødelagt.')
  const kopi: Sikkerhetskopi = { app: APP_ID, format: FORMAT, eksportert: raw.eksportert, data }
  return { ok: true, kopi, oppsummering: oppsummer(data, now) }
}

/** Skriver bare når kopien er gyldig. Ugyldig tekst rører ikke lagret fremgang. */
export function importerHvisGyldig(tekst: string, skriv: (data: AppState) => void, now = new Date()): Validering {
  const resultat = lesSikkerhetskopi(tekst, now)
  if (!resultat.ok) return resultat
  skriv(resultat.kopi.data)
  return resultat
}

/**
 * Velger en filtype delingsarket faktisk godtar.
 * iOS Safari deler ofte ikke `application/json`, men godtar `text/plain`
 * med samme .json-filnavn. Android Chrome godtar begge.
 */
export function velgDelbarFil(tekst: string, navn: string, canShare: (files: File[]) => boolean): File | null {
  for (const type of ['application/json', 'text/plain'] as const) {
    const fil = new File([tekst], navn, { type })
    try {
      if (canShare([fil])) return fil
    } catch {
      /* prøv neste type */
    }
  }
  return null
}

/**
 * Hva slags eksport som er trygg på denne enheten.
 *
 * iOS (Safari og Hjem-skjerm) får ikke en vanlig nedlasting: blob-lenker blir
 * ofte ignorert, og i en installert app kan fila åpnes i Quick Look uten vei
 * tilbake til appen. Delingsarket (Lagre i Filer) og kopiert tekst virker.
 * Android Chrome og vanlige nettlesere har en skikkelig nedlasting.
 */
export function eksportvalg(p: { ios: boolean; frittstaende: boolean; kanDeleFil: boolean }): EksportValg {
  const visDel = p.kanDeleFil
  const visNedlasting = !p.ios
  let primar: EksportPrimar = 'kopi'
  if (p.ios && visDel) primar = 'del'
  else if (visNedlasting) primar = 'nedlasting'
  else if (visDel) primar = 'del'

  let hint: string
  if (p.ios) {
    const hjem = p.frittstaende ? ' Vanlig nedlasting virker dårlig fra Hjem-skjermen.' : ''
    hint = visDel
      ? `Trykk Del fil og velg Lagre i Filer. Du kan også kopiere teksten til Notater.${hjem}`
      : `Kopier teksten og lim den inn i Notater.${hjem}`
  } else if (visDel) {
    hint = 'Last ned filen, del den, eller kopier teksten. Legg kopien et sted utenfor appen.'
  } else {
    hint = 'Last ned filen eller kopier teksten, og legg den et sted utenfor appen.'
  }
  return { visDel, visNedlasting, primar, hint }
}

export function hoyesteMilepel(dager: number): number {
  let hoyest = 0
  for (const m of MILEPELER) if (dager >= m) hoyest = m
  return hoyest
}

/** Neste strekke-milepæl det er verdt å minne om, eller null om vi allerede har gjort det. */
export function nesteMilepel(dager: number, sistKvittert: number): number | null {
  const hoyest = hoyesteMilepel(dager)
  if (hoyest === 0 || hoyest <= sistKvittert) return null
  return hoyest
}

export function lesKvittertMilepel(): number {
  try {
    const raw = localStorage.getItem(PAMINNELSE_NOKKEL)
    if (!raw) return 0
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function settKvittertMilepel(milepel: number) {
  const verdi = Number.isInteger(milepel) && milepel > 0 ? milepel : 0
  try {
    if (verdi === 0) localStorage.removeItem(PAMINNELSE_NOKKEL)
    else localStorage.setItem(PAMINNELSE_NOKKEL, String(verdi))
  } catch {
    /* privat modus */
  }
}
