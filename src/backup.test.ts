import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import type { AppState } from './store.ts'
import {
  dagerPaRad,
  eksportvalg,
  filnavnForDato,
  hoyesteMilepel,
  importerHvisGyldig,
  lagKopi,
  lesSikkerhetskopi,
  nesteMilepel,
  tilTekst,
  velgDelbarFil,
} from './backup.ts'

const ISO = '2026-11-18T02:21:00.000Z'
const NOW = new Date(2026, 10, 18, 12, 0, 0)

function tom(): AppState {
  return {
    cards: {},
    feil: {},
    quizStats: {},
    dager: [],
    nyeIdag: { dato: '', antall: 0 },
  }
}

function rikt(): AppState {
  return {
    cards: {
      't-ohm': { ease: 2.35, interval: 0, due: 1_700_000_000_000, reps: 0, lapses: 1 },
      'v-rcd': { ease: 2.65, interval: 12, due: 1_763_500_000_000, reps: 4, lapses: 0 },
      'n-bad': { ease: 12.5, interval: 200_000, due: 1_800_000_000_000, reps: 40, lapses: 2 },
    },
    feil: { 'q-jord': true, 'q-ohm': true },
    quizStats: {
      teori: { riktig: 4, totalt: 6 },
      regning: { riktig: 3, totalt: 3 },
    },
    dager: ['2026-11-16', '2026-11-17', '2026-11-18'],
    nyeIdag: { dato: '2026-11-18', antall: 2 },
  }
}

function tekstAv(s: AppState, eksportert = ISO): string {
  return tilTekst(lagKopi(s, eksportert))
}

describe('round trip', () => {
  it('exports and imports a full progress snapshot unchanged', () => {
    const opprinnelig = rikt()
    const tekst = tekstAv(opprinnelig)
    const resultat = lesSikkerhetskopi(tekst, NOW)
    assert.equal(resultat.ok, true)
    if (!resultat.ok) return
    assert.equal(resultat.kopi.app, 'elektrikerstudie')
    assert.equal(resultat.kopi.format, 1)
    assert.equal(resultat.kopi.eksportert, ISO)
    assert.deepEqual(resultat.kopi.data, opprinnelig)
    assert.equal(resultat.oppsummering.kortSett, 3)
    assert.equal(resultat.oppsummering.kortSomSitter, 2)
    assert.equal(resultat.oppsummering.dagerPaRad, 3)
    assert.equal(resultat.oppsummering.dagerOvd, 3)
    assert.equal(resultat.oppsummering.quizSvar, 9)
    assert.equal(resultat.oppsummering.feilListe, 2)
  })

  it('round-trips an empty progress file', () => {
    const resultat = lesSikkerhetskopi(tekstAv(tom()), NOW)
    assert.equal(resultat.ok, true)
    if (!resultat.ok) return
    assert.deepEqual(resultat.kopi.data, tom())
    assert.equal(resultat.oppsummering.kortSett, 0)
    assert.equal(resultat.oppsummering.dagerPaRad, 0)
  })

  it('accepts minified JSON and a leading BOM', () => {
    const minified = `\uFEFF${JSON.stringify(lagKopi(rikt(), ISO))}`
    const resultat = lesSikkerhetskopi(minified, NOW)
    assert.equal(resultat.ok, true)
    if (!resultat.ok) return
    assert.deepEqual(resultat.kopi.data, rikt())
  })

  it('does not keep a live reference to the exported state', () => {
    const opprinnelig = rikt()
    const kopi = lagKopi(opprinnelig, ISO)
    opprinnelig.cards['t-ohm'].ease = 9
    opprinnelig.dager.push('1999-01-01')
    opprinnelig.feil['q-ny'] = true
    assert.equal(kopi.data.cards['t-ohm'].ease, 2.35)
    assert.equal(kopi.data.dager.includes('1999-01-01'), false)
    assert.equal(kopi.data.feil['q-ny'], undefined)
  })

  it('writes only progress data when the file is valid', () => {
    const opprinnelig = rikt()
    let skrevet: AppState | null = null
    let antall = 0
    const resultat = importerHvisGyldig(tekstAv(opprinnelig), (data) => {
      antall += 1
      skrevet = data
    }, NOW)
    assert.equal(resultat.ok, true)
    assert.equal(antall, 1)
    assert.deepEqual(skrevet, opprinnelig)
    assert.equal(skrevet !== null && 'format' in skrevet, false)
    assert.equal(filnavnForDato('2026-11-18'), 'elektrikerstudie-sikkerhetskopi-2026-11-18.json')
  })
})

describe('invalid files leave storage untouched', () => {
  function avvist(tekst: string, kode: string) {
    let antall = 0
    const resultat = importerHvisGyldig(tekst, () => {
      antall += 1
    }, NOW)
    assert.equal(antall, 0)
    assert.equal(resultat.ok, false)
    if (resultat.ok) return
    assert.equal(resultat.kode, kode)
    assert.match(resultat.feil, /Ingenting er endret/)
    assert.equal('kopi' in resultat, false)
  }

  it('rejects text that is not JSON', () => {
    avvist('ikke json', 'json')
    avvist('{', 'json')
    avvist('', 'json')
    avvist('   ', 'json')
  })

  it('rejects a different app and an unversioned progress blob', () => {
    const annen = JSON.parse(tekstAv(rikt()))
    annen.app = 'annet-studie'
    avvist(JSON.stringify(annen), 'app')
    avvist(JSON.stringify(rikt()), 'app')
    avvist('[]', 'app')
    avvist('null', 'app')
  })

  it('rejects a newer format and an unknown format', () => {
    const ny = JSON.parse(tekstAv(rikt()))
    ny.format = 2
    avvist(JSON.stringify(ny), 'format-ny')
    ny.format = 0
    avvist(JSON.stringify(ny), 'format')
    ny.format = '1'
    avvist(JSON.stringify(ny), 'format')
  })

  it('rejects a broken card, a bad quiz row, and unknown progress fields', () => {
    const raw = JSON.parse(tekstAv(rikt()))
    raw.data.cards['t-ohm'].ease = 'lett'
    avvist(JSON.stringify(raw), 'innhold')

    const feilListe = JSON.parse(tekstAv(rikt()))
    feilListe.data.feil['q-jord'] = 1
    avvist(JSON.stringify(feilListe), 'innhold')

    const ekstra = JSON.parse(tekstAv(rikt()))
    ekstra.data.ekstra = true
    avvist(JSON.stringify(ekstra), 'innhold')

    const ukjentKortfelt = JSON.parse(tekstAv(rikt()))
    ukjentKortfelt.data.cards['t-ohm'].begravd = true
    avvist(JSON.stringify(ukjentKortfelt), 'innhold')

    const umuligQuiz = JSON.parse(tekstAv(rikt()))
    umuligQuiz.data.quizStats.teori = { riktig: 4, totalt: 1 }
    avvist(JSON.stringify(umuligQuiz), 'innhold')

    const dato = JSON.parse(tekstAv(rikt()))
    dato.data.dager = ['2026-02-31']
    avvist(JSON.stringify(dato), 'innhold')
  })

  it('rejects prototype keys and still allows unknown envelope notes', () => {
    const kapret = JSON.parse(tekstAv(rikt()))
    kapret.data.cards.constructor = { ease: 1, interval: 1, due: 1, reps: 0, lapses: 0 }
    avvist(JSON.stringify(kapret), 'innhold')

    const notat = JSON.parse(tekstAv(rikt()))
    notat.notat = 'lagret i Filer'
    const resultat = lesSikkerhetskopi(JSON.stringify(notat), NOW)
    assert.equal(resultat.ok, true)
    if (!resultat.ok) return
    assert.deepEqual(resultat.kopi.data, rikt())
  })

  it('does not replace an earlier good import when a later file is invalid', () => {
    let lagret: AppState | null = null
    const ok = importerHvisGyldig(tekstAv(rikt()), (data) => {
      lagret = data
    }, NOW)
    assert.equal(ok.ok, true)
    const etter = lagret
    const dårlig = importerHvisGyldig('{ "app": "elektrikerstudie" }', (data) => {
      lagret = data
    }, NOW)
    assert.equal(dårlig.ok, false)
    assert.equal(lagret, etter)
  })
})

describe('streak summary', () => {
  it('counts today, or yesterday when today is missing, and stops at a gap', () => {
    const now = new Date(2026, 2, 1, 15, 0, 0)
    assert.equal(dagerPaRad(['2026-03-01', '2026-02-28', '2026-02-27'], now), 3)
    assert.equal(dagerPaRad(['2026-02-28', '2026-02-27'], now), 2)
    assert.equal(dagerPaRad(['2026-02-27'], now), 0)
    assert.equal(dagerPaRad([], now), 0)
  })

  it('reports practiced days even when the streak is already broken', () => {
    const s = tom()
    s.dager = ['2026-01-01', '2026-01-02']
    const resultat = lesSikkerhetskopi(tekstAv(s), NOW)
    assert.equal(resultat.ok, true)
    if (!resultat.ok) return
    assert.equal(resultat.oppsummering.dagerPaRad, 0)
    assert.equal(resultat.oppsummering.dagerOvd, 2)
  })
})

describe('backup reminder milestones', () => {
  it('reminds once per reached milestone and not before a week', () => {
    assert.equal(nesteMilepel(6, 0), null)
    assert.equal(nesteMilepel(7, 0), 7)
    assert.equal(nesteMilepel(13, 0), 7)
    assert.equal(nesteMilepel(14, 7), 14)
    assert.equal(nesteMilepel(15, 14), null)
    assert.equal(nesteMilepel(30, 14), 30)
    assert.equal(nesteMilepel(100, 60), 100)
    assert.equal(nesteMilepel(100, 100), null)
    assert.equal(hoyesteMilepel(0), 0)
    assert.equal(hoyesteMilepel(29), 14)
  })
})

describe('export channel', () => {
  it('hides ordinary download on iOS and prefers the share sheet there', () => {
    const hjem = eksportvalg({ ios: true, frittstaende: true, kanDeleFil: true })
    assert.equal(hjem.visDel, true)
    assert.equal(hjem.visNedlasting, false)
    assert.equal(hjem.primar, 'del')
    assert.match(hjem.hint, /Hjem-skjermen/)

    const safari = eksportvalg({ ios: true, frittstaende: false, kanDeleFil: true })
    assert.equal(safari.visNedlasting, false)
    assert.equal(safari.primar, 'del')

    const utenDeling = eksportvalg({ ios: true, frittstaende: true, kanDeleFil: false })
    assert.equal(utenDeling.visDel, false)
    assert.equal(utenDeling.visNedlasting, false)
    assert.equal(utenDeling.primar, 'kopi')
  })

  it('offers download on Android and desktop', () => {
    const android = eksportvalg({ ios: false, frittstaende: true, kanDeleFil: true })
    assert.equal(android.visDel, true)
    assert.equal(android.visNedlasting, true)
    assert.equal(android.primar, 'nedlasting')

    const pc = eksportvalg({ ios: false, frittstaende: false, kanDeleFil: false })
    assert.equal(pc.visDel, false)
    assert.equal(pc.visNedlasting, true)
    assert.equal(pc.primar, 'nedlasting')
  })

  it('falls back to text/plain when json files cannot be shared', () => {
    const json = velgDelbarFil('{}', 'a.json', (files) => files[0].type === 'application/json')
    assert.equal(json?.type, 'application/json')
    assert.equal(json?.name, 'a.json')

    const tekst = velgDelbarFil('{}', 'a.json', (files) => {
      if (files[0].type === 'application/json') throw new Error('ikke støttet')
      return files[0].type === 'text/plain'
    })
    assert.equal(tekst?.type, 'text/plain')
    assert.equal(tekst?.name, 'a.json')

    const ingen = velgDelbarFil('{}', 'a.json', () => false)
    assert.equal(ingen, null)
  })
})
