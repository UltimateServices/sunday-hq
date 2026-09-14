import { PLAYER_BY_ID } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import type { WeekCatalog } from "@/lib/catalog";
import type { MatchupGrade, Position } from "@/lib/types/domain";
import { compareGradeThenEdge } from "@/lib/homepage";
import { toPropView, type PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";

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
    compareGradeThenEdge({ grade: a.confidenceGrade, edge: a.pricing.edge.value }, { grade: b.confidenceGrade, edge: b.pricing.edge.value }),
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
      href: view ? `/players/${view.playerId}` : `/${position === "QB" ? "quarterbacks" : position === "RB" ? "running-backs" : position === "WR" ? "wide-receivers" : "tight-ends"}`,
    });
  };

  if (position === "QB") {
    pushView("pass", "Highest passing projection", byModel("PASS_YDS"));
    pushView("ptd", "Highest passing TD", byModel("PASS_TD") ?? byModel("ANYTIME_TD"));
    cards.push({
      id: "match",
      label: "Best matchup",
      value: bestMatch ? views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only" : "PENDING",
      sub: bestMatch ? `Matchup ${bestMatch.overall.value} · ESTIMATE` : "Matchup engine has no QB row.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
    pushView("rush", "Best rushing QB", byModel("RUSH_YDS") ?? byModel("RUSH_TD"));
    pushView("edge", "Largest market edge", bestEdge);
  } else if (position === "RB") {
    pushView("rush", "Highest rush projection", byModel("RUSH_YDS"));
    pushView("carry", "Carry / volume lean", liveViews.find((view) => view.volumeTag === "HIGH" && view.market === "RUSH_YDS"));
    pushView("td", "TD probability", byModel("ANYTIME_TD") ?? byModel("RUSH_TD"));
    pushView("safe", "Safest workload", pick(liveViews, (view) => view.market === "RUSH_YDS" && view.volumeTag === "HIGH", (view) => (view.volumeTag === "HIGH" ? 2 : 0)));
    cards.push({
      id: "match",
      label: "Best matchup",
      value: bestMatch ? views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only" : "PENDING",
      sub: bestMatch ? `Matchup ${bestMatch.overall.value} · ESTIMATE` : "Matchup engine has no RB row.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
  } else if (position === "WR") {
    pushView("yds", "Highest yard projection", byModel("REC_YDS"));
    pushView("tgt", "Target / volume lean", liveViews.find((view) => view.volumeTag === "HIGH" && view.market === "REC_YDS"));
    pushView("rec", "Reception projection", byModel("RECEPTIONS") ?? byModel("REC_YDS"));
    pushView("td", "TD probability", byModel("ANYTIME_TD") ?? byModel("REC_TD"));
    cards.push({
      id: "cover",
      label: "Best coverage matchup",
      value: bestMatch ? views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only" : "PENDING",
      sub: bestMatch ? `${bestMatch.note} Coverage grade is a script proxy — not a CB rank.` : "WR matchup drawer PENDING.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
  } else {
    pushView("yds", "Highest yard projection", byModel("REC_YDS"));
    pushView("td", "TD probability", byModel("ANYTIME_TD") ?? byModel("REC_TD"));
    pushView("edge", "Largest market edge", bestEdge);
    cards.push({
      id: "match",
      label: "Coverage matchup",
      value: bestMatch ? views.find((view) => view.playerId === bestMatch.playerId)?.playerName ?? "Estimate only" : "PENDING",
      sub: bestMatch ? `Matchup ${bestMatch.overall.value} · ESTIMATE` : "TE coverage PENDING.",
      href: bestMatch ? `/players/${bestMatch.playerId}` : "/matchups",
    });
  }

  return cards;
}
