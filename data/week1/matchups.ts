import type { MatchupGrade, MeasuredNumber, QualifierGrade, QualifierLens } from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

function score(value: number, note: string): MeasuredNumber {
  return {
    value,
    quality: "LOW_SAMPLE",
    source: "Week 1 matchup placeholder",
    asOf: AS_OF,
    note,
  };
}

function lenses(
  player: QualifierGrade,
  matchup: QualifierGrade,
  projection: QualifierGrade,
  bet: QualifierGrade,
): Record<QualifierLens, QualifierGrade> {
  return {
    GOOD_PLAYER: player,
    GOOD_MATCHUP: matchup,
    GOOD_PROJECTION: projection,
    GOOD_BET: bet,
  };
}

export const MATCHUPS: MatchupGrade[] = [
  {
    id: "mu-burrow",
    playerId: "burrow",
    gameId: "tb-cin",
    position: "QB",
    panel: "BEST",
    overall: score(7.4, "Script/total lean only. Coverage grade is LOW SAMPLE."),
    factors: [
      { id: "pace", label: "Pace", score: 8, quality: "LOW_SAMPLE", note: "Highest Sunday total (50.5) is the pace proxy." },
      { id: "pressure", label: "Pressure", score: null, quality: "UNAVAILABLE", note: "Pressure-to-sack feature store not wired." },
      { id: "coverage", label: "Coverage", score: null, quality: "UNAVAILABLE", note: "Do not invent a TB coverage rank." },
      { id: "rz", label: "Red zone", score: 7, quality: "ESTIMATE", note: "Shootout script can raise RZ trips. Not a trained RZ model." },
    ],
    lenses: lenses("YES", "LEAN", "LEAN", "UNKNOWN"),
    why: {
      modelCase: ["TB @ CIN 50.5 is the Sunday ceiling.", "Burrow is a GOOD PLAYER in a high-total script."],
      supporting: ["Indoor-adjacent outdoor but no SIGNIFICANT weather flag."],
      risks: ["Coverage engine UNAVAILABLE.", "Projection > line is not a bet."],
      marketContext: ["Consensus 269.5. DK odds DATA UNAVAILABLE."],
      dataQuality: ["Week 1 = LOW SAMPLE.", "Matchup scores are placeholders, not 2025 ranks recycled as facts."],
    },
    note: "BEST QB panel is environment + player quality, not a priced GOOD BET.",
  },
  {
    id: "mu-rush",
    playerId: "rush",
    gameId: "atl-pit",
    position: "QB",
    panel: "WORST",
    overall: score(2.1, "Emergency start. GOOD PLAYER is NO."),
    factors: [
      { id: "pace", label: "Pace", score: 3, quality: "ESTIMATE", note: "42.5 total + QB_DOWNGRADE." },
      { id: "pressure", label: "Pressure", score: 3, quality: "ESTIMATE", note: "PIT home. Pressure feature still LOW SAMPLE." },
      { id: "coverage", label: "Coverage", score: 4, quality: "LOW_SAMPLE", note: "Do not invent a PIT secondary grade." },
      { id: "rz", label: "Red zone", score: 2, quality: "ESTIMATE", note: "Rush is not a designed RZ creator." },
    ],
    lenses: lenses("NO", "NO", "LEAN", "UNKNOWN"),
    why: {
      modelCase: ["Tua and Penix OUT. Rush starts."],
      supporting: ["Under is the structurally honest passing side if a line exists near 200."],
      risks: ["Line is ESTIMATE, not DK.", "Bijan can still produce without Rush yards."],
      marketContext: ["No consensus Rush pass line ingested."],
      dataQuality: ["Verified inactive context. Pass-yard number is ESTIMATE."],
    },
    note: "WORST QB is a downgrade environment, not a player insult beyond the tape we have.",
  },
  {
    id: "mu-gibbs",
    playerId: "gibbs",
    gameId: "no-det",
    position: "RB",
    panel: "BEST",
    overall: score(7.8, "Indoor favorite, highest derived home team total."),
    factors: [
      { id: "box", label: "Box count", score: null, quality: "UNAVAILABLE", note: "Box-count engine not wired." },
      { id: "pace", label: "Pace", score: 8, quality: "CONSENSUS", note: "49.5 indoor, DET -7." },
      { id: "rz", label: "Red zone", score: 7, quality: "ESTIMATE", note: "Favorite script can raise RZ carries. Montgomery split unknown." },
      { id: "pass-down", label: "Pass-down role", score: 7, quality: "ESTIMATE", note: "Receiving work not fully split-modeled." },
    ],
    lenses: lenses("YES", "LEAN", "LEAN", "UNKNOWN"),
    why: {
      modelCase: ["Indoor favorite. Implied DET team total leads Sunday RB environments."],
      supporting: ["Kamara SOURCE CONFLICT may pull NO from a clean box."],
      risks: ["Montgomery split.", "Blowout can cut closing rushes."],
      marketContext: ["Consensus 84.5 rush. DK odds DATA UNAVAILABLE."],
      dataQuality: ["LOW SAMPLE. Box count UNAVAILABLE."],
    },
    note: "BEST RB matchup ≠ priced rush over.",
  },
  {
    id: "mu-etienne",
    playerId: "etienne",
    gameId: "no-det",
    position: "RB",
    panel: "WORST",
    overall: score(3.6, "Role is conditional. DET front + road dog."),
    factors: [
      { id: "box", label: "Box count", score: null, quality: "UNAVAILABLE", note: "Box-count engine not wired." },
      { id: "pace", label: "Pace", score: 6, quality: "CONSENSUS", note: "49.5 indoor, but NO is the dog." },
      { id: "role", label: "Role stability", score: 2, quality: "SOURCE_CONFLICT", note: "Kamara seed OUT vs CBS QUESTIONABLE." },
      { id: "rz", label: "Red zone", score: 4, quality: "ESTIMATE", note: "If Kamara plays, RZ compresses." },
    ],
    lenses: lenses("LEAN", "NO", "LEAN", "UNKNOWN"),
    why: {
      modelCase: ["Volume lean only if Kamara is limited/OUT."],
      supporting: ["Owner seed treats Etienne as the successor."],
      risks: ["SOURCE CONFLICT.", "Negative script can raise receiving and cut rushing."],
      marketContext: ["Consensus 56.5. Not a GOOD BET until inactives + DK price."],
      dataQuality: ["SOURCE CONFLICT on the lead back. Week 1 LOW SAMPLE."],
    },
    note: "WORST here means unstable role, not a talent verdict.",
  },
  {
    id: "mu-chase",
    playerId: "chase",
    gameId: "tb-cin",
    position: "WR",
    panel: "BEST",
    overall: score(7.2, "Featured WR in the Sunday ceiling game."),
    factors: [
      { id: "slot-wide", label: "Slot / wide", score: null, quality: "UNAVAILABLE", note: "Alignment feature store not wired." },
      { id: "coverage", label: "Coverage", score: null, quality: "UNAVAILABLE", note: "Do not invent TB CB ranks." },
      { id: "pace", label: "Pace", score: 8, quality: "CONSENSUS", note: "50.5 DK total." },
      { id: "rz", label: "Red zone", score: 6, quality: "ESTIMATE", note: "Share PENDING." },
    ],
    lenses: lenses("YES", "LEAN", "LEAN", "UNKNOWN"),
    why: {
      modelCase: ["Highest-total Sunday game. Featured target."],
      supporting: ["Placeholder mean 91 vs 85.5 consensus."],
      risks: ["Camp knee scare.", "Higgins target share not verified."],
      marketContext: ["Consensus 85.5. DK odds DATA UNAVAILABLE."],
      dataQuality: ["LOW SAMPLE. Coverage UNAVAILABLE."],
    },
    note: "GOOD PLAYER + high total. Coverage still UNKNOWN.",
  },
  {
    id: "mu-london",
    playerId: "london",
    gameId: "atl-pit",
    position: "WR",
    panel: "WORST",
    overall: score(3.2, "GOOD PLAYER can survive. ATL pass environment cannot."),
    factors: [
      { id: "qb", label: "QB environment", score: 2, quality: "VERIFIED", note: "Rush starts. Tua + Penix OUT." },
      { id: "coverage", label: "Coverage", score: null, quality: "UNAVAILABLE", note: "PIT coverage grade not invented." },
      { id: "pace", label: "Pace", score: 3, quality: "CONSENSUS", note: "42.5 total." },
      { id: "rz", label: "Red zone", score: 3, quality: "ESTIMATE", note: "Emergency QB caps designed looks." },
    ],
    lenses: lenses("YES", "NO", "NO", "UNKNOWN"),
    why: {
      modelCase: ["Player quality is not the issue. The passer is."],
      supporting: ["London remains startable in fantasy. That is not a receiving over."],
      risks: ["Do not chase ATL pass stack."],
      marketContext: ["No consensus London line in the seed."],
      dataQuality: ["QB status VERIFIED. WR matchup features UNAVAILABLE."],
    },
    note: "WORST WR panel is environment, not a talent fade.",
  },
  {
    id: "mu-mayer",
    playerId: "mayer",
    gameId: "mia-lv",
    position: "TE",
    panel: "BEST",
    overall: score(6.1, "Opportunity residual after verified Bowers OUT."),
    factors: [
      { id: "role", label: "Role", score: 7, quality: "VERIFIED", note: "Bowers meniscus OUT. Mayer is the on-roster TE." },
      { id: "coverage", label: "Coverage", score: null, quality: "UNAVAILABLE", note: "MIA TE coverage PENDING." },
      { id: "pace", label: "Pace", score: 4, quality: "CONSENSUS", note: "41.5 indoor is not a shootout." },
      { id: "vacuum", label: "Target vacuum", score: 6, quality: "ESTIMATE", note: "Vacuum can leak to Jeanty / WRs." },
    ],
    lenses: lenses("LEAN", "UNKNOWN", "LEAN", "UNKNOWN"),
    why: {
      modelCase: ["Verified Bowers OUT. Consensus 39.5 already prices residual TE work."],
      supporting: ["Placeholder mean 45 vs 39.5."],
      risks: ["Not Bowers.", "Low total.", "GOOD PLAYER is LEAN at best."],
      marketContext: ["Consensus 39.5. DK odds DATA UNAVAILABLE."],
      dataQuality: ["Injury VERIFIED. Projection ESTIMATE. Week 1 LOW SAMPLE."],
    },
    note: "BEST TE is opportunity, not a locked TE1.",
  },
  {
    id: "mu-bowers",
    playerId: "bowers",
    gameId: "mia-lv",
    position: "TE",
    panel: "WORST",
    overall: score(0, "OUT. Do not research a live snap."),
    factors: [
      { id: "avail", label: "Availability", score: 0, quality: "VERIFIED", note: "Meniscus surgery. OUT." },
      { id: "role", label: "Role", score: 0, quality: "VERIFIED", note: "Not in the game." },
      { id: "coverage", label: "Coverage", score: null, quality: "UNAVAILABLE", note: "Irrelevant while OUT." },
      { id: "pace", label: "Pace", score: 4, quality: "CONSENSUS", note: "Game still exists; he does not." },
    ],
    lenses: lenses("NO", "NO", "NO", "NO"),
    why: {
      modelCase: ["OUT after meniscus surgery."],
      supporting: ["Mayer is the residual research name."],
      risks: ["Any Bowers ticket is a void/loss path."],
      marketContext: ["Do not invent a Bowers line."],
      dataQuality: ["VERIFIED inactive."],
    },
    note: "WORST TE is availability, not a matchup fade.",
  },
];

export const MATCHUPS_BY_POS = {
  QB: MATCHUPS.filter((m) => m.position === "QB"),
  RB: MATCHUPS.filter((m) => m.position === "RB"),
  WR: MATCHUPS.filter((m) => m.position === "WR"),
  TE: MATCHUPS.filter((m) => m.position === "TE"),
};
