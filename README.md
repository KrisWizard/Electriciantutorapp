# Elektrikerstudie ⚡

En studieapp for mobil som hjelper deg å øve til fagbrev som elektriker (NEK 400, FEL, FSE).

## Funksjoner

- **Flashcards med spaced repetition.** Etter hvert kort trykker du *Igjen / Vanskelig / Bra / Lett*. Appen viser kort du sliter med oftere, og kort du kan sjeldnere. Den introduserer maks 15 nye kort per dag.
- **Quiz.** 10 tilfeldige flervalgsspørsmål med forklaring etter hvert svar. Spørsmål du svarer feil på havner i en **feilliste** du kan øve på separat.
- **Regneøving.** Ohms lov, effekt (enfase og trefase), serie/parallell, lederresistans, spenningsfall og energikostnad. Nye tall hver gang, og svar innenfor ±2 % godtas.
- **Fremgang.** Dager på rad, antall kort sett og treffsikkerhet per tema.
- **Sikkerhetskopi.** Last ned, del eller kopier all fremgang, og hent den inn igjen på en ny telefon.
- **Virker offline og kan installeres på mobilen** (PWA). All fremgang lagres lokalt på telefonen.

## ⚠️ Om innholdet

Spørsmålene og kortene er et **utkast** og må kvalitetssikres mot gjeldende utgave av NEK 400, forskriftene og læreplanen. Rett og utvid gjerne!

## Legge til eller endre spørsmål

Alt innhold ligger i `src/data/`:

| Fil | Innhold |
| --- | --- |
| `cards.ts` | Flashcards (`front`, `back`, `topic`, valgfri `kilde`) |
| `quiz.ts` | Flervalgsspørsmål (`alternativer`, `riktig` = indeks til riktig svar, `forklaring`) |
| `generators.ts` | Regneoppgaver som lager nye tall hver gang |
| `topics.ts` | Temaene |

Gi hvert nytt kort eller spørsmål en unik `id`, og ikke endre `id` på eksisterende innhold, for fremgangen lagres per id.

## Kjøre lokalt

```bash
npm install
npm run dev       # utviklingsserver
npm test          # sikkerhetskopi: rundtur og ugyldig fil
npm run build     # produksjonsbygg i dist/
```

## Sikkerhetskopi

Fremgangen ligger bare i nettleseren på telefonen. Under **Fremgang** kan du ta en kopi og hente den inn igjen:

- **Del fil** — anbefalt på iPhone, særlig hvis appen ligger på Hjem-skjermen. Velg *Lagre i Filer*.
- **Last ned fil** — Android og PC.
- **Kopier tekst** — lim inn i Notater. Virker også når nedlasting ikke gjør det.

For å hente den inn: **Importer fra fil** eller **Lim inn tekst**, se over tallene, og bekreft. Ugyldig tekst endrer ingenting. Kopien erstatter fremgangen som ligger på telefonen.

## Publisere (GitHub Pages)

1. I GitHub: **Settings → Pages → Source: GitHub Actions**.
2. Merge til `main`. Workflowen i `.github/workflows/deploy.yml` bygger og publiserer automatisk.
3. Åpne lenken på mobilen:
   - **iPhone** (Safari): Del → *Legg til på Hjem-skjerm*
   - **Android** (Chrome): meny → *Installer app*
