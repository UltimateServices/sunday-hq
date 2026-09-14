import { INJURIES } from "@/data/week1/injuries";
import { MARKET_MOVES } from "@/data/week1/market-moves";
import { PLAYER_BY_ID, SUNDAY_PLAYERS } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { WeekCatalog } from "@/lib/catalog";
import { envScoresFor, type EnvScores } from "@/lib/env-scores";
import { liveStatus, windowFilter } from "@/lib/game-window";
import { gameScript } from "@/lib/game-script";
import { formatNumber, spreadLabel } from "@/lib/format";
import { MARKET_LABEL, toPropView, type PropView } from "@/lib/prop-view";
import { impliedTeamTotals } from "@/lib/team-totals";
import type {
  EnvironmentTier,
  Game,
  LiveStatus,
  MarketMoveEvent,
  Player,
  WeatherImpact,
} from "@/lib/types/domain";

export type GameDeskRow = {
  id: string;
  matchup: string;
  awayAbbr: string;
  homeAbbr: string;
  kickoff: string;
  network: string;
  window: Game["window"];
  windowChip: "1PM" | "4PM" | "SNF";
  total: number | null;
  openTotal: number | null;
  spread: string;
  indoor: boolean;
  venue: string;
  tier: EnvironmentTier;
  weatherImpact: WeatherImpact;
  weatherSummary?: string;
  live: LiveStatus;
  injuryCount: number;
  bestProp: string | null;
  primaryRisk: string | null;
  env: EnvScores;
  script: {
    pHomeWin: number;
    pAwayWin: number;
    pClose: number;
    pBlowout: number;
    note: string;
  };
  positives: string[];
  negatives: string[];
};

export function bestPropLabel(views: PropView[]): string | null {
  const ranked = views
    .filter((view) => view.confidenceGrade !== "PASS" && view.model.value !== null)
    .sort((a, b) => (b.pricing.edge.value ?? -999) - (a.pricing.edge.value ?? -999));
  const top = ranked[0];
  if (!top) return null;
  const line = top.line.value !== null ? `${top.side === "OVER" ? "O" : "U"} ${top.line.value}` : MARKET_LABEL[top.market];
  return `${top.playerName} ${MARKET_LABEL[top.market]} ${line}`;
}

export function buildGameDeskRow(catalog: WeekCatalog, game: Game): GameDeskRow {
  const away = TEAM_BY_ID[game.awayTeamId];
  const home = TEAM_BY_ID[game.homeTeamId];
  const wx = catalog.weather.find((row) => row.gameId === game.id);
  const qbDowngrade = game.id === "atl-pit";
  const env = envScoresFor(game, wx, { qbDowngrade });
  const script = gameScript(game);
  const injuries = INJURIES.filter((row) => row.gameId === game.id);
  const views = catalog.props.filter((prop) => prop.gameId === game.id).map((prop) => toPropView(prop));
  const positives: string[] = [];
  const negatives: string[] = [];

  if (game.total.value !== null && game.total.value >= 49) {
    positives.push(`Posted total ${game.total.value} — shootout tier from the catalog.`);
  }
  if (game.indoor) positives.push(`${game.venue} is indoor. Weather is not the limiter.`);
  if (wx?.impact === "NONE") positives.push("No material weather in the stored hourly.");
  if (script.favoriteTeamId) {
    positives.push(`${TEAM_BY_ID[script.favoriteTeamId].abbr} is the posted favorite. Script is ESTIMATE.`);
  }

  if (wx?.impact === "SIGNIFICANT") negatives.push(wx.impactNote || wx.summary);
  if (qbDowngrade) negatives.push("Atlanta QB room: Tua and Penix OUT. Cooper Rush starts.");
  if (game.total.value !== null && game.total.value <= 41) {
    negatives.push(`Posted total ${game.total.value} — capped scoring environment.`);
  }
  for (const inj of injuries.filter((row) => row.health === "OUT" || row.health === "GAME_TIME_DECISION" || row.quality === "SOURCE_CONFLICT")) {
    negatives.push(inj.headline);
  }
  if (positives.length === 0) positives.push("No extra positive factor stored beyond the posted number.");
  if (negatives.length === 0) negatives.push("No material negative flag in the Week 1 seed for this game.");

  const primaryRisk = negatives[0] ?? null;

  return {
    id: game.id,
    matchup: `${away.abbr} @ ${home.abbr}`,
    awayAbbr: away.abbr,
    homeAbbr: home.abbr,
    kickoff: game.kickoffLabel,
    network: game.network,
    window: game.window,
    windowChip: windowFilter(game),
    total: game.total.value,
    openTotal: game.openingTotal?.value ?? null,
    spread: spreadLabel(home.abbr, game.spreadHome.value),
    indoor: game.indoor,
    venue: game.venue,
    tier: env.tier,
    weatherImpact: wx?.impact ?? "UNKNOWN",
    weatherSummary: wx?.summary,
    live: liveStatus(game),
    injuryCount: injuries.length,
    bestProp: bestPropLabel(views),
    primaryRisk,
    env,
    script: {
      pHomeWin: script.pHomeWin,
      pAwayWin: script.pAwayWin,
      pClose: 1 - script.pBlowout,
      pBlowout: script.pBlowout,
      note: script.note,
    },
    positives,
    negatives,
  };
}

export function buildGameDesk(catalog: WeekCatalog): GameDeskRow[] {
  return catalog.games.map((game) => buildGameDeskRow(catalog, game));
}

export function gamePlayers(game: Game): Player[] {
  return SUNDAY_PLAYERS.filter((player) => player.teamId === game.awayTeamId || player.teamId === game.homeTeamId);
}

export function impliedLabels(game: Game): { away: string; home: string } {
  const implied = impliedTeamTotals(game);
  return {
    away: formatNumber(implied.away),
    home: formatNumber(implied.home),
  };
}

export function movesForGameDesk(gameId: string): MarketMoveEvent[] {
  return MARKET_MOVES.filter((move) => move.gameId === gameId).sort((a, b) => a.at.localeCompare(b.at));
}

export function playerUsageLine(player: Player, views: PropView[]): string {
  const relevant = views.filter((view) => view.playerId === player.id);
  if (relevant.length === 0) return "No seeded prop — usage DATA UNAVAILABLE";
  const primary = relevant.sort((a, b) => (b.model.value ?? 0) - (a.model.value ?? 0))[0];
  return `${MARKET_LABEL[primary.market]} model ${primary.model.value ?? "—"} (${primary.model.quality})`;
}

export function playerName(id: string): string {
  return PLAYER_BY_ID[id]?.name ?? id;
}
