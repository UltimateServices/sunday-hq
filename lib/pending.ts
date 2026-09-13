import type { PendingCapability } from "@/lib/types/domain";

export const PENDING_CAPABILITIES: PendingCapability[] = [
  {
    id: "ev-engine",
    phase: 3,
    title: "Props EV engine",
    summary:
      "Independent projection distribution vs DraftKings price: model prob, implied, EV, CLV-ready snapshots. Overs and unders with no side bias.",
    blockedBy: [
      "Live DraftKings prop odds ingest",
      "Trained projection model (not placeholder CDF)",
      "Alternate-line ladder + juice",
    ],
  },
  {
    id: "matchup-engine",
    phase: 4,
    title: "Matchup engines",
    summary:
      "Separate GOOD PLAYER / GOOD MATCHUP / GOOD PROJECTION / GOOD BET. Coverage, pace, pressure, slot/wide, box count, red-zone.",
    blockedBy: [
      "Play-by-play feature store",
      "Defensive role mappings",
      "Sample-size gates (Week 1 = LOW SAMPLE)",
    ],
  },
  {
    id: "parlay-boost-card",
    phase: 5,
    title: "Parlays, boosts, My Card",
    summary:
      "SGP correlation, multi-game parlays, profit-boost residual EV, unit-capped card. No loss chasing or unit inflation after early games.",
    blockedBy: [
      "Correlation matrix",
      "Boost inventory feed",
      "Card persistence + unit rules",
    ],
  },
  {
    id: "results-clv",
    phase: 6,
    title: "Results, CLV, calibration",
    summary:
      "Settle tickets, close-line value, calibration plots, model vs market error. Record then learn.",
    blockedBy: ["Settled results feed", "Closing line archive", "Calibration buckets"],
  },
  {
    id: "alerts-admin",
    phase: 7,
    title: "Alerts and admin weights",
    summary:
      "Injury/line/weather alerts plus admin-tunable model weights. Weights are configuration, not hidden narrative.",
    blockedBy: ["Alert bus", "Admin auth", "Weight versioning"],
  },
];

export function pendingForPhase(phase: number): PendingCapability | undefined {
  return PENDING_CAPABILITIES.find((item) => item.phase === phase);
}
