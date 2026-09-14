# Snapshot overlay (serverless-safe)

Live ingest cannot write the Next.js repo on Vercel.

Resolution order:

1. **Vercel Blob** when `BLOB_READ_WRITE_TOKEN` is set (`sunday-hq/*.json`, private).
2. **In-memory overlay** on the current function instance (warm-only).
3. **Local files here** during `next dev` (`odds-latest.json`, `ops.json`, …). These JSON files are gitignored.

`GET /api/markets/live` is the public overlay. Markets / Props prefer a **fresh** live snapshot; otherwise they render the Week 1 seed plus a stale / DATA UNAVAILABLE warning.

Never commit invented DraftKings prices.
