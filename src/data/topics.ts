import type { Topic } from './types'

export const TOPICS: Topic[] = [
  { id: 'teori', navn: 'Elektroteknikk og formler', ikon: '⚡' },
  { id: 'vern', navn: 'Vern og jording', ikon: '🛡️' },
  { id: 'nek400', navn: 'NEK 400', ikon: '📘' },
  { id: 'forskrifter', navn: 'Forskrifter (FEL, FEK)', ikon: '⚖️' },
  { id: 'sikkerhet', navn: 'Sikkerhet (FSE)', ikon: '🦺' },
  { id: 'maling', navn: 'Måling og kontroll', ikon: '📏' },
  { id: 'materiell', navn: 'Kabler og materiell', ikon: '🔌' },
]

export const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t])) as Record<
  Topic['id'],
  Topic
>
