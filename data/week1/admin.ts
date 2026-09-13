import type { AdminWeight, SundayRoutineStep } from "@/lib/types/domain";
import { DATA_HEALTH } from "@/lib/refresh";
import { WEEK1_META } from "./meta";

export const DATA_SOURCES = [
  {
    id: "dk-espn",
    name: "DraftKings game lines via ESPN widget",
    status: "LIVE" as const,
    lastPull: WEEK1_META.lastUpdatedIso,
    note: "Spreads/totals captured 2026-09-13. Player-prop tape not ingested.",
  },
  {
    id: "dk-props",
    name: "DraftKings player-prop odds",
    status: "PENDING" as const,
    lastPull: null,
    note: "Do not fabricate verified DK prop prices.",
  },
  {
    id: "nws",
    name: "NWS hourly",
    status: "PENDING" as const,
    lastPull: null,
    note: "CLE@JAX heat/storm remains owner-seed ESTIMATE.",
  },
  {
    id: "inactives",
    name: "ESPN / club injury reports",
    status: "LIVE" as const,
    lastPull: WEEK1_META.lastUpdatedIso,
    note: "Tua, Penix, Bowers OUT verified in seed. Kamara SOURCE CONFLICT.",
  },
];

export const MODEL_WEIGHTS: AdminWeight[] = [
  { id: "w-pass", name: "Pass environment", weight: 0.22, updatedBy: "seed", updatedAt: WEEK1_META.lastUpdatedIso, note: "Total + QB availability." },
  { id: "w-rush", name: "Rush volume", weight: 0.2, updatedBy: "seed", updatedAt: WEEK1_META.lastUpdatedIso, note: "Script + implied team total." },
  { id: "w-rec", name: "Receiving share", weight: 0.18, updatedBy: "seed", updatedAt: WEEK1_META.lastUpdatedIso, note: "Role, not coverage grade." },
  { id: "w-td", name: "TD residual", weight: 0.12, updatedBy: "seed", updatedAt: WEEK1_META.lastUpdatedIso, note: "Anytime / first / 2+ stay separate." },
  { id: "w-wx", name: "Weather tax", weight: 0.1, updatedBy: "seed", updatedAt: WEEK1_META.lastUpdatedIso, note: "Only when impact ≥ MODERATE." },
  { id: "w-inj", name: "Availability", weight: 0.18, updatedBy: "seed", updatedAt: WEEK1_META.lastUpdatedIso, note: "Health enum beats projection." },
];

export const THRESHOLDS = [
  { id: "min-edge", label: "Min placeholder edge (yards)", value: "4.0", note: "Research highlight only. Not a bet trigger." },
  { id: "max-units", label: "Max units / play", value: "1.5", note: "No unit inflation after early red." },
  { id: "max-card", label: "Max Sunday units", value: "6", note: "Cap before the 1PM window." },
  { id: "pass-conf", label: "Auto PASS if", value: "GTD / OUT / no line", note: "Matches confidenceGrade()." },
  { id: "min-conf", label: "Card-ready confidence", value: "B- or better", note: "Week 1 never awards A / A+." },
];

export const SPORTSBOOKS = [
  { id: "dk", name: "DraftKings", role: "PRIMARY", status: "Game lines live · props PENDING" },
  { id: "consensus", name: "Consensus desk", role: "SEED", status: "Player-prop lines in Week 1 seed" },
  { id: "unknown", name: "Unknown / estimate", role: "RESEARCH", status: "Labeled ESTIMATE only" },
];

export const AUTOMATION = [
  { id: "poll", label: "Live poll", status: "PENDING", last: null, note: "Next refresh stays LIVE POLL PENDING." },
  { id: "inactives", label: "Inactive sweep", status: "MANUAL", last: WEEK1_META.lastUpdatedIso, note: "Seed snapshot, not a cron." },
  { id: "wx", label: "NWS hourly", status: "PENDING", last: null, note: "No invented countdown." },
  { id: "settle", label: "Results settle", status: "PENDING", last: null, note: "Week 1 Sunday still UPCOMING." },
];

export const ALERT_RULES = [
  { id: "crit-out", label: "Starter OUT", severity: "CRITICAL", enabled: true },
  { id: "conflict", label: "SOURCE CONFLICT", severity: "IMPORTANT", enabled: true },
  { id: "wx-sig", label: "Weather SIGNIFICANT", severity: "IMPORTANT", enabled: true },
  { id: "line-1", label: "Total move ≥ 1.0", severity: "WATCH", enabled: true },
  { id: "edge-lost", label: "Card edge lost", severity: "IMPORTANT", enabled: true },
];

export const FEATURE_FLAGS = [
  { id: "final-card", label: "Final Card mode", on: true, note: "Header toggle. Declutters to card + recs + critical + last changes." },
  { id: "assumed-juice", label: "Assumed -110 ranking", on: true, note: "Always labeled ESTIMATE. Never shown as DK." },
  { id: "live-odds", label: "Live DK prop odds", on: false, note: "Off until ingest exists." },
  { id: "unit-inflation", label: "Allow unit inflation", on: false, note: "Hard off. Binding spec." },
];

export const SUNDAY_ROUTINE: SundayRoutineStep[] = [
  { id: "r1", label: "Collect slate + DK game lines", status: "DONE", at: WEEK1_META.lastUpdatedIso, note: "13 Sunday games." },
  { id: "r2", label: "Verify inactives / conflicts", status: "DONE", at: WEEK1_META.lastUpdatedIso, note: "Kamara still SOURCE CONFLICT." },
  { id: "r3", label: "Normalize health + markets", status: "DONE", at: WEEK1_META.lastUpdatedIso, note: "Enum applied. No “healthy” language." },
  { id: "r4", label: "Model vs consensus", status: "LIVE", at: WEEK1_META.lastUpdatedIso, note: "Placeholder CDF / binary P. Not a trained engine." },
  { id: "r5", label: "Rank + explain", status: "LIVE", at: WEEK1_META.lastUpdatedIso, note: "Why drawers on every board." },
  { id: "r6", label: "Monitor movement / weather", status: "LIVE", at: WEEK1_META.lastUpdatedIso, note: "NYJ@TEN +1.0. NWS hourly PENDING." },
  { id: "r7", label: "Record card", status: "LIVE", at: WEEK1_META.lastUpdatedIso, note: "Seed watching / ready / placed / example settled." },
  { id: "r8", label: "Learn (CLV / calibration)", status: "PENDING", at: null, note: "Week 1 not settled. EXAMPLE buckets only." },
];

export const ADMIN_HEALTH = DATA_HEALTH;
