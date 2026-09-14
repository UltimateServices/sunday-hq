export function hasOddsApiKey(): boolean {
  return Boolean(process.env.ODDS_API_KEY?.trim());
}

export function oddsApiKey(): string | null {
  return process.env.ODDS_API_KEY?.trim() || null;
}

export function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function nwsUserAgent(): string | null {
  return process.env.NWS_USER_AGENT?.trim() || null;
}

export function configuredSecrets(): string[] {
  return [process.env.CRON_SECRET, process.env.INGEST_SECRET]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
}

export function isProductionRuntime(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}
