import { useState } from 'react'
import { CARDS } from '../data/cards'
import { lesKvittertMilepel, nesteMilepel, settKvittertMilepel } from '../backup'
import { streak, useAppState } from '../store'
import { koKort } from './Flashcards'
import type { Fane } from '../App'

export function Hjem({ gaTil }: { gaTil: (f: Fane) => void }) {
  const s = useAppState()
  const igjen = koKort(s, 'alle').length
  const dager = streak(s.dager)
  const feil = Object.keys(s.feil).length
  const [kvittert, setKvittert] = useState(lesKvittertMilepel)
  const milepel = nesteMilepel(dager, kvittert)

  function ikkeNa() {
    if (milepel == null) return
    settKvittertMilepel(milepel)
    setKvittert(lesKvittertMilepel())
  }

  return (
    <section>
      <h1>Hei! ⚡</h1>
      <p className="muted">Øv litt hver dag, så sitter det til fagprøven.</p>

      <div className="stats">
        <div className="stat">
          <b>{dager}</b>
          <span>{dager === 1 ? 'dag' : 'dager'} på rad 🔥</span>
        </div>
        <div className="stat">
          <b>{igjen}</b>
          <span>kort i dag</span>
        </div>
      </div>

      {milepel != null && (
        <div className="paminnelse">
          <p>
            <b>{milepel} dager på rad.</b> Ta en sikkerhetskopi, så har du fremgangen hvis du bytter telefon.
          </p>
          <div className="paminnelse-knapper">
            <button type="button" className="btn btn-primary" onClick={() => gaTil('fremgang')}>
              Ta sikkerhetskopi
            </button>
            <button type="button" className="lenke" onClick={ikkeNa}>
              Ikke nå
            </button>
          </div>
        </div>
      )}

      <button className="kort-knapp primar" onClick={() => gaTil('kort')}>
        <span className="ikon">🃏</span>
        <span>
          <b>Dagens flashcards</b>
          <small>{igjen > 0 ? `${igjen} kort venter` : 'Alt gjort for i dag!'}</small>
        </span>
      </button>
      <button className="kort-knapp" onClick={() => gaTil('quiz')}>
        <span className="ikon">❓</span>
        <span>
          <b>Quiz</b>
          <small>{feil > 0 ? `${feil} spørsmål på feillisten` : '10 spørsmål med forklaring'}</small>
        </span>
      </button>
      <button className="kort-knapp" onClick={() => gaTil('regning')}>
        <span className="ikon">🧮</span>
        <span>
          <b>Regneøving</b>
          <small>Ohms lov, effekt, spenningsfall …</small>
        </span>
      </button>

      <p className="disclaimer">
        Innholdet ({CARDS.length} kort) er et utkast. Ser du noe som ikke stemmer med boka? Trykk «🚩 Meld feil» på kortet eller spørsmålet.
      </p>
    </section>
  )
}
