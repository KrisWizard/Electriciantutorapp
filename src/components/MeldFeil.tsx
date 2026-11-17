import { useState } from 'react'

interface Props {
  /** Stabil id (kort-id, spørsmåls-id eller oppgavetype). */
  id: string
  /** Teksten det gjelder, slik at mottakeren ser hva som ble vist. */
  innhold: string
}

/**
 * «Meld feil»: åpner delingsmenyen på telefonen med en ferdig utfylt melding,
 * slik at den kan sendes på SMS, Messenger e.l. Faller tilbake til å kopiere
 * teksten hvis deling ikke støttes.
 */
export function MeldFeil({ id, innhold }: Props) {
  const [status, setStatus] = useState<'' | 'kopiert' | 'feilet'>('')

  async function meld() {
    const tekst = `Feil i Elektrikerstudie\nID: ${id}\n\n${innhold}\n\nHva er feil:\n`
    try {
      if (navigator.share) {
        await navigator.share({ text: tekst })
        return
      }
    } catch (e) {
      // Brukeren avbrøt delingen – ikke gjør noe.
      if (e instanceof DOMException && e.name === 'AbortError') return
    }
    try {
      await navigator.clipboard.writeText(tekst)
      setStatus('kopiert')
    } catch {
      setStatus('feilet')
    }
  }

  return (
    <div className="meld-feil">
      <button type="button" className="lenke" onClick={meld}>
        🚩 Meld feil
      </button>
      {status === 'kopiert' && <span className="muted"> Kopiert! Lim inn i en melding.</span>}
      {status === 'feilet' && <span className="muted"> Klarte ikke å dele. Ta et skjermbilde i stedet.</span>}
    </div>
  )
}

/** Varsel for innhold som bør sjekkes mot boka. */
export function SjekkMotBoka() {
  return (
    <div className="sjekk-boka">
      ⚠️ Sjekk mot boka: dette kan variere med utgaven av NEK 400 eller forskriften.
    </div>
  )
}
