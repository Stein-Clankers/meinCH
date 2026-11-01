# Session log

## 2026-10-19

- **Done:** research on existing naturalisation/Switzerland learning apps, cantonal test requirements, licensing of official material and naming. Name chosen: meinCH («meinCH – Schweiz verstehen»). Public repo created.
- **Changed:** `README.md`, `CLAUDE.md`, ADR 0001 (stack, Proposed), `reports/Schweiz Lernapp Einbürgerung.md`, `research_notes/Schweiz Lernapp Einbürgerung/`. HQ page `projects/meinch.md`.
- **Open:** iOS app repo later. Domain meinch.ch not needed for now (Markus).
- **Update:** swissreg checked by Markus: no trademark «meinCH» or «mein.ch» registered (2026-10-19).

## 2026-10-19 (site scaffold)

- **Done:** ADR 0001 accepted. Astro 7 + Svelte site on SteinerDesign v1.1.0: home with interactive Switzerland map, canton overview (map + table), 26 generated canton pages with municipality map, municipality list and «üben» quiz (find the canton/municipality), lesson pages, `/daten/kantone.json` export for the iOS app. First module is Zürich (Markus' canton).
- **Changed:** `src/data/kantone.yaml` (26 cantons; Hauptort/Beitritt/Sprachen marked `ungeprueft`), `src/data/gemeinden.json` (2110 municipalities, BFS, 01.01.2026) via `tools/gemeinden.mjs`; maps from `swiss-maps` 2026. Lessons: «Bund, Kantone, Gemeinden» (BV), «Einbürgerung im Kanton Zürich» (draft). GitHub Pages workflow.
- **Verified:** build (32 pages); map hover, links and quiz in the browser at 1440 px and 390 px (no horizontal scroll), light and dark.
- **Open:** check the `ungeprueft` canton fields against HLS/official sources and drop the flags; ZH lessons (Kanton, Stadt Zürich, fees, residence periods, step-by-step); more politics/history/geography lessons; a question trainer with own questions; quiz header shifts the map when its text wraps; which Gemeinde in ZH (assumed Stadt Zürich, not confirmed).

## 2026-10-19 (moved to Stein-Clankers)

- **Done:** repo transferred to the GitHub organisation Stein-Clankers (like Archipelago). Site URL, footer and README links updated; Pages setting carried over.
- **Changed:** now https://github.com/Stein-Clankers/meinCH, site https://stein-clankers.github.io/meinCH/. The old markussteinbrecher.github.io/meinCH URL no longer serves the site (Pages does not redirect).

## 2026-10-19 (no marketing)

- **Changed:** home page, page title, README and CLAUDE.md lose the slogan («die Schweiz verstehen, nicht nur den Test bestehen», «neutral, werbefrei»). Home now says what's on the site. CLAUDE.md gets a «Ton: nur Inhalt, kein Marketing» rule. meinCH added to Clanker City (steinclankers repo).
- **Fixed:** municipality→canton mapping in `tools/gemeinden.mjs`. BFS `HistoricalCode` is only unique per level (district Horgen and the municipality Vionnaz share 10078), so 9 Horgen municipalities were counted in Valais and others shifted too (ZH showed 151 instead of 160; LU, AG, GR, VS also wrong). Lookup is now per level and the script fails if a municipality has no canton. Spotted by Markus.

## 2026-10-19 (politics: more content, visual)

- **Done:** politics section rebuilt around visuals (Markus: pages were too text-heavy). New components in `src/components/viz/`: key-figure row, state-levels × powers grid, National Council seats per canton as a dot chart (ZH highlighted), seats per party as bars (NR and SR), Federal Council department tiles, process steps, double-majority map (full vs half cantonal votes). New lessons: «Das Parlament», «Der Bundesrat», «Direkte Demokratie», «Politik im Kanton Zürich» (draft); «Bund, Kantone, Gemeinden» rewritten. New data file `src/data/politik.yaml` with build checks; included in `/daten/kantone.json`.
- **Verified:** build (36 pages); all politics pages in the browser at desktop width and 390 px (no horizontal scroll after making tables scroll on phones). Source URLs checked with curl; two BFS links were dead and replaced. Party totals for the National Council 2023 (SVP 62, SP 41, Mitte 29, FDP 28, Grüne 23, others 17) confirmed against BFS.
- **Open:** `politik.yaml` still flagged `ungeprueft` (seats per canton, Council of States parties, Federal Council names as of 1.1.2026): check against BFS/parlament.ch/admin.ch. ZH politics lesson is a draft (Oberrichter election, sources are portal pages). Next: history and geography lessons, question trainer.

## 2026-10-19 (fact check of the whole site)

- **Done:** every fact on the site checked against official sources (four parallel checks: canton data, politics figures, federal lessons, Zurich lessons). All `ungeprueft` flags removed.
- **Corrected:** AR has no constitutional Hauptort (courts, not only the cantonal court, in Trogen); JU dates 24.9.1978 / 1.1.1979; municipalities have no courts (state-levels grid, key figures); Art. 148 quote completed; Bundesgericht seat from BGG Art. 4 (Lausanne, two divisions in Luzern); Fraktion = same or like-minded parties, ≥ 5 members (ParlG Art. 61); General elected for large active-service deployments, not only war; next elections 24.10.2027; casting vote of the president (RVOG Art. 19); Art. 140/141 scope completed; Ständemehr = majority of Standesstimmen (≥ 12 of 23); Council of States chart labelled as 2023 result (seats changed since, e.g. SH 2025); VBS «Bevölkerungsschutz». Zurich naturalisation: «Lina» is fictional; 3 of the last 5 years (Art. 9); integration vs familiarity separated; German required in ZH; residence 2 years in the municipality (under 25: in the canton); «50 of 350» attributed to the Maur leaflet, pass mark not published; extra exemption; fees table added. Zurich politics: KV in force 1.1.2006, Majorz for Regierungsrat, court elections, cantonal initiative/referendum thresholds, 12 districts named (checked against BFS data), only some municipalities have a parliament. Sources replaced: BüV on fedlex, KV on zhlex, NR seats on ch.ch; new: BGG, ParlG, RVOG, ar.ch, zh.ch fees page, Maur leaflet.
- **Limits:** HLS blocked direct fetches (canton history facts rest on search excerpts plus BV); Ständerat 2026 composition (FDP 12, SP 7, one non-party) from parlament.ch via the checker, not shown on the site.

## 2026-10-19 (wrap-up)

- **Done:** 25 GitHub issues, one per canton except Zurich (#1–#25, label `kanton`), each with a checklist for a canton module like Zurich (politics + naturalisation) and research hints where known (BE, AG, SZ, SG, BL, NW, TG, BS).
- **State of the site** (https://stein-clankers.github.io/meinCH/, noindex draft): home with Switzerland map and canton quiz; 26 canton pages with municipality maps, quiz and lists; politics section with 5 lessons and visuals (key figures, state levels, NR seats per canton, party bars, Federal Council tiles, process steps, Ständemehr map); naturalisation lesson for Zurich; `/daten/kantone.json` export (cantons, municipalities, politics). All facts checked against official sources on 2026-10-19.
- **Open (next sessions):**
  - Canton modules: issues #1–#25.
  - History and geography lessons in the same visual style.
  - Question trainer with own questions (no verbatim official catalogues).
  - Stadt Zürich lesson; naturalisation step by step for Zurich; which municipality Markus lives in (assumed Stadt Zürich, not confirmed).
  - Quiz header shifts the map when its feedback wraps.
  - Yearly data refresh: municipalities (`tools/gemeinden.mjs`), `swiss-maps` year, politics after by-elections and the 24.10.2027 elections.
  - Launch: switch off `ENTWURFSPHASE` when ready; iOS app in its own repo later.

## 2026-10-19 (canton module Bern, #1)

- **Done:** two Bern lessons, listed on the canton page: «Politik im Kanton Bern» (Grosser Rat 160, Regierungsrat 7, courts, Sonderstatut Berner Jura with the 12 guaranteed seats and the reserved government seat, Volksrechte incl. Volksvorschlag, «Bundesstadt», Stadt Bern: Stadtrat 80 / Gemeinderat 5) and «Einbürgerung im Kanton Bern» (2 years in the municipality, KV Art. 7 exclusions, 10 years without social assistance, language of the Verwaltungskreis, test 90 min / 60 %, Stadt Bern 48 questions, fees canton 1150/1725/575, steps with statutory deadlines, 3004 naturalisations in 2025). Every fact from statute texts (BELEX, fedlex) or official pages, read by two research agents.
- **New for all cantons:** `gemeinden.json` now has `bezirk` (BFS level 2: Bezirk, Verwaltungskreis …); `bezirkKarte()` in `src/lib/karte.ts` and `viz/Bezirke.astro` draw a canton's districts as a numbered map with optional accent highlight. Use it in the other canton modules.
- **Verified:** build (38 pages); both lessons in the browser at desktop and 375 px, no horizontal scroll.
- **Notes:** Moutier moved to JU on 1.1.2026 (already in the BFS data). bern.ch answers 403 to curl, the agent read it in a browser. Test price in Bern is not published. Unconfirmed: a news report that the Stadt Bern will drop its naturalisation fees.
- **Open:** issues #2–#25; Bern lesson on the Grosser Rat Wahlkreise as a visual would need Wahlkreis data (they differ from the Verwaltungskreise).

## 2026-11-01 (canton modules LU, UR, SZ, OW: #2–#5)

- **Done:** four canton modules built in parallel sessions and merged as PRs: Obwalden #26, Luzern #27, Schwyz #28, Uri #29 (issues #2–#5 closed). Each adds «Politik im Kanton …» and «Einbürgerung im Kanton …». Uri adds `viz/SitzeWahlkreise.astro` (Landrat seats per municipality). Details and sources are in each PR description.
- **Changed:** `bezirkKarte()` now puts district labels at the point farthest inside the district's largest part instead of the centroid, so a ring-shaped district (Luzern-Land around Luzern-Stadt) no longer gets its label on top of the inner one. CLAUDE.md lists the new visuals.
- **Review:** #26 checked against the OW constitution, one wording fixed (Bürgergemeindeversammlung = resident citizens, Art. 97 KV). For #27–#29 the independent fact-check agents failed (expired login), so they were merged on the sessions' own checks (build, 375 px, all source URLs 200) without a second fact check.
- **Verified:** build (46 pages); LU district map in the browser.
- **Open:**
  - Second fact check of LU, SZ, UR (and BE, which only had the research agents).
  - `politik.yaml`: National Council seats change with the 2027 elections (LU 10, FR 8, BE and GR −1; SR 161.12). Update after 24.10.2027 or show both.
  - Unconfirmed in the modules: LU cantonal fee basis (only a 2016 fee sheet), SZ test question count, UR cantonal fee (only altdorf.ch), OW municipal fees other than Sarnen.
  - Canton modules #6–#25.
