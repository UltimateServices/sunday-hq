# Sunday HQ

Private NFL Props & Parlay Intelligence Platform for UltimateServices.

`/` is a shareable **Top 10** homepage (Props / Overs / Unders / Spreads). Full research Command Center lives at `/dashboard`. Workflow: collect → verify → normalize → model → compare → rank → explain → monitor → record → learn.

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

Set these in the Vercel project → Settings → Environment Variables (Production **and** Preview). Locally: copy `.env.example` to `.env.local`. Never commit values.

| Name | Required on Vercel? | Used by | If missing |
| --- | --- | --- | --- |
| `ODDS_API_KEY` | for live tape | `POST /api/ingest/odds`, Sunday `odds` stage | Degraded snapshot. DK prices stay **DATA UNAVAILABLE**. Seed picks are **hidden**. |
| `CRON_SECRET` | **yes in production** | Vercel Cron `Authorization: Bearer`, ingest / settle / admin weight writes | Production mutating routes return 503. |
| `INGEST_SECRET` | optional alias | same mutating routes; Grok Bot can send either | Falls back to `CRON_SECRET`. |
| `BLOB_READ_WRITE_TOKEN` | recommended | persist odds / weather / weights / changelog / results on Vercel Blob | Serverless memory overlay (lost on cold start). Local `next dev` writes `data/snapshots/`. |
| `NWS_USER_AGENT` | recommended | Sunday `weather` stage (NWS requires a UA) | Uses documented default `SundayHQ/1.0 (+https://github.com/UltimateServices/sunday-hq)`. Set a real contact string in production. |

Vercel Cron (already in `vercel.json`) hits `/api/cron/sunday-refresh?stage=…`. Production must have `CRON_SECRET`. Enable Cron Jobs on the project.

Without `ODDS_API_KEY`: ingest still runs and timestamps the miss. No verified DraftKings number is invented. Home still shows the Top-10 layout with **Not live** labels. Parlays + pick boards stay hidden. Banner: **Not live — do not bet from this page.**

Tomorrow morning (keys only): [`docs/TOMORROW_GO_LIVE.md`](docs/TOMORROW_GO_LIVE.md).

## Ingest + live markets

- `POST /api/ingest/odds` — secret required in production. Pulls NFL game lines + player props from [The Odds API](https://the-odds-api.com) with `bookmakers=draftkings,fanduel,betmgm,caesars`. DraftKings is the decision book; others are compare-only.
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
| 1 | Shell, Live Home (`/`), Command Center (`/dashboard`), games, player/team deep dives | LIVE |
| 2 | Injuries, weather, position boards | LIVE |
| 3 | Props, touchdowns, team totals, game totals, fantasy | LIVE · seed engine + live DK overlay when fresh |
| 4 | Matchups, compare, market movement, alerts / What Changed | LIVE · factor engine + changelog |
| 5 | Parlays, boosts, My Card, Final Card | LIVE · PLACED lock snapshot |
| 6 | Results, model performance | LIVE · REAL vs EXAMPLE/SEED |
| 7 | Admin + settings | LIVE · weights persist to Blob / snapshots |

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
