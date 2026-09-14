# Sunday HQ — UI Blueprint (binding)

Visual and interaction contract. Product rules in `MASTER_SPEC.md` still win on language, health, and data honesty. This file wins on shell, component reuse, and page composition.

Do **not** invent generic dashboards. Every screen is a research terminal surface.

## 1. Global shell

### Desktop

Fixed left sidebar **240px** (collapses to icon rail) + top header + main + optional right drawer.

Sidebar groups, in this order (icons + labels):

1. COMMAND CENTER
2. GAMES · PROPS · TOUCHDOWNS · TEAM TOTALS · GAME TOTALS
3. QUARTERBACKS · RUNNING BACKS · WIDE RECEIVERS · TIGHT ENDS · FANTASY
4. COMPARE · MATCHUPS · WEATHER · INJURIES · MARKET MOVEMENT
5. PARLAYS · BOOSTS · MY CARD
6. RESULTS · MODEL PERFORMANCE
7. ADMIN · SETTINGS

### Mobile

- Bottom nav: **HOME / GAMES / PROPS / MY CARD / MORE**
- MORE opens the full nav drawer
- Mobile header: week + refresh status + alerts + search

### Top header

Page title + week | Last refresh + Next refresh + Refresh + Search + Alerts + settings.

- Last refresh is a real timestamp (seed or client view-refresh)
- Next refresh is the next Sunday cron **attempt** (ET label + stage). It is not a guarantee of new DK tape — Degraded / DATA UNAVAILABLE still apply when the key is missing or the pull fails
- Refresh updates the *view clock* only; it does not fabricate lines

### Global search

Players / teams / games / props / books → deep links. No invented hits.

### Alerts right drawer

Tabs: **ALL · INJURIES · WEATHER · MARKETS · PROJECTIONS**  
Severity: **INFO · WATCH · IMPORTANT · CRITICAL**

### Data health

`Healthy` or `Degraded` plus source issues. Week 1 seed is **Degraded**: DK player-prop odds missing, NWS hourly pending, at least one SOURCE CONFLICT.

`HEALTHY` as a chip is **system/data health only**. Player availability never renders “HEALTHY” or “100% healthy” — it uses the Master Spec enum (`NO KNOWN LIMITATION`, …).

## 2. Command Center `/` (and `/dashboard`)

Desktop order:

1. Hero stats strip
2. 8 primary cards (4×2): BEST OVER · BEST UNDER · BEST TD · BEST TEAM TOTAL · BEST QB MATCHUP · BEST RB MATCHUP · BEST GAME ENVIRONMENT · BIGGEST WARNING
3. Critical news strip (decision-impacting only)
4. WHAT CHANGED SINCE LAST REFRESH — filters ALL / INJURY / PROJECTION / MARKET / WEATHER / LINEUP
5. Sunday scoreboard strip — game tiles with ENV + weather; filters 1PM / 4PM / SNF / ALL
6. Top Opportunities table
7. Top Volume
8. TD Leaders
9. Weather (material only)
10. Injuries (material only)
11. Game Environment top 5
12. Overs / Unders split
13. Parlay preview — Conservative / Balanced / Aggressive
14. My Card preview — Watching / Ready / Placed

Mobile order:

Critical Alerts → Top 5 Opportunities → My Card → TDs → Injuries → Weather → Games → Overs → Unders → Team Totals → Parlays

## 3. Routes (connected workspace)

`/dashboard` `/games` `/games/[id]` `/props` `/quarterbacks` `/running-backs` `/wide-receivers` `/tight-ends` `/touchdowns` `/team-totals` `/game-totals` `/fantasy` `/compare` `/matchups` `/weather` `/injuries` `/markets` `/parlays` `/boosts` `/my-card` `/results` `/model-performance` `/players/[id]` `/teams/[id]` `/admin` `/settings`

`/lines` remains as a redirect to `/markets`. `/` and `/dashboard` share Command Center.

## 4. Shared design system (reuse everywhere)

`PlayerCard` `GameCard` `PropRow` `PropCard` `ProjectionBadge` `ConfidenceBadge` `HealthBadge` `WeatherBadge` `MarketMovementBadge` `EdgeBadge` `EVBadge` `TDCard` `ParlayCard` `AlertRow` `ChangeRow` `StatTile` `RankingTable` `WhyDrawer` `FilterDrawer`

Health / confidence / edge / weather **must** be the same components and definitions on every page.

### Status chips (catalog)

`HEALTHY` (data-health only) · `QUESTIONABLE` · `LIMITED` · `OUT` · `DOME` · `WIND` · `RAIN` · `SNOW` · `ROLE CHANGE` · `LINE MOVE` · `STEAM` · `HIGH EDGE` · `HIGH VOLATILITY` · `LOW SAMPLE` · `SOURCE CONFLICT` · `STALE DATA`

Player `HealthBadge` still uses Master Spec states. UI `LIMITED` maps to `EXPECTED LIMITED`.

### Confidence

`A+ A A- B+ B B- C PASS`  
Week 1 seed does not award A / A+ (LOW SAMPLE + placeholder model).

### Edge units (labeled)

yards · probability edge % · EV %

### Why drawer sections

1. Model Case  
2. Supporting Factors  
3. Risk Factors  
4. Market Context  
5. Data Quality  

Plus the four lenses (GOOD PLAYER / MATCHUP / PROJECTION / BET).

## 5. Props power features

Heavy filter bar + **URL query state**. Sortable sticky table. Row expansion: floor / median / mean / ceiling, alts, books, Why.  
Actions: **STAR · ADD · WATCH · OPEN PLAYER · OPEN GAME · COMPARE · WHY**

Missing DK books/alts/distribution tails → `DATA UNAVAILABLE`, not invented ladders.

## 6. Mobile rules

Compact `PropCard`s. Filter drawer. Prefer cards over giant tables.

## 7. UX rules

- Loading: skeletons only. No fake sample rows.
- Empty: `NO PLAYS MEET FILTERS`
- Errors: clear stale timestamps
- No casino noise
- Visual priority: 1 Availability 2 Projection 3 Market price 4 Probability 5 Edge 6 Confidence 7 Matchup 8 Weather 9 Market movement 10 Explanation
- Filters in URL
- Game window switcher: ALL / EARLY / LATE / SNF (scoreboard also 1PM / 4PM / SNF / ALL)
- Final Card mode: UI exists; empty until My Card ships
- Live Sunday game states: `UPCOMING` / `LIVE` / `FINAL` — Week 1 seed is UPCOMING unless a verified live feed exists

## 8. Build phases (this PR)

| Phase | UI |
| --- | --- |
| 1 | Shell, sidebar, header, Command Center, games list/detail, player profile, mobile layout |
| 2 | Props / QB / RB / WR / TE / Injuries / Weather — tables matching column specs |
| 3 | Touchdowns tabs + table, team totals Best Over/Under, game totals open/current/move |
| 4 | Matchup BEST/WORST + factor breakdown, markets heat/timeline, My Card + alerts |
| 5 | Parlay generator, boosts Best/2nd/3rd, Final Card declutter |
| 6 | Results + model performance + admin/settings |

## 9. Reconciliation with Master Spec

- No LOCK / GUARANTEED / 100% BET
- Overs and unders stay first-class
- No unit inflation / loss chasing
- PENDING stubs stay; do not hide missing engines
- Seed data stays labeled CONSENSUS / ESTIMATE / UNAVAILABLE / SOURCE CONFLICT
