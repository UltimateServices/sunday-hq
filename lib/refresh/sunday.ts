import { GAMES } from "@/data/week1/games";
import { INJURIES } from "@/data/week1/injuries";
import { WEEK1_META } from "@/data/week1/meta";
import { WEATHER } from "@/data/week1/weather";
import { appendChangelog, changeFrom } from "@/lib/ingest/changelog";
import { hasOddsApiKey, nwsUserAgent } from "@/lib/ingest/env";
import { recordIngestMeta, recordStage } from "@/lib/ingest/ops";
import { ingestOdds } from "@/lib/ingest/run-odds";
import { fingerprint, readOddsSnapshot, storeBackend } from "@/lib/ingest/store";
import { STORE_KEYS, type LearnSnapshot, type SundayStage } from "@/lib/ingest/types";
import { writeJson } from "@/lib/ingest/store";
import { fetchEspnInjuries, fetchEspnScoreboard } from "@/lib/settle/espn";
import { readResultsSnapshot, settleWeek } from "@/lib/settle/pipeline";
import { RESULTS } from "@/data/week1/results";
import type { AlertItem, CalibrationBucket, ChangeItem } from "@/lib/types/domain";
import { SCHEDULE_TO_STAGE } from "./windows";

export const SUNDAY_STAGES: SundayStage[] = [
  "slate",
  "injuries",
  "weather",
  "odds",
  "projections",
  "settle",
  "monday-learn",
];

export function parseStage(value: string | null, scheduleHeader: string | null): SundayStage | null {
  if (value && SUNDAY_STAGES.includes(value as SundayStage)) return value as SundayStage;
  if (scheduleHeader && SCHEDULE_TO_STAGE[scheduleHeader]) return SCHEDULE_TO_STAGE[scheduleHeader];
  return null;
}

async function writeIfNew(stage: SundayStage, items: ChangeItem[], alerts: AlertItem[], note: string, status: "OK" | "DEGRADED" | "FAILED" | "SKIPPED") {
  const fp = fingerprint({ stage, items: items.map((i) => i.fingerprint ?? i.id), note, status });
  await recordStage({ stage, status, note, fingerprint: fp });
  if (items.length || alerts.length) {
    await appendChangelog({ items, alerts });
  }
  return { fingerprint: fp, status, note, items: items.length, alerts: alerts.length };
}

export async function runSlate() {
  const board = await fetchEspnScoreboard().catch((error: Error) => error);
  const asOf = new Date().toISOString();
  if (board instanceof Error) {
    return writeIfNew(
      "slate",
      [
        changeFrom({
          title: "Slate refresh degraded",
          from: "ESPN scoreboard",
          to: "DATA UNAVAILABLE",
          implication: board.message,
          quality: "UNAVAILABLE",
          category: "LINEUP",
          severity: "WATCH",
          asOf,
          fingerprint: fingerprint(["slate-fail", board.message]),
        }),
      ],
      [],
      `ESPN scoreboard failed: ${board.message}`,
      "DEGRADED",
    );
  }
  const live = board.filter((row) => row.status === "LIVE").length;
  const finals = board.filter((row) => row.status === "FINAL").length;
  return writeIfNew(
    "slate",
    [
      changeFrom({
        title: "Sunday slate refresh",
        from: `${GAMES.length} seed games`,
        to: `${board.length} ESPN matches · ${live} LIVE · ${finals} FINAL`,
        implication: "Kickoffs and game state from ESPN public scoreboard. Lines still come from DK ingest, not ESPN.",
        quality: "VERIFIED",
        category: "LINEUP",
        severity: "INFO",
        asOf,
        fingerprint: fingerprint(["slate", board.map((row) => `${row.gameId}:${row.status}`)]),
      }),
    ],
    [],
    `ESPN matched ${board.length}/${GAMES.length} Sunday games. Storage ${storeBackend()}.`,
    board.length ? "OK" : "DEGRADED",
  );
}

export async function runInjuries() {
  const hits = await fetchEspnInjuries().catch((error: Error) => error);
  const asOf = new Date().toISOString();
  if (hits instanceof Error) {
    return writeIfNew("injuries", [], [], `ESPN injuries failed: ${hits.message}`, "DEGRADED");
  }
  const items: ChangeItem[] = [];
  const alerts: AlertItem[] = [];
  for (const hit of hits) {
    const seed = INJURIES.find((row) => row.playerId === hit.playerId);
    const espn = hit.status.toUpperCase();
    if (seed && seed.headline && espn && !seed.headline.toUpperCase().includes(espn.split(" ")[0] ?? "NOPE")) {
      const fp = fingerprint(["inj", hit.playerId, espn]);
      items.push(
        changeFrom({
          title: `${hit.playerId} ESPN status ${hit.status}`,
          from: seed.health,
          to: hit.status,
          implication: `${hit.description} Seed health stays ${seed.health} until a desk confirm. SOURCE rows are not overwritten silently.`,
          quality: seed.quality === "SOURCE_CONFLICT" ? "SOURCE_CONFLICT" : "CONSENSUS",
          category: "INJURY",
          severity: espn.includes("OUT") ? "CRITICAL" : "WATCH",
          asOf,
          fingerprint: fp,
        }),
      );
    }
  }
  return writeIfNew(
    "injuries",
    items,
    alerts,
    `ESPN injury feed matched ${hits.length} desk players. Seed health enum is not auto-replaced.`,
    "OK",
  );
}

const STADIUMS: Record<string, { lat: number; lon: number }> = {
  "tb-cin": { lat: 39.0954, lon: -84.516 },
  "no-det": { lat: 42.34, lon: -83.0456 },
  "nyj-ten": { lat: 36.1665, lon: -86.7713 },
  "bal-ind": { lat: 39.7601, lon: -86.1639 },
  "atl-pit": { lat: 40.4468, lon: -80.0158 },
  "chi-car": { lat: 35.2258, lon: -80.8528 },
  "cle-jax": { lat: 30.3239, lon: -81.6373 },
  "buf-hou": { lat: 29.6847, lon: -95.4107 },
  "was-phi": { lat: 39.9008, lon: -75.1675 },
  "dal-nyg": { lat: 40.8136, lon: -74.0744 },
};

export async function runWeather() {
  const agent = nwsUserAgent();
  const asOf = new Date().toISOString();
  if (!agent) {
    return writeIfNew(
      "weather",
      [
        changeFrom({
          title: "NWS hourly still DATA UNAVAILABLE",
          from: "PENDING",
          to: "UNAVAILABLE",
          implication: "NWS_USER_AGENT is not set. Outdoor games keep seed ESTIMATE weather. No invented hourly.",
          quality: "UNAVAILABLE",
          category: "WEATHER",
          severity: "WATCH",
          asOf,
          fingerprint: "wx-no-agent",
        }),
      ],
      [],
      "NWS_USER_AGENT missing. Weather stage degraded.",
      "DEGRADED",
    );
  }

  const outdoor = GAMES.filter((game) => !game.indoor && STADIUMS[game.id]);
  const notes: string[] = [];
  for (const game of outdoor) {
    const point = STADIUMS[game.id];
    try {
      const meta = await fetch(`https://api.weather.gov/points/${point.lat},${point.lon}`, {
        headers: { "User-Agent": agent, Accept: "application/geo+json" },
        cache: "no-store",
      });
      if (!meta.ok) {
        notes.push(`${game.id}: NWS points ${meta.status}`);
        continue;
      }
      const json = (await meta.json()) as { properties?: { forecastHourly?: string } };
      if (!json.properties?.forecastHourly) {
        notes.push(`${game.id}: no hourly URL`);
        continue;
      }
      const hourly = await fetch(json.properties.forecastHourly, {
        headers: { "User-Agent": agent, Accept: "application/geo+json" },
        cache: "no-store",
      });
      notes.push(`${game.id}: hourly ${hourly.ok ? "ok" : hourly.status}`);
    } catch (error) {
      notes.push(`${game.id}: ${error instanceof Error ? error.message : "nws fail"}`);
    }
  }

  return writeIfNew(
    "weather",
    [
      changeFrom({
        title: "NWS hourly pull",
        from: `${WEATHER.filter((w) => w.impact !== "NONE").length} seed material rows`,
        to: notes.join(" · ") || "no outdoor pulls",
        implication: "Hourly was requested. Seed impact labels stay until a verified hourly row is stored.",
        quality: "CONSENSUS",
        category: "WEATHER",
        severity: "INFO",
        asOf,
        fingerprint: fingerprint(notes),
      }),
    ],
    [],
    notes.join(" | ") || "No outdoor NWS pulls.",
    "OK",
  );
}

export async function runOdds() {
  const snapshot = await ingestOdds();
  await recordIngestMeta({
    success: snapshot.status === "LIVE",
    note: snapshot.note,
    source: snapshot.source,
    remaining: snapshot.requestsRemaining,
  });
  const asOf = snapshot.asOf;
  const items: ChangeItem[] = [
    changeFrom({
      title: snapshot.status === "LIVE" ? "DraftKings tape refreshed" : "DraftKings ingest degraded",
      from: hasOddsApiKey() ? "The Odds API" : "no ODDS_API_KEY",
      to: `${snapshot.games.length} game lines / ${snapshot.props.length} prop sides · ${snapshot.status}`,
      implication: snapshot.note,
      quality: snapshot.status === "LIVE" ? "VERIFIED" : "UNAVAILABLE",
      category: "MARKET",
      severity: snapshot.status === "LIVE" ? "INFO" : "IMPORTANT",
      asOf,
      fingerprint: fingerprint(["odds", snapshot.status, snapshot.games.length, snapshot.props.length, snapshot.lastFailureNote]),
    }),
  ];
  return writeIfNew( "odds", items, [], snapshot.note, snapshot.status === "LIVE" ? "OK" : "DEGRADED");
}

export async function runProjections() {
  const snapshot = await readOddsSnapshot();
  const asOf = new Date().toISOString();
  return writeIfNew(
    "projections",
    [
      changeFrom({
        title: "Projection stamp",
        from: "placeholder CDF",
        to: snapshot?.status === "LIVE" ? "same model vs live DK lines" : "same model vs seed consensus",
        implication:
          "No trained re-fit. Week 1 model stays ESTIMATE / LOW SAMPLE. Live DK lines change price, not the projection engine.",
        quality: "LOW_SAMPLE",
        category: "PROJECTION",
        severity: "INFO",
        asOf,
        fingerprint: fingerprint(["proj", snapshot?.asOf ?? "seed"]),
      }),
    ],
    [],
    "Projections re-stamped. Model numbers were not invented or retrained.",
    "OK",
  );
}

export async function runSettle() {
  try {
    const settled = await settleWeek();
    const asOf = settled.asOf ?? new Date().toISOString();
    return writeIfNew(
      "settle",
      [
        changeFrom({
          title: "Week settle",
          from: "PLACED / seed tickets",
          to: `${settled.rows.length} REAL rows · ${settled.pending.length} pending`,
          implication: `Box scores: ${settled.source}. REAL vs EXAMPLE/SEED stay separated. Pending games are not graded.`,
          quality: settled.rows.length ? "VERIFIED" : "UNAVAILABLE",
          category: "MARKET",
          severity: settled.rows.length ? "INFO" : "WATCH",
          asOf,
          fingerprint: fingerprint(["settle", settled.rows.map((r) => r.id), settled.pending]),
        }),
      ],
      [],
      `Settled ${settled.rows.length} REAL tickets. ${settled.pending.length} still pending.`,
      settled.rows.length ? "OK" : "DEGRADED",
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "settle failed";
    return writeIfNew("settle", [], [], message, "FAILED");
  }
}

function bucketsFromReal(nHits: number[], nTried: number[], predicted: number[]): CalibrationBucket[] {
  const labels = ["50–55%", "55–60%", "60–65%", "65–70%", "70%+"];
  return labels.map((label, i) => ({
    label,
    predicted: predicted[i] ?? 0.5,
    observed: nTried[i] ? nHits[i] / nTried[i] : null,
    n: nTried[i] ?? 0,
    quality: (nTried[i] ?? 0) === 0 ? "UNAVAILABLE" : "LOW_SAMPLE",
  }));
}

export async function runMondayLearn() {
  const real = await readResultsSnapshot();
  const graded = real.rows.filter((row) => row.seedLabel === "REAL" && (row.result === "WIN" || row.result === "LOSS"));
  const asOf = new Date().toISOString();
  const nTried = [0, 0, 0, 0, 0];
  const nHits = [0, 0, 0, 0, 0];
  // Placeholder CDF is not a stored model-prob archive; REAL n is reported, buckets stay UNAVAILABLE without predicted probs.
  const buckets = bucketsFromReal(nHits, nTried, [0.525, 0.575, 0.625, 0.675, 0.75]);
  const learn: LearnSnapshot = {
    asOf,
    buckets,
    n: graded.length,
    note:
      graded.length === 0
        ? "No REAL WIN/LOSS grades yet. EXAMPLE/SEED calibration remains illustrative only."
        : `${graded.length} REAL grades. Predicted-prob buckets stay DATA UNAVAILABLE until model-prob is stored on the lock snapshot.`,
  };
  await writeJson(STORE_KEYS.learn, learn);
  return writeIfNew(
    "monday-learn",
    [
      changeFrom({
        title: "Monday learn",
        from: `${RESULTS.length} EXAMPLE/SEED rows`,
        to: `${learn.n} REAL grades`,
        implication: learn.note,
        quality: learn.n ? "LOW_SAMPLE" : "UNAVAILABLE",
        category: "PROJECTION",
        severity: "INFO",
        asOf,
        fingerprint: fingerprint(["learn", learn.n, learn.note]),
      }),
    ],
    [],
    learn.note,
    graded.length ? "OK" : "DEGRADED",
  );
}

export async function runSundayStage(stage: SundayStage) {
  switch (stage) {
    case "slate":
      return runSlate();
    case "injuries":
      return runInjuries();
    case "weather":
      return runWeather();
    case "odds":
      return runOdds();
    case "projections":
      return runProjections();
    case "settle":
      return runSettle();
    case "monday-learn":
      return runMondayLearn();
    default:
      return { status: "FAILED" as const, note: "Unknown stage", fingerprint: "unknown", items: 0, alerts: 0 };
  }
}

export { WEEK1_META };
