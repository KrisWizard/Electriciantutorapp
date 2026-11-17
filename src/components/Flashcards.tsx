import { useMemo, useState } from 'react'
import { CARDS } from '../data/cards'
import { topicById } from '../data/topics'
import type { Card, TopicId } from '../data/types'
import { NYE_PER_DAG, getState, idag, markerOvd, schedule, update, useAppState, type AppState, type Rating } from '../store'
import { TopicPicker } from './TopicPicker'

/** Kort som skal repeteres nå + nye kort (innenfor dagens grense). */
export function koKort(s: AppState, topic: TopicId | 'alle', now = Date.now()): Card[] {
  const iTema = CARDS.filter((c) => topic === 'alle' || c.topic === topic)
  const etterDue = (a: Card, b: Card) => s.cards[a.id].due - s.cards[b.id].due
  const forfalt = iTema.filter((c) => s.cards[c.id] && s.cards[c.id].due <= now).sort(etterDue)
  // Kort trykket «Igjen» på kommer tilbake på slutten av økta.
  const laering = iTema
    .filter((c) => s.cards[c.id] && s.cards[c.id].due > now && s.cards[c.id].due <= now + 10 * 60 * 1000)
    .sort(etterDue)
  const brukt = s.nyeIdag.dato === idag() ? s.nyeIdag.antall : 0
  const nye = iTema.filter((c) => !s.cards[c.id]).slice(0, Math.max(0, NYE_PER_DAG - brukt))
  return [...forfalt, ...nye, ...laering]
}

const KNAPPER: { rating: Rating; tekst: string; cls: string }[] = [
  { rating: 'igjen', tekst: 'Igjen', cls: 'r-igjen' },
  { rating: 'vanskelig', tekst: 'Vanskelig', cls: 'r-vansk' },
  { rating: 'bra', tekst: 'Bra', cls: 'r-bra' },
  { rating: 'lett', tekst: 'Lett', cls: 'r-lett' },
]

export function Flashcards() {
  const s = useAppState()
  const [topic, setTopic] = useState<TopicId | 'alle'>('alle')
  const [snudd, setSnudd] = useState(false)
  const [okt, setOkt] = useState(0)

  // Køen beregnes på nytt etter hver vurdering (okt endres).
  const ko = useMemo(() => koKort(getState(), topic), [topic, okt])
  const kort = ko[0]

  function vurder(r: Rating) {
    if (!kort) return
    const erNy = !getState().cards[kort.id]
    update((st) => {
      const neste: AppState = {
        ...markerOvd(st),
        cards: { ...st.cards, [kort.id]: schedule(st.cards[kort.id], r) },
      }
      if (erNy) {
        const d = idag()
        neste.nyeIdag = { dato: d, antall: (st.nyeIdag.dato === d ? st.nyeIdag.antall : 0) + 1 }
      }
      return neste
    })
    setSnudd(false)
    setOkt((o) => o + 1)
  }

  return (
    <section>
      <h1>Flashcards</h1>
      <TopicPicker
        valgt={topic}
        onVelg={(t) => {
          setTopic(t)
          setSnudd(false)
        }}
        antall={(t) => koKort(s, t).length}
      />

      {!kort ? (
        <div className="tom">
          <p className="stor">🎉 Ferdig for nå!</p>
          <p>Det er ingen kort igjen i dette temaet i dag. Kom tilbake i morgen, eller ta en quiz.</p>
        </div>
      ) : (
        <>
          <p className="muted">
            {ko.length} kort igjen · {topicById[kort.topic].ikon} {topicById[kort.topic].navn}
            {!s.cards[kort.id] && <span className="badge">Nytt</span>}
          </p>
          <button
            className={`flashcard ${snudd ? 'snudd' : ''}`}
            onClick={() => setSnudd(true)}
            aria-label={snudd ? 'Svar vist' : 'Trykk for å vise svaret'}
          >
            <div className="fc-front">{kort.front}</div>
            {snudd ? (
              <>
                <hr />
                <div className="fc-back">{kort.back}</div>
                {kort.kilde && <div className="kilde">Kilde: {kort.kilde}</div>}
              </>
            ) : (
              <div className="hint">Trykk for å vise svaret</div>
            )}
          </button>

          {snudd && (
            <div className="rating">
              {KNAPPER.map((k) => (
                <button key={k.rating} className={`btn ${k.cls}`} onClick={() => vurder(k.rating)}>
                  {k.tekst}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
