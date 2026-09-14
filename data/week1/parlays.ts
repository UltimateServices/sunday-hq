import type { ParlayConstruct } from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

function p(value: number, note: string) {
  return {
    value,
    quality: "ESTIMATE" as const,
    source: "placeholder independent product",
    asOf: AS_OF,
    note,
  };
}

export const PARLAYS: ParlayConstruct[] = [
  {
    id: "parlay-sgp-det",
    kind: "SGP",
    profile: "Conservative",
    title: "DET same-game volume",
    legs: [
      { propId: "prop-gibbs-rush-over", label: "Gibbs rush O 84.5", modelProb: p(0.56, "Placeholder CDF / role lean.") },
      { propId: "prop-gibbs-atd", label: "Gibbs anytime TD", modelProb: p(0.62, "Placeholder ATD.") },
    ],
    combinedProb: p(0.31, "Independent product 0.56×0.62. Same-game leakage not subtracted."),
    correlation: "STACKED",
    correlationNote: "Same player, same game. Rush yards and ATD are positively correlated. Combined P is optimistic.",
    whyFit: [
      "Indoor favorite. Highest derived DET team total.",
      "Both legs are volume expressions of the same script.",
    ],
    howLoses: [
      "A DET committee back or Goff / St. Brown scores while Gibbs still clears yards — or Gibbs is held under the rush line. No second Lions RB is in the desk.",
      "NO boxes DET and the game stays 17–13.",
      "No DK SGP price — this is a construct, not a ticket.",
    ],
    lenses: { GOOD_PLAYER: "YES", GOOD_MATCHUP: "LEAN", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" },
  },
  {
    id: "parlay-cross-unders",
    kind: "CROSS",
    profile: "Balanced",
    title: "Capped environments cross",
    legs: [
      { propId: "prop-lawrence-pass-under", label: "Lawrence pass U 219.5 (est.)", modelProb: p(0.58, "Weather + 40.5 total.") },
      { propId: "prop-rush-pass-under", label: "Rush pass U 199.5 (est.)", modelProb: p(0.61, "Emergency start.") },
    ],
    combinedProb: p(0.35, "Independent product. Games are separate — correlation UNKNOWN vs weather/news."),
    correlation: "INDEPENDENT",
    correlationNote: "Different games. Treat as independent until a correlation matrix exists.",
    whyFit: [
      "Both are structural unders: weather/script and QB downgrade.",
      "Overs are not required to have a Sunday opinion.",
    ],
    howLoses: [
      "Storms miss JAX and Lawrence throws freely.",
      "Rush line is ESTIMATE — if DK posts 175.5 the under is wrong-sided.",
      "Both lines are research estimates, not DK.",
    ],
    lenses: { GOOD_PLAYER: "NO", GOOD_MATCHUP: "NO", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" },
  },
  {
    id: "parlay-td-board",
    kind: "TD",
    profile: "Aggressive",
    title: "Anytime TD cluster",
    legs: [
      { propId: "prop-gibbs-atd", label: "Gibbs ATD", modelProb: p(0.62, "Placeholder.") },
      { propId: "prop-henry-atd", label: "Henry ATD", modelProb: p(0.58, "Placeholder.") },
      { propId: "prop-chase-atd", label: "Chase ATD", modelProb: p(0.54, "Placeholder.") },
    ],
    combinedProb: p(0.19, "Independent product 0.62×0.58×0.54. Cross-game ATD correlation UNKNOWN."),
    correlation: "UNKNOWN",
    correlationNote: "Three games. No shared-script correlation claimed.",
    whyFit: [
      "Featured scorers in three of the better environments.",
      "TD board research, not a priced longshot.",
    ],
    howLoses: [
      "Any one miss kills the ticket.",
      "Lamar sneak, a DET committee score, or Higgins.",
      "DK anytime prices DATA UNAVAILABLE — do not treat combined P as a book number.",
    ],
    lenses: { GOOD_PLAYER: "YES", GOOD_MATCHUP: "LEAN", GOOD_PROJECTION: "UNKNOWN", GOOD_BET: "NO" },
  },
  {
    id: "parlay-conservative",
    kind: "CONSERVATIVE",
    profile: "Conservative",
    title: "Two-leg research floor",
    legs: [
      { propId: "prop-gibbs-rush-over", label: "Gibbs rush O 84.5", modelProb: p(0.56, "Placeholder.") },
      { propId: "prop-lawrence-pass-under", label: "Lawrence pass U (est.)", modelProb: p(0.58, "Weather tax.") },
    ],
    combinedProb: p(0.32, "Independent product. Cross-game."),
    correlation: "INDEPENDENT",
    correlationNote: "Different games, different sides. No stack.",
    whyFit: ["One volume over, one environment under. No same-game leakage."],
    howLoses: ["DET run game stalls.", "JAX weather misses.", "Both prices unverified at DK."],
    lenses: { GOOD_PLAYER: "LEAN", GOOD_MATCHUP: "LEAN", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" },
  },
  {
    id: "parlay-balanced",
    kind: "BALANCED",
    profile: "Balanced",
    title: "CIN stack + DET volume",
    legs: [
      { propId: "prop-burrow-pass-over", label: "Burrow pass O 269.5", modelProb: p(0.54, "Small placeholder edge.") },
      { propId: "prop-chase-rec-over", label: "Chase rec O 85.5", modelProb: p(0.55, "Stacked with Burrow.") },
      { propId: "prop-gibbs-atd", label: "Gibbs ATD", modelProb: p(0.62, "Separate game.") },
    ],
    combinedProb: p(0.18, "Independent product ignores Burrow↔Chase positive correlation."),
    correlation: "STACKED",
    correlationNote: "Burrow + Chase is a same-game stack. Combined P is optimistic.",
    whyFit: ["Highest-total game stack plus a separate TD lean."],
    howLoses: [
      "CIN script goes run-heavy.",
      "Chase knee limits routes while Burrow still throws.",
      "Gibbs is held out of the end zone.",
    ],
    lenses: { GOOD_PLAYER: "YES", GOOD_MATCHUP: "LEAN", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" },
  },
  {
    id: "parlay-aggressive",
    kind: "AGGRESSIVE",
    profile: "Aggressive",
    title: "Residual + weather + 2+",
    legs: [
      { propId: "prop-mayer-rec-over", label: "Mayer rec O 39.5", modelProb: p(0.57, "Bowers OUT residual.") },
      { propId: "prop-etienne-rush-over", label: "Etienne rush O 56.5", modelProb: p(0.53, "Kamara conflict.") },
      { propId: "prop-chase-2td", label: "Chase 2+ TD", modelProb: p(0.14, "Tail.") },
    ],
    combinedProb: p(0.04, "Independent product. Aggressive profile on purpose — not a recommendation to fire."),
    correlation: "UNKNOWN",
    correlationNote: "Three games. Etienne role is SOURCE CONFLICT. Chase 2+ is a tail.",
    whyFit: ["Shows the Aggressive generator path: residual + conditional volume + tail TD."],
    howLoses: [
      "Kamara plays and Etienne compresses.",
      "Mayer vacuum leaks to Jeanty.",
      "Chase 2+ is the usual killer. Combined P is a warning, not a tease.",
    ],
    lenses: { GOOD_PLAYER: "LEAN", GOOD_MATCHUP: "UNKNOWN", GOOD_PROJECTION: "UNKNOWN", GOOD_BET: "NO" },
  },
];
