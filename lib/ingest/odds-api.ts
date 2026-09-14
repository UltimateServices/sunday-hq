import { oddsApiKey } from "./env";

const BASE = "https://api.the-odds-api.com/v4";
const SPORT = "americanfootball_nfl";

export const PLAYER_PROP_MARKETS = [
  "player_pass_yds",
  "player_pass_tds",
  "player_pass_completions",
  "player_rush_yds",
  "player_rush_tds",
  "player_reception_yds",
  "player_receptions",
  "player_reception_tds",
  "player_anytime_td",
] as const;

export type OddsApiOutcome = {
  name: string;
  description?: string;
  price: number;
  point?: number;
};

export type OddsApiMarket = {
  key: string;
  last_update?: string;
  outcomes: OddsApiOutcome[];
};

export type OddsApiBookmaker = {
  key: string;
  title: string;
  last_update?: string;
  markets: OddsApiMarket[];
};

export type OddsApiEvent = {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: OddsApiBookmaker[];
};

export type OddsApiFetchResult = {
  events: OddsApiEvent[];
  remaining: number | null;
};

function remainingFrom(headers: Headers): number | null {
  const raw = headers.get("x-requests-remaining");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

async function oddsGet(path: string, params: Record<string, string>): Promise<{ json: unknown; remaining: number | null }> {
  const key = oddsApiKey();
  if (!key) {
    throw new Error("ODDS_API_KEY is not set");
  }
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("apiKey", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const response = await fetch(url.toString(), { cache: "no-store" });
  const remaining = remainingFrom(response.headers);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`The Odds API ${response.status}: ${body.slice(0, 240)}`);
  }
  return { json: await response.json(), remaining };
}

export async function fetchDraftKingsGameLines(): Promise<OddsApiFetchResult> {
  const { json, remaining } = await oddsGet(`/sports/${SPORT}/odds`, {
    regions: "us",
    markets: "spreads,totals",
    oddsFormat: "american",
    bookmakers: "draftkings,fanduel,betmgm,caesars",
  });
  return { events: json as OddsApiEvent[], remaining };
}

export async function fetchDraftKingsEventProps(eventId: string): Promise<OddsApiFetchResult> {
  const { json, remaining } = await oddsGet(`/sports/${SPORT}/events/${eventId}/odds`, {
    regions: "us",
    markets: PLAYER_PROP_MARKETS.join(","),
    oddsFormat: "american",
    bookmakers: "draftkings,fanduel,betmgm,caesars",
  });
  return { events: [json as OddsApiEvent], remaining };
}
