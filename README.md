# 🏆 WORLD CUP '26 — Retro Fan Zone

A retro arcade-style interactive website for the 2026 FIFA World Cup.
Pure HTML/CSS/JS — no build step, no dependencies, runs anywhere.

## 🎮 Features

- **PRESS START intro** — classic arcade splash screen (Enter works too)
- **Rotating pixel globe** — canvas-rendered Earth with blinking markers for all
  48 qualified nations; click a marker (or the roster) to visit that country
- **48 country pages** — sights, food, culture, World Cup record, star squad,
  a themed animated background per nation, and a procedurally-drawn **retro
  pixel player juggling a ball in that country's real kit** (click him to kick!)
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

All live-tournament data lives in **`js/tournament.js`**:

- `MATCHES` — add scores / flip `status` (`played` / `today` / `upcoming` / `tbd`)
  as games finish. `sa`/`sb` of `null` on a played match renders a **W** badge
  (winner listed first) when the exact score wasn't tracked.
- `GROUPS` — group standings (`W` winner / `Q` qualified / `T` best third / `X` out)
- `ODDS` — sportsbook lines
- `LIVE_TODAY` — the red "today" banner

Country content (sights, food, culture, kits) lives in **`js/data.js`** —
each team is one self-contained object, so it's easy to edit or extend.

Team kit colors drive the pixel player automatically (`kit.pattern`:
`solid`, `stripes`, `hoops`, `checks`, `halves`, `sash`).

---

*Fan project — not affiliated with FIFA. Free play mode: no coins required.* 🕹
