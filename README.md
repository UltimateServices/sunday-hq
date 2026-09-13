# Sunday HQ

Private NFL Props & Parlay Intelligence Platform for UltimateServices.

This is **not** a simple picks page. Workflow: collect → verify → normalize → model → compare → rank → explain → monitor → record → learn.

Binding product contract: [`docs/MASTER_SPEC.md`](docs/MASTER_SPEC.md).  
Binding UI contract: [`docs/UI_BLUEPRINT.md`](docs/UI_BLUEPRINT.md).

Live: https://sunday-hq.vercel.app (production branch `main`).

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Vercel
- Week 1 seed in `data/week1/` (typed modules, not a live book feed)

## Local

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Phase status

| Phase | Surface | Status |
| --- | --- | --- |
| 1 | Shell, Command Center, games, player/team deep dives | LIVE |
| 2 | Injuries, weather, position boards | LIVE |
| 3 | Props, touchdowns, team totals, game totals, fantasy | LIVE · seed / ESTIMATE engine |
| 4 | Matchups, market movement, alerts / What Changed | LIVE · LOW SAMPLE factors |
| 5 | Parlays, boosts, My Card, Final Card | LIVE · seed constructs |
| 6 | Results, model performance | LIVE · EXAMPLE/SEED until settle |
| 7 | Admin + settings | LIVE · no secrets in repo |

Primary nav destinations are usable with the Week 1 Sunday 2026-09-13 seed. Missing live ingest (DK player-prop odds, NWS hourly, trained CDF) stays labeled CONSENSUS / ESTIMATE / UNAVAILABLE — it is not hidden behind empty PENDING stubs.

## Data honesty

- Game spreads/totals: DraftKings via ESPN schedule widget, captured 2026-09-13.
- Player props: consensus / estimate from the Week 1 seed. **DK player-prop odds are not ingested.**
- Assumed -110 appears only as labeled estimate for ranking — never as a DK price.
- Quality flags: VERIFIED, CONSENSUS, ESTIMATE, UNAVAILABLE, STALE, SOURCE CONFLICT, LOW SAMPLE.
- Results / calibration tables are marked EXAMPLE or SEED. Week 1 Sunday is not settled.

Secrets never belong in this repo. Copy `.env.example` locally when ingest keys exist.

## Deploy on Vercel

1. Import `UltimateServices/sunday-hq` as a Vercel project (Framework Preset: Next.js).
2. Root directory: repo root. Build command: `npm run build`. Output: Next.js default.
3. Do **not** add fabricated “demo odds” env vars. When DK/NWS ingest exists, add those secrets in the Vercel dashboard only.
4. Production branch: `main`. Merges to `main` auto-deploy when Git is connected.

Optional CLI (already logged-in machines):

```bash
npx vercel --prod
```
