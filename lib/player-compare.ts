import { FANTASY } from "@/data/week1/fantasy";
import { GAMES } from "@/data/week1/games";
import { injuryForPlayer } from "@/data/week1/injuries";
import { PLAYERS } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { qualityLabel } from "@/lib/copy";
import { formatMeasured } from "@/lib/format";
import { healthLabel } from "@/lib/health";
import { isProbabilityMarket } from "@/lib/odds";
import { MARKET_LABEL, weatherLine } from "@/lib/prop-view";
import type { HealthState, Player, Position } from "@/lib/types/domain";

export function gameForTeam(teamId: string) {
  return GAMES.find((game) => game.homeTeamId === teamId || game.awayTeamId === teamId) ?? null;
}

export type PlayerCompareRow = {
  id: string;
  name: string;
  href: string;
  teamAbbr: string;
  position: Position;
  depth: string;
  notes: string;
  health: HealthState;
  healthLabel: string;
  matchup: string;
  weather: string;
  usage: string;
  projection: string;
  projectionQuality: string;
  postedLine: string;
  postedLineQuality: string;
  tdProb: string;
  tdQuality: string;
  dkOdds: string;
  fantasyPpr: string;
};

function volumeProp(playerId: string) {
  return (
    PROPS.find((row) => row.playerId === playerId && !isProbabilityMarket(row.market)) ??
    PROPS.find((row) => row.playerId === playerId) ??
    null
  );
}

export function buildPlayerCompare(player: Player): PlayerCompareRow {
  const team = TEAM_BY_ID[player.teamId];
  const game = gameForTeam(player.teamId);
  const injury = injuryForPlayer(player.id);
  const health = injury?.health ?? "NO_KNOWN_LIMITATION";
  const away = game ? TEAM_BY_ID[game.awayTeamId].abbr : "—";
  const home = game ? TEAM_BY_ID[game.homeTeamId].abbr : "—";
  const volume = volumeProp(player.id);
  const atd = PROPS.find((row) => row.playerId === player.id && row.market === "ANYTIME_TD");
  const fantasy = FANTASY.find((row) => row.playerId === player.id);

  return {
    id: player.id,
    name: player.name,
    href: `/players/${player.id}`,
    teamAbbr: team.abbr,
    position: player.position,
    depth: player.depth ? `Depth ${player.depth}` : "Depth UNKNOWN",
    notes: player.notes ?? "No seed note.",
    health,
    healthLabel: healthLabel(health),
    matchup: game ? `${away} @ ${home}` : "DATA UNAVAILABLE",
    weather: game ? weatherLine(game.id) : "DATA UNAVAILABLE",
    usage: "DATA UNAVAILABLE — Week 1 has no usage series.",
    projection: volume ? formatMeasured(volume.model) : "DATA UNAVAILABLE",
    projectionQuality: volume ? qualityLabel(volume.model.quality) : "Not available",
    postedLine: volume
      ? isProbabilityMarket(volume.market)
        ? "No DK price"
        : `${volume.side === "OVER" ? "O" : "U"} ${formatMeasured(volume.line)} ${MARKET_LABEL[volume.market]}`
      : "DATA UNAVAILABLE",
    postedLineQuality: volume ? `${qualityLabel(volume.line.quality)} · not a live DK ticket` : "Not available",
    tdProb: atd ? formatMeasured(atd.model, 1, "pct") : "DATA UNAVAILABLE",
    tdQuality: atd ? qualityLabel(atd.model.quality) : "Not available",
    dkOdds: volume ? formatMeasured(volume.oddsAmerican, 0, "american") : "DATA UNAVAILABLE",
    fantasyPpr: fantasy ? `${formatMeasured(fantasy.ppr)} PPR · ${qualityLabel(fantasy.ppr.quality)}` : "DATA UNAVAILABLE",
  };
}

export function comparablePlayers(): Player[] {
  return [...PLAYERS].sort((a, b) => a.position.localeCompare(b.position) || a.name.localeCompare(b.name));
}

export function playerCompareRows(ids: string[]): PlayerCompareRow[] {
  return ids
    .map((id) => PLAYERS.find((player) => player.id === id))
    .filter((player): player is Player => Boolean(player))
    .slice(0, 4)
    .map(buildPlayerCompare);
}
