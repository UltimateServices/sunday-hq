import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { INJURIES } from "@/data/week1/injuries";
import { MARKET_MOVES } from "@/data/week1/market-moves";
import { PARLAYS } from "@/data/week1/parlays";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { WeekCatalog } from "@/lib/catalog";
import { compareGradeThenEdge, isTdMarket } from "@/lib/homepage";
import { gameScript } from "@/lib/game-script";
import { MARKET_LABEL, toPropView, type PropView } from "@/lib/prop-view";
import { derivedTeamTotals, environmentFor, impliedTeamTotals } from "@/lib/team-totals";
import type { Game, Position, WeatherRecord } from "@/lib/types/domain";

function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export type EnvScore = {
  id: "GAME" | "PASS" | "RUSH" | "TD";
  label: string;
  score: number | null;
  note: string;
};

export type GameFactor = {
  id: string;
  side: "POSITIVE" | "NEGATIVE";
  title: string;
  detail: string;
};

export type GamePlayerRow = {
  playerId: string;
  name: string;
  position: Position;
  teamAbbr: string;
  usage: string;
  yards: string;
  receptions: string;
  tdProb: string;
  fantasy: string;
  topProp: string;
  confidence: string;
};

export function environmentScores(game: Game, wx?: WeatherRecord): EnvScore[] {
  const total = game.total.value;
  const implied = impliedTeamTotals(game);
  const env = environmentFor(game, {
    qbDowngrade: game.id === "atl-pit",
    weatherRisk: wx?.impact === "SIGNIFICANT",
  });
  const base = total === null ? null : clamp100((total - 34) * 5.8);
  const wxTax = wx?.impact === "SIGNIFICANT" ? 18 : wx?.impact === "MODERATE" ? 8 : 0;
  const qbTax = env === "QB_DOWNGRADE" ? 22 : 0;
  const indoorBoost = game.indoor ? 6 : 0;
  const note = "ESTIMATE script proxy from DK total + weather + QB room. Not a trained 0–100 engine.";

  const gameScore = base;
  const passScore = base === null ? null : clamp100(base - wxTax - qbTax + indoorBoost);
  const rushScore = base === null ? null : clamp100(52 + (implied.home ?? 22) - 22 - (wxTax ? 4 : 0));
  const tdScore =
    implied.home === null || implied.away === null
      ? null
      : clamp100(((implied.home + implied.away) / 48) * 100);

  return [
    { id: "GAME", label: "Game environment", score: gameScore, note },
    { id: "PASS", label: "Passing environment", score: passScore, note },
    { id: "RUSH", label: "Rushing environment", score: rushScore, note },
    { id: "TD", label: "TD environment", score: tdScore, note },
  ];
}

export function keyFactors(game: Game, wx?: WeatherRecord): GameFactor[] {
  const factors: GameFactor[] = [];
  const env = environmentFor(game, {
    qbDowngrade: game.id === "atl-pit",
    weatherRisk: wx?.impact === "SIGNIFICANT",
  });
  if (env === "SHOOTOUT") {
    factors.push({
      id: "shootout",
      side: "POSITIVE",
      title: "Highest-total script",
      detail: `Posted total ${game.total.value ?? "DATA UNAVAILABLE"}. Shootout ≠ automatic overs.`,
    });
  }
  if (game.indoor) {
    factors.push({
      id: "indoor",
      side: "POSITIVE",
      title: "Indoor / roof",
      detail: "Weather is not the limiter.",
    });
  }
  if (env === "CAPPED") {
    factors.push({
      id: "capped",
      side: "NEGATIVE",
      title: "Capped total",
      detail: `Posted total ${game.total.value ?? "DATA UNAVAILABLE"} is a Sunday floor-ish environment.`,
    });
  }
  if (env === "QB_DOWNGRADE") {
    factors.push({
      id: "qb",
      side: "NEGATIVE",
      title: "QB room downgrade",
      detail: "Atlanta starters OUT. Rush starts. Do not chase ATL pass.",
    });
  }
  if (wx?.impact === "SIGNIFICANT" || wx?.impact === "MODERATE") {
    factors.push({
      id: "wx",
      side: "NEGATIVE",
      title: "Material weather",
      detail: wx.impactNote,
    });
  }
  const injuries = INJURIES.filter((row) => row.gameId === game.id && ["OUT", "QUESTIONABLE", "GAME_TIME_DECISION", "HIGH_RISK"].includes(row.health));
  for (const inj of injuries.slice(0, 4)) {
    factors.push({
      id: inj.id,
      side: inj.health === "OUT" || inj.health === "HIGH_RISK" ? "NEGATIVE" : "NEGATIVE",
      title: inj.headline,
      detail: inj.detail,
    });
  }
  if (factors.length === 0) {
    factors.push({
      id: "neutral",
      side: "POSITIVE",
      title: "No material flags in seed",
      detail: "Missing engines stay unlabeled. We will not invent a factor to fill the board.",
    });
  }
  return factors;
}

export function gamePlayerRows(game: Game, views: PropView[]): GamePlayerRow[] {
  const players = SUNDAY_PLAYERS.filter((p) => p.teamId === game.awayTeamId || p.teamId === game.homeTeamId);
  return players.map((player) => {
    const props = views.filter((view) => view.playerId === player.id);
    const yard = props.find((view) => ["PASS_YDS", "RUSH_YDS", "REC_YDS"].includes(view.market));
    const rec = props.find((view) => view.market === "RECEPTIONS");
    const td = props.find((view) => view.market === "ANYTIME_TD");
    const fan = FANTASY_BY_PLAYER[player.id];
    const top = [...props].sort((a, b) =>
      compareGradeThenEdge({ grade: a.confidenceGrade, edge: a.pricing.edge.value }, { grade: b.confidenceGrade, edge: b.pricing.edge.value }),
    )[0];
    return {
      playerId: player.id,
      name: player.name,
      position: player.position,
      teamAbbr: TEAM_BY_ID[player.teamId].abbr,
      usage: top?.volumeTag ?? "PENDING",
      yards: yard ? `${yard.side === "OVER" ? "O" : "U"} ${yard.line.value ?? "—"}` : "DATA UNAVAILABLE",
      receptions: rec ? `${rec.line.value ?? "—"}` : "DATA UNAVAILABLE",
      tdProb: td?.model.value != null ? `${Math.round(td.model.value * 100)}%` : "DATA UNAVAILABLE",
      fantasy: fan?.ppr.value != null ? fan.ppr.value.toFixed(1) : "DATA UNAVAILABLE",
      topProp: top ? `${MARKET_LABEL[top.market]} ${top.side === "OVER" ? "O" : "U"}` : "NO SEEDED PROP",
      confidence: top?.confidenceGrade ?? "PASS",
    };
  });
}

export function buildGameWorkspace(catalog: WeekCatalog, game: Game) {
  const wx = catalog.weather.find((row) => row.gameId === game.id);
  const source = catalog.props.length > 0 ? catalog.props : PROPS;
  const views = source.filter((prop) => prop.gameId === game.id).map((prop) => toPropView(prop));
  const rankable = views.filter((view) => view.confidenceGrade !== "PASS");
  const overs = [...rankable]
    .filter((view) => view.side === "OVER" && !isTdMarket(view.market))
    .sort((a, b) => compareGradeThenEdge({ grade: a.confidenceGrade, edge: a.pricing.edge.value }, { grade: b.confidenceGrade, edge: b.pricing.edge.value }))
    .slice(0, 3);
  const unders = [...rankable]
    .filter((view) => view.side === "UNDER")
    .sort((a, b) => compareGradeThenEdge({ grade: a.confidenceGrade, edge: a.pricing.edge.value }, { grade: b.confidenceGrade, edge: b.pricing.edge.value }))
    .slice(0, 3);
  const tds = [...rankable]
    .filter((view) => isTdMarket(view.market))
    .sort((a, b) => compareGradeThenEdge({ grade: a.confidenceGrade, edge: a.pricing.edge.value }, { grade: b.confidenceGrade, edge: b.pricing.edge.value }))
    .slice(0, 3);
  const teamTotals = derivedTeamTotals(catalog.games).filter((row) => row.gameId === game.id);
  const parlays = PARLAYS.filter((row) => row.legs.some((leg) => views.some((view) => view.id === leg.propId)));
  const moves = MARKET_MOVES.filter((row) => row.gameId === game.id);

  return {
    live: catalog.liveGate.actionable,
    liveGate: catalog.liveGate,
    away: TEAM_BY_ID[game.awayTeamId],
    home: TEAM_BY_ID[game.homeTeamId],
    wx,
    script: gameScript(game),
    implied: impliedTeamTotals(game),
    scores: environmentScores(game, wx),
    factors: keyFactors(game, wx),
    players: gamePlayerRows(game, views),
    views,
    overs,
    unders,
    tds,
    teamTotals,
    parlays: parlays.slice(0, 2),
    moves: moves.length ? moves : MARKET_MOVES.filter((row) => row.gameId === game.id),
    news: catalog.alerts.filter((alert) => alert.href.includes(game.id)).slice(0, 4),
  };
}

export type GameWorkspaceVM = ReturnType<typeof buildGameWorkspace>;
