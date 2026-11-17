import { CARDS } from '../data/cards'
import { TOPICS } from '../data/topics'
import { nullstill, streak, useAppState } from '../store'

export function Fremgang() {
  const s = useAppState()
  const sett = CARDS.filter((c) => s.cards[c.id]).length
  const laert = CARDS.filter((c) => (s.cards[c.id]?.interval ?? 0) >= 7).length

  const rader = [
    ...TOPICS.map((t) => ({ id: t.id, navn: `${t.ikon} ${t.navn}` })),
    { id: 'regning' as const, navn: '🧮 Regneøving' },
  ]

  return (
    <section>
      <h1>Fremgang</h1>
      <div className="stats">
        <div className="stat">
          <b>{streak(s.dager)}</b>
          <span>dager på rad</span>
        </div>
        <div className="stat">
          <b>
            {sett}/{CARDS.length}
          </b>
          <span>kort sett</span>
        </div>
        <div className="stat">
          <b>{laert}</b>
          <span>kort som sitter</span>
        </div>
      </div>

      <h2>Treffsikkerhet per tema</h2>
      <p className="muted">Fra quiz og regneøving.</p>
      <div className="liste">
        {rader.map((r) => {
          const st = s.quizStats[r.id]
          const pst = st && st.totalt > 0 ? Math.round((st.riktig / st.totalt) * 100) : null
          return (
            <div key={r.id} className="tema-rad">
              <div className="tema-navn">
                <span>{r.navn}</span>
                <span className="muted">{pst === null ? '–' : `${pst} % (${st!.totalt})`}</span>
              </div>
              <div className="bar">
                <div
                  className={pst === null ? '' : pst >= 80 ? 'god' : pst >= 50 ? 'middels' : 'svak'}
                  style={{ width: `${pst ?? 0}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <button
        className="btn full fare"
        onClick={() => {
          if (confirm('Slette all fremgang? Dette kan ikke angres.')) nullstill()
        }}
      >
        Nullstill fremgang
      </button>
    </section>
  )
}
