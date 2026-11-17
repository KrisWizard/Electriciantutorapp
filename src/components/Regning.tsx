import { useState } from 'react'
import { MeldFeil } from './MeldFeil'
import { GENERATORS, erRiktig, fmt, type Generator } from '../data/generators'
import type { CalcProblem } from '../data/types'
import { registrerSvar, update } from '../store'

export function Regning() {
  const [gen, setGen] = useState<Generator | 'blandet' | null>(null)
  const [oppgave, setOppgave] = useState<CalcProblem | null>(null)
  const [input, setInput] = useState('')
  const [resultat, setResultat] = useState<boolean | null>(null)
  const [score, setScore] = useState({ riktig: 0, totalt: 0 })

  function ny(g: Generator | 'blandet') {
    const valgt = g === 'blandet' ? GENERATORS[Math.floor(Math.random() * GENERATORS.length)] : g
    setOppgave(valgt.lag())
    setInput('')
    setResultat(null)
  }

  function start(g: Generator | 'blandet') {
    setGen(g)
    setScore({ riktig: 0, totalt: 0 })
    ny(g)
  }

  function sjekk(e: React.FormEvent) {
    e.preventDefault()
    if (!oppgave || resultat !== null) return
    const tall = parseFloat(input.replace(',', '.').replace(/\s/g, ''))
    if (Number.isNaN(tall)) return
    const ok = erRiktig(tall, oppgave.svar, oppgave.eksakt)
    setResultat(ok)
    setScore((s) => ({ riktig: s.riktig + (ok ? 1 : 0), totalt: s.totalt + 1 }))
    update((st) => registrerSvar(st, 'regning', ok))
  }

  if (!gen || !oppgave) {
    return (
      <section>
        <h1>Regneøving</h1>
        <p className="muted">Nye tall hver gang, så du må faktisk regne. Svar innenfor ±2 % godtas (subnett må være eksakt).</p>
        <button className="btn btn-primary full" onClick={() => start('blandet')}>
          Blandede oppgaver
        </button>
        <h2>Velg oppgavetype</h2>
        <div className="liste">
          {GENERATORS.map((g) => (
            <button key={g.id} className="rad" onClick={() => start(g)}>
              {g.navn} <span>›</span>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="quiz-top">
        <button className="lenke" onClick={() => setGen(null)}>
          ← Tilbake
        </button>
        <span className="muted">
          {score.riktig} / {score.totalt} riktige
        </span>
      </div>
      <p className="muted">🧮 {oppgave.tittel}</p>
      <h2 className="sporsmal">{oppgave.tekst}</h2>
      <form onSubmit={sjekk} className="svar-form">
        <input
          inputMode="decimal"
          autoComplete="off"
          placeholder="Ditt svar"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={resultat !== null}
          aria-label="Ditt svar"
        />
        <span className="enhet">{oppgave.enhet}</span>
        {resultat === null && (
          <button className="btn btn-primary" type="submit" disabled={!input.trim()}>
            Sjekk
          </button>
        )}
      </form>
      {resultat !== null && (
        <div className={`forklaring ${resultat ? "ok" : "nei"}`} ref={(el) => el?.scrollIntoView({ behavior: "smooth", block: "nearest" })}>
          <strong>
            {resultat ? '✅ Riktig!' : `❌ Fasit: ${fmt(oppgave.svar)} ${oppgave.enhet}`}
          </strong>
          <pre className="losning">{oppgave.losning}</pre>
          <MeldFeil
            id={`regning: ${oppgave.tittel}`}
            innhold={`Oppgave: ${oppgave.tekst}\nAppens fasit: ${fmt(oppgave.svar)} ${oppgave.enhet}\nUtregning:\n${oppgave.losning}`}
          />
          <button className="btn btn-primary full" onClick={() => ny(gen)}>
            Neste oppgave
          </button>
        </div>
      )}
    </section>
  )
}
