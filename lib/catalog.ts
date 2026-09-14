import { AUTOMATION, DATA_SOURCES, FEATURE_FLAGS, SUNDAY_ROUTINE } from "@/data/week1/admin";
import { ALERTS } from "@/data/week1/alerts";
import { GAMES } from "@/data/week1/games";
import { CHANGES } from "@/data/week1/news";
import { PROPS } from "@/data/week1/props";
import { CALIBRATION_BUCKETS, RESULTS, RESULTS_SUMMARY } from "@/data/week1/results";
import { WEEK1_META } from "@/data/week1/meta";
import { buildHealth, buildPublicOps, readOps, routineFromOps } from "@/lib/ingest/ops";
import { readChangelog } from "@/lib/ingest/changelog";
import { FRESH_MS, type OddsSnapshot } from "@/lib/ingest/types";
import { readJson, readOddsSnapshot, storeBackend } from "@/lib/ingest/store";
import { STORE_KEYS, type LearnSnapshot } from "@/lib/ingest/types";
import { readResultsSnapshot } from "@/lib/settle/pipeline";
import { overlayWeather, type WeatherSnapshot } from "@/lib/weather/nws";
import { buildMatchupGrades } from "@/lib/matchup/engine";
import { weightsFromAdmin, type ModelThresholds, type ModelWeights, type WeightsSnapshot } from "@/lib/weights";
import { readWeights } from "@/lib/weights-store";
import type {
  AlertItem,
  CalibrationBucket,
  ChangeItem,
  Game,
  MarketMoveEvent,
  MatchupGrade,
  PropMarket,
  ResultRow,
  SundayRoutineStep,
  WeatherRecord,
} from "@/lib/types/domain";
import { cache } from "react";
import { nextRefreshLabel } from "@/lib/refresh/windows";
import { hasOddsApiKey } from "@/lib/ingest/env";
import { buildLiveGate, type LiveGate } from "@/lib/live-gate";
import { envChecklist, type EnvCheck } from "@/lib/env-status";
import { assertRosterNarratives } from "@/lib/narrative-roster";

export type ResultsSummaryView = {
  record: string;
  units: number;
  roi: number | null;
  clvAvg: number | null;
  note: string;
  realCount: number;
  exampleCount: number;
};

export type WeekCatalog = {
  games: Game[];
  gameById: Record<string, Game>;
  props: PropMarket[];
  propById: Record<string, PropMarket>;
  changes: ChangeItem[];
  alerts: AlertItem[];
  results: ResultRow[];
  exampleResults: ResultRow[];
  realResults: ResultRow[];
  resultsSummary: ResultsSummaryView;
  calibration: CalibrationBucket[];
  realCalibration: CalibrationBucket[];
  routine: SundayRoutineStep[];
  sources: Array<{
    id: string;
    name: string;
    status: "LIVE" | "PENDING";
    lastPull: string | null;
    note: string;
  }>;
  automation: Array<{
    id: string;
    label: string;
    status: string;
    last: string | null;
    note: string;
  }>;
  featureFlags: typeof FEATURE_FLAGS;
  staleWarning: string | null;
  liveBanner: string;
  oddsFresh: boolean;
  snapshot: OddsSnapshot | null;
  nextRefreshLabel: string;
  lastRefreshLabel: string;
  lastRefreshIso: string;
  storage: ReturnType<typeof storeBackend>;
  health: Awaited<ReturnType<typeof buildHealth>>;
  weather: WeatherRecord[];
  matchups: MatchupGrade[];
  modelWeights: ModelWeights;
  adminWeights: WeightsSnapshot;
  thresholds: ModelThresholds;
  liveGate: LiveGate;
  envChecks: EnvCheck[];
};

function snapshotFresh(snapshot: OddsSnapshot | null): boolean {
  if (!snapshot || snapshot.status !== "LIVE") return false;
  return Date.now() - Date.parse(snapshot.asOf) <= FRESH_MS;
}

function overlayGames(snapshot: OddsSnapshot | null, fresh: boolean): Game[] {
  if (!snapshot || !fresh) return GAMES;
  return GAMES.map((game) => {
    const hit = snapshot.games.find((row) => row.gameId === game.id);
    if (!hit) return game;
    const opening = game.openingTotal ?? game.total;
    return {
      ...game,
      spreadHome: hit.spreadHome,
      total: hit.total,
      openingTotal: opening,
    };
  });
}

function overlayProps(snapshot: OddsSnapshot | null, fresh: boolean): PropMarket[] {
  if (!snapshot || !fresh) return PROPS;
  return PROPS.map((prop) => {
    const hit = snapshot.props.find(
      (row) => row.playerId === prop.playerId && row.market === prop.market && row.side === prop.side,
    );
    if (!hit) return prop;
    const moved =
      prop.line.value !== null && hit.line.value !== null && prop.line.value !== hit.line.value
        ? hit.line.value > prop.line.value
          ? "UP"
          : "DOWN"
        : prop.movement.direction;
    return {
      ...prop,
      book: "DRAFTKINGS",
      line: hit.line,
      oddsAmerican: hit.oddsAmerican,
      books: hit.books,
      movement: {
        direction: moved,
        note:
          prop.line.value !== null && hit.line.value !== null && prop.line.value !== hit.line.value
            ? `Seed ${prop.line.value} → live DK ${hit.line.value} (${hit.line.asOf}).`
            : `Live DK tape ${hit.oddsAmerican.value ?? "DATA UNAVAILABLE"} at ${hit.line.asOf}.`,
      },
    };
  });
}

function summarize(real: ResultRow[], example: ResultRow[]): ResultsSummaryView {
  if (real.length === 0) {
    return {
      ...RESULTS_SUMMARY,
      roi: RESULTS_SUMMARY.roi,
      clvAvg: RESULTS_SUMMARY.clvAvg,
      realCount: 0,
      exampleCount: example.length,
      note: `${RESULTS_SUMMARY.note} REAL section is empty until ESPN finals + settle.`,
    };
  }
  const graded = real.filter((row) => row.result === "WIN" || row.result === "LOSS" || row.result === "PUSH");
  const wins = graded.filter((row) => row.result === "WIN").length;
  const losses = graded.filter((row) => row.result === "LOSS").length;
  const pushes = graded.filter((row) => row.result === "PUSH").length;
  const voids = real.filter((row) => row.result === "VOID").length;
  const units = real.reduce((sum, row) => {
    if (row.result === "WIN") return sum + row.units;
    if (row.result === "LOSS") return sum - row.units;
    return sum;
  }, 0);
  const clvs = real.map((row) => row.clv.value).filter((value): value is number => value !== null);
  const risked = real.filter((row) => row.result === "WIN" || row.result === "LOSS").reduce((sum, row) => sum + row.units, 0);
  return {
    record: `${wins}-${losses}-${pushes}${voids ? ` + ${voids} void` : ""}`,
    units,
    roi: risked ? units / risked : null,
    clvAvg: clvs.length ? clvs.reduce((a, b) => a + b, 0) / clvs.length : null,
    note: `REAL grades from ${real[0]?.source ?? "ESPN"}. EXAMPLE/SEED rows are excluded from this summary.`,
    realCount: real.length,
    exampleCount: example.length,
  };
}

export function liveMarketMoves(games: Game[], snapshot: OddsSnapshot | null): MarketMoveEvent[] {
  if (!snapshot) return [];
  const moves: MarketMoveEvent[] = [];
  for (const game of GAMES) {
    const live = snapshot.games.find((row) => row.gameId === game.id);
    if (!live || live.total.value === null || game.total.value === null) continue;
    if (live.total.value === game.total.value) continue;
    moves.push({
      id: `live-${game.id}-${snapshot.asOf}`,
      gameId: game.id,
      market: "GAME_TOTAL",
      at: snapshot.asOf,
      from: game.total.value,
      to: live.total.value,
      heat: Math.abs(live.total.value - game.total.value) >= 1.5 ? "WARM" : "QUIET",
      note: `Seed DK-via-ESPN ${game.total.value} → live DK ${live.total.value}.`,
      quality: "VERIFIED",
    });
  }
  return moves;
}

async function loadWeekCatalog(): Promise<WeekCatalog> {
  assertRosterNarratives();
  const [snapshot, changelog, results, ops, health, learn, weatherSnap, weightsSnap] = await Promise.all([
    readOddsSnapshot(),
    readChangelog(),
    readResultsSnapshot(),
    readOps(),
    buildHealth(),
    readJson<LearnSnapshot>(STORE_KEYS.learn),
    readJson<WeatherSnapshot>(STORE_KEYS.weather),
    readWeights(),
  ]);
  const fresh = snapshotFresh(snapshot);
  if (snapshot) {
    snapshot.freshness = fresh ? "FRESH" : snapshot.status === "LIVE" ? "STALE" : "UNAVAILABLE";
  }
  const liveGate = buildLiveGate({
    oddsFresh: fresh,
    snapshotStatus: snapshot?.status ?? null,
    keyConfigured: hasOddsApiKey(),
  });
  const games = overlayGames(snapshot, fresh);
  const props = liveGate.actionable ? overlayProps(snapshot, fresh) : [];
  const realResults = results.rows.filter((row) => row.seedLabel === "REAL");
  const exampleResults = RESULTS;
  const changes = changelog.items.length ? changelog.items : CHANGES;
  const alerts = changelog.alerts.length ? changelog.alerts : ALERTS;
  const lastIso = snapshot?.lastSuccessAt ?? ops.ingest.lastAttemptAt ?? WEEK1_META.lastUpdatedIso;

  const sources = DATA_SOURCES.map((source) => {
    if (source.id === "dk-props") {
      return {
        ...source,
        status: snapshot?.status === "LIVE" && fresh ? ("LIVE" as const) : ("PENDING" as const),
        lastPull: snapshot?.lastSuccessAt ?? null,
        note:
          snapshot?.status === "LIVE"
            ? snapshot.note
            : snapshot?.note ?? source.note,
      };
    }
    if (source.id === "dk-espn") {
      return {
        ...source,
        lastPull: snapshot?.lastSuccessAt ?? source.lastPull,
        note: fresh && snapshot ? `Live DK game lines overlaid. ${snapshot.note}` : source.note,
      };
    }
    if (source.id === "nws") {
      return {
        ...source,
        status: weatherSnap?.status === "LIVE" ? ("LIVE" as const) : ("PENDING" as const),
        lastPull: weatherSnap?.asOf ?? ops.stages.weather.lastRunAt,
        note: weatherSnap?.note ?? source.note,
      };
    }
    return source;
  });

  const automation = AUTOMATION.map((row) => {
    if (row.id === "poll") {
      return {
        ...row,
        status: snapshot?.status === "LIVE" ? "LIVE" : "PENDING",
        last: snapshot?.lastAttemptAt ?? null,
        note: snapshot?.note ?? row.note,
      };
    }
    if (row.id === "settle") {
      return {
        ...row,
        status: results.asOf ? "LIVE" : "PENDING",
        last: results.asOf,
        note: results.asOf ? `${results.rows.length} REAL rows · ${results.pending.length} pending` : row.note,
      };
    }
    if (row.id === "wx") {
      return {
        ...row,
        status: weatherSnap?.status === "LIVE" || ops.stages.weather.lastStatus === "OK" ? "LIVE" : "PENDING",
        last: weatherSnap?.asOf ?? ops.stages.weather.lastRunAt,
        note: weatherSnap?.note || ops.stages.weather.lastNote || row.note,
      };
    }
    if (row.id === "inactives") {
      return {
        ...row,
        status: ops.stages.injuries.lastStatus === "NEVER" ? "MANUAL" : "LIVE",
        last: ops.stages.injuries.lastRunAt ?? row.last,
        note: ops.stages.injuries.lastNote || row.note,
      };
    }
    return row;
  });

  const flags = FEATURE_FLAGS.map((flag) =>
    flag.id === "live-odds" ? { ...flag, on: Boolean(fresh && snapshot?.status === "LIVE") } : flag,
  );
  const weather = overlayWeather(weatherSnap);
  const modelWeights = weightsFromAdmin(weightsSnap.weights);
  const matchups = buildMatchupGrades(games, weather, modelWeights);

  return {
    games,
    gameById: Object.fromEntries(games.map((game) => [game.id, game])),
    props,
    propById: Object.fromEntries(props.map((prop) => [prop.id, prop])),
    changes,
    alerts,
    results: [...realResults, ...exampleResults],
    exampleResults,
    realResults,
    resultsSummary: summarize(realResults, exampleResults),
    calibration: CALIBRATION_BUCKETS,
    realCalibration: learn?.buckets ?? CALIBRATION_BUCKETS.map((bucket) => ({ ...bucket, observed: null, n: 0, quality: "UNAVAILABLE" as const })),
    routine: Object.values(ops.stages).some((stage) => stage.lastRunAt) ? routineFromOps(ops) : SUNDAY_ROUTINE,
    sources,
    automation,
    featureFlags: flags,
    staleWarning: !fresh
      ? snapshot?.status === "LIVE"
        ? `Live DK snapshot from ${snapshot.asOf} is STALE. Seed picks are hidden — do not bet from this page.`
        : snapshot?.note ?? "No live DraftKings snapshot. Seed picks are hidden. No invented prices."
      : null,
    liveBanner: fresh
      ? `Live DraftKings snapshot ${snapshot?.asOf} (${snapshot?.props.length ?? 0} prop sides).`
      : "Not live — do not bet from this page. Seed constructs are hidden.",
    oddsFresh: fresh,
    snapshot,
    nextRefreshLabel: nextRefreshLabel(),
    lastRefreshLabel: new Date(lastIso).toLocaleString("en-US", { timeZone: "America/New_York" }),
    lastRefreshIso: lastIso,
    storage: storeBackend(),
    health,
    weather,
    matchups,
    modelWeights,
    adminWeights: weightsSnap,
    thresholds: weightsSnap.thresholds,
    liveGate,
    envChecks: envChecklist(),
  };
}

export const getWeekCatalog = cache(loadWeekCatalog);

export async function getPublicOps() {
  return buildPublicOps();
}

export { nextRefreshLabel };
