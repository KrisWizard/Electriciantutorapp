import type { QuizQuestion } from './types'

/**
 * Startsett med flervalgsspørsmål. Utkast – må kvalitetssikres.
 * Behold `id` uendret når du redigerer, slik at statistikken bevares.
 */
export const QUIZ: QuizQuestion[] = [
  // Teori
  { id: 'q-ohm1', topic: 'teori', sporsmal: 'En ovn på 230 V har resistans 23 Ω. Hvor stor er strømmen?', alternativer: ['1 A', '10 A', '23 A', '5290 A'], riktig: 1, forklaring: 'I = U / R = 230 / 23 = 10 A' },
  { id: 'q-eff1', topic: 'teori', sporsmal: 'Hvilken formel gir aktiv effekt i en symmetrisk trefaselast?', alternativer: ['P = U · I', 'P = 3 · U · I', 'P = √3 · U · I · cos φ', 'P = U² · R'], riktig: 2, forklaring: 'P = √3 · U · I · cos φ, der U er linjespenningen.' },
  { id: 'q-par1', topic: 'teori', sporsmal: 'To motstander på 20 Ω kobles i parallell. Hva blir totalresistansen?', alternativer: ['40 Ω', '20 Ω', '10 Ω', '5 Ω'], riktig: 2, forklaring: 'To like motstander i parallell: R/2 = 10 Ω' },
  { id: 'q-stjerne', topic: 'teori', sporsmal: 'I et 400 V-nett: hva er fasespenningen over en stjernekoblet last?', alternativer: ['400 V', '230 V', '693 V', '133 V'], riktig: 1, forklaring: 'U_fase = U_linje / √3 = 400 / 1,732 ≈ 230 V' },
  { id: 'q-cos', topic: 'teori', sporsmal: 'Hva er effektfaktoren for en ren resistiv last?', alternativer: ['0', '0,5', '0,8', '1'], riktig: 3, forklaring: 'Strøm og spenning er i fase, φ = 0°, og cos 0° = 1.' },
  { id: 'q-enhet-q', topic: 'teori', sporsmal: 'Hvilken enhet har reaktiv effekt?', alternativer: ['W', 'VA', 'var', 'Wh'], riktig: 2, forklaring: 'Reaktiv effekt Q måles i var. Aktiv effekt i W, tilsynelatende effekt i VA.' },
  { id: 'q-kwh', topic: 'teori', sporsmal: 'En varmeovn på 1500 W står på i 4 timer. Hvor mye energi bruker den?', alternativer: ['0,375 kWh', '1,5 kWh', '6 kWh', '6000 kWh'], riktig: 2, forklaring: 'W = P · t = 1,5 kW · 4 h = 6 kWh' },

  // Vern og jording
  { id: 'q-it', topic: 'vern', sporsmal: 'Hva betyr «I» i IT-nett?', alternativer: ['Induktivt jordet', 'Isolert fra jord (eller høyimpedant jordet)', 'Indirekte tilkoblet', 'Installasjonsjord'], riktig: 1, forklaring: 'Første bokstav sier hvordan forsyningen forholder seg til jord. I = isolert.' },
  { id: 'q-tt', topic: 'vern', sporsmal: 'I hvilket system er utsatte deler jordet via en egen jordelektrode, uavhengig av forsyningens jording?', alternativer: ['TN-C', 'TN-S', 'TT', 'IT'], riktig: 2, forklaring: 'TT: forsyningen er direkte jordet (T), og utsatte deler er jordet direkte til egen elektrode (T).' },
  { id: 'q-c-kar', topic: 'vern', sporsmal: 'En C-automat løser ut momentant ved ca.:', alternativer: ['1,13–1,45 × I_n', '3–5 × I_n', '5–10 × I_n', '10–20 × I_n'], riktig: 2, forklaring: 'B: 3–5×, C: 5–10×, D: 10–20× merkestrømmen.' },
  { id: 'q-vernebet', topic: 'vern', sporsmal: 'Hvilken betingelse må oppfylles for overbelastningsvern?', alternativer: ['I_Z ≤ I_n ≤ I_B', 'I_B ≤ I_n ≤ I_Z', 'I_n ≤ I_B ≤ I_Z', 'I_B = I_n = I_Z'], riktig: 1, forklaring: 'Belastningsstrøm ≤ vernets merkestrøm ≤ kabelens strømføringsevne. I tillegg: I₂ ≤ 1,45 · I_Z.', kilde: 'NEK 400-4-43' },
  { id: 'q-klasse2', topic: 'vern', sporsmal: 'Utstyr i klasse II (dobbeltisolert)…', alternativer: ['skal alltid ha PE', 'skal ikke ha PE', 'skal kun brukes i IT-nett', 'krever egen jordelektrode'], riktig: 1, forklaring: 'Klasse II beskytter med dobbel eller forsterket isolasjon og har ingen PE-tilkobling.' },
  { id: 'q-selekt', topic: 'vern', sporsmal: 'Hva betyr det at et anlegg er selektivt?', alternativer: ['Alle vern løser ut samtidig', 'Bare vernet nærmest feilen løser ut', 'Hovedsikringen løser alltid ut først', 'Anlegget har jordfeilbryter'], riktig: 1, forklaring: 'Selektivitet: bare vernet nærmest feilen kobler ut, og resten av anlegget beholder strømmen.' },

  // NEK 400
  { id: 'q-rcd30', topic: 'nek400', sporsmal: 'Hvilken maks utløsestrøm skal en jordfeilbryter for tilleggsbeskyttelse ha?', alternativer: ['10 mA', '30 mA', '100 mA', '300 mA'], riktig: 1, forklaring: '30 mA er grensen for tilleggsbeskyttelse.', kilde: 'NEK 400-4-41' },
  { id: 'q-bad', topic: 'nek400', sporsmal: 'Hvilken del av NEK 400 omhandler rom med badekar eller dusj?', alternativer: ['NEK 400-4-41', 'NEK 400-5-52', 'NEK 400-7-701', 'NEK 400-8-823'], riktig: 2, forklaring: 'Del 7 er spesielle installasjoner, og 701 er bad og dusj.' },
  { id: 'q-sone1', topic: 'nek400', sporsmal: 'Hvor høyt over gulvet går sone 1 på et bad?', alternativer: ['1,2 m', '2,0 m', '2,25 m', '3,0 m'], riktig: 2, forklaring: 'Sone 1 går opp til 2,25 m over gulvet.', kilde: 'NEK 400-7-701' },
  { id: 'q-ipx7', topic: 'nek400', sporsmal: 'Hvilken IP-grad kreves minst for utstyr i sone 0?', alternativer: ['IPX4', 'IPX5', 'IPX6', 'IPX7'], riktig: 3, forklaring: 'Sone 0 er inne i badekaret/dusjkaret, så utstyret må tåle neddykking: IPX7.', kilde: 'NEK 400-7-701' },
  { id: 'q-ip-forste', topic: 'nek400', sporsmal: 'Hva sier det første sifferet i en IP-kode noe om?', alternativer: ['Vann', 'Faste gjenstander og støv', 'Mekanisk slag', 'Temperatur'], riktig: 1, forklaring: '1. siffer: faste gjenstander/støv. 2. siffer: vann.' },
  { id: 'q-elv', topic: 'nek400', sporsmal: 'Hva er øvre grense for ekstra lav spenning (ELV) i AC?', alternativer: ['12 V', '24 V', '50 V', '120 V'], riktig: 2, forklaring: 'ELV: inntil 50 V AC eller 120 V rippelfri DC.' },
  { id: 'q-lav', topic: 'nek400', sporsmal: 'Hva er øvre grense for lavspenning (AC)?', alternativer: ['230 V', '400 V', '690 V', '1000 V'], riktig: 3, forklaring: 'Lavspenning: inntil 1000 V AC / 1500 V DC.' },
  { id: 'q-pelv', topic: 'nek400', sporsmal: 'Hva skiller PELV fra SELV?', alternativer: ['PELV har høyere spenning', 'PELV-kretsen kan være jordet', 'PELV krever jordfeilbryter', 'Det er ingen forskjell'], riktig: 1, forklaring: 'SELV har ingen forbindelse til jord. PELV kan være jordet.' },

  // Forskrifter
  { id: 'q-fel', topic: 'forskrifter', sporsmal: 'Hvilken forskrift stiller krav til hvordan lavspenningsanlegg skal være utført?', alternativer: ['FSE', 'FEL', 'FEK', 'TEK17'], riktig: 1, forklaring: 'FEL = Forskrift om elektriske lavspenningsanlegg.' },
  { id: 'q-fse', topic: 'forskrifter', sporsmal: 'Hvilken forskrift handler om sikkerhet ved arbeid i og drift av elektriske anlegg?', alternativer: ['FSE', 'FEL', 'FEK', 'FHE'], riktig: 0, forklaring: 'FSE = Forskrift om sikkerhet ved arbeid i og drift av elektriske anlegg.' },
  { id: 'q-dsb', topic: 'forskrifter', sporsmal: 'Hvem er sentral tilsynsmyndighet for elsikkerhet?', alternativer: ['Arbeidstilsynet', 'NVE', 'DSB', 'Statsforvalteren'], riktig: 2, forklaring: 'DSB – Direktoratet for samfunnssikkerhet og beredskap.' },
  { id: 'q-nek-fel', topic: 'forskrifter', sporsmal: 'Hva er forholdet mellom NEK 400 og FEL?', alternativer: ['NEK 400 er en lov', 'Følger man NEK 400, regnes kravene i FEL som oppfylt', 'FEL er en del av NEK 400', 'De har ingenting med hverandre å gjøre'], riktig: 1, forklaring: 'NEK 400 er en norm. Følger man den, regnes sikkerhetskravene i FEL som oppfylt.' },
  { id: 'q-samsvar', topic: 'forskrifter', sporsmal: 'Hvem skal få samsvarserklæringen når installasjonen er ferdig?', alternativer: ['DSB', 'Nettselskapet', 'Eieren av anlegget', 'Kommunen'], riktig: 2, forklaring: 'Samsvarserklæringen og dokumentasjonen gis til eieren.' },

  // Sikkerhet
  { id: 'q-forste-regel', topic: 'sikkerhet', sporsmal: 'Hva er første steg i sikkerhetsreglene for arbeid på frakoblet anlegg?', alternativer: ['Kontrollere spenningsløshet', 'Frakoble', 'Jorde og kortslutte', 'Sikre mot innkobling'], riktig: 1, forklaring: 'Rekkefølgen er: frakoble → sikre mot innkobling → kontrollere spenningsløshet → jorde og kortslutte → beskytte mot nærliggende spenningsførende deler.' },
  { id: 'q-tredje-regel', topic: 'sikkerhet', sporsmal: 'Hvilket steg kommer rett etter «sikre mot innkobling»?', alternativer: ['Frakoble', 'Jorde og kortslutte', 'Kontrollere spenningsløshet', 'Starte arbeidet'], riktig: 2, forklaring: 'Etter at anlegget er frakoblet og sikret, kontrollerer du at det er spenningsløst.' },
  { id: 'q-prover', topic: 'sikkerhet', sporsmal: 'Når skal spenningsprøveren testes på en kjent spenningskilde?', alternativer: ['Bare før bruk', 'Bare etter bruk', 'Både før og etter bruk', 'En gang i året'], riktig: 2, forklaring: 'Test før og etter, slik at du vet at prøveren virket da du målte.' },
  { id: 'q-lege', topic: 'sikkerhet', sporsmal: 'En kollega har fått strøm gjennom kroppen, men føler seg helt fin. Hva gjør du?', alternativer: ['Ingenting, det gikk bra', 'Kollegaen tar resten av dagen fri', 'Kollegaen skal til lege', 'Du ringer DSB'], riktig: 2, forklaring: 'Alle som har vært utsatt for strømgjennomgang skal til lege. Hjerterytmeforstyrrelser kan komme senere.' },
  { id: 'q-aus', topic: 'sikkerhet', sporsmal: 'Hva står AUS for?', alternativer: ['Arbeid uten sikring', 'Arbeid under spenning', 'Automatisk utkobling ved strømfeil', 'Ansvarlig for utstyr og sikkerhet'], riktig: 1, forklaring: 'AUS = arbeid under spenning, en av de tre arbeidsmetodene i FSE.' },

  // Måling
  { id: 'q-iso', topic: 'maling', sporsmal: 'Hvilken målespenning brukes ved isolasjonsmåling i et 230 V-anlegg?', alternativer: ['50 V DC', '250 V DC', '500 V DC', '1000 V DC'], riktig: 2, forklaring: 'For anlegg opp til 500 V: 500 V DC og minst 1 MΩ.', kilde: 'NEK 400-6' },
  { id: 'q-iso-min', topic: 'maling', sporsmal: 'Minste godkjente isolasjonsresistans i et 230 V-anlegg (målt med 500 V DC):', alternativer: ['0,25 MΩ', '0,5 MΩ', '1 MΩ', '10 MΩ'], riktig: 2, forklaring: 'Minst 1 MΩ.', kilde: 'NEK 400-6' },
  { id: 'q-visuell', topic: 'maling', sporsmal: 'Hva gjøres først ved sluttkontroll av et nytt anlegg?', alternativer: ['Isolasjonsmåling', 'Visuell kontroll', 'Jordfeilbrytertest', 'Funksjonsprøving'], riktig: 1, forklaring: 'Visuell kontroll gjøres først, før anlegget settes under spenning.' },

  // Materiell
  { id: 'q-blå', topic: 'materiell', sporsmal: 'Hvilken farge har nøytrallederen (N)?', alternativer: ['Brun', 'Svart', 'Blå', 'Grønn/gul'], riktig: 2, forklaring: 'N er blå, PE er grønn/gul, og fasene er brun, svart og grå.' },
  { id: 'q-gulgronn', topic: 'materiell', sporsmal: 'Grønn/gul leder skal bare brukes som:', alternativer: ['Fase', 'Nøytralleder', 'Beskyttelsesleder (PE)', 'Styreleder'], riktig: 2, forklaring: 'Grønn/gul er forbeholdt beskyttelsesleder.' },
  // NEK 400 (flere)
  { id: 'q-utkobling', topic: 'nek400', sporsmal: 'Hva er maks utkoblingstid i et TN-system (230 V) for en kurs på 16 A?', alternativer: ['0,1 s', '0,4 s', '1 s', '5 s'], riktig: 1, forklaring: 'For kurser inntil 32 A i TN-system med 230 V er kravet 0,4 s.', kilde: 'NEK 400-4-41, tabell 41.1' },
  { id: 'q-min-tverr', topic: 'nek400', sporsmal: 'Minste tverrsnitt for kobber i en fast lyskurs er:', alternativer: ['0,75 mm²', '1,0 mm²', '1,5 mm²', '2,5 mm²'], riktig: 2, forklaring: 'Minst 1,5 mm² kobber for faste kraft- og lyskurser.', kilde: 'NEK 400-5-52' },
  { id: 'q-del6', topic: 'nek400', sporsmal: 'Hvilken del av NEK 400 handler om kontroll og verifikasjon av anlegget?', alternativer: ['Del 4', 'Del 5', 'Del 6', 'Del 7'], riktig: 2, forklaring: 'Del 6: Verifikasjon. Del 4 er beskyttelse, del 5 er valg av utstyr og del 7 er spesielle installasjoner.' },

  // Ekom
  { id: 'q-t568b-1', topic: 'ekom', sporsmal: 'Hvilken farge har pinne 1 etter T568B?', alternativer: ['Hvit/grønn', 'Hvit/oransje', 'Blå', 'Hvit/brun'], riktig: 1, forklaring: 'T568B starter med hvit/oransje, oransje. T568A starter med hvit/grønn, grønn.' },
  { id: 'q-kryss', topic: 'ekom', sporsmal: 'En kabel har T568A i den ene enden og T568B i den andre. Hva slags kabel er det?', alternativer: ['Rett kabel', 'Krysset kabel', 'Rollover-kabel', 'Feilkoblet kabel'], riktig: 1, forklaring: 'Ulik standard i hver ende gir en krysset kabel.' },
  { id: 'q-100m', topic: 'ekom', sporsmal: 'Hva er maks total lengde for en Ethernet-kanal i kobber (inkl. patchkabler)?', alternativer: ['50 m', '90 m', '100 m', '500 m'], riktig: 2, forklaring: '100 m totalt: inntil 90 m fast kabel og 10 m patch.' },
  { id: 'q-tvinning', topic: 'ekom', sporsmal: 'Hvorfor er parene i en nettverkskabel tvinnet?', alternativer: ['For å gjøre kabelen sterkere', 'For å redusere støy og krysstale', 'For å spare kobber', 'For å skille fargene'], riktig: 1, forklaring: 'Tvinning gjør at forstyrrelser i stor grad kansellerer hverandre.' },
  { id: 'q-singlemode', topic: 'ekom', sporsmal: 'Hvilken fibertype brukes for de lengste avstandene?', alternativer: ['Multimodus OM1', 'Multimodus OM3', 'Singlemodus', 'Plastfiber'], riktig: 2, forklaring: 'Singlemodus har en tynn kjerne (ca. 9 µm) og gir svært lang rekkevidde.' },
  { id: 'q-poe', topic: 'ekom', sporsmal: 'Hva gjør PoE mulig?', alternativer: ['Trådløst nett uten ruter', 'Strøm og data i samme nettverkskabel', 'Fiber over kobberkabel', 'Raskere internett'], riktig: 1, forklaring: 'Power over Ethernet sender strøm gjennom nettverkskabelen, f.eks. til kameraer og aksesspunkter.' },
  { id: 'q-koaks', topic: 'ekom', sporsmal: 'Hvilken impedans har koaksialkabel for TV/antenne?', alternativer: ['50 Ω', '75 Ω', '100 Ω', '120 Ω'], riktig: 1, forklaring: 'TV- og antenneanlegg bruker 75 Ω. 50 Ω brukes blant annet i radiosamband.' },
  { id: 'q-router', topic: 'ekom', sporsmal: 'Hvilken enhet sender trafikk mellom ulike nett ut fra IP-adresser?', alternativer: ['Switch', 'Router', 'Patchpanel', 'Mediekonverter'], riktig: 1, forklaring: 'En router jobber på lag 3 (IP). En switch jobber på lag 2 (MAC) innenfor samme nett.' },
  { id: 'q-subnett24', topic: 'ekom', sporsmal: 'Hvor mange vertsadresser kan brukes i nettet 192.168.1.0/24?', alternativer: ['24', '254', '256', '65 534'], riktig: 1, forklaring: '256 adresser minus nettverks- og broadcastadressen = 254.' },
  { id: 'q-3db', topic: 'ekom', sporsmal: 'Et signal blir dempet med 3 dB. Hva skjer med effekten?', alternativer: ['Den dobles', 'Den halveres omtrent', 'Den blir 1/10', 'Ingen endring'], riktig: 1, forklaring: '−3 dB ≈ halv effekt. −10 dB = 1/10.' },
  { id: 'q-nkom', topic: 'ekom', sporsmal: 'Hvem er tilsynsmyndighet for ekom i Norge?', alternativer: ['DSB', 'Nkom', 'NVE', 'Datatilsynet'], riktig: 1, forklaring: 'Nkom – Nasjonal kommunikasjonsmyndighet.' },
  { id: 'q-cat6a', topic: 'ekom', sporsmal: 'Hvilken kabelkategori er laget for 10 Gbit/s over hele 100 m?', alternativer: ['Cat 5e', 'Cat 6', 'Cat 6A', 'Cat 3'], riktig: 2, forklaring: 'Cat 6A (500 MHz) klarer 10GBASE-T på 100 m. Cat 6 klarer det bare på kortere strekk.' },

  { id: 'q-iz', topic: 'materiell', sporsmal: 'Hva av dette påvirker IKKE strømføringsevnen til en kabel?', alternativer: ['Forlegningsmåte', 'Omgivelsestemperatur', 'Fargen på kappen', 'Antall kabler som ligger samlet'], riktig: 2, forklaring: 'Fargen på kappen påvirker ikke strømføringsevnen. De andre faktorene gjør det.' },
]
