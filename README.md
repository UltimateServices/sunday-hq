# Sunday HQ

Private NFL Props & Parlay Intelligence Platform for UltimateServices.

This is **not** a simple picks page. Workflow: collect → verify → normalize → model → compare → rank → explain → monitor → record → learn.

Binding product contract: [`docs/MASTER_SPEC.md`](docs/MASTER_SPEC.md).  
Binding UI contract: [`docs/UI_BLUEPRINT.md`](docs/UI_BLUEPRINT.md).

Live: https://sunday-hq.vercel.app (production branch `main`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Vercel (Fluid Compute) + optional [Vercel Blob](https://vercel.com/docs/vercel-blob)
- Week 1 seed in `data/week1/` (typed modules)
- Live overlay: The Odds API (DraftKings-primary) + ESPN public box scores

## Local

```bash
npm install
cp .env.example .env.local   # names only; add real secrets locally
npm run dev
```

Build check:

```bash
npm run build
```

## Environment variables

Never commit values. Set them in `.env.local` and in the Vercel project (Production / Preview).

| Name | Required | Used by |
| --- | --- | --- |
| `ODDS_API_KEY` | for live DK tape | `POST /api/ingest/odds`, Sunday `odds` stage |
| `CRON_SECRET` | production mutating routes | Vercel Cron `Authorization: Bearer` |
| `INGEST_SECRET` | optional alias | same routes; Grok Bot can send either |
| `BLOB_READ_WRITE_TOKEN` | optional | persist snapshots on Vercel Blob |
| `NWS_USER_AGENT` | optional | Sunday `weather` stage (NWS requires UA) |

Without `ODDS_API_KEY`: ingest still runs, writes a **Degraded** snapshot, and every missing DK price stays **DATA UNAVAILABLE** with timestamps. No verified DraftKings number is invented.

Without Blob: serverless uses an in-memory overlay (warm instance only) plus `GET /api/markets/live`. Local `next dev` also writes gitignored files under `data/snapshots/`.

## Ingest + live markets

- `POST /api/ingest/odds` — secret required in production. Pulls NFL game lines + player props from [The Odds API](https://the-odds-api.com) with `bookmakers=draftkings`.
- `GET /api/markets/live` — public overlay. Markets / Props / game totals prefer a **fresh** snapshot (3 hours). Else seed + stale warning.

```bash
curl -X POST "$URL/api/ingest/odds" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Quota note: game odds are one call; each Sunday slate event then requests player-prop markets. Watch The Odds API remaining-credits header.

## Settlement + CLV

Source (public, no secret): ESPN site API

- Scoreboard: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`
- Box score: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event={id}`

`POST /api/settle/week` (secret) grades PLACED tickets (seed + `/api/card/lock`) against FINAL box scores.

- Closing line = last **pre-kick** DraftKings snapshot (not a guessed close).
- CLV (yards / TD units): OVER `close − taken`, UNDER `taken − close`. Missing snapshot → CLV **DATA UNAVAILABLE**.
- Results + Model Performance keep **REAL** and **EXAMPLE/SEED** in separate buckets.

My Card **PLACED** writes a lock snapshot: line, odds, projection, confidence, health, weather.

## Sunday refresh + crons

`vercel.json` registers UTC cron jobs. Docs assume **EDT = UTC−4** (Week 1 Sunday 2026-09-13):

| ET (EDT) | UTC | Stage |
| --- | --- | --- |
| Sun 11:00 AM | 15:00 | `slate` |
| Sun 11:05 AM | 15:05 | `injuries` |
| Sun 11:10 AM | 15:10 | `weather` |
| Sun 12:00 PM | 16:00 | `odds` (pre-1PM) |
| Sun 12:15 PM | 16:15 | `projections` |
| Sun 3:00 PM | 19:00 | `odds` (pre-late) |
| Sun 7:00 PM | 23:00 | `odds` (pre-SNF) |
| Mon 8:00 AM | 12:00 | `settle` |
| Mon 10:00 AM | 14:00 | `monday-learn` |

Endpoint (Vercel Cron = GET, Grok Bot = POST):

`/api/cron/sunday-refresh?stage=slate|injuries|weather|odds|projections|settle|monday-learn`

Stages are idempotent (fingerprint). They append What Changed / Alerts. `/admin` Sunday routine reads **real last-run metadata**, not a fake DONE clock.

Vercel also sends `x-vercel-cron-schedule`; the handler maps that schedule to a stage if the query string is dropped.

### Grok Bot

Post the same paths with the shared secret. Do not put the secret in the repo or in a chat log.

```bash
# Odds ingest
curl -X POST "$URL/api/ingest/odds" \
  -H "Authorization: Bearer $INGEST_SECRET"

# Any Sunday stage
curl -X POST "$URL/api/cron/sunday-refresh?stage=odds" \
  -H "Authorization: Bearer $CRON_SECRET"

# Week settle
curl -X POST "$URL/api/settle/week" \
  -H "x-ingest-secret: $INGEST_SECRET"
```

Suggested Grok routines: `slate` → `injuries` → `weather` → `odds` → `projections` before 1PM ET; `odds` again before late / SNF; `settle` then `monday-learn` Monday morning.

## Phase status

| Phase | Surface | Status |
| --- | --- | --- |
| 1 | Shell, Command Center, games, player/team deep dives | LIVE |
| 2 | Injuries, weather, position boards | LIVE |
| 3 | Props, touchdowns, team totals, game totals, fantasy | LIVE · seed engine + live DK overlay when fresh |
| 4 | Matchups, market movement, alerts / What Changed | LIVE · changelog from refresh |
| 5 | Parlays, boosts, My Card, Final Card | LIVE · PLACED lock snapshot |
| 6 | Results, model performance | LIVE · REAL vs EXAMPLE/SEED |
| 7 | Admin + settings | LIVE · ingest last success/failure |

## Data honesty

- Game spreads/totals: seed = DraftKings via ESPN schedule widget (2026-09-13). Live overlay = DraftKings via The Odds API when the key works.
- Player props: seed CONSENSUS / ESTIMATE. Live DK odds only when The Odds API returns them.
- Assumed -110 appears only as labeled estimate for ranking — never as a DK price.
- Quality flags: VERIFIED, CONSENSUS, ESTIMATE, UNAVAILABLE, STALE, SOURCE CONFLICT, LOW SAMPLE.
- Results / calibration: EXAMPLE/SEED stay labeled. REAL rows require a FINAL ESPN box score.
- No LOCK / GUARANTEED / 100% healthy language.

Secrets never belong in this repo.

## Deploy on Vercel

1. Import `UltimateServices/sunday-hq` (Framework Preset: Next.js).
2. Root directory: repo root. Build command: `npm run build`.
3. Add secrets in the Vercel dashboard only (`ODDS_API_KEY`, `CRON_SECRET`, optional `INGEST_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NWS_USER_AGENT`).
4. Enable Cron Jobs on the project (Pro for multiple Sunday windows).
5. Production branch: `main`.

Hobby plans limit cron count — keep the `odds` / `settle` windows if you must trim.

Future: a Fade Board (`/fade`, handicapper-webhook singles) is parked — not in this ship.
