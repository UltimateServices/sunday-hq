import { DATA_HEALTH } from "@/lib/refresh";
import type { SundayRoutineStep } from "@/lib/types/domain";
import { nextRefreshLabel, STAGE_WINDOWS } from "@/lib/refresh/windows";
import { readJson, storeBackend, writeJson } from "./store";
import { FRESH_MS, STORE_KEYS, type DataHealthView, type OpsSnapshot, type PublicOps, type StageRun, type SundayStage } from "./types";
import { readOddsSnapshot } from "./store";
import { readChangelog } from "./changelog";
import { WEEK1_META } from "@/data/week1/meta";
import type { WeatherSnapshot } from "@/lib/weather/nws";
import { hasOddsApiKey } from "./env";
import { buildLiveGate } from "@/lib/live-gate";
import { envChecklist } from "@/lib/env-status";

const STAGES: SundayStage[] = ["slate", "injuries", "weather", "odds", "projections", "settle", "monday-learn"];

function emptyStage(stage: SundayStage): StageRun {
  return {
    stage,
    lastRunAt: null,
    lastStatus: "NEVER",
    lastNote: "No Sunday refresh run recorded.",
    lastFingerprint: null,
  };
}

export function emptyOps(): OpsSnapshot {
  return {
    asOf: new Date().toISOString(),
    ingest: {
      lastSuccessAt: null,
      lastFailureAt: null,
      lastFailureNote: null,
      lastAttemptAt: null,
      source: "none",
      remaining: null,
    },
    storage: storeBackend(),
    stages: Object.fromEntries(STAGES.map((stage) => [stage, emptyStage(stage)])) as OpsSnapshot["stages"],
  };
}

export async function readOps(): Promise<OpsSnapshot> {
  return (await readJson<OpsSnapshot>(STORE_KEYS.ops)) ?? emptyOps();
}

export async function writeOps(ops: OpsSnapshot): Promise<void> {
  ops.asOf = new Date().toISOString();
  ops.storage = storeBackend();
  await writeJson(STORE_KEYS.ops, ops);
}

export async function recordStage(input: {
  stage: SundayStage;
  status: StageRun["lastStatus"];
  note: string;
  fingerprint: string;
}): Promise<OpsSnapshot> {
  const ops = await readOps();
  ops.stages[input.stage] = {
    stage: input.stage,
    lastRunAt: new Date().toISOString(),
    lastStatus: input.status,
    lastNote: input.note,
    lastFingerprint: input.fingerprint,
  };
  await writeOps(ops);
  return ops;
}

export async function recordIngestMeta(input: {
  success: boolean;
  note: string;
  source: string;
  remaining: number | null;
}): Promise<void> {
  const ops = await readOps();
  const now = new Date().toISOString();
  ops.ingest.lastAttemptAt = now;
  ops.ingest.source = input.source;
  ops.ingest.remaining = input.remaining;
  if (input.success) {
    ops.ingest.lastSuccessAt = now;
  } else {
    ops.ingest.lastFailureAt = now;
    ops.ingest.lastFailureNote = input.note;
  }
  await writeOps(ops);
}

const ROUTINE_MAP: Array<{ id: string; label: string; stage: SundayStage | null; fallbackNote: string }> = [
  { id: "r1", label: "Collect slate + DK game lines", stage: "slate", fallbackNote: "Seed slate loaded. Live slate refresh pending." },
  { id: "r2", label: "Verify inactives / conflicts", stage: "injuries", fallbackNote: "Seed inactives. Live injury pull pending." },
  { id: "r3", label: "Normalize health + markets", stage: "odds", fallbackNote: "Enum applied on seed. Live DK normalize pending." },
  { id: "r4", label: "Model vs consensus", stage: "projections", fallbackNote: "Placeholder CDF. Live projection stamp pending." },
  { id: "r5", label: "Rank + explain", stage: null, fallbackNote: "Why drawers stay live on every board." },
  { id: "r6", label: "Monitor movement / weather", stage: "weather", fallbackNote: "NWS hourly pending unless a refresh wrote metadata." },
  { id: "r7", label: "Record card", stage: null, fallbackNote: "PLACED lock snapshot is live. Units only." },
  { id: "r8", label: "Learn (CLV / calibration)", stage: "monday-learn", fallbackNote: "REAL buckets only after settle." },
];

export function routineFromOps(ops: OpsSnapshot): SundayRoutineStep[] {
  return ROUTINE_MAP.map((row) => {
    if (!row.stage) {
      return {
        id: row.id,
        label: row.label,
        status: "LIVE",
        at: ops.asOf ?? WEEK1_META.lastUpdatedIso,
        note: row.fallbackNote,
      };
    }
    const run = ops.stages[row.stage];
    if (!run || run.lastStatus === "NEVER") {
      return {
        id: row.id,
        label: row.label,
        status: "PENDING",
        at: null,
        note: row.fallbackNote,
      };
    }
    return {
      id: row.id,
      label: row.label,
      status: run.lastStatus === "OK" ? "DONE" : run.lastStatus === "DEGRADED" ? "LIVE" : "PENDING",
      at: run.lastRunAt,
      note: run.lastNote,
    };
  });
}

export async function buildHealth(): Promise<DataHealthView> {
  const [ops, snapshot, weather] = await Promise.all([
    readOps(),
    readOddsSnapshot(),
    readJson<WeatherSnapshot>(STORE_KEYS.weather),
  ]);
  const issues = [...DATA_HEALTH.issues];
  if (!snapshot || snapshot.status !== "LIVE") {
    issues[0] = snapshot?.note || "DraftKings player-prop odds not ingested";
  } else {
    const idx = issues.findIndex((issue) => issue.toLowerCase().includes("player-prop"));
    if (idx >= 0) issues.splice(idx, 1);
  }
  if (weather?.status === "LIVE") {
    const wxIdx = issues.findIndex((issue) => issue.toLowerCase().includes("nws"));
    if (wxIdx >= 0) issues.splice(wxIdx, 1);
  }
  const failureNote = ops.ingest.lastFailureNote;
  if (
    failureNote &&
    ops.ingest.lastFailureAt &&
    (!ops.ingest.lastSuccessAt || ops.ingest.lastFailureAt > ops.ingest.lastSuccessAt) &&
    !issues.includes(failureNote)
  ) {
    issues.push(`Last ingest failure: ${failureNote}`);
  }
  if (snapshot?.freshness === "STALE") issues.push("Live odds snapshot is STALE — seed picks are hidden.");
  if (!hasOddsApiKey()) issues.push("ODDS_API_KEY is not set. Live tape cannot land.");
  const unique = [...new Set(issues)];
  return {
    state: unique.length === 0 ? "HEALTHY" : "DEGRADED",
    issues: unique.length ? unique : ["No source issues recorded."],
    ingestLastSuccessAt: snapshot?.lastSuccessAt ?? ops.ingest.lastSuccessAt,
    ingestLastFailureAt: snapshot?.lastFailureAt ?? ops.ingest.lastFailureAt,
    ingestLastFailureNote: snapshot?.lastFailureNote ?? ops.ingest.lastFailureNote,
  };
}

export async function buildPublicOps(): Promise<PublicOps> {
  const [ops, snapshot, changelog, health] = await Promise.all([
    readOps(),
    readOddsSnapshot(),
    readChangelog(),
    buildHealth(),
  ]);
  const lastIso = snapshot?.lastSuccessAt ?? ops.ingest.lastAttemptAt ?? WEEK1_META.lastUpdatedIso;
  const oddsFresh = Boolean(
    snapshot && snapshot.status === "LIVE" && Date.now() - Date.parse(snapshot.asOf) <= FRESH_MS,
  );
  return {
    health,
    routine: routineFromOps(ops),
    alerts: changelog.alerts,
    changes: changelog.items,
    staleWarning: snapshot && snapshot.status !== "LIVE" ? snapshot.note : snapshot?.freshness === "STALE" ? `Last live DK pull ${snapshot.asOf} is STALE.` : null,
    nextRefreshLabel: nextRefreshLabel(new Date()),
    lastRefreshLabel: new Date(lastIso).toLocaleString("en-US", { timeZone: "America/New_York" }),
    lastRefreshIso: lastIso,
    storage: storeBackend(),
    liveGate: buildLiveGate({
      oddsFresh,
      snapshotStatus: snapshot?.status ?? null,
      keyConfigured: hasOddsApiKey(),
    }),
    envChecks: envChecklist(),
  };
}

export { STAGE_WINDOWS };
