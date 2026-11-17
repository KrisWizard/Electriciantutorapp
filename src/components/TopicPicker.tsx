import { TOPICS } from '../data/topics'
import type { TopicId } from '../data/types'

interface Props {
  valgt: TopicId | 'alle'
  onVelg: (t: TopicId | 'alle') => void
  antall?: (t: TopicId | 'alle') => number
}

export function TopicPicker({ valgt, onVelg, antall }: Props) {
  const valg: (TopicId | 'alle')[] = ['alle', ...TOPICS.map((t) => t.id)]
  return (
    <div className="chips" role="tablist" aria-label="Velg tema">
      {valg.map((id) => {
        const t = TOPICS.find((x) => x.id === id)
        const n = antall?.(id)
        return (
          <button
            key={id}
            role="tab"
            aria-selected={valgt === id}
            className={`chip ${valgt === id ? 'chip-on' : ''}`}
            onClick={() => onVelg(id)}
          >
            {t ? `${t.ikon} ${t.navn}` : 'Alle tema'}
            {n !== undefined && <span className="chip-n">{n}</span>}
          </button>
        )
      })}
    </div>
  )
}
