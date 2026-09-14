import { PROPS } from "@/data/week1/props";
import { WEEK1_META } from "@/data/week1/meta";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { environmentFor } from "@/lib/team-totals";
import type { WeekCatalog } from "@/lib/catalog";
import { oneLineWhy, qualityLabel } from "@/lib/copy";
import { isProbabilityMarket } from "@/lib/odds";
import { MARKET_LABEL, toPropView, type PropView } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import type { ConfidenceGrade, DataQuality, Game } from "@/lib/types/domain";

export const HOME_PICK_LIMIT = 10;

export type HomeTape = "LIVE" | "STALE" | "ESTIMATE";
export type HomeSectionId = "PROPS" | "OVERS" | "UNDERS" | "SPREADS";
export type HomeEdgeUnit = "yards" | "prob";

const CONF_WEIGHT: Record<ConfidenceGrade, number> = {
  "A+": 8,
  A: 7,
  "A-": 6,
  "B+": 5,
  B: 4,
  "B-": 3,
  C: 1,
  PASS: -20,
};

export type HomeScanRow = {
  id: string;
  href: string;
  who: string;
  what: string;
  context: string;
  line: string;
  edgeValue: number | null;
  edgeUnit: HomeEdgeUnit;
  grade: ConfidenceGrade;
  why: string;
  quality: DataQuality;
  qualityLabel: string;
};

export type HomeSection = {
  id: HomeSectionId;
  title: string;
  lede: string;
  rows: HomeScanRow[];
};

export function isTdMarket(market: string): boolean {
  return market === "ANYTIME_TD" || market === "FIRST_TD" || market === "TWO_PLUS_TD";
}

/** Grade first, then edge. A high-edge PASS never outranks a priced lean. */
export function compareGradeThenEdge(
  a: { grade: ConfidenceGrade; edge: number | null },
  b: { grade: ConfidenceGrade; edge: number | null },
): number {
  const grade = CONF_WEIGHT[b.grade] - CONF_WEIGHT[a.grade];
  if (grade !== 0) return grade;
  return (b.edge ?? Number.NEGATIVE_INFINITY) - (a.edge ?? Number.NEGATIVE_INFINITY);
}

function rankablePlayerPick(view: PropView): boolean {
  if (view.confidenceGrade === "PASS") return false;
  if (view.model.value === null) return false;
  if (isTdMarket(view.market)) return view.market === "ANYTIME_TD";
  return view.line.value !== null;
}

function propRow(view: PropView): HomeScanRow {
  const td = isProbabilityMarket(view.market);
  const what = td
    ? MARKET_LABEL[view.market]
    : `${MARKET_LABEL[view.market]} ${view.side === "OVER" ? "over" : "under"}`;
  const line = td ? formatMeasured(view.model, 1, "pct") : `${view.side === "OVER" ? "O" : "U"} ${formatMeasured(view.line)}`;
  return {
    id: view.id,
    href: `/players/${view.playerId}`,
    who: view.playerName,
    what,
    context: `${view.teamAbbr} ${view.position} · ${view.matchup}`,
    line,
    edgeValue: view.pricing.edge.value,
    edgeUnit: td ? "prob" : "yards",
    grade: view.confidenceGrade,
    why: oneLineWhy(view.whySections.modelCase, view.matchupNote),
    quality: view.line.quality,
    qualityLabel: qualityLabel(view.line.quality),
  };
}

function favoriteSpread(game: Game): {
  who: string;
  line: string;
  matchup: string;
} {
  const away = TEAM_BY_ID[game.awayTeamId].abbr;
  const home = TEAM_BY_ID[game.homeTeamId].abbr;
  const matchup = `${away} @ ${home}`;
  const spread = game.spreadHome.value;
  if (spread === null) return { who: matchup, line: "DATA UNAVAILABLE", matchup };
  if (spread === 0) return { who: matchup, line: "PK", matchup };
  if (spread < 0) return { who: home, line: `${home} ${spread}`, matchup };
  return { who: away, line: `${away} −${spread}`, matchup };
}

/** Posted-line research grade only. No cover model — never A / A+. */
export function spreadConfidenceGrade(game: Game): ConfidenceGrade {
  if (game.spreadHome.value === null || game.spreadHome.quality === "UNAVAILABLE") return "PASS";
  return "C";
}

function spreadWhy(game: Game): string {
  const note = game.spreadHome.note?.trim();
  if (note) return oneLineWhy([note], note);
  const env = environmentFor(game, {
    qbDowngrade: game.id === "atl-pit",
    weatherRisk: game.id === "cle-jax",
  });
  if (env === "QB_DOWNGRADE") return "QB room is OUT. Line is posted; no trained cover model.";
  if (env === "WEATHER_RISK") return "Weather can move this number. No trained cover model.";
  return "Game spread from the catalog. No trained cover model.";
}

function spreadRow(game: Game): HomeScanRow | null {
  if (game.spreadHome.value === null) return null;
  const fav = favoriteSpread(game);
  const grade = spreadConfidenceGrade(game);
  if (grade === "PASS") return null;
  return {
    id: `spread-${game.id}`,
    href: `/games/${game.id}`,
    who: fav.who,
    what: "Spread",
    context: `${fav.matchup} · ${game.kickoffLabel}`,
    line: fav.line,
    edgeValue: null,
    edgeUnit: "yards",
    grade,
    why: spreadWhy(game),
    quality: game.spreadHome.quality,
    qualityLabel: qualityLabel(game.spreadHome.quality),
  };
}

function takeTop10(rows: HomeScanRow[]): HomeScanRow[] {
  return [...rows].sort((a, b) => compareGradeThenEdge({ grade: a.grade, edge: a.edgeValue }, { grade: b.grade, edge: b.edgeValue })).slice(0, HOME_PICK_LIMIT);
}

/**
 * Shareable Home. Always builds the four Top-10 lists from catalog or Week 1 seed.
 * Live-gate never hides the structure — rows stay labeled research, not tickets.
 */
export function buildHomepage(catalog: WeekCatalog) {
  const live = catalog.liveGate.actionable;
  const propSource = catalog.props.length > 0 ? catalog.props : PROPS;
  const views = propSource.map((prop) => toPropView(prop));
  const rankable = views.filter(rankablePlayerPick);
  const props = takeTop10(rankable.map(propRow));
  const overs = takeTop10(
    rankable.filter((view) => view.side === "OVER").map(propRow),
  );
  const unders = takeTop10(
    rankable.filter((view) => view.side === "UNDER").map(propRow),
  );
  const spreadRows = catalog.games
    .map(spreadRow)
    .filter((row): row is HomeScanRow => row !== null)
    .sort((a, b) => {
      const gradeEdge = compareGradeThenEdge({ grade: a.grade, edge: a.edgeValue }, { grade: b.grade, edge: b.edgeValue });
      if (gradeEdge !== 0) return gradeEdge;
      const gameA = catalog.gameById[a.id.replace("spread-", "")];
      const gameB = catalog.gameById[b.id.replace("spread-", "")];
      const absA = Math.abs(gameA?.spreadHome.value ?? 99);
      const absB = Math.abs(gameB?.spreadHome.value ?? 99);
      if (absA !== absB) return absA - absB;
      return (gameA?.kickoffIso ?? "").localeCompare(gameB?.kickoffIso ?? "");
    })
    .slice(0, HOME_PICK_LIMIT);

  const tape: HomeTape = catalog.oddsFresh ? "LIVE" : catalog.snapshot?.status === "LIVE" ? "STALE" : "ESTIMATE";
  const notLiveLede = "Not live. Research ranks from seed/catalog — not a bet slip.";

  const sections: HomeSection[] = [
    {
      id: "PROPS",
      title: "Top 10 Props",
      lede: live ? "Highest grade, then edge. Player props only." : notLiveLede,
      rows: props,
    },
    {
      id: "OVERS",
      title: "Top 10 Overs",
      lede: live ? "Overs first-class. Same grade + edge rank." : notLiveLede,
      rows: overs,
    },
    {
      id: "UNDERS",
      title: "Top 10 Unders",
      lede: live ? "Unders first-class. Same grade + edge rank." : notLiveLede,
      rows: unders,
    },
    {
      id: "SPREADS",
      title: "Top 10 Spreads",
      lede: live
        ? "Posted game lines. Cover edge stays unavailable until a spread model ships."
        : "Game lines from seed/catalog. Quality labeled. No cover model.",
      rows: spreadRows,
    },
  ];

  return {
    week: WEEK1_META.week,
    season: WEEK1_META.season,
    slateLabel: WEEK1_META.slateLabel,
    lastRefreshLabel: catalog.lastRefreshLabel,
    lastRefreshIso: catalog.lastRefreshIso,
    nextRefreshLabel: catalog.nextRefreshLabel,
    healthState: catalog.health.state,
    healthIssues: catalog.health.issues.slice(0, 3),
    tape,
    live,
    liveBanner: catalog.liveBanner,
    staleWarning: catalog.staleWarning,
    liveGate: catalog.liveGate,
    sections,
  };
}

export type HomepageVM = ReturnType<typeof buildHomepage>;
