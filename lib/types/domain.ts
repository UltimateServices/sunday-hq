/**
 * Sunday HQ domain contract.
 * Binding: never present a raw number as verified unless quality says so.
 */

export const HEALTH_STATES = [
  "NO_KNOWN_LIMITATION",
  "MINOR_CONCERN",
  "QUESTIONABLE",
  "EXPECTED_LIMITED",
  "GAME_TIME_DECISION",
  "HIGH_RISK",
  "OUT",
  "IR_PUP_NFI",
] as const;

export type HealthState = (typeof HEALTH_STATES)[number];

export const DATA_QUALITIES = [
  "VERIFIED",
  "CONSENSUS",
  "ESTIMATE",
  "UNAVAILABLE",
  "STALE",
  "SOURCE_CONFLICT",
  "LOW_SAMPLE",
] as const;

export type DataQuality = (typeof DATA_QUALITIES)[number];

export type Side = "OVER" | "UNDER";

export type BookId = "DRAFTKINGS" | "CONSENSUS" | "UNKNOWN";

export type Position =
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "K"
  | "DST"
  | "OL"
  | "DB"
  | "LB"
  | "DL"
  | "OTHER";

export type MarketType =
  | "PASS_YDS"
  | "PASS_TD"
  | "RUSH_YDS"
  | "RUSH_TD"
  | "COMPLETIONS"
  | "REC_YDS"
  | "RECEPTIONS"
  | "REC_TD"
  | "ANYTIME_TD"
  | "ALT_YDS"
  | "TEAM_TOTAL"
  | "GAME_TOTAL"
  | "SGP"
  | "MULTI_GAME_PARLAY"
  | "PROFIT_BOOST";

export type Layer = "COMMAND_CENTER" | "RESEARCH_BOARD" | "DEEP_DIVE";

export type PhaseId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RouteReadiness = "LIVE" | "PLACEHOLDER" | "PENDING";

export type QualifierLens =
  | "GOOD_PLAYER"
  | "GOOD_MATCHUP"
  | "GOOD_PROJECTION"
  | "GOOD_BET";

export type QualifierGrade = "YES" | "LEAN" | "NO" | "UNKNOWN";

export type MovementDirection = "UP" | "DOWN" | "FLAT" | "UNKNOWN";

export type WeatherImpact = "NONE" | "MINOR" | "MODERATE" | "SIGNIFICANT" | "UNKNOWN";

export type EnvironmentTier = "SHOOTOUT" | "NEUTRAL" | "CAPPED" | "WEATHER_RISK" | "QB_DOWNGRADE";

export type MeasuredNumber = {
  value: number | null;
  quality: DataQuality;
  source: string;
  asOf: string | null;
  note?: string;
};

export type Team = {
  id: string;
  abbr: string;
  city: string;
  name: string;
  conference: "AFC" | "NFC";
  division: string;
};

export type Player = {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  depth?: number;
  notes?: string;
};

export type Game = {
  id: string;
  week: number;
  season: number;
  kickoffIso: string;
  kickoffLabel: string;
  window: "EARLY" | "LATE" | "SNF" | "MNF" | "TNF" | "INTL";
  network: string;
  awayTeamId: string;
  homeTeamId: string;
  venue: string;
  city: string;
  indoor: boolean;
  spreadHome: MeasuredNumber;
  total: MeasuredNumber;
  openingTotal?: MeasuredNumber;
  status: "SCHEDULED" | "LIVE" | "FINAL" | "POSTPONED";
};

export type InjuryRecord = {
  id: string;
  playerId: string;
  teamId: string;
  gameId: string;
  health: HealthState;
  bodyPart: string;
  headline: string;
  detail: string;
  quality: DataQuality;
  sources: string[];
  asOf: string;
  beneficiaryPlayerIds: string[];
};

export type WeatherRecord = {
  gameId: string;
  indoor: boolean;
  summary: string;
  tempF: MeasuredNumber;
  windMph: MeasuredNumber;
  precipChance: MeasuredNumber;
  impact: WeatherImpact;
  impactNote: string;
  quality: DataQuality;
  source: string;
};

export type PropMarket = {
  id: string;
  playerId: string;
  gameId: string;
  market: MarketType;
  side: Side;
  book: BookId;
  line: MeasuredNumber;
  oddsAmerican: MeasuredNumber;
  model: MeasuredNumber;
  median: MeasuredNumber;
  confidence: MeasuredNumber;
  matchupNote: string;
  weatherNote: string;
  movement: {
    direction: MovementDirection;
    note: string;
  };
  why: string[];
  risks: string[];
  lenses: Record<QualifierLens, QualifierGrade>;
  volumeTag?: "HIGH" | "MED" | "LOW";
  tdRole?: "PRIMARY" | "SECONDARY" | "DEVICE" | "UNKNOWN";
};

export type DerivedTeamTotal = {
  id: string;
  gameId: string;
  teamId: string;
  line: MeasuredNumber;
  environment: EnvironmentTier;
  note: string;
};

export type NewsItem = {
  id: string;
  severity: "CRITICAL" | "WATCH" | "INFO";
  title: string;
  body: string;
  gameId?: string;
  playerIds: string[];
  asOf: string;
  quality: DataQuality;
  source: string;
};

export type ChangeCategory = "INJURY" | "PROJECTION" | "MARKET" | "WEATHER" | "LINEUP";

export type ChangeItem = {
  id: string;
  title: string;
  from: string;
  to: string;
  implication: string;
  quality: DataQuality;
  category: ChangeCategory;
};

export type LiveStatus = "UPCOMING" | "LIVE" | "FINAL";

export type GameWindowFilter = "ALL" | "EARLY" | "LATE" | "SNF";

export type ConfidenceGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C" | "PASS";

export type AlertKind = "INJURIES" | "WEATHER" | "MARKETS" | "PROJECTIONS";

export type AlertSeverity = "INFO" | "WATCH" | "IMPORTANT" | "CRITICAL";

export type AlertItem = {
  id: string;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  body: string;
  href: string;
  asOf: string;
};

export type WhySections = {
  modelCase: string[];
  supporting: string[];
  risks: string[];
  marketContext: string[];
  dataQuality: string[];
};

export type StatusChipId =
  | "HEALTHY"
  | "QUESTIONABLE"
  | "LIMITED"
  | "OUT"
  | "DOME"
  | "WIND"
  | "RAIN"
  | "SNOW"
  | "ROLE_CHANGE"
  | "LINE_MOVE"
  | "STEAM"
  | "HIGH_EDGE"
  | "HIGH_VOLATILITY"
  | "LOW_SAMPLE"
  | "SOURCE_CONFLICT"
  | "STALE_DATA";

export type EdgeUnit = "yards" | "prob" | "ev";

export type DataHealthState = "HEALTHY" | "DEGRADED";

export type FantasyProjection = {
  playerId: string;
  gameId: string;
  ppr: MeasuredNumber;
  halfPpr: MeasuredNumber;
  standard: MeasuredNumber;
  note: string;
};

export type AvoidItem = {
  id: string;
  title: string;
  reason: string;
  severity: "HIGH" | "MED";
  href: string;
};

export type CommandCenterMeta = {
  week: number;
  season: number;
  slateDate: string;
  slateLabel: string;
  lastUpdatedIso: string;
  lastUpdatedLabel: string;
  timezone: "America/New_York";
  seedNote: string;
};

export type PendingCapability = {
  id: string;
  phase: PhaseId;
  title: string;
  summary: string;
  blockedBy: string[];
};
