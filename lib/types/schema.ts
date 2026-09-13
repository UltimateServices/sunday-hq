/**
 * Database schema stubs — future persistence contract.
 * Phase 1 stores Week 1 seed as typed modules under /data.
 * These table names are binding so later phases do not reinvent entities.
 */

export type TableStub = {
  name: string;
  phase: number;
  purpose: string;
  columns: string[];
};

export const SCHEMA_STUBS: TableStub[] = [
  {
    name: "teams",
    phase: 1,
    purpose: "Franchise identity and conference/division.",
    columns: ["id", "abbr", "city", "name", "conference", "division"],
  },
  {
    name: "players",
    phase: 1,
    purpose: "Player identity, team, position, depth.",
    columns: ["id", "name", "team_id", "position", "depth", "notes"],
  },
  {
    name: "games",
    phase: 1,
    purpose: "Weekly slate, venue, kickoff, DK spread/total when verified.",
    columns: [
      "id",
      "week",
      "season",
      "kickoff",
      "away_team_id",
      "home_team_id",
      "venue",
      "indoor",
      "spread_home",
      "total",
      "line_quality",
      "status",
    ],
  },
  {
    name: "injuries",
    phase: 2,
    purpose: "Health state history with source + beneficiary graph.",
    columns: [
      "id",
      "player_id",
      "game_id",
      "health_state",
      "body_part",
      "quality",
      "sources",
      "as_of",
      "beneficiary_player_ids",
    ],
  },
  {
    name: "weather",
    phase: 2,
    purpose: "Per-game environment snapshot; indoor games marked NONE.",
    columns: [
      "game_id",
      "temp_f",
      "wind_mph",
      "precip_chance",
      "impact",
      "quality",
      "source",
      "as_of",
    ],
  },
  {
    name: "prop_lines",
    phase: 3,
    purpose: "Book lines + odds. DK-primary. Never store invented verified odds.",
    columns: [
      "id",
      "player_id",
      "game_id",
      "market",
      "book",
      "line",
      "odds_american",
      "side",
      "quality",
      "as_of",
    ],
  },
  {
    name: "model_projections",
    phase: 3,
    purpose: "Independent projection distribution (mean, median, sigma).",
    columns: [
      "id",
      "player_id",
      "game_id",
      "market",
      "mean",
      "median",
      "sigma",
      "model_version",
      "quality",
    ],
  },
  {
    name: "ev_snapshots",
    phase: 3,
    purpose: "Model prob vs implied vs EV at a timestamp.",
    columns: [
      "prop_id",
      "model_prob",
      "implied_prob",
      "ev",
      "edge",
      "assumed_juice",
      "quality",
      "as_of",
    ],
  },
  {
    name: "matchup_features",
    phase: 4,
    purpose: "Defense/scheme/pace features. Separate from player talent.",
    columns: ["game_id", "player_id", "feature", "value", "quality", "sample_size"],
  },
  {
    name: "parlays",
    phase: 5,
    purpose: "SGP and multi-game constructs with correlation flags.",
    columns: ["id", "legs", "book", "price", "boost_id", "correlation_note", "quality"],
  },
  {
    name: "boosts",
    phase: 5,
    purpose: "Profit boost inventory and residual EV after boost.",
    columns: ["id", "label", "boost_pct", "eligible_markets", "expires", "quality"],
  },
  {
    name: "my_card",
    phase: 5,
    purpose: "User card with unit discipline (no loss chasing).",
    columns: ["id", "slate_date", "legs", "units", "status", "notes"],
  },
  {
    name: "results",
    phase: 6,
    purpose: "Settled outcomes, CLV, calibration buckets.",
    columns: ["prop_id", "result", "closing_line", "clv", "model_prob", "hit"],
  },
  {
    name: "alerts",
    phase: 7,
    purpose: "Injury/line/weather/news alerts.",
    columns: ["id", "kind", "payload", "fired_at", "acked"],
  },
  {
    name: "model_weights",
    phase: 7,
    purpose: "Admin-tunable weights. Never hardcoded as secret sauce in UI.",
    columns: ["id", "name", "weight", "updated_by", "updated_at"],
  },
  {
    name: "odds_snapshots",
    phase: 7,
    purpose: "DraftKings-primary live tape from The Odds API. Never store invented verified prices.",
    columns: [
      "id",
      "as_of",
      "source",
      "status",
      "game_lines",
      "prop_lines",
      "last_success_at",
      "last_failure_at",
    ],
  },
  {
    name: "card_locks",
    phase: 6,
    purpose: "PLACED lock snapshot: line, odds, projection, confidence, health, weather.",
    columns: [
      "id",
      "prop_id",
      "placed_at",
      "line",
      "odds",
      "projection",
      "confidence",
      "health",
      "weather",
    ],
  },
  {
    name: "settlements",
    phase: 6,
    purpose: "REAL grades from public box scores + CLV vs last pre-kick snapshot.",
    columns: ["prop_id", "result", "actual", "closing_line", "clv", "source", "settled_at"],
  },
  {
    name: "cron_runs",
    phase: 7,
    purpose: "Sunday refresh + Monday learn last-run metadata.",
    columns: ["stage", "last_run_at", "status", "fingerprint", "note"],
  },
];
