import type { Card } from './types'

/**
 * Startsett med flashcards.
 *
 * `usikker: true` markerer kort som avhenger av utgave/nasjonale krav, og som
 * appen viser med «Sjekk mot boka».
 *
 * VIKTIG: Innholdet er et utkast og må kvalitetssikres mot gjeldende NEK 400,
 * forskrifter og læreplanen før man stoler på det. Endre gjerne tekst, men
 * behold `id` uendret – fremgangen lagres per id.
 */
export const CARDS: Card[] = [
  // ── Elektroteknikk og formler ─────────────────────────────────────────
  { id: 't-ohm', topic: 'teori', front: 'Ohms lov', back: 'U = R · I\n\nU = spenning (V), R = resistans (Ω), I = strøm (A)' },
  { id: 't-effekt-dc', topic: 'teori', front: 'Effekt i en resistiv krets (tre varianter)', back: 'P = U · I\nP = I² · R\nP = U² / R' },
  { id: 't-effekt-1f', topic: 'teori', front: 'Aktiv effekt, enfase vekselstrøm', back: 'P = U · I · cos φ' },
  { id: 't-effekt-3f', topic: 'teori', front: 'Aktiv effekt, trefase (symmetrisk last)', back: 'P = √3 · U · I · cos φ\n\nU = linjespenning (spenning mellom faser)' },
  { id: 't-s-p-q', topic: 'teori', front: 'Sammenhengen mellom S, P og Q (effekttrekanten)', back: 'S² = P² + Q²\n\nS = tilsynelatende effekt (VA)\nP = aktiv effekt (W)\nQ = reaktiv effekt (var)' },
  { id: 't-cosphi', topic: 'teori', front: 'Hva er effektfaktor (cos φ)?', back: 'Forholdet mellom aktiv og tilsynelatende effekt:\ncos φ = P / S\n\nRen resistiv last: cos φ = 1' },
  { id: 't-serie', topic: 'teori', front: 'Total resistans i seriekobling', back: 'R_tot = R₁ + R₂ + R₃ + …\n\nSamme strøm går gjennom alle motstandene.' },
  { id: 't-parallell', topic: 'teori', front: 'Total resistans i parallellkobling', back: '1 / R_tot = 1/R₁ + 1/R₂ + …\n\nTo like motstander i parallell: R_tot = R / 2\nSamme spenning over alle grenene.' },
  { id: 't-ledermotstand', topic: 'teori', front: 'Resistansen i en leder', back: 'R = ρ · l / A\n\nρ (kobber) ≈ 0,0175 Ω·mm²/m\nl = lengde (m), A = tverrsnitt (mm²)' },
  { id: 't-stjerne', topic: 'teori', front: 'Stjernekobling (Y): spenning og strøm', back: 'U_linje = √3 · U_fase\nI_linje = I_fase' },
  { id: 't-trekant', topic: 'teori', front: 'Trekantkobling (Δ): spenning og strøm', back: 'U_linje = U_fase\nI_linje = √3 · I_fase' },
  { id: 't-frekvens', topic: 'teori', front: 'Nettfrekvens i Norge', back: '50 Hz' },
  { id: 't-reaktans', topic: 'teori', front: 'Induktiv og kapasitiv reaktans', back: 'X_L = 2π · f · L\nX_C = 1 / (2π · f · C)' },
  { id: 't-energi', topic: 'teori', front: 'Elektrisk energi', back: 'W = P · t\n\nEks: 2 kW i 3 timer = 6 kWh' },
  { id: 't-spfall-1f', topic: 'teori', front: 'Spenningsfall i en enfase kurs (resistiv last, forenklet)', back: 'ΔU = 2 · l · I · ρ / A\n\nFaktoren 2 fordi strømmen går både fram og tilbake.' },
  { id: 't-spfall-3f', topic: 'teori', front: 'Spenningsfall i en trefase kurs (forenklet)', back: 'ΔU = √3 · l · I · ρ · cos φ / A' },

  // ── Vern og jording ───────────────────────────────────────────────────
  { id: 'v-it', topic: 'vern', front: 'Hva kjennetegner et IT-nett?', back: 'Forsyningen er isolert fra jord (eller jordet via høy impedans). Utsatte ledende deler er jordet lokalt.\n\nVanlig i eldre norske boligområder, typisk 230 V mellom faser.', kilde: 'NEK 400-3' },
  { id: 'v-tn', topic: 'vern', front: 'Hva kjennetegner et TN-C-S-nett?', back: 'Forsyningen er direkte jordet. Nøytral- og beskyttelsesleder er felles (PEN) i en del av systemet, og deles i separate N og PE videre.\n\nTypisk 400/230 V i nyere anlegg.', kilde: 'NEK 400-3' },
  { id: 'v-tt', topic: 'vern', front: 'Hva kjennetegner et TT-nett?', back: 'Forsyningen er direkte jordet, og utsatte ledende deler er jordet via en egen jordelektrode som er uavhengig av forsyningens jording.', kilde: 'NEK 400-3' },
  { id: 'v-bokstaver', topic: 'vern', front: 'Hva betyr bokstavene i TN / TT / IT?', back: '1. bokstav – forsyningens forhold til jord:\nT = direkte jordet, I = isolert\n\n2. bokstav – utsatte deler:\nT = jordet direkte, N = forbundet til forsyningens jordede punkt' },
  { id: 'v-rcd', topic: 'vern', front: 'Maks utløsestrøm for jordfeilbryter som tilleggsbeskyttelse', back: '30 mA', kilde: 'NEK 400-4-41' },
  { id: 'v-overlast', topic: 'vern', front: 'Vernebetingelsene for overbelastningsvern', back: 'I_B ≤ I_n ≤ I_Z\nI₂ ≤ 1,45 · I_Z\n\nI_B = belastningsstrøm, I_n = vernets merkestrøm, I_Z = kabelens strømføringsevne, I₂ = strøm som sikrer utløsning', kilde: 'NEK 400-4-43' },
  { id: 'v-bkarakteristikk', topic: 'vern', front: 'Utløsekarakteristikk B, C og D (momentan utløsning)', back: 'B: 3–5 × I_n\nC: 5–10 × I_n\nD: 10–20 × I_n' },
  { id: 'v-selektivitet', topic: 'vern', front: 'Hva betyr selektivitet?', back: 'At bare vernet nærmest feilen kobler ut, slik at resten av anlegget fortsatt har strøm.' },
  { id: 'v-utjevning', topic: 'vern', front: 'Hva er beskyttende potensialutjevning (hovedutjevning)?', back: 'Fremmede ledende deler (f.eks. metalliske vann- og varmerør) forbindes til hovedjordskinnen, slik at alle har samme potensial.', kilde: 'NEK 400-4-41' },
  { id: 'v-klasse1', topic: 'vern', front: 'Utstyrsklasse I', back: 'Basisisolasjon + tilkobling til beskyttelsesleder (PE). Utsatte ledende deler skal jordes.' },
  { id: 'v-klasse2', topic: 'vern', front: 'Utstyrsklasse II', back: 'Dobbel eller forsterket isolasjon. Skal IKKE ha PE.\n\nSymbol: en firkant inni en firkant.' },

  // ── NEK 400 ───────────────────────────────────────────────────────────
  { id: 'n-lavspenning', topic: 'nek400', front: 'Spenningsgrensene for lavspenning', back: 'Inntil 1000 V AC\nInntil 1500 V DC' },
  { id: 'n-elv', topic: 'nek400', front: 'Hva er ELV (ekstra lav spenning)?', back: 'Inntil 50 V AC eller 120 V rippelfri DC.' },
  { id: 'n-selv-pelv', topic: 'nek400', front: 'Forskjellen på SELV og PELV', back: 'Begge er ekstra lav spenning fra en sikker kilde.\n\nSELV: ingen forbindelse til jord.\nPELV: kretsen kan være jordet.' },
  { id: 'n-berøring', topic: 'nek400', front: 'Konvensjonell grense for berøringsspenning (U_L) under normale forhold', back: '50 V AC' },
  { id: 'n-stikk-rcd', topic: 'nek400', front: 'Hvilke stikkontaktkurser krever jordfeilbryter ≤ 30 mA som tilleggsbeskyttelse?', back: 'Stikkontakter med merkestrøm inntil 32 A for generell bruk.', kilde: 'NEK 400-4-41, 411.3.3', usikker: true },
  { id: 'n-bad-del', topic: 'nek400', front: 'Hvilken del av NEK 400 gjelder rom med badekar eller dusj?', back: 'NEK 400-7-701' },
  { id: 'n-bolig-del', topic: 'nek400', front: 'Hvilken del av NEK 400 gjelder boliginstallasjoner?', back: 'NEK 400-8-823' },
  { id: 'n-sone0', topic: 'nek400', front: 'Bad: hva er sone 0?', back: 'Innsiden av badekaret eller dusjkaret.', kilde: 'NEK 400-7-701' },
  { id: 'n-sone1', topic: 'nek400', front: 'Bad: hva er sone 1?', back: 'Over sone 0, opp til 2,25 m over gulvet.', kilde: 'NEK 400-7-701' },
  { id: 'n-ip-bad', topic: 'nek400', front: 'Minste IP-grad for utstyr i sone 0 og sone 1 på bad', back: 'Sone 0: IPX7\nSone 1: IPX4 (IPX5 der det kan brukes vannstråle til rengjøring)', kilde: 'NEK 400-7-701', usikker: true },
  { id: 'n-ip', topic: 'nek400', front: 'Hva betyr de to sifrene i en IP-kode?', back: '1. siffer: beskyttelse mot faste gjenstander og støv (0–6)\n2. siffer: beskyttelse mot vann (0–8)\n\nX = ikke angitt' },
  { id: 'n-ipx4', topic: 'nek400', front: 'IPX4, IPX5 og IPX7', back: 'IPX4: vannsprut fra alle retninger\nIPX5: vannstråle\nIPX7: midlertidig neddykking' },
  { id: 'n-ip2x', topic: 'nek400', front: 'Hva betyr IP2X?', back: 'Beskyttet mot faste gjenstander ≥ 12,5 mm, dvs. «fingersikker».' },
  { id: 'n-spfall', topic: 'nek400', front: 'Anbefalt maks spenningsfall fra inntaket til utstyret', back: '4 % (anbefaling).', kilde: 'NEK 400-5-52 – sjekk gjeldende utgave', usikker: true },

  // ── Forskrifter ───────────────────────────────────────────────────────
  { id: 'f-fel', topic: 'forskrifter', front: 'Hva står FEL for?', back: 'Forskrift om elektriske lavspenningsanlegg' },
  { id: 'f-fse', topic: 'forskrifter', front: 'Hva står FSE for?', back: 'Forskrift om sikkerhet ved arbeid i og drift av elektriske anlegg' },
  { id: 'f-fek', topic: 'forskrifter', front: 'Hva står FEK for?', back: 'Forskrift om elektroforetak og kvalifikasjonskrav for arbeid knyttet til elektriske anlegg og elektrisk utstyr' },
  { id: 'f-dsb', topic: 'forskrifter', front: 'Hvem er sentral tilsynsmyndighet for elsikkerhet i Norge?', back: 'DSB – Direktoratet for samfunnssikkerhet og beredskap' },
  { id: 'f-nek-fel', topic: 'forskrifter', front: 'Hvordan henger NEK 400 sammen med FEL?', back: 'FEL stiller sikkerhetskravene. Følger man NEK 400, regnes kravene i FEL som oppfylt. Man kan velge en annen løsning, men må da dokumentere at den gir minst like god sikkerhet.' },
  { id: 'f-samsvar', topic: 'forskrifter', front: 'Hva er en samsvarserklæring?', back: 'En erklæring fra installatøren om at anlegget er utført i samsvar med forskriftene. Den gis til eieren sammen med dokumentasjonen etter at anlegget er kontrollert.', kilde: 'FEL' },
  { id: 'f-register', topic: 'forskrifter', front: 'Hvor skal et elektroforetak være registrert?', back: 'I Elvirksomhetsregisteret (hos DSB).', kilde: 'FEK' },

  // ── Sikkerhet (FSE) ───────────────────────────────────────────────────
  { id: 's-fem-regler', topic: 'sikkerhet', front: 'De fem sikkerhetsreglene ved arbeid på frakoblet anlegg', back: '1. Frakoble\n2. Sikre mot innkobling\n3. Kontrollere spenningsløshet\n4. Jorde og kortslutte\n5. Beskytte mot spenningsførende deler i nærheten', kilde: 'FSE' },
  { id: 's-metoder', topic: 'sikkerhet', front: 'De tre arbeidsmetodene i FSE', back: '1. Arbeid på frakoblet anlegg\n2. Arbeid nær spenning\n3. Arbeid under spenning (AUS)', kilde: 'FSE' },
  { id: 's-lfs', topic: 'sikkerhet', front: 'Hva gjør leder for sikkerhet (LFS)?', back: 'Har ansvaret for elsikkerheten på arbeidsstedet: at sikkerhetstiltakene blir etablert, opprettholdt og fjernet på riktig måte.', kilde: 'FSE' },
  { id: 's-spenningsprover', topic: 'sikkerhet', front: 'Hvordan bruker du en spenningsprøver riktig?', back: 'Test prøveren på en kjent spenningskilde FØR og ETTER du kontrollerer at anlegget er spenningsløst.' },
  { id: 's-30ma', topic: 'sikkerhet', front: 'Hvorfor er 30 mA grensen for jordfeilbryter som tilleggsbeskyttelse?', back: 'Strøm under dette nivået gir normalt ikke hjerteflimmer hvis den brytes raskt nok.' },
  { id: 's-forstehjelp', topic: 'sikkerhet', front: 'Førstehjelp ved strømulykke – det viktigste', back: '1. Bryt strømmen før du tar i personen\n2. Sjekk bevissthet og pust, start HLR ved behov og ring 113\n3. Alle som har vært utsatt for strømgjennomgang skal til lege' },

  // ── Måling og kontroll ────────────────────────────────────────────────
  { id: 'm-iso', topic: 'maling', front: 'Isolasjonsmåling i anlegg opp til 500 V: målespenning og minste verdi', back: 'Målespenning: 500 V DC\nMinst 1 MΩ', kilde: 'NEK 400-6' },
  { id: 'm-iso-selv', topic: 'maling', front: 'Isolasjonsmåling i SELV/PELV-kretser', back: 'Målespenning: 250 V DC\nMinst 0,5 MΩ', kilde: 'NEK 400-6' },
  { id: 'm-rekkefolge', topic: 'maling', front: 'Hva gjøres først ved sluttkontroll?', back: 'Visuell kontroll, før anlegget spenningssettes. Deretter måling og prøving.', kilde: 'NEK 400-6' },
  { id: 'm-kontinuitet', topic: 'maling', front: 'Hva er en kontinuitetsmåling?', back: 'Måling av at beskyttelsesledere og utjevningsforbindelser henger sammen og har lav resistans.' },
  { id: 'm-rcd-test', topic: 'maling', front: 'Hva kontrollerer du med en jordfeilbrytertester?', back: 'At jordfeilbryteren løser ut, og hvor lang utløsetid og hvor stor utløsestrøm den har.' },
  { id: 'm-kortslutning', topic: 'maling', front: 'Hvorfor måler man sløyfeimpedans eller kortslutningsstrøm?', back: 'For å sjekke at feilstrømmen blir stor nok til at vernet kobler ut automatisk innen kravet til utkoblingstid.' },

  // ── Kabler og materiell ───────────────────────────────────────────────
  { id: 'k-farger', topic: 'materiell', front: 'Fargekoder på ledere', back: 'PE: grønn/gul\nN: blå\nFaser: brun, svart, grå' },
  { id: 'k-tverrsnitt', topic: 'materiell', front: 'Vanlige standardtverrsnitt (mm²)', back: '1,5 – 2,5 – 4 – 6 – 10 – 16 – 25 – 35 …' },
  { id: 'k-pen', topic: 'materiell', front: 'Hva er en PEN-leder?', back: 'En leder som både er nøytralleder (N) og beskyttelsesleder (PE). Den finnes i TN-C-delen av et anlegg.' },
  { id: 'k-strømføring', topic: 'materiell', front: 'Hva påvirker strømføringsevnen (I_Z) til en kabel?', back: 'Tverrsnitt, ledermateriale, isolasjonstype, forlegningsmåte, omgivelsestemperatur og hvor mange kabler som ligger samlet.', kilde: 'NEK 400-5-52' },

  // ── NEK 400 (flere) ───────────────────────────────────────────────────
  { id: 'n-utkobling-tn', topic: 'nek400', front: 'Maks utkoblingstid i TN-system, 230 V, for kurser inntil 32 A', back: '0,4 s', kilde: 'NEK 400-4-41, tabell 41.1' },
  { id: 'n-utkobling-tt', topic: 'nek400', front: 'Maks utkoblingstid i TT-system, 230 V, for kurser inntil 32 A', back: '0,2 s', kilde: 'NEK 400-4-41, tabell 41.1' },
  { id: 'n-min-tverrsnitt', topic: 'nek400', front: 'Minste tverrsnitt for kobberledere i faste kraft- og lyskurser', back: '1,5 mm²', kilde: 'NEK 400-5-52' },
  { id: 'n-overspenning', topic: 'nek400', front: 'Hvilken del av NEK 400 handler om beskyttelse mot overspenninger (f.eks. lynoverspenning)?', back: 'NEK 400-4-44, avsnitt 443', kilde: 'NEK 400-4-443' },
  { id: 'n-deler', topic: 'nek400', front: 'Hvordan er NEK 400 bygd opp?', back: 'Del 1: Omfang og grunnleggende prinsipper\nDel 2: Definisjoner\nDel 3: Generelle karakteristikker\nDel 4: Beskyttelse for å oppnå sikkerhet\nDel 5: Valg og installasjon av utstyr\nDel 6: Verifikasjon (kontroll)\nDel 7: Spesielle installasjoner\nDel 8: Bolig m.m. (8-823) og energieffektivitet (8-1)', usikker: true },
  { id: 'n-risiko', topic: 'nek400', front: 'Hva må gjøres før et nytt anlegg prosjekteres og bygges?', back: 'En risikovurdering, slik at anlegget får et sikkerhetsnivå som passer bruken og omgivelsene.', kilde: 'FEL' },

  // ── Ekom og nettverk ──────────────────────────────────────────────────
  { id: 'e-rj45', topic: 'ekom', front: 'Hvor mange ledere og par har en vanlig nettverkskabel med RJ45-kontakt?', back: '8 ledere i 4 tvinnede par.' },
  { id: 'e-t568b', topic: 'ekom', front: 'Fargerekkefølge T568B (pinne 1–8)', back: '1 hvit/oransje\n2 oransje\n3 hvit/grønn\n4 blå\n5 hvit/blå\n6 grønn\n7 hvit/brun\n8 brun', kilde: 'TIA-568' },
  { id: 'e-t568a', topic: 'ekom', front: 'Fargerekkefølge T568A (pinne 1–8)', back: '1 hvit/grønn\n2 grønn\n3 hvit/oransje\n4 blå\n5 hvit/blå\n6 oransje\n7 hvit/brun\n8 brun\n\nSom T568B, men oransje og grønt par har byttet plass.', kilde: 'TIA-568' },
  { id: 'e-rett-kryss', topic: 'ekom', front: 'Rett kabel vs. krysset kabel', back: 'Rett kabel: samme standard i begge ender (f.eks. B–B).\nKrysset kabel: T568A i den ene enden og T568B i den andre.' },
  { id: 'e-tvinning', topic: 'ekom', front: 'Hvorfor er lederparene i en nettverkskabel tvinnet?', back: 'For å redusere elektromagnetisk støy og krysstale mellom parene.' },
  { id: 'e-skjerm', topic: 'ekom', front: 'Hva betyr U/UTP, F/UTP og S/FTP?', back: 'Før skråstreken: skjerm rundt hele kabelen. Etter: skjerm rundt hvert par.\n\nU/UTP: ingen skjerm\nF/UTP: folie rundt hele kabelen\nS/FTP: flettet skjerm rundt kabelen + folie rundt hvert par' },
  { id: 'e-100m', topic: 'ekom', front: 'Maks lengde på en kobberkanal for Ethernet (tvunnet par)', back: '100 m totalt: inntil 90 m fast kabel (permanent link) + inntil 10 m patchkabler.' },
  { id: 'e-cat6', topic: 'ekom', front: 'Cat 6 vs. Cat 6A', back: 'Cat 6: inntil 250 MHz. 10 Gbit/s bare på kortere avstander.\nCat 6A: inntil 500 MHz. 10 Gbit/s på hele 100 m.' },
  { id: 'e-fiber-typer', topic: 'ekom', front: 'Singlemodus- vs. multimodusfiber', back: 'Singlemodus (OS1/OS2): ca. 9 µm kjerne, for lange avstander.\nMultimodus (OM1–OM5): 50 eller 62,5 µm kjerne, for kortere avstander, f.eks. i bygg.' },
  { id: 'e-fiber-fordeler', topic: 'ekom', front: 'Fordeler med fiber framfor kobber', back: 'Påvirkes ikke av elektromagnetisk støy, gir galvanisk skille, har lang rekkevidde og høy båndbredde.' },
  { id: 'e-fiber-kontakter', topic: 'ekom', front: 'To vanlige fiberkontakter', back: 'LC (liten, vanlig i switcher) og SC (større, firkantet).' },
  { id: 'e-poe', topic: 'ekom', front: 'Hva er PoE?', back: 'Power over Ethernet: strøm og data i samme nettverkskabel, f.eks. til IP-kameraer, aksesspunkter og IP-telefoner.\n\n802.3af: inntil 15,4 W\n802.3at: inntil 30 W\n802.3bt: inntil 60/90 W\n(effekt levert fra switchen)', usikker: true },
  { id: 'e-koaks', topic: 'ekom', front: 'Karakteristisk impedans for koaksialkabel til TV/antenne', back: '75 Ω' },
  { id: 'e-switch-router', topic: 'ekom', front: 'Forskjellen på en switch og en router', back: 'Switch: kobler sammen enheter i samme lokale nett, ut fra MAC-adresser (lag 2).\nRouter: sender trafikk mellom ulike nett, ut fra IP-adresser (lag 3).' },
  { id: 'e-ipv4', topic: 'ekom', front: 'Hvor mange bit er en IPv4-adresse og en MAC-adresse?', back: 'IPv4: 32 bit (f.eks. 192.168.1.10)\nMAC: 48 bit (f.eks. 00:1A:2B:3C:4D:5E)' },
  { id: 'e-subnett', topic: 'ekom', front: 'Hvor mange brukbare vertsadresser har et /24-nett (255.255.255.0)?', back: '254\n\n2⁸ = 256 adresser, minus nettverksadressen og broadcastadressen.' },
  { id: 'e-db', topic: 'ekom', front: 'Hva betyr +3 dB og −3 dB?', back: '+3 dB ≈ dobbel effekt\n−3 dB ≈ halv effekt\n+10 dB = 10 ganger effekten' },
  { id: 'e-nkom', topic: 'ekom', front: 'Hvem er tilsynsmyndighet for elektronisk kommunikasjon (ekom) i Norge?', back: 'Nkom – Nasjonal kommunikasjonsmyndighet' },
  { id: 'e-nek700', topic: 'ekom', front: 'Hvilken norm gjelder for installasjon av ekomnett i bygninger?', back: 'NEK 700', kilde: 'Sjekk gjeldende utgave', usikker: true },
]
