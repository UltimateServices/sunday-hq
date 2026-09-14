import type { MatchupGrade } from "@/lib/types/domain";
import { rbRoleForId, rbRoleLabel } from "@/lib/rb-roles";
import { MARKET_LABEL, type PropView } from "@/lib/prop-view";

export type PositionHero = {
  id: string;
  label: string;
  who: string;
  href: string;
  detail: string;
};

function topBy(
  views: PropView[],
  pred: (view: PropView) => boolean,
  score: (view: PropView) => number | null,
): PropView | null {
  const ranked = views
    .filter((view) => pred(view) && view.confidenceGrade !== "PASS")
    .map((view) => ({ view, score: score(view) }))
    .filter((row) => row.score !== null)
    .sort((a, b) => (b.score ?? -999) - (a.score ?? -999));
  return ranked[0]?.view ?? null;
}

function heroFromView(label: string, view: PropView | null, fallback: string): PositionHero {
  if (!view) {
    return { id: label, label, who: "DATA UNAVAILABLE", href: "#", detail: fallback };
  }
  const line = view.line.value !== null ? `${view.side === "OVER" ? "O" : "U"} ${view.line.value}` : MARKET_LABEL[view.market];
  return {
    id: `${label}-${view.id}`,
    label,
    who: view.playerName,
    href: `/players/${view.playerId}`,
    detail: `${MARKET_LABEL[view.market]} ${line} · model ${view.model.value ?? "—"}`,
  };
}

export function qbHeroes(views: PropView[], matchups: MatchupGrade[]): PositionHero[] {
  const pass = topBy(views, (v) => v.market === "PASS_YDS", (v) => v.model.value);
  const passTd = topBy(views, (v) => v.market === "PASS_TD" || v.market === "ANYTIME_TD", (v) => v.model.value);
  const rush = topBy(views, (v) => v.market === "RUSH_YDS", (v) => v.model.value);
  const edge = topBy(views, (v) => v.market === "PASS_YDS" || v.market === "RUSH_YDS", (v) => v.pricing.edge.value);
  const match = [...matchups].filter((row) => row.position === "QB").sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];
  const matchView = match ? views.find((v) => v.playerId === match.playerId) ?? null : null;
  return [
    heroFromView("Highest passing projection", pass, "No pass-yard model in the seed for this board."),
    heroFromView("Highest passing TD", passTd, "No pass-TD / ATD model in the seed."),
    heroFromView("Best matchup (script proxy)", matchView, "No QB matchup grade stored."),
    heroFromView("Best rushing QB", rush, "No QB rush-yard model in the seed."),
    heroFromView("Largest market edge", edge, "No rankable QB edge until a line exists."),
  ];
}

export function rbHeroes(views: PropView[], matchups: MatchupGrade[]): PositionHero[] {
  const rush = topBy(views, (v) => v.market === "RUSH_YDS", (v) => v.model.value);
  const rec = topBy(views, (v) => v.market === "RECEPTIONS" || v.market === "REC_YDS", (v) => v.model.value);
  const td = topBy(views, (v) => v.market === "ANYTIME_TD", (v) => v.model.value);
  const safest = topBy(
    views,
    (v) => v.market === "RUSH_YDS" && (v.health === "NO_KNOWN_LIMITATION" || v.health === "MINOR_CONCERN"),
    (v) => v.model.value,
  );
  const match = [...matchups].filter((row) => row.position === "RB").sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];
  const matchView = match ? views.find((v) => v.playerId === match.playerId) ?? null : null;
  const safestHero = heroFromView("Safest workload", safest, "No clean-availability rush projection.");
  if (safest) {
    const role = rbRoleForId(safest.playerId);
    safestHero.detail = `${safestHero.detail}${role ? ` · ${rbRoleLabel(role)}` : ""}`;
  }
  return [
    heroFromView("Highest rush projection", rush, "No rush-yard model in the seed."),
    heroFromView("Receiving work", rec, "No RB receiving model in the seed."),
    heroFromView("TD probability", td, "No ATD model in the seed."),
    safestHero,
    heroFromView("Best matchup (script proxy)", matchView, "No RB matchup grade stored."),
  ];
}

export function wrHeroes(views: PropView[], matchups: MatchupGrade[]): PositionHero[] {
  const yards = topBy(views, (v) => v.market === "REC_YDS", (v) => v.model.value);
  const rec = topBy(views, (v) => v.market === "RECEPTIONS", (v) => v.model.value);
  const td = topBy(views, (v) => v.market === "ANYTIME_TD" || v.market === "REC_TD", (v) => v.model.value);
  const edge = topBy(views, (v) => v.market === "REC_YDS", (v) => v.pricing.edge.value);
  const match = [...matchups].filter((row) => row.position === "WR").sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];
  const matchView = match ? views.find((v) => v.playerId === match.playerId) ?? null : null;
  return [
    heroFromView("Highest yard projection", yards, "No rec-yard model in the seed."),
    heroFromView("Reception projection", rec, "No receptions model in the seed."),
    heroFromView("TD probability", td, "No WR TD model in the seed."),
    heroFromView("Largest market edge", edge, "No rankable WR edge."),
    heroFromView("Best coverage matchup (script proxy)", matchView, "Coverage is a script proxy — not a CB rank."),
  ];
}

export function teHeroes(views: PropView[], matchups: MatchupGrade[]): PositionHero[] {
  const yards = topBy(views, (v) => v.market === "REC_YDS", (v) => v.model.value);
  const rec = topBy(views, (v) => v.market === "RECEPTIONS", (v) => v.model.value);
  const td = topBy(views, (v) => v.market === "ANYTIME_TD" || v.market === "REC_TD", (v) => v.model.value);
  const match = [...matchups].filter((row) => row.position === "TE").sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];
  const matchView = match ? views.find((v) => v.playerId === match.playerId) ?? null : null;
  const edge = topBy(views, () => true, (v) => v.pricing.edge.value);
  return [
    heroFromView("Highest yard projection", yards, "No TE rec-yard model in the seed."),
    heroFromView("Reception projection", rec, "No TE receptions model in the seed."),
    heroFromView("TD probability", td, "No TE TD model in the seed."),
    heroFromView("Best matchup (script proxy)", matchView, "No TE matchup grade stored."),
    heroFromView("Largest market edge", edge, "No rankable TE edge."),
  ];
}

export function heroesFor(position: string, views: PropView[], matchups: MatchupGrade[]): PositionHero[] {
  if (position === "QB") return qbHeroes(views, matchups);
  if (position === "RB") return rbHeroes(views, matchups);
  if (position === "WR") return wrHeroes(views, matchups);
  if (position === "TE") return teHeroes(views, matchups);
  return [];
}
