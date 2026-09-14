# Tomorrow — plug in keys and verify live tape

Desk-only. Code on `main` is already key-ready. **Do not invent a DraftKings price.** If a pull fails, the site stays “Not live — do not bet from this page.”

Production: https://sunday-hq.vercel.app  
Vercel project: the Sunday HQ project that deploys from `main`.

---

## 1. The Odds API (paid credits)

1. Sign in at https://the-odds-api.com
2. Use a **paid** plan with remaining credits (NFL game lines + per-event player props).
3. Copy the API key from the dashboard.
4. Do not paste the key into Slack, GitHub, or this repo.

## 2. Generate `CRON_SECRET`

Any long random string. On the desk Mac:

```bash
openssl rand -hex 32
```

Copy the output once. That value is `CRON_SECRET`. Optional alias: set the same value as `INGEST_SECRET`.

## 3. Set Vercel env vars

Vercel → Sunday HQ project → **Settings → Environment Variables**.

Add each **name** below to **Production and Preview** (and Development if you use `vercel env pull`):

| Name | Required? | Value |
| --- | --- | --- |
| `ODDS_API_KEY` | **Yes** for live tape | The Odds API key |
| `CRON_SECRET` | **Yes** in production | The openssl string |
| `INGEST_SECRET` | Optional | Same as `CRON_SECRET` if you want a Grok/curl alias |
| `BLOB_READ_WRITE_TOKEN` | Recommended | Vercel Blob read-write token so snapshots survive deploys |
| `NWS_USER_AGENT` | Optional | `SundayHQ/1.0 (+mailto:you@ultimateservices.us)` |

Never commit values. The Admin and Settings pages show **Set / Missing** only.

After saving variables: **Redeploy** Production (Deployments → ⋯ → Redeploy) so the new env is in the lambda.

## 4. Optional Blob

Without Blob, odds snapshots sit in serverless memory and can vanish on cold start. For tomorrow morning:

1. Vercel → Storage → Blob → create store if needed.
2. Attach to the project. Vercel usually injects `BLOB_READ_WRITE_TOKEN`.
3. Redeploy.

## 5. Trigger ingest

Vercel Cron will fire on the Sunday schedule automatically **once `CRON_SECRET` is set**. Do not wait for Sunday to verify the key.

From the desk (replace URL and secret; do not log the secret):

```bash
curl -X POST "https://sunday-hq.vercel.app/api/ingest/odds" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Or:

```bash
curl -X POST "https://sunday-hq.vercel.app/api/cron/sunday-refresh?stage=odds" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Expect JSON `snapshot.status: "LIVE"` and a non-zero `props` count. If the key is missing, ingest still runs and writes a **DEGRADED** snapshot — no fake DK number.

## 6. Verify the site

Open https://sunday-hq.vercel.app

| You should see | You should not see |
| --- | --- |
| Banner: **Live DraftKings tape** | **Not live — do not bet from this page.** |
| Ranked singles on Home | Seed parlays / seed ATD clusters as tickets |
| `/admin` keys marked **Set** | A invented American odds on a prop |

If the banner is still “Not live”:

1. Confirm env is on **Production** (not only Preview).
2. Confirm you **redeployed** after saving.
3. Re-run ingest. Check `/admin` → Data Health → last success / last failure note.
4. Confirm The Odds API has credits and NFL is in-season.

## 7. What is already wired (no code tomorrow)

- `POST /api/ingest/odds` — The Odds API, DraftKings-primary, FanDuel/BetMGM/Caesars compare-only.
- `GET/POST /api/cron/sunday-refresh?stage=…` — slate, injuries, weather, odds, projections, settle, monday-learn.
- `vercel.json` Sunday/Monday UTC crons (Bearer = `CRON_SECRET`).
- Live gate: homepage, parlays, props, TDs, boosts, compare, team/game totals, Command Center pick cards stay **hidden** until `oddsFresh && snapshot.status === "LIVE"`.
- NWS weather runs with a documented default User-Agent if `NWS_USER_AGENT` is unset.
- Fade Board stays **PARKED**.

## 8. Honesty

Missing key or stale tape → no verified DraftKings price is invented. Assumed −110 stays labeled **ESTIMATE** and is ranking-only after tape is live.
