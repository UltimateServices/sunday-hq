import { GAMES } from "@/data/week1/games";
import { INJURIES, injuryForPlayer } from "@/data/week1/injuries";
import { OL_BY_TEAM } from "@/data/week1/ol";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAMS, TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { liveStatus } from "@/lib/game-window";
import { formatMeasured, formatNumber, spreadLabel } from "@/lib/format";
import { rbRole } from "@/lib/position-board";
import { toPropView } from "@/lib/prop-view";
import { environmentFor, impliedTeamTotals } from "@/lib/team-totals";
import type { EnvironmentTier, Game, HealthState, InjuryRecord, LiveStatus, WeatherImpact } from "@/lib/types/domain";

export type TeamField = {
  label: string;
  value: string;
  hint?: string;
};

export type TeamPlayerCard = {
  id: string;
  name: string;
  position: string;
  health: HealthState;
  note?: string;
};

export type TeamWorkspaceVM = {
  teamName: string;
  abbr: string;
  conference: string;
  division: string;
  game: Game | null;
  matchup?: string;
  kickoff?: string;
  spread?: string;
  indoor?: boolean;
  tier?: EnvironmentTier;
  weatherImpact?: WeatherImpact;
  live?: LiveStatus;
  players: TeamPlayerCard[];
  injuries: InjuryRecord[];
  overview: TeamField[];
  offense: TeamField[];
  defense: TeamField[];
  pace: TeamField[];
  redZone: TeamField[];
  markets: TeamField[];
  qb: TeamPlayerCard | null;
  olStarters: string;
  olGrade: string;
  olNote: string;
  committee: Array<TeamPlayerCard & { role: string }>;
  targets: Array<TeamPlayerCard & { share: string }>;
};

const UNAVAILABLE = "DATA UNAVAILABLE";

export function buildTeamWorkspace(teamId: string): TeamWorkspaceVM | null {
  const team = TEAMS.find((row) => row.id === teamId);
  if (!team) return null;
  const game = GAMES.find((row) => row.awayTeamId === teamId || row.homeTeamId === teamId) ?? null;
  const players = SUNDAY_PLAYERS.filter((player) => player.teamId === teamId);
  const injuries = INJURIES.filter((row) => row.teamId === teamId);
  const wx = game ? WEATHER_BY_GAME[game.id] : undefined;
  const opponentId = game ? (game.homeTeamId === teamId ? game.awayTeamId : game.homeTeamId) : null;
  const opponent = opponentId ? TEAM_BY_ID[opponentId] : null;
  const implied = game ? impliedTeamTotals(game) : { home: null, away: null };
  const impliedValue = game ? (game.homeTeamId === teamId ? implied.home : implied.away) : null;
  const ol = OL_BY_TEAM[teamId];
  const cards: TeamPlayerCard[] = players.map((player) => ({
    id: player.id,
    name: player.name,
    position: player.position,
    health: injuryForPlayer(player.id)?.health ?? "NO_KNOWN_LIMITATION",
    note: player.notes,
  }));

  const qbs = cards.filter((player) => player.position === "QB");
  const qb =
    qbs.find((player) => player.health !== "OUT" && player.health !== "IR_PUP_NFI") ?? qbs[0] ?? null;

  const propViews = PROPS.filter((prop) => players.some((player) => player.id === prop.playerId)).map((prop) =>
    toPropView(prop),
  );
  const committee = cards
    .filter((player) => player.position === "RB")
    .map((player) => {
      const rush = propViews.find((view) => view.playerId === player.id && view.market === "RUSH_YDS");
      return { ...player, role: rush ? rbRole(rush) : "ROLE UNCERTAIN" };
    });
  const targets = cards
    .filter((player) => player.position === "WR" || player.position === "TE")
    .map((player) => ({ ...player, share: UNAVAILABLE }));

  const tier = game
    ? environmentFor(game, {
        qbDowngrade: game.id === "atl-pit",
        weatherRisk: wx?.impact === "SIGNIFICANT",
      })
    : undefined;

  const overview: TeamField[] = [
    { label: "Opponent", value: opponent ? `${opponent.city} ${opponent.name}` : "No Sunday game on this slate." },
    {
      label: "Implied total",
      value: impliedValue === null ? UNAVAILABLE : formatNumber(impliedValue),
      hint: "Derived from captured DK spread + total. Not a listed team-total ticket.",
    },
    { label: "Model total", value: UNAVAILABLE, hint: "No independent team-total model is stored." },
    { label: "Injury count", value: `${injuries.length}` },
    {
      label: "Environment",
      value: tier ? tier.replaceAll("_", " ") : UNAVAILABLE,
      hint: game ? `Posted total ${formatMeasured(game.total)}.` : undefined,
    },
  ];

  const offense: TeamField[] = [
    { label: "QB", value: qb ? qb.name : UNAVAILABLE, hint: qb?.note ?? qb?.health.replaceAll("_", " ") },
    {
      label: "OL starters",
      value: ol?.starters.join(", ") ?? UNAVAILABLE,
      hint: ol ? `${ol.quality} desk — not a PFF rank.` : "No OL row stored.",
    },
    { label: "OL grade", value: ol ? `${ol.grade.toFixed(1)} (${ol.quality})` : UNAVAILABLE, hint: ol?.note },
    { label: "Pass rate", value: UNAVAILABLE, hint: "No play-by-play store." },
    { label: "Rush rate", value: UNAVAILABLE, hint: "No play-by-play store." },
    {
      label: "RB committee",
      value: committee.length ? committee.map((row) => `${row.name} (${row.role})`).join(" · ") : UNAVAILABLE,
      hint: "Role is an ESTIMATE from volume tag. Snap share stays PENDING.",
    },
    { label: "Target distribution", value: UNAVAILABLE, hint: "Target share is not invented from depth chart." },
  ];

  const defense: TeamField[] = [
    { label: "Pass defense", value: UNAVAILABLE },
    { label: "Rush defense", value: UNAVAILABLE },
    { label: "Coverage", value: UNAVAILABLE, hint: "Not a CB / man-zone grade." },
    { label: "Pressure", value: UNAVAILABLE },
    { label: "Red-zone defense", value: UNAVAILABLE },
    { label: "Defensive injuries", value: UNAVAILABLE, hint: "Desk stores offensive / skill injuries only for Week 1." },
  ];

  const pace: TeamField[] = [
    { label: "Projected plays", value: UNAVAILABLE, hint: "Pace engine is not stored." },
    { label: "Seconds per play", value: UNAVAILABLE },
    {
      label: "Game total context",
      value: game ? formatMeasured(game.total) : UNAVAILABLE,
      hint: "Posted DK game total, not a pace projection.",
    },
    { label: "Upcoming opponent", value: opponent?.abbr ?? UNAVAILABLE },
  ];

  const redZone: TeamField[] = [
    { label: "Red-zone trips", value: UNAVAILABLE },
    { label: "Red-zone TD rate", value: UNAVAILABLE },
    { label: "Inside-5", value: UNAVAILABLE },
    { label: "Goal-line role", value: UNAVAILABLE, hint: "Device / primary labels live on TD rows, not a team RZ model." },
  ];

  const markets: TeamField[] = [
    {
      label: "Implied team total",
      value: impliedValue === null ? UNAVAILABLE : formatNumber(impliedValue),
      hint: "From DK spread + total. Not a listed TT market.",
    },
    { label: "Listed team total", value: UNAVAILABLE, hint: "No DK team-total tape." },
    { label: "Model team total", value: UNAVAILABLE },
    { label: "Player-prop tape", value: UNAVAILABLE, hint: "Live DK player-prop prices are off until Odds ingest." },
    { label: "Team-total history", value: UNAVAILABLE, hint: "No closing archive for Week 1." },
  ];

  return {
    teamName: `${team.city} ${team.name}`,
    abbr: team.abbr,
    conference: team.conference,
    division: team.division,
    game,
    matchup: game ? `${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}` : undefined,
    kickoff: game?.kickoffLabel,
    spread: game ? spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value) : undefined,
    indoor: game?.indoor,
    tier,
    weatherImpact: wx?.impact ?? "UNKNOWN",
    live: game ? liveStatus(game) : undefined,
    players: cards,
    injuries,
    overview,
    offense,
    defense,
    pace,
    redZone,
    markets,
    qb,
    olStarters: ol?.starters.join(", ") ?? UNAVAILABLE,
    olGrade: ol ? `${ol.grade.toFixed(1)} (${ol.quality})` : UNAVAILABLE,
    olNote: ol?.note ?? "No OL row stored.",
    committee,
    targets,
  };
}
