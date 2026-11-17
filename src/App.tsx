import { useState } from 'react'
import { Flashcards } from './components/Flashcards'
import { Fremgang } from './components/Fremgang'
import { Hjem } from './components/Hjem'
import { Quiz } from './components/Quiz'
import { Regning } from './components/Regning'

export type Fane = 'hjem' | 'kort' | 'quiz' | 'regning' | 'fremgang'

const FANER: { id: Fane; ikon: string; navn: string }[] = [
  { id: 'hjem', ikon: '🏠', navn: 'Hjem' },
  { id: 'kort', ikon: '🃏', navn: 'Kort' },
  { id: 'quiz', ikon: '❓', navn: 'Quiz' },
  { id: 'regning', ikon: '🧮', navn: 'Regning' },
  { id: 'fremgang', ikon: '📊', navn: 'Fremgang' },
]

export default function App() {
  const [fane, setFane] = useState<Fane>('hjem')

  return (
    <div className="app">
      <main>
        {fane === 'hjem' && <Hjem gaTil={setFane} />}
        {fane === 'kort' && <Flashcards />}
        {fane === 'quiz' && <Quiz />}
        {fane === 'regning' && <Regning />}
        {fane === 'fremgang' && <Fremgang />}
      </main>
      <nav className="tabbar">
        {FANER.map((f) => (
          <button
            key={f.id}
            className={fane === f.id ? 'aktiv' : ''}
            onClick={() => setFane(f.id)}
            aria-current={fane === f.id ? 'page' : undefined}
          >
            <span className="tab-ikon">{f.ikon}</span>
            <span>{f.navn}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
