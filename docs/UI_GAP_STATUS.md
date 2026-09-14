# Sunday HQ — UI gap status vs 140-item bible

Source: Dylan page-by-page UI blueprint (PR #9 / `docs/UI_BLUEPRINT_PAGE_BY_PAGE.md`).
Product overrides: `/` = Top-10 Home · `/dashboard` = Command Center · live-gate · no fake DK prices · Fade Board parked.

Status: **DONE** ships the item · **PARTIAL** scaffold exists · **MISSING** not started · **PARKED** out of this ship.

Updated after PR #9 merged (`docs/UI_BLUEPRINT_PAGE_BY_PAGE.md` + full `docs/MASTER_BUILD_SPEC.md` on `main`). This tracker is coverage, not a second spec.

## Build phases

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Shell, Home, Command Center, Games, player pages, mobile | LIVE · this PR fills header / CMD+K / games desk |
| 2 | Props, QB, RB, WR, TE, Injuries, Weather | LIVE · this PR adds filters, top cards, roles, meaningful weather |
| 3 | TD, Team Totals, Game Totals, Matchups, Fantasy | LIVE · this PR adds TD hero; totals columns still thin |
| 4 | Markets, My Card, Alerts, change tracking | LIVE · this PR adds market hero cards |
| 5 | Parlays, Boosts, Final Card | LIVE · seed constructs; live-gated |
| 6 | Results, Model Performance, Admin | LIVE · REAL vs EXAMPLE; charts still thin |

## Items 1–140

| # | Item | Status | Notes |
| --- | --- | --- | --- |
| 1 | Global app shell | DONE | Sidebar + header + main + drawers |
| 2 | Left sidebar | DONE | Labels + collapse; Home + Command Center (product override) |
| 3 | Mobile nav | DONE | HOME / GAMES / PROPS / MY CARD / MORE |
| 4 | Global top header | DONE | Next refresh + data health + window switcher + Notifications |
| 5 | Global search | DONE | Players / teams / games / props / books |
| 6 | Alert panel tabs | DONE | ALL / INJURIES / WEATHER / MARKETS / PROJECTIONS |
| 7 | Alert severity | DONE | INFO / WATCH / IMPORTANT / CRITICAL |
| 8 | Refresh + data health | DONE | Degraded/Healthy + next cron attempt |
| 9 | Command Center page | DONE | `/dashboard` |
| 10 | CC hero | PARTIAL | Stat tiles; not every bible count |
| 11 | 8 primary cards | PARTIAL | Labels live; gated when not live |
| 12 | Critical news | DONE | |
| 13 | What changed | DONE | Six filters |
| 14 | Scoreboard strip | PARTIAL | Window filters; env still a tier not 0–100 on the strip |
| 15 | Top opportunities | PARTIAL | Live-gated table |
| 16 | Top volume | PARTIAL | HIGH tag only; no ELITE scale |
| 17 | TD leaders | PARTIAL | Cards; RZ columns thin |
| 18 | CC weather | PARTIAL | Material-only |
| 19 | CC injuries | DONE | Material + beneficiaries |
| 20 | Game environment top 5 | PARTIAL | By posted total |
| 21 | Overs / unders split | PARTIAL | Not capped at 5 |
| 22 | Parlay preview | PARTIAL | Live-gated |
| 23 | My Card preview | PARTIAL | Counts |
| 24 | Games page filters | DONE | This PR: ALL / EARLY / LATE / SNF |
| 25 | Game card fields | PARTIAL | This PR: injury count, best prop, primary risk |
| 26 | Game card expansion | DONE | This PR: script / env / factors |
| 27 | Individual game page | PARTIAL | This PR: env 0–100, script bars, factors, player table, best bets, seed moves |
| 28 | Game env 0–100 | DONE | ESTIMATE from posted total + weather + QB flag |
| 29 | Game script viz | PARTIAL | This PR: P(win) / P(close) bars — ESTIMATE |
| 30 | Key factors | DONE | This PR: + / − from seed facts only |
| 31 | Game player table | PARTIAL | This PR: ALL / QB / RB / WR / TE from slate roster + seeded props |
| 32 | Game best bets | PARTIAL | This PR: overs / unders / TDs / team-total lean; no live DK ticket |
| 33 | Game market movement | PARTIAL | Seed `MARKET_MOVES` only; player-prop tape UNAVAILABLE |
| 34 | Props filters | PARTIAL | This PR: quick chips + more URL keys |
| 35 | Prop table | PARTIAL | Sticky; header sort still thin |
| 36 | Prop row expansion | PARTIAL | Floor/median/mean/ceiling; alts UNAVAILABLE |
| 37 | Prop actions | PARTIAL | STAR / ADD / WATCH / Player / Game / Compare |
| 38 | QB top cards | DONE | This PR: derived from seed props / matchups |
| 39 | QB table columns | PARTIAL | Still shared RankingTable |
| 40 | QB detail drawer | MISSING | Use player deep dive |
| 41 | RB top cards | DONE | This PR |
| 42 | RB table columns | PARTIAL | Shared table |
| 43 | RB role badges | DONE | Derived from depth + seed notes only |
| 44 | WR top cards | DONE | This PR |
| 45 | WR table | PARTIAL | Shared table |
| 46 | WR matchup drawer | PARTIAL | Opens existing matchup factors; labeled script proxy |
| 47 | TE table / cards | PARTIAL | Top cards + shared table |
| 48 | TD hero | DONE | This PR: top candidate card |
| 49 | TD table | PARTIAL | Tabs exist; RZ cols thin |
| 50 | TD expansion | DONE | This PR: Why drawer on hero + table |
| 51 | Team totals heroes | PARTIAL | Best Over / Under |
| 52 | Team total table | PARTIAL | |
| 53 | Team total detail | PARTIAL | |
| 54 | Game totals table | PARTIAL | |
| 55 | Fantasy tabs | DONE | |
| 56 | High disagreement | DONE | |
| 57 | Matchups positions | PARTIAL | No OL-DL |
| 58 | Best / worst | DONE | |
| 59 | Matchup deep dive | DONE | |
| 60 | Weather meaningful-first | DONE | This PR |
| 61 | Weather card | PARTIAL | Gusts / snow / humidity often UNAVAILABLE |
| 62 | Weather timeline | PARTIAL | Kickoff row + Q2–Q4 DATA UNAVAILABLE (no hourly store) |
| 63 | Injuries filters | DONE | This PR: TEAM / POS / STATUS / IMPACT / GAME |
| 64 | Injury table | PARTIAL | Cards with practice-trend from seed copy only |
| 65 | Injury downstream | DONE | Beneficiaries listed |
| 66 | Markets top cards | DONE | This PR: largest move / most active / reverse / quiet |
| 67 | Market table | PARTIAL | Game cards, not full player tape |
| 68 | Market timeline | DONE | Drawer |
| 69 | Parlay controls | PARTIAL | |
| 70 | Parlay output | PARTIAL | Live-gated |
| 71 | Parlay legs | PARTIAL | |
| 72 | Parlay script | DONE | |
| 73 | Correlation visual | PARTIAL | Chip, not matrix |
| 74 | Boost controls | PARTIAL | |
| 75 | Boost Best/2nd/3rd | PARTIAL | Seed titles; flat list |
| 76 | My Card tabs | DONE | |
| 77 | My Card bet row | PARTIAL | |
| 78 | Change warnings | DONE | |
| 79 | Bet entry | PARTIAL | Units + Place |
| 80 | Results summary | PARTIAL | |
| 81 | Results filters | PARTIAL | |
| 82 | Results CLV table | DONE | |
| 83 | Model perf summary | PARTIAL | |
| 84 | Performance charts | MISSING | Calibration bars only |
| 85 | Calibration buckets | DONE | |
| 86 | Player profile header | PARTIAL | No photo |
| 87 | Player tabs | DONE | This PR: shell + UNAVAILABLE empty tabs |
| 88 | Player overview | PARTIAL | Fantasy 3-pack |
| 89 | Player usage | MISSING | Empty tab — no usage series in seed |
| 90 | Player prop history | MISSING | Empty tab — Week 1 only |
| 91 | Team page header | PARTIAL | This PR: implied total + injury count |
| 92 | Team tabs | PARTIAL | This PR: Overview / Players / Injuries |
| 93 | Admin sections | DONE | |
| 94 | Model weights | PARTIAL | |
| 95 | Thresholds | PARTIAL | |
| 96 | Sunday routine | PARTIAL | No RUN NOW |
| 97 | Data health | DONE | |
| 98 | Mobile CC order | DONE | |
| 99 | Mobile prop card | DONE | |
| 100 | Mobile swipes | MISSING | Optional; buttons remain |
| 101 | Table behavior | PARTIAL | Sticky; no column picker |
| 102 | Mobile filter drawer | DONE | |
| 103 | Standard badges | DONE | + RB role badges |
| 104 | Confidence | DONE | Week 1 never awards A / A+ |
| 105 | Edge display | DONE | Edge/EV prefix on badges; assumed −110 labeled ESTIMATE |
| 106 | Tooltips | DONE | This PR: InfoTip glossary |
| 107 | Why standard | DONE | Five sections |
| 108 | Data quality HIGH/MED/LOW | PARTIAL | Domain enum, not that three-tier UI |
| 109 | Visual priority | PARTIAL | |
| 110 | Empty states | DONE | |
| 111 | Loading skeletons | PARTIAL | Root + props |
| 112 | Errors + retry | DONE | This PR: `app/error.tsx` |
| 113 | Cached marked stale | PARTIAL | Live-gate + stale warning |
| 114 | URL state | DONE | Props + games window |
| 115 | Saved views | MISSING | |
| 116 | Quick filters | DONE | This PR on Props |
| 117 | Favorites | PARTIAL | This PR persists stars |
| 118 | Game window switcher | DONE | Header + Games + Props + CC scoreboard |
| 119 | Final Card mode | DONE | |
| 120 | Live Sunday mode | PARTIAL | Per-game UPCOMING / LIVE / FINAL |
| 121 | Locked bet snapshot | DONE | |
| 122 | Player comparison | DONE | `/compare?mode=players` 2–4; usage/DK odds UNAVAILABLE |
| 123 | Prop comparison | DONE | Posted line labeled; DK odds row stays DATA UNAVAILABLE until tape |
| 124 | Game comparison | PARKED | Optional later |
| 125 | Command palette | DONE | This PR: ⌘/Ctrl+K |
| 126 | Notification center | DONE | Unread/All inbox; kinds only; no invented fade alerts |
| 127 | My Card negative alert | PARTIAL | Review chips |
| 128 | My Card positive alert | PARTIAL | Review chips |
| 129 | Sunday timeline | PARTIAL | Next refresh label; not a milestone strip |
| 130 | Reusable DS | DONE | |
| 131 | Consistency | PARTIAL | Dead layout files removed |
| 132 | Performance | PARTIAL | |
| 133 | CC load priority | PARTIAL | |
| 134 | Accessibility | PARTIAL | Dialog roles; no focus trap |
| 135 | No visual noise | DONE | |
| 136–140 | Sunday journeys | PARTIAL | Window switcher now global; live tape still tomorrow |

## Still open (do not invent)

- Live DK player-prop odds / alts / multi-book tape (Odds API tomorrow — do not wire as live)
- Saved views (sibling PR #14)
- Position-specific column sets + QB/WR drawers as dedicated tables
- Performance charts, RUN NOW admin, swipe gestures
- Fade Board (parked until after live accuracy)
- Full MASTER BUILD SPEC body — **on main via PR #9**. Do not overwrite.
