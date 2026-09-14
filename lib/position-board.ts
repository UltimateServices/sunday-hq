import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { GAME_BY_ID } from "@/data/week1/games";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import type { WeekCatalog } from "@/lib/catalog";
import { formatMeasured, formatNumber } from "@/lib/format";
import { compareGradeThenEdge } from "@/lib/homepage";
import { MARKET_LABEL, toPropView, type PropView } from "@/lib/prop-view";
import type { ConfidenceGrade, HealthState, MatchupGrade, Position } from "@/lib/types/domain";

export function positionViews(catalog: WeekCatalog, position: Position): PropView[] {
  const source = catalog.props.length > 0 ? catalog.props : PROPS;
  return source.filter((prop) => PLAYER_BY_ID[prop.playerId]?.position === position).map((prop) => toPropView(prop));
}

export type PositionHero = {
  id: string;
  label: string;
  value: string;
  sub: string;
  href: string;
};

export type RbRole =
  | "WORKHORSE"
  | "LEAD BACK"
  | "COMMITTEE"
  | "PASS-DOWN BACK"
  | "GOAL-LINE BACK"
  | "ROLE UNCERTAIN";

export function rbRole(view: PropView): RbRole {
  if (view.tdRole === "DEVICE") return "GOAL-LINE BACK";
  if (view.volumeTag === "HIGH" && view.tdRole === "PRIMARY") return "WORKHORSE";
  if (view.volumeTag === "HIGH") return "LEAD BACK";
  if (view.market === "REC_YDS" || view.market === "RECEPTIONS") return "PASS-DOWN BACK";
  if (view.volumeTag === "MED") return "COMMITTEE";
  return "ROLE UNCERTAIN";
}

function pick(
  views: PropView[],
  pred: (view: PropView) => boolean,
  score: (view: PropView) => number,
): PropView | undefined {
  return [...views.filter(pred)].sort((a, b) => score(b) - score(a))[0];
}

export function positionHeroes(
  position: Position,
  views: PropView[],
  matchups: MatchupGrade[],
): PositionHero[] {
  const liveViews = views.filter((view) => view.confidenceGrade !== "PASS");
  const byModel = (market: string) =>
    pick(liveViews, (view) => view.market === market, (view) => view.model.value ?? -1);
  const bestEdge = [...liveViews].sort((a, b) =>
    compareGradeThenEdge(
      { grade: a.confidenceGrade, edge: a.pricing.edge.value },
      { grade: b.confidenceGrade, edge: b.pricing.edge.value },
    ),
  )[0];
  const bestMatch = [...matchups]
    .filter((row) => row.position === position)
    .sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];

  const cards: PositionHero[] = [];
  const pushView = (id: string, label: string, view?: PropView, extra?: string) => {
    cards.push({
      id,
      label,
      value: view ? view.playerName : "PENDING",
      sub: view
        ? `${MARKET_LABEL[view.market]} ${view.side === "OVER" ? "O" : "U"} ${view.line.value ?? "—"} · ${extra ?? view.confidenceGrade}`
        : "No seeded row. Not invented.",
      href: view
        ? `/players/${view.playerId}`
        : `/${position === "QB" ? "quarterbacks" : position === "RB" ? "running-backs" : position === "WR" ? "wide-receivers" : "tight-ends"}`,
    });
  };

  if (position === "QB") {
    pushView("pass", "Highest passing projection", byModel("PASS_YDS"));
    pushView("ptd", "Highest passing TD", byModel("PASS_TD") ?? byModel("ANYTIME_TD"));
    cards.push({
      id: "match",
      label: "Best matchup",
      value: bestMatch ? (views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only") : "PENDING",
      sub: bestMatch ? `Matchup ${bestMatch.overall.value} · ESTIMATE` : "Matchup engine has no QB row.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
    pushView("rush", "Best rushing QB", byModel("RUSH_YDS") ?? byModel("RUSH_TD"));
    pushView("edge", "Largest market edge", bestEdge);
  } else if (position === "RB") {
    pushView("rush", "Highest rush projection", byModel("RUSH_YDS"));
    pushView(
      "carry",
      "Carry / volume lean",
      liveViews.find((view) => view.volumeTag === "HIGH" && view.market === "RUSH_YDS"),
    );
    pushView("td", "TD probability", byModel("ANYTIME_TD") ?? byModel("RUSH_TD"));
    pushView(
      "safe",
      "Safest workload",
      pick(liveViews, (view) => view.market === "RUSH_YDS" && view.volumeTag === "HIGH", () => 2),
    );
    cards.push({
      id: "match",
      label: "Best matchup",
      value: bestMatch ? (views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only") : "PENDING",
      sub: bestMatch ? `Matchup ${bestMatch.overall.value} · ESTIMATE` : "Matchup engine has no RB row.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
  } else if (position === "WR") {
    pushView("yds", "Highest yard projection", byModel("REC_YDS"));
    pushView(
      "tgt",
      "Target / volume lean",
      liveViews.find((view) => view.volumeTag === "HIGH" && view.market === "REC_YDS"),
    );
    pushView("rec", "Reception projection", byModel("RECEPTIONS") ?? byModel("REC_YDS"));
    pushView("td", "TD probability", byModel("ANYTIME_TD") ?? byModel("REC_TD"));
    cards.push({
      id: "cover",
      label: "Best coverage matchup",
      value: bestMatch ? (views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only") : "PENDING",
      sub: bestMatch
        ? `${bestMatch.note} Coverage grade is a script proxy — not a CB rank.`
        : "WR matchup drawer PENDING.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
  } else {
    pushView("yds", "Highest yard projection", byModel("REC_YDS"));
    pushView("td", "TD probability", byModel("ANYTIME_TD") ?? byModel("REC_TD"));
    pushView("edge", "Largest market edge", bestEdge);
    cards.push({
      id: "match",
      label: "Coverage matchup",
      value: bestMatch ? (views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only") : "PENDING",
      sub: bestMatch ? `Matchup ${bestMatch.overall.value} · ESTIMATE` : "TE coverage PENDING.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
  }

  return cards;
}

export type PositionCell = {
  label: string;
  value: string;
  pending?: boolean;
};

export type PositionTableRow = {
  playerId: string;
  playerName: string;
  teamAbbr: string;
  opponent: string;
  href: string;
  health: HealthState;
  confidence: ConfidenceGrade;
  role?: RbRole;
  cells: PositionCell[];
};

function viewFor(views: PropView[], playerId: string, market: string): PropView | undefined {
  return views.find((view) => view.playerId === playerId && view.market === market);
}

function modelCell(label: string, view?: PropView): PositionCell {
  if (!view || view.model.value === null) return { label, value: "PENDING", pending: true };
  return { label, value: formatMeasured(view.model), pending: false };
}

function probCell(label: string, view?: PropView): PositionCell {
  if (!view || view.pricing.modelProb.value === null) return { label, value: "PENDING", pending: true };
  return { label, value: formatMeasured(view.pricing.modelProb, 1, "pct"), pending: false };
}

function opponentLabel(playerId: string, gameId: string): string {
  const player = PLAYER_BY_ID[playerId];
  const game = GAME_BY_ID[gameId];
  if (!player || !game) return "—";
  const away = player.teamId === game.awayTeamId;
  const opp = TEAM_BY_ID[away ? game.homeTeamId : game.awayTeamId]?.abbr ?? "—";
  return away ? `@ ${opp}` : `vs ${opp}`;
}

function matchupCell(matchups: MatchupGrade[], playerId: string, label = "Matchup"): PositionCell {
  const row = matchups.find((item) => item.playerId === playerId);
  if (!row || row.overall.value === null) return { label, value: "PENDING", pending: true };
  return { label, value: `${formatNumber(row.overall.value)} · ESTIMATE`, pending: false };
}

export function positionTableColumns(position: Position): string[] {
  if (position === "QB") {
    return [
      "Attempts",
      "Completions",
      "Pass Yards",
      "Pass TD",
      "INT Probability",
      "Rush Yards",
      "Rush TD %",
      "Fantasy",
      "Matchup",
      "OL Grade",
      "Weather",
    ];
  }
  if (position === "RB") {
    return [
      "Carries",
      "Rush Yards",
      "Targets",
      "Receptions",
      "Receiving Yards",
      "Scrimmage Yards",
      "Goal-Line Share",
      "TD %",
      "2+ TD %",
      "Snap %",
      "Matchup",
    ];
  }
  if (position === "WR") {
    return [
      "Targets",
      "Receptions",
      "Receiving Yards",
      "Air Yards",
      "Target Share",
      "First Read %",
      "Red Zone %",
      "TD %",
      "100+ %",
      "Coverage Grade",
      "Weather",
    ];
  }
  return ["Routes", "Targets", "Receptions", "Yards", "Red Zone Targets", "TD %", "Coverage Matchup", "Fantasy"];
}

export function positionTableRows(
  position: Position,
  views: PropView[],
  matchups: MatchupGrade[],
): PositionTableRow[] {
  const players = [...new Set(views.map((view) => view.playerId))]
    .map((id) => PLAYER_BY_ID[id])
    .filter((player) => player && player.position === position);

  const rows = players.map((player) => {
    const playerViews = views.filter((view) => view.playerId === player.id);
    const primary =
      playerViews.find((view) =>
        position === "QB"
          ? view.market === "PASS_YDS"
          : position === "RB"
            ? view.market === "RUSH_YDS"
            : view.market === "REC_YDS",
      ) ?? playerViews[0];
    const fan = FANTASY_BY_PLAYER[player.id];
    const wx = primary ? WEATHER_BY_GAME[primary.gameId] : undefined;
    const weatherCell: PositionCell = wx
      ? { label: "Weather", value: wx.indoor ? "DOME" : wx.impact, pending: wx.impact === "UNKNOWN" }
      : { label: "Weather", value: "PENDING", pending: true };
    const fantasyCell: PositionCell = fan?.ppr.value != null
      ? { label: "Fantasy", value: formatNumber(fan.ppr.value), pending: false }
      : { label: "Fantasy", value: "PENDING", pending: true };

    let cells: PositionCell[] = [];
    if (position === "QB") {
      cells = [
        { label: "Attempts", value: "PENDING", pending: true },
        modelCell("Completions", viewFor(playerViews, player.id, "COMPLETIONS")),
        modelCell("Pass Yards", viewFor(playerViews, player.id, "PASS_YDS")),
        modelCell("Pass TD", viewFor(playerViews, player.id, "PASS_TD")),
        { label: "INT Probability", value: "PENDING", pending: true },
        modelCell("Rush Yards", viewFor(playerViews, player.id, "RUSH_YDS")),
        probCell("Rush TD %", viewFor(playerViews, player.id, "RUSH_TD")),
        fantasyCell,
        matchupCell(matchups, player.id),
        { label: "OL Grade", value: "PENDING", pending: true },
        weatherCell,
      ];
    } else if (position === "RB") {
      const rush = viewFor(playerViews, player.id, "RUSH_YDS");
      const rec = viewFor(playerViews, player.id, "REC_YDS");
      const scrimmage =
        rush?.model.value != null && rec?.model.value != null
          ? { label: "Scrimmage Yards", value: formatNumber((rush.model.value ?? 0) + (rec.model.value ?? 0)), pending: false }
          : { label: "Scrimmage Yards", value: "PENDING", pending: true };
      cells = [
        { label: "Carries", value: "PENDING", pending: true },
        modelCell("Rush Yards", rush),
        { label: "Targets", value: "PENDING", pending: true },
        modelCell("Receptions", viewFor(playerViews, player.id, "RECEPTIONS")),
        modelCell("Receiving Yards", rec),
        scrimmage,
        { label: "Goal-Line Share", value: "PENDING", pending: true },
        probCell("TD %", viewFor(playerViews, player.id, "ANYTIME_TD") ?? viewFor(playerViews, player.id, "RUSH_TD")),
        { label: "2+ TD %", value: "PENDING", pending: true },
        { label: "Snap %", value: "PENDING", pending: true },
        matchupCell(matchups, player.id),
      ];
    } else if (position === "WR") {
      cells = [
        { label: "Targets", value: "PENDING", pending: true },
        modelCell("Receptions", viewFor(playerViews, player.id, "RECEPTIONS")),
        modelCell("Receiving Yards", viewFor(playerViews, player.id, "REC_YDS")),
        { label: "Air Yards", value: "PENDING", pending: true },
        { label: "Target Share", value: "PENDING", pending: true },
        { label: "First Read %", value: "PENDING", pending: true },
        { label: "Red Zone %", value: "PENDING", pending: true },
        probCell("TD %", viewFor(playerViews, player.id, "ANYTIME_TD") ?? viewFor(playerViews, player.id, "REC_TD")),
        { label: "100+ %", value: "PENDING", pending: true },
        matchupCell(matchups, player.id, "Coverage Grade"),
        weatherCell,
      ];
    } else {
      cells = [
        { label: "Routes", value: "PENDING", pending: true },
        { label: "Targets", value: "PENDING", pending: true },
        modelCell("Receptions", viewFor(playerViews, player.id, "RECEPTIONS")),
        modelCell("Yards", viewFor(playerViews, player.id, "REC_YDS")),
        { label: "Red Zone Targets", value: "PENDING", pending: true },
        probCell("TD %", viewFor(playerViews, player.id, "ANYTIME_TD") ?? viewFor(playerViews, player.id, "REC_TD")),
        matchupCell(matchups, player.id, "Coverage Matchup"),
        fantasyCell,
      ];
    }

    return {
      playerId: player.id,
      playerName: player.name,
      teamAbbr: TEAM_BY_ID[player.teamId].abbr,
      opponent: primary ? opponentLabel(player.id, primary.gameId) : "—",
      href: `/players/${player.id}`,
      health: primary?.health ?? "NO_KNOWN_LIMITATION",
      confidence: primary?.confidenceGrade ?? "C",
      role: position === "RB" && primary ? rbRole(primary) : undefined,
      cells,
    };
  });

  return rows.sort((a, b) => {
    const aYds = Number.parseFloat(a.cells.find((cell) => cell.label.includes("Yards"))?.value ?? "") || -1;
    const bYds = Number.parseFloat(b.cells.find((cell) => cell.label.includes("Yards"))?.value ?? "") || -1;
    return bYds - aYds;
  });
}
