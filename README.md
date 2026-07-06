# 🏆 WORLD CUP '26 — Retro Fan Zone

A retro arcade-style interactive website for the 2026 FIFA World Cup.
Pure HTML/CSS/JS — no build step, no dependencies, runs anywhere.

## 🎮 Features

- **PRESS START intro** — classic arcade splash screen (Enter works too)
- **Rotating pixel globe** — canvas-rendered Earth with blinking markers for all
  48 qualified nations; **drag to spin/tilt it** with mouse or touch, or click a
  marker (or the roster) to visit that country
- **48 country pages** — sights, food, culture, World Cup record, star squad,
  a themed animated background per nation, and a procedurally-drawn **retro
  pixel player juggling a ball in that country's kit** (click him to kick!).
  **HOME / AWAY kit toggle** switches the jersey shown.
- **Match reports everywhere** — every game (all 72 group matches + the full
  knockout stage) is clickable and opens a **retro box score**. Knockout-stage
  goals, cards, and stats are researched from live tournament coverage (ESPN,
  FIFA/Opta match centres, Al Jazeera, Sky Sports) rather than invented — a few
  individual stats that weren't reported are simply omitted rather than guessed.
  Each country page has a **Game Log** of that nation's matches; every match
  card in the tournament tabs opens the same report.
- **Tournament Central** — real 2026 data (patched July 6, 2026, mid Round-of-16):
  - Group standings for all 12 groups
  - Full knockout bracket: Round of 32 → Final (July 19, New York New Jersey Stadium)
  - Past results, today's matches, upcoming fixtures
  - Title odds with retro bar charts
- **Hall of Fame** — every champion 1930–2022, legends of the Cup, 2026 fun facts
- Chiptune sound effects (WebAudio), CRT scanlines, mute toggle

## 🕹 Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Publish with GitHub Pages

A deploy workflow is included (`.github/workflows/deploy.yml`). To go live:

1. Merge this branch into `main`
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. Push to `main` (or run the workflow manually) — the site deploys to
   `https://<your-username>.github.io/WorldCup/`

## 📝 Updating tournament data

Knockout results + tournament state live in **`js/tournament.js`**:

- `MATCHES` — knockout games. Flip `status` (`played` / `today` / `upcoming` /
  `tbd`) and set `sa`/`sb` as games finish. Each match's `d` object holds the box
  score: `goals` (`{t,p,m,pen,og}`), `cards`, `pens`, `stats`, `motm`, `sum`, or a
  `preview` string for games not yet played.
- `GROUPS` — group standings (`W` winner / `Q` qualified / `T` best third / `X` out)
- `ODDS` — sportsbook lines
- `LIVE_TODAY` — the red "today" banner

Group-stage games live in **`js/groups.js`** (`GROUP_MATCHES`, all 72), with
real scorelines and (where reported) scorers researched from live coverage.
These feed the country Game Logs and their match reports.

Country content (sights, food, culture, kits) lives in **`js/data.js`** —
each team is one self-contained object, so it's easy to edit or extend.

Team kit colors drive the pixel player automatically (`kit.pattern`:
`solid`, `stripes`, `hoops`, `checks`, `halves`, `sash`). Home kits are on each
team; iconic **away kits** are in `KITS_AWAY` (any team without one gets a
distinct auto-generated change kit).

---

*Fan project — not affiliated with FIFA. Free play mode: no coins required.* 🕹
