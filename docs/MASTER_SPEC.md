# Sunday HQ — Master Spec (binding)

Condensed contract for the private NFL Props & Parlay Intelligence Platform. This is not a picks blog. If a later PR conflicts with this file, this file wins until explicitly amended.

## 1. Product

Sunday HQ is a permanent research terminal: **collect → verify → normalize → model → compare → rank → explain → monitor → record → learn**.

Org: UltimateServices. App: Next.js on Vercel. Book: **DraftKings-primary**.

## 2. Three layers

1. **Live Home (`/`)** — best projected singles of the week. Not the research dump.
2. **Command Center (`/dashboard`)** — full Sunday research terminal. Ordered sections are mandatory (see §12).
3. **Research Boards** — position, market, injury, weather, lines.
4. **Deep Dive** — `/games/[id]` and `/players/[id]` with **Why drawers**.

Home is a ranked picks surface. Command Center stays the encyclopedia. Do not delete the research dump to make Home simpler.

## 3. Workflow (non-skippable)

| Step | Meaning |
| --- | --- |
| Collect | Ingest slate, news, lines, weather, injuries |
| Verify | Source + timestamp + quality flag |
| Normalize | Shared types, health enum, market enum |
| Model | Independent projection (not the line) |
| Compare | Model vs book; player vs matchup vs price |
| Rank | Probability + EV + implied, not projection>line alone |
| Explain | Why drawer; four lenses |
| Monitor | Movement, inactives, weather |
| Record | Card + results |
| Learn | CLV, calibration, weights |

## 4. Health states (exact)

Never say “100% healthy” or “full go”.

`NO KNOWN LIMITATION` · `MINOR CONCERN` · `QUESTIONABLE` · `EXPECTED LIMITED` · `GAME-TIME DECISION` · `HIGH RISK` · `OUT` · `IR/PUP/NFI`

Missing injury row → `NO KNOWN LIMITATION`, not “healthy”.

## 5. Four lenses (independent)

`GOOD PLAYER` ≠ `GOOD MATCHUP` ≠ `GOOD PROJECTION` ≠ `GOOD BET`.

A startable fantasy player can be a bad bet. A backup TE residual can be a better *opportunity* than a star who is GTD.

## 6. Language bans

Forbidden: **LOCK**, **GUARANTEED**, **100% BET**, “can’t miss”, “print”.

Allowed: lean, research, placeholder, estimate, unavailable.

## 7. Pricing rules

- Rank with **model probability, implied probability, EV**.
- Projection above the line is **not** a bet.
- **Overs and unders** are first-class. No over bias.
- Missing DK odds → `DATA UNAVAILABLE`. Do not print a fake DK price.
- Assumed `-110` is allowed **only** as labeled `ESTIMATE` for ranking, never as Book odds.

## 8. Data quality

Every number carries quality: `VERIFIED` · `CONSENSUS` · `ESTIMATE` · `UNAVAILABLE` · `STALE` · `SOURCE CONFLICT` · `LOW SAMPLE`.

No silent fake numbers. Week 1 in-season sample is always `LOW SAMPLE`.

## 9. Owner markets

QB: pass yds / pass TD / rush / completions  
RB: rush / rec / receptions / TD  
WR/TE: rec / receptions / TD  
Also: anytime TD, alternate yardage, team totals, game totals, SGPs, multi-game parlays, profit boosts.

## 10. Navigation (routes always exist)

HOME · COMMAND CENTER · GAMES · PROPS · QUARTERBACKS · RUNNING BACKS · WIDE RECEIVERS · TIGHT ENDS · TOUCHDOWNS · TEAM TOTALS · GAME TOTALS · FANTASY · MATCHUPS · WEATHER · INJURIES · LINES · PARLAYS · BOOSTS · MY CARD · RESULTS · MODEL PERFORMANCE · ADMIN/SETTINGS

If a capability cannot ship, **stub the route / empty board and mark PENDING**. Do not redesign the product around the hole.

## 11. Phases

| Phase | Ships | Status in this PR |
| --- | --- | --- |
| 1 | App shell, nav, Live Home, Command Center, games/players | LIVE |
| 2 | Injuries, weather, fantasy placeholders, position boards | LIVE |
| 3 | Props / TD / team totals / game totals / fantasy boards (seed EV + Why) | LIVE · seed engine |
| 4 | Matchup boards + market movement heat/timeline | LIVE · LOW SAMPLE scores |
| 5 | Parlays, boosts, My Card, Final Card | LIVE · seed constructs |
| 6 | Results, CLV, calibration (EXAMPLE/SEED until settle) | LIVE · REAL vs EXAMPLE/SEED separated |
| 7 | Alerts wired + admin weights / settings | LIVE · ingest + Sunday crons; no secrets in repo |

Do not optimize for the fastest MVP at the expense of this foundation.

## 12. Home vs Command Center

`/` is the live picks homepage (week / refresh / health, 3–5 decision alerts, one ranked BEST PICKS list, Overs/Unders/TDs/Team Totals chips, My Card counts, link to Command Center). Do not paint every board on first load.

`/dashboard` is Command Center. Visual composition is defined in `docs/UI_BLUEPRINT.md` (desktop 4×2 primary cards, scoreboard strip, mobile reorder). Product content that must remain there: hero strip, eight summary cards (BEST OVER / UNDER / TD / TEAM TOTAL / QB MATCHUP / RB MATCHUP / GAME ENVIRONMENT / BIGGEST WARNING), critical news, what changed, opportunities, volume, TDs, weather, injuries, environments, overs + unders, parlays, my card. Missing engines stay PENDING.

## 13. Prop card fields

Player · Market · Book · Line · Odds · Model · Median · Edge · Model Prob · Implied Prob · EV · Confidence · Matchup · Health · Weather · Movement · Why · Risks.

## 14. Unit discipline

When My Card ships: **no loss chasing** and **no unit inflation** after early games. Early red does not raise later units.

## 15. Secrets and sources

- Secrets never in source control.
- `.env*` is gitignored. Document names only in `.env.example`.
- Game spreads/totals in the Week 1 seed are **DK via ESPN schedule widget (2026-09-13)**.
- Player props in the seed are **CONSENSUS / ESTIMATE** unless a later ingest marks them verified.
- Live DK tape comes from **The Odds API** (`ODDS_API_KEY`) with `bookmakers=draftkings`. Without the key: Degraded + DATA UNAVAILABLE + timestamps. Never invent a verified DK price.
- Settlement uses the **ESPN public site API** (no key): scoreboard + summary box scores. Closing line is the last **pre-kick** odds snapshot. CLV is REAL only when both exist.
- NYJ@TEN: owner seed 38.5 floor; ESPN DK widget 39.5 at capture — both stored, movement labeled.

## 16. Architecture

```
app/           App Router pages (Live Home, Command Center, boards) + api/ingest, api/settle, api/cron
components/    Shell, homepage, Command Center, boards, shared
lib/           types, nav, homepage rank, odds/EV, ingest, settle, Sunday refresh
data/          Week 1 seed + snapshots overlay + SQL schema stub
docs/          This contract
```

Future tables are named in `lib/types/schema.ts` and `data/schema.sql` so Phase 3+ does not invent a second ontology.

## 17. Visual

Dark premium: sportsbook + trading terminal + fantasy analytics. High contrast, large numbers, compact cards, dense desktop tables, mobile cards, left nav. Status colors always include **text + icon**: Green / Yellow / Orange / Red / Blue / Purple.

## 18. Seed highlights (Week 1 Sunday 2026-09-13)

13 Sunday games. TB@CIN 50.5 highest. NYJ@TEN lowest. Tua + Penix OUT, Cooper Rush starts. Kamara SOURCE CONFLICT → Etienne volume lean. Bowers OUT → Mayer. Nabers GAME-TIME DECISION. CLE@JAX significant heat/storms (estimate). Consensus: Burrow 269.5, Chase 85.5, Gibbs 84.5, Henry 78.5, Etienne 56.5, Nico 69.5, Mayer 39.5.
