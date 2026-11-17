import { useState } from 'react'
import { QUIZ } from '../data/quiz'
import { topicById } from '../data/topics'
import type { QuizQuestion, TopicId } from '../data/types'
import { getState, registrerSvar, update, useAppState } from '../store'
import { TopicPicker } from './TopicPicker'

const ANTALL = 10

function stokk<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Stokker også rekkefølgen på alternativene. */
function blandAlternativer(q: QuizQuestion): QuizQuestion {
  const idx = stokk(q.alternativer.map((_, i) => i))
  return { ...q, alternativer: idx.map((i) => q.alternativer[i]), riktig: idx.indexOf(q.riktig) }
}

type Modus = TopicId | 'alle' | 'feil'

function lagRunde(modus: Modus): QuizQuestion[] {
  const feil = getState().feil
  const utvalg =
    modus === 'feil'
      ? QUIZ.filter((q) => feil[q.id])
      : QUIZ.filter((q) => modus === 'alle' || q.topic === modus)
  return stokk(utvalg).slice(0, ANTALL).map(blandAlternativer)
}

export function Quiz() {
  const s = useAppState()
  const [modus, setModus] = useState<Modus | null>(null)
  const [runde, setRunde] = useState<QuizQuestion[]>([])
  const [i, setI] = useState(0)
  const [valgt, setValgt] = useState<number | null>(null)
  const [poeng, setPoeng] = useState(0)

  const antallFeil = Object.keys(s.feil).length

  function start(m: Modus) {
    setModus(m)
    setRunde(lagRunde(m))
    setI(0)
    setValgt(null)
    setPoeng(0)
  }

  function svar(idx: number) {
    if (valgt !== null) return
    const q = runde[i]
    const ok = idx === q.riktig
    setValgt(idx)
    if (ok) setPoeng((p) => p + 1)
    update((st) => {
      const feil = { ...st.feil }
      if (ok) delete feil[q.id]
      else feil[q.id] = true
      return { ...registrerSvar(st, q.topic, ok), feil }
    })
  }

  if (modus === null) {
    return (
      <section>
        <h1>Quiz</h1>
        <p className="muted">{ANTALL} tilfeldige spørsmål med forklaring etter hvert svar.</p>
        <button className="btn btn-primary full" onClick={() => start('alle')}>
          Start blandet quiz
        </button>
        <button className="btn full" disabled={antallFeil === 0} onClick={() => start('feil')}>
          Øv på feillisten ({antallFeil})
        </button>
        <h2>Eller velg tema</h2>
        <TopicPicker
          valgt="alle"
          onVelg={(t) => start(t)}
          antall={(t) => QUIZ.filter((q) => t === 'alle' || q.topic === t).length}
        />
      </section>
    )
  }

  if (runde.length === 0) {
    return (
      <section>
        <h1>Quiz</h1>
        <p>Ingen spørsmål her ennå.</p>
        <button className="btn full" onClick={() => setModus(null)}>
          Tilbake
        </button>
      </section>
    )
  }

  if (i >= runde.length) {
    const pst = Math.round((poeng / runde.length) * 100)
    return (
      <section>
        <h1>Resultat</h1>
        <div className="tom">
          <p className="stor">
            {poeng} / {runde.length}
          </p>
          <p>{pst >= 80 ? 'Sterkt! 💪' : pst >= 50 ? 'Godt på vei.' : 'Fortsett å øve – det sitter snart.'}</p>
        </div>
        <button className="btn btn-primary full" onClick={() => start(modus)}>
          Ny runde
        </button>
        <button className="btn full" onClick={() => setModus(null)}>
          Tilbake til quiz-menyen
        </button>
      </section>
    )
  }

  const q = runde[i]
  return (
    <section>
      <div className="quiz-top">
        <button className="lenke" onClick={() => setModus(null)}>
          ← Avslutt
        </button>
        <span className="muted">
          {i + 1} / {runde.length}
        </span>
      </div>
      <div className="progress">
        <div style={{ width: `${(i / runde.length) * 100}%` }} />
      </div>
      <p className="muted">
        {topicById[q.topic].ikon} {topicById[q.topic].navn}
      </p>
      <h2 className="sporsmal">{q.sporsmal}</h2>
      <div className="alternativer">
        {q.alternativer.map((a, idx) => {
          let cls = 'alt'
          if (valgt !== null) {
            if (idx === q.riktig) cls += ' alt-riktig'
            else if (idx === valgt) cls += ' alt-feil'
            else cls += ' alt-dim'
          }
          return (
            <button key={idx} className={cls} onClick={() => svar(idx)} disabled={valgt !== null}>
              {a}
            </button>
          )
        })}
      </div>
      {valgt !== null && (
        <div className={`forklaring ${valgt === q.riktig ? "ok" : "nei"}`} ref={(el) => el?.scrollIntoView({ behavior: "smooth", block: "nearest" })}>
          <strong>{valgt === q.riktig ? '✅ Riktig!' : '❌ Feil'}</strong>
          <p>{q.forklaring}</p>
          {q.kilde && <div className="kilde">Kilde: {q.kilde}</div>}
          <button
            className="btn btn-primary full"
            onClick={() => {
              setI(i + 1)
              setValgt(null)
            }}
          >
            {i + 1 < runde.length ? 'Neste' : 'Se resultat'}
          </button>
        </div>
      )}
    </section>
  )
}
