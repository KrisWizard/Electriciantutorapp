export type TopicId =
  | 'teori'
  | 'vern'
  | 'nek400'
  | 'forskrifter'
  | 'sikkerhet'
  | 'maling'
  | 'materiell'
  | 'ekom'

export interface Topic {
  id: TopicId
  navn: string
  ikon: string
}

/** Et flashcard. `kilde` er hvor man kan sjekke svaret (f.eks. "NEK 400-7-701"). */
export interface Card {
  id: string
  topic: TopicId
  front: string
  back: string
  kilde?: string
  /** true = kan variere med utgave av NEK 400/forskrift – vis «sjekk mot boka». */
  usikker?: boolean
}

/** Et flervalgsspørsmål. `riktig` er indeksen til riktig alternativ. */
export interface QuizQuestion {
  id: string
  topic: TopicId
  sporsmal: string
  alternativer: string[]
  riktig: number
  forklaring: string
  kilde?: string
  /** true = kan variere med utgave av NEK 400/forskrift – vis «sjekk mot boka». */
  usikker?: boolean
}

/** Et generert regnestykke med tallsvar. */
export interface CalcProblem {
  tittel: string
  tekst: string
  svar: number
  enhet: string
  /** Utregning som vises etter svar. */
  losning: string
  /** Krever eksakt svar (heltall) i stedet for ±2 %. */
  eksakt?: boolean
}
