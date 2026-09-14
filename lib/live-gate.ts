import { hasOddsApiKey } from "@/lib/ingest/env";
import type { SnapshotStatus } from "@/lib/ingest/types";

export type LiveGateReason = "LIVE" | "STALE" | "NO_KEY" | "DEGRADED";

export type LiveGate = {
  /** Fresh DraftKings tape only. Seed / stale / missing key are never actionable. */
  actionable: boolean;
  reason: LiveGateReason;
  headline: string;
  body: string;
  keyConfigured: boolean;
};

export function buildLiveGate(input: {
  oddsFresh: boolean;
  snapshotStatus: SnapshotStatus | null;
  keyConfigured?: boolean;
}): LiveGate {
  const keyConfigured = input.keyConfigured ?? hasOddsApiKey();
  if (input.oddsFresh && input.snapshotStatus === "LIVE") {
    return {
      actionable: true,
      reason: "LIVE",
      headline: "Live DraftKings tape",
      body: "Prices on this page came from the last fresh pull. Still research — not a guarantee.",
      keyConfigured,
    };
  }
  if (input.snapshotStatus === "LIVE") {
    return {
      actionable: false,
      reason: "STALE",
      headline: "Not live — do not bet from this page.",
      body: "The last DraftKings snapshot is stale. Seed and old numbers are hidden so they cannot look like tickets.",
      keyConfigured,
    };
  }
  if (!keyConfigured) {
    return {
      actionable: false,
      reason: "NO_KEY",
      headline: "Not live — do not bet from this page.",
      body: "Live prices are not connected. Seed parlays and props are hidden. Add ODDS_API_KEY in Vercel, then run the odds refresh.",
      keyConfigured,
    };
  }
  return {
    actionable: false,
    reason: "DEGRADED",
    headline: "Not live — do not bet from this page.",
    body: "The Odds API key is set but no fresh DraftKings tape landed. Seed research is hidden so it cannot look like a pick.",
    keyConfigured,
  };
}
