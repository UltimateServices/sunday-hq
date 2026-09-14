import { WEEK1_META } from "@/data/week1/meta";
import type { WeekCatalog } from "@/lib/catalog";
import { isProbabilityMarket } from "@/lib/odds";
import { toPropView, type PropView } from "@/lib/prop-view";
import { teamTotalRows, type TeamTotalRow } from "@/lib/team-total-view";
import type { AlertItem, ConfidenceGrade } from "@/lib/types/domain";

export const HOME_PICK_LIMIT = 10;
export const HOME_ALERT_LIMIT = 5;

export type HomeTape = "LIVE" | "STALE" | "ESTIMATE";
export type HomeChip = "ALL" | "OVERS" | "UNDERS" | "TDS" | "TEAM_TOTALS";

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

export function isTdMarket(market: string): boolean {
  return market === "ANYTIME_TD" || market === "FIRST_TD" || market === "TWO_PLUS_TD";
}

export function homeChipFor(view: PropView): Exclude<HomeChip, "ALL" | "TEAM_TOTALS"> {
  if (isTdMarket(view.market)) return "TDS";
  if (view.side === "UNDER") return "UNDERS";
  return "OVERS";
}

/**
 * Cross-market rank. EV at assumed -110 is ESTIMATE for ranking only — never a DK price.
 * Confidence is the second axis so a high-edge PASS does not outrank a priced B- lean.
 */
export function pickRankScore(view: PropView): number {
  if (view.confidenceGrade === "PASS") return Number.NEGATIVE_INFINITY;
  const ev = view.pricing.ev.value ?? -1;
  const prob = view.pricing.modelProb.value ?? 0.5;
  return ev * 220 + CONF_WEIGHT[view.confidenceGrade] * 5 + (prob - 0.5) * 18;
}

function rankablePlayerPick(view: PropView): boolean {
  if (view.confidenceGrade === "PASS") return false;
  if (view.model.value === null) return false;
  if (isTdMarket(view.market)) return view.market === "ANYTIME_TD";
  return view.line.value !== null;
}

function rankTeamTotal(row: TeamTotalRow): number {
  return Math.abs(row.edge ?? 0);
}

export function buildHomepage(catalog: WeekCatalog) {
  const views = catalog.props.map((prop) => toPropView(prop));
  const mixed = views.filter(rankablePlayerPick).sort((a, b) => pickRankScore(b) - pickRankScore(a));
  const overs = views
    .filter((view) => view.side === "OVER" && !isTdMarket(view.market) && view.confidenceGrade !== "PASS" && view.line.value !== null)
    .sort((a, b) => pickRankScore(b) - pickRankScore(a));
  const unders = views
    .filter((view) => view.side === "UNDER" && view.confidenceGrade !== "PASS" && view.line.value !== null)
    .sort((a, b) => pickRankScore(b) - pickRankScore(a));
  const tds = views
    .filter((view) => isTdMarket(view.market) && view.confidenceGrade !== "PASS" && view.model.value !== null)
    .sort((a, b) => pickRankScore(b) - pickRankScore(a));
  const teamTotals = teamTotalRows(catalog.games)
    .filter((row) => row.line.value !== null && row.edge !== null)
    .sort((a, b) => rankTeamTotal(b) - rankTeamTotal(a));

  const alerts = [...catalog.alerts]
    .filter((alert) => alert.severity === "CRITICAL" || alert.severity === "IMPORTANT")
    .sort((a, b) => {
      if (a.severity === b.severity) return 0;
      return a.severity === "CRITICAL" ? -1 : 1;
    })
    .slice(0, HOME_ALERT_LIMIT);

  const tape: HomeTape = catalog.oddsFresh ? "LIVE" : catalog.snapshot?.status === "LIVE" ? "STALE" : "ESTIMATE";

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
    liveBanner: catalog.liveBanner,
    staleWarning: catalog.staleWarning,
    alerts,
    picks: {
      ALL: mixed.slice(0, HOME_PICK_LIMIT),
      OVERS: overs.slice(0, HOME_PICK_LIMIT),
      UNDERS: unders.slice(0, HOME_PICK_LIMIT),
      TDS: tds.slice(0, HOME_PICK_LIMIT),
    },
    teamTotals: teamTotals.slice(0, HOME_PICK_LIMIT),
  };
}

export type HomepageVM = ReturnType<typeof buildHomepage>;
export type HomepageAlert = AlertItem;
