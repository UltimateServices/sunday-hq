import type {
  AlertItem,
  BookId,
  BookQuote,
  CalibrationBucket,
  CardBet,
  ChangeItem,
  DataHealthState,
  DataQuality,
  MarketType,
  MeasuredNumber,
  ResultRow,
  Side,
  SundayRoutineStep,
} from "@/lib/types/domain";

export const STORE_KEYS = {
  odds: "sunday-hq/odds-latest.json",
  archive: "sunday-hq/odds-archive.json",
  ops: "sunday-hq/ops.json",
  changelog: "sunday-hq/changelog.json",
  results: "sunday-hq/results.json",
  card: "sunday-hq/card.json",
  learn: "sunday-hq/learn.json",
  weather: "sunday-hq/weather-latest.json",
  weights: "sunday-hq/weights.json",
} as const;

export const FRESH_MS = 3 * 60 * 60 * 1000;

export type SnapshotStatus = "LIVE" | "DEGRADED" | "UNAVAILABLE";
export type Freshness = "FRESH" | "STALE" | "UNAVAILABLE";

export type SundayStage =
  | "slate"
  | "injuries"
  | "weather"
  | "odds"
  | "projections"
  | "settle"
  | "monday-learn";

export type OverlayGameLine = {
  gameId: string;
  eventId: string;
  commenceTime: string;
  spreadHome: MeasuredNumber;
  total: MeasuredNumber;
};

export type OverlayPropLine = {
  playerId: string;
  playerName: string;
  gameId: string;
  market: MarketType;
  side: Side;
  line: MeasuredNumber;
  oddsAmerican: MeasuredNumber;
  books?: BookQuote[];
};

export type OddsSnapshot = {
  asOf: string;
  source: "the-odds-api" | "none";
  book: BookId;
  status: SnapshotStatus;
  freshness: Freshness;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastFailureNote: string | null;
  lastAttemptAt: string;
  games: OverlayGameLine[];
  props: OverlayPropLine[];
  unmatched: Array<{ name: string; market: string; reason: string }>;
  requestsRemaining: number | null;
  note: string;
};

export type OddsArchive = {
  snapshots: OddsSnapshot[];
};

export type StageRun = {
  stage: SundayStage;
  lastRunAt: string | null;
  lastStatus: "OK" | "DEGRADED" | "FAILED" | "SKIPPED" | "NEVER";
  lastNote: string;
  lastFingerprint: string | null;
};

export type OpsSnapshot = {
  asOf: string;
  ingest: {
    lastSuccessAt: string | null;
    lastFailureAt: string | null;
    lastFailureNote: string | null;
    lastAttemptAt: string | null;
    source: string;
    remaining: number | null;
  };
  storage: "blob" | "memory" | "file";
  stages: Record<SundayStage, StageRun>;
};

export type ChangelogSnapshot = {
  asOf: string;
  items: ChangeItem[];
  alerts: AlertItem[];
};

export type ResultsSnapshot = {
  asOf: string | null;
  week: number;
  season: number;
  source: string;
  rows: ResultRow[];
  pending: string[];
};

export type CardStore = {
  asOf: string;
  placed: CardBet[];
};

export type LearnSnapshot = {
  asOf: string | null;
  buckets: CalibrationBucket[];
  n: number;
  note: string;
};

export type DataHealthView = {
  state: DataHealthState;
  issues: string[];
  ingestLastSuccessAt: string | null;
  ingestLastFailureAt: string | null;
  ingestLastFailureNote: string | null;
};

export type PublicOps = {
  health: DataHealthView;
  routine: SundayRoutineStep[];
  alerts: AlertItem[];
  changes: ChangeItem[];
  staleWarning: string | null;
  nextRefreshLabel: string;
  lastRefreshLabel: string;
  lastRefreshIso: string;
  storage: "blob" | "memory" | "file";
};
