import {
  hasBlobToken,
  hasOddsApiKey,
  usingDefaultNwsAgent,
  configuredSecrets,
} from "@/lib/ingest/env";

export type EnvCheckId = "ODDS_API_KEY" | "CRON_SECRET" | "BLOB_READ_WRITE_TOKEN" | "NWS_USER_AGENT";

export type EnvCheck = {
  id: EnvCheckId;
  name: string;
  requiredForLive: boolean;
  present: boolean;
  purpose: string;
  ifMissing: string;
  where: string;
};

/** Names only — never return secret values. */
export function envChecklist(): EnvCheck[] {
  const cronPresent = configuredSecrets().length > 0;
  return [
    {
      id: "ODDS_API_KEY",
      name: "ODDS_API_KEY",
      requiredForLive: true,
      present: hasOddsApiKey(),
      purpose: "The Odds API — DraftKings-primary NFL game lines and player props.",
      ifMissing: "Tape stays seed/ESTIMATE. Homepage, parlays, and pick boards stay hidden.",
      where: "Vercel → Project → Settings → Environment Variables → Production and Preview",
    },
    {
      id: "CRON_SECRET",
      name: "CRON_SECRET",
      requiredForLive: true,
      present: cronPresent,
      purpose: "Authorizes Vercel Cron and POST ingest / settle. Any long random string.",
      ifMissing: "Production mutating routes return 503. Ingest cannot run on Vercel.",
      where: "Vercel → Project → Settings → Environment Variables → Production and Preview",
    },
    {
      id: "BLOB_READ_WRITE_TOKEN",
      name: "BLOB_READ_WRITE_TOKEN",
      requiredForLive: false,
      present: hasBlobToken(),
      purpose: "Persist odds / weather / weights / results on Vercel Blob across deploys.",
      ifMissing: "Snapshots live in serverless memory and can vanish on cold start.",
      where: "Vercel → Storage → Blob → token, or Project env vars",
    },
    {
      id: "NWS_USER_AGENT",
      name: "NWS_USER_AGENT",
      requiredForLive: false,
      present: !usingDefaultNwsAgent(),
      purpose: "NWS hourly weather User-Agent (app name + contact). Optional; a documented default is used.",
      ifMissing: "Weather still runs with SundayHQ/1.0 default UA. Set a real contact string for production.",
      where: "Vercel → Project → Settings → Environment Variables",
    },
  ];
}

export function missingRequiredEnv(checks = envChecklist()): EnvCheck[] {
  return checks.filter((row) => row.requiredForLive && !row.present);
}
