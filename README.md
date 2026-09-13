# Sunday HQ

Private NFL Props & Parlay Intelligence Platform for UltimateServices.

This is **not** a simple picks page. Workflow: collect → verify → normalize → model → compare → rank → explain → monitor → record → learn.

Binding product contract: [`docs/MASTER_SPEC.md`](docs/MASTER_SPEC.md).  
Binding UI contract: [`docs/UI_BLUEPRINT.md`](docs/UI_BLUEPRINT.md).

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

## What is live vs pending

- **Live:** Command Center, games, game/player deep dives, injuries, weather, game totals, lines, position boards (placeholder projections).
- **Pending (routes exist):** full props EV engine, matchup engines, parlays/boosts/My Card, results/CLV/calibration, alerts/admin weights.

Missing capabilities are empty boards marked **PENDING**. The IA is not redesigned around them.

## Data honesty

- Game spreads/totals: DraftKings via ESPN schedule widget, captured 2026-09-13.
- Player props: consensus / estimate from the Week 1 seed. **DK player-prop odds are not ingested.**
- Assumed -110 appears only as labeled estimate for ranking — never as a DK price.
- Quality flags: VERIFIED, CONSENSUS, ESTIMATE, UNAVAILABLE, STALE, SOURCE CONFLICT, LOW SAMPLE.

Secrets never belong in this repo. Copy `.env.example` locally when ingest keys exist.

## Deploy on Vercel

1. Import `UltimateServices/sunday-hq` as a Vercel project (Framework Preset: Next.js).
2. Root directory: repo root. Build command: `npm run build`. Output: Next.js default.
3. Do **not** add fabricated “demo odds” env vars. When DK/NWS ingest exists, add those secrets in the Vercel dashboard only.
4. Production branch: `main`. This foundation PR should merge to `main`, then Vercel deploys automatically if Git is connected.
5. After merge: confirm `/` Command Center renders Week 1 Sunday 2026-09-13 and that stub routes (`/parlays`, `/boosts`, `/my-card`, `/results`, `/model-performance`, `/admin`) show PENDING panels.

Optional CLI (already logged-in machines):

```bash
npx vercel --prod
```
