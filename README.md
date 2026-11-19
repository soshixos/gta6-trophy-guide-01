[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/soshixos/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/soshixos/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Platinum — GTA 6 Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI
(launched 19 November 2026). Static files, no build step, no network requests, no
Rockstar logo or artwork — a look of our own in a neon-sunset Vice City palette.

## What it does

- **Every trophy, verified.** All 55 official names, descriptions and grades
  (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden), cross-checked 19 November
  2026 against planetgta6.com, OutputLag and PowerPyx — all three agree.
- **A guide for each trophy, in our own words**, with its sources named beside it.
  Where a method is still unconfirmed at launch (#44, #45, #49, #50, #51), the guide
  says so instead of inventing one.
- **A checklist that saves in the browser** (localStorage), with export to JSON,
  import from JSON (validated), and reset with confirmation.
- **Filters** by grade and by kind, text search, earned/unearned filter, and a
  missable-only switch. **Spoiler setting** hides the 28 hidden story trophies
  (name, description and guide) until earned or until spoilers are switched on.
- **Progress bar and counts** — x/55 overall, per grade, and per kind.
- **Platinum roadmap** in 5 phases (story → side strands → activities/collectibles/
  robberies → grinds → platinum), plus the three launch-week warnings: the one
  potentially missable trophy (#28, Lucia's Chapter 1 balcony meditation), cheats
  disabling trophies, and no mission replay / no New Game Plus.

## How to run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. It also works with the network
off — every file it loads lives under `app/`.

Shareable view links (for screenshots and deep links): `?seed=demo` marks a demo
set of 13 trophies earned, `?spoilers=on|off` sets the spoiler switch,
`?grade=silver`, `?kind=robbery`, `?q=bank`, `?earned=unearned` set the filters,
and `?open=28` opens one trophy's guide. These only set the first view; your saved
progress in localStorage always wins over a seed.

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`.

## Files

- `app/index.html` — page structure, warnings, roadmap, controls
- `app/app.js` — boot, rendering, controls, shareable view links
- `app/store.js` — localStorage progress, export/import/reset
- `app/filters.js` — grade/kind/search/earned filtering and counting
- `app/style.css` — the neon-sunset look (CSS only)
- `app/data/trophies.json` — the 55 trophies with guides and sources
- `screenshots/` — 4 renders of the app (see `shots.json`)
- `main.ts` — the hand-in program; `serve.ts` — a tiny static server for local use

## License

MIT. See `LICENSE`.
