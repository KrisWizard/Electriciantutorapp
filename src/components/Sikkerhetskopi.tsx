import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  DEL_TITTEL,
  MAKS_TEKST,
  dagerPaRad,
  eksportvalg,
  filnavnForDato,
  hoyesteMilepel,
  importerHvisGyldig,
  lagKopi,
  lesSikkerhetskopi,
  oppsummer,
  settKvittertMilepel,
  tilTekst,
  velgDelbarFil,
  type Oppsummering,
  type Sikkerhetskopi,
} from '../backup'
import { erstattFremgang, getState, idag, useAppState } from '../store'

const RADER: { nokkel: keyof Oppsummering; navn: string }[] = [
  { nokkel: 'kortSett', navn: 'Kort sett' },
  { nokkel: 'dagerPaRad', navn: 'Dager på rad' },
  { nokkel: 'kortSomSitter', navn: 'Kort som sitter' },
  { nokkel: 'dagerOvd', navn: 'Dager øvd' },
  { nokkel: 'quizSvar', navn: 'Svar i quiz og regning' },
  { nokkel: 'feilListe', navn: 'Feilliste' },
]

type Status = { type: 'ok' | 'feil'; tekst: string } | null

function lesPlattform(): { ios: boolean; frittstaende: boolean } {
  const ua = navigator.userAgent || ''
  const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  const nav = navigator as Navigator & { standalone?: boolean }
  const frittstaende =
    window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
  return { ios, frittstaende }
}

function kanDeleFil(): boolean {
  if (!navigator.share || !navigator.canShare) return false
  return (
    velgDelbarFil('{}', 'elektrikerstudie.json', (files) => {
      try {
        return navigator.canShare?.({ files }) ?? false
      } catch {
        return false
      }
    }) != null
  )
}

function knappKlasse(erPrimar: boolean): string {
  return erPrimar ? 'btn btn-primary full' : 'btn full'
}

function formatTid(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

async function kopierTilUtklipp(tekst: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(tekst)
      return true
    }
  } catch {
    /* prøv den eldre metoden */
  }
  try {
    const felt = document.createElement('textarea')
    felt.value = tekst
    felt.setAttribute('readonly', '')
    felt.style.position = 'fixed'
    felt.style.top = '0'
    felt.style.left = '0'
    felt.style.opacity = '0'
    document.body.appendChild(felt)
    felt.focus()
    felt.select()
    felt.setSelectionRange(0, felt.value.length)
    const ok = document.execCommand('copy')
    felt.remove()
    return ok
  } catch {
    return false
  }
}

export function Sikkerhetskopi() {
  const s = useAppState()
  const [plattform] = useState(lesPlattform)
  const [kanDele] = useState(kanDeleFil)
  const valg = eksportvalg({ ...plattform, kanDeleFil: kanDele })
  const [status, setStatus] = useState<Status>(null)
  const [manuell, setManuell] = useState<string | null>(null)
  const [limInn, setLimInn] = useState(false)
  const [tekst, setTekst] = useState('')
  const [venter, setVenter] = useState<Sikkerhetskopi | null>(null)
  const manuellRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!manuell) return
    manuellRef.current?.focus()
    manuellRef.current?.select()
  }, [manuell])

  useEffect(() => {
    if (!venter) return
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [venter])

  function lagTekst(): string {
    return tilTekst(lagKopi(getState(), new Date().toISOString()))
  }

  function huskAtKopiErTatt(dager: string[]) {
    settKvittertMilepel(hoyesteMilepel(dagerPaRad(dager)))
  }

  async function delFil() {
    const innhold = lagTekst()
    const navn = filnavnForDato(idag())
    const fil = velgDelbarFil(innhold, navn, (files) => {
      try {
        return navigator.canShare?.({ files }) ?? false
      } catch {
        return false
      }
    })
    if (!fil || !navigator.share) {
      setStatus({ type: 'feil', tekst: 'Deling er ikke tilgjengelig her. Kopier teksten i stedet.' })
      return
    }
    try {
      await navigator.share({ files: [fil], title: DEL_TITTEL })
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      setStatus({ type: 'feil', tekst: 'Klarte ikke å dele. Kopier teksten i stedet, så har du en kopi.' })
      return
    }
    huskAtKopiErTatt(getState().dager)
    setVenter(null)
    setManuell(null)
    setStatus({ type: 'ok', tekst: 'Velg Lagre i Filer, eller send kopien til deg selv.' })
  }

  function lastNed() {
    const innhold = lagTekst()
    const navn = filnavnForDato(idag())
    const url = URL.createObjectURL(new Blob([innhold], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = navn
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1500)
    huskAtKopiErTatt(getState().dager)
    setVenter(null)
    setManuell(null)
    setStatus({ type: 'ok', tekst: 'Filen er lastet ned. Legg den et sted du finner igjen.' })
  }

  async function kopier() {
    const innhold = lagTekst()
    const ok = await kopierTilUtklipp(innhold)
    if (ok) {
      huskAtKopiErTatt(getState().dager)
      setManuell(null)
      setVenter(null)
      setStatus({ type: 'ok', tekst: 'Kopiert. Lim den inn i Notater, eller send den til deg selv.' })
      return
    }
    setManuell(innhold)
    setStatus({
      type: 'feil',
      tekst: 'Klarte ikke å kopiere automatisk. Hold inne i feltet under og velg Kopier.',
    })
  }

  function vurder(raw: string) {
    const resultat = lesSikkerhetskopi(raw)
    if (!resultat.ok) {
      setVenter(null)
      setStatus({ type: 'feil', tekst: resultat.feil })
      return
    }
    setManuell(null)
    setStatus(null)
    setVenter(resultat.kopi)
  }

  async function onFil(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAKS_TEKST) {
      setVenter(null)
      setStatus({ type: 'feil', tekst: 'Filen er for stor. Ingenting er endret.' })
      return
    }
    try {
      vurder(await file.text())
    } catch {
      setVenter(null)
      setStatus({ type: 'feil', tekst: 'Klarte ikke å lese filen. Ingenting er endret.' })
    }
  }

  function bekreft() {
    if (!venter) return
    const resultat = importerHvisGyldig(tilTekst(venter), erstattFremgang)
    if (!resultat.ok) {
      setVenter(null)
      setStatus({ type: 'feil', tekst: resultat.feil })
      return
    }
    settKvittertMilepel(hoyesteMilepel(dagerPaRad(resultat.kopi.data.dager)))
    setVenter(null)
    setTekst('')
    setManuell(null)
    setStatus({ type: 'ok', tekst: 'Fremgangen er hentet inn fra kopien.' })
  }

  const naa = oppsummer(s)
  const kopiTall = venter ? oppsummer(venter.data) : null

  return (
    <div id="sikkerhetskopi">
      <h2>Sikkerhetskopi</h2>
      <p className="muted">
        Fremgangen lagres bare på denne telefonen. Ta en kopi innimellom, så har du den hvis du bytter telefon eller
        nettleseren blir tømt.
      </p>
      <p className="muted">{valg.hint}</p>

      {valg.visDel && (
        <button type="button" className={knappKlasse(valg.primar === 'del')} onClick={delFil}>
          Del fil
        </button>
      )}
      {valg.visNedlasting && (
        <button type="button" className={knappKlasse(valg.primar === 'nedlasting')} onClick={lastNed}>
          Last ned fil
        </button>
      )}
      <button type="button" className={knappKlasse(valg.primar === 'kopi')} onClick={kopier}>
        Kopier tekst
      </button>
      <label className="btn full">
        Importer fra fil
        <input
          className="fil-input"
          type="file"
          accept=".json,.txt,application/json,text/plain,application/octet-stream"
          onChange={onFil}
        />
      </label>
      <button type="button" className="btn full" onClick={() => setLimInn((v) => !v)}>
        {limInn ? 'Skjul tekstfelt' : 'Lim inn tekst'}
      </button>

      {status && (
        <p className={status.type === 'ok' ? 'merknad' : 'merknad feil'} role="status">
          {status.tekst}
        </p>
      )}

      {manuell && (
        <textarea
          ref={manuellRef}
          className="kopi-tekst"
          readOnly
          value={manuell}
          aria-label="Sikkerhetskopi som tekst"
          spellCheck={false}
          onFocus={(e) => e.target.select()}
        />
      )}

      {limInn && (
        <>
          <textarea
            className="kopi-tekst"
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            placeholder="Lim inn sikkerhetskopien her"
            aria-label="Lim inn sikkerhetskopi"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <button type="button" className="btn full" onClick={() => vurder(tekst)}>
            Sjekk teksten
          </button>
        </>
      )}

      {venter && kopiTall && (
        <div ref={previewRef}>
          <h3>Se over kopien</h3>
          <p className="muted">Tatt {formatTid(venter.eksportert)}.</p>
          <p>Dette erstatter fremgangen på denne telefonen. Det som ligger her nå blir borte. Ingenting endres før du bekrefter.</p>
          <table className="kopi-tabell">
            <caption className="sr-only">Sammenligning av fremgang nå og i kopien</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Mål</span>
                </th>
                <th scope="col">Nå</th>
                <th scope="col">I kopien</th>
              </tr>
            </thead>
            <tbody>
              {RADER.map((r) => (
                <tr key={r.nokkel}>
                  <th scope="row">{r.navn}</th>
                  <td>{naa[r.nokkel]}</td>
                  <td>{kopiTall[r.nokkel]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn btn-primary full" onClick={bekreft}>
            Erstatt med kopien
          </button>
          <button type="button" className="btn full" onClick={() => setVenter(null)}>
            Avbryt
          </button>
        </div>
      )}
    </div>
  )
}
