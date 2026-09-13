-- Sunday HQ persistence stub (Phase 1).
-- Not applied in this PR. Names are binding for later migrations.

CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  abbr TEXT NOT NULL,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  conference TEXT NOT NULL,
  division TEXT NOT NULL
);

CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  team_id TEXT NOT NULL REFERENCES teams(id),
  position TEXT NOT NULL,
  depth INTEGER,
  notes TEXT
);

CREATE TABLE games (
  id TEXT PRIMARY KEY,
  week INTEGER NOT NULL,
  season INTEGER NOT NULL,
  kickoff TIMESTAMPTZ NOT NULL,
  away_team_id TEXT NOT NULL REFERENCES teams(id),
  home_team_id TEXT NOT NULL REFERENCES teams(id),
  venue TEXT NOT NULL,
  indoor BOOLEAN NOT NULL,
  spread_home NUMERIC,
  total NUMERIC,
  line_quality TEXT NOT NULL,
  line_source TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE injuries (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  game_id TEXT NOT NULL REFERENCES games(id),
  health_state TEXT NOT NULL,
  body_part TEXT,
  quality TEXT NOT NULL,
  sources TEXT[] NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  beneficiary_player_ids TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE weather (
  game_id TEXT PRIMARY KEY REFERENCES games(id),
  temp_f NUMERIC,
  wind_mph NUMERIC,
  precip_chance NUMERIC,
  impact TEXT NOT NULL,
  quality TEXT NOT NULL,
  source TEXT NOT NULL,
  as_of TIMESTAMPTZ
);

CREATE TABLE prop_lines (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  game_id TEXT NOT NULL REFERENCES games(id),
  market TEXT NOT NULL,
  book TEXT NOT NULL,
  line NUMERIC,
  odds_american INTEGER,
  side TEXT NOT NULL,
  quality TEXT NOT NULL,
  as_of TIMESTAMPTZ
);

CREATE TABLE model_projections (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL REFERENCES players(id),
  game_id TEXT NOT NULL REFERENCES games(id),
  market TEXT NOT NULL,
  mean NUMERIC,
  median NUMERIC,
  sigma NUMERIC,
  model_version TEXT NOT NULL,
  quality TEXT NOT NULL
);

CREATE TABLE ev_snapshots (
  prop_id TEXT NOT NULL,
  model_prob NUMERIC,
  implied_prob NUMERIC,
  ev NUMERIC,
  edge NUMERIC,
  assumed_juice INTEGER,
  quality TEXT NOT NULL,
  as_of TIMESTAMPTZ NOT NULL
);

CREATE TABLE matchup_features (
  game_id TEXT NOT NULL REFERENCES games(id),
  player_id TEXT REFERENCES players(id),
  feature TEXT NOT NULL,
  value NUMERIC,
  quality TEXT NOT NULL,
  sample_size INTEGER
);

CREATE TABLE parlays (
  id TEXT PRIMARY KEY,
  legs JSONB NOT NULL,
  book TEXT NOT NULL,
  price NUMERIC,
  boost_id TEXT,
  correlation_note TEXT,
  quality TEXT NOT NULL
);

CREATE TABLE boosts (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  boost_pct NUMERIC,
  eligible_markets TEXT[],
  expires TIMESTAMPTZ,
  quality TEXT NOT NULL
);

CREATE TABLE my_card (
  id TEXT PRIMARY KEY,
  slate_date DATE NOT NULL,
  legs JSONB NOT NULL,
  units NUMERIC NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE results (
  prop_id TEXT PRIMARY KEY,
  result TEXT,
  closing_line NUMERIC,
  clv NUMERIC,
  model_prob NUMERIC,
  hit BOOLEAN
);

CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  fired_at TIMESTAMPTZ NOT NULL,
  acked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE model_weights (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE odds_snapshots (
  id TEXT PRIMARY KEY,
  as_of TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  game_lines JSONB NOT NULL,
  prop_lines JSONB NOT NULL,
  last_success_at TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ
);

CREATE TABLE card_locks (
  id TEXT PRIMARY KEY,
  prop_id TEXT NOT NULL,
  placed_at TIMESTAMPTZ NOT NULL,
  line NUMERIC,
  odds NUMERIC,
  projection NUMERIC,
  confidence TEXT,
  health TEXT,
  weather TEXT
);

CREATE TABLE settlements (
  prop_id TEXT PRIMARY KEY,
  result TEXT,
  actual NUMERIC,
  closing_line NUMERIC,
  clv NUMERIC,
  source TEXT NOT NULL,
  settled_at TIMESTAMPTZ
);

CREATE TABLE cron_runs (
  stage TEXT PRIMARY KEY,
  last_run_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  fingerprint TEXT,
  note TEXT
);
