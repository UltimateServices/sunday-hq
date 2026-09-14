export function hasOddsApiKey(): boolean {
  return Boolean(process.env.ODDS_API_KEY?.trim());
}

export function oddsApiKey(): string | null {
  return process.env.ODDS_API_KEY?.trim() || null;
}

export function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export const DEFAULT_NWS_USER_AGENT = "SundayHQ/1.0 (+https://github.com/UltimateServices/sunday-hq)";

/** NWS requires a User-Agent. Prefer NWS_USER_AGENT; otherwise the documented default contact string. */
export function nwsUserAgent(): string {
  return process.env.NWS_USER_AGENT?.trim() || DEFAULT_NWS_USER_AGENT;
}

export function usingDefaultNwsAgent(): boolean {
  return !process.env.NWS_USER_AGENT?.trim();
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
