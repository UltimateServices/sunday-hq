import type { BoostOffer, MeasuredNumber } from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

function ev(value: number, note: string): MeasuredNumber {
  return {
    value,
    quality: "ESTIMATE",
    source: "assumed-juice + placeholder boost math",
    asOf: AS_OF,
    note,
  };
}

export const BOOSTS: BoostOffer[] = [
  {
    id: "boost-25",
    label: "25% profit boost (seed inventory)",
    boostPct: 25,
    minOdds: -110,
    minLegs: 2,
    markets: ["player props", "TD", "SGP"],
    expires: "2026-09-13T20:20:00-04:00",
    quality: "ESTIMATE",
    candidates: [
      {
        id: "b25-1",
        title: "Best use · DET volume SGP",
        legs: ["Gibbs rush O 84.5", "Gibbs ATD"],
        minOdds: 150,
        normalEv: ev(-0.04, "Illustrative EV at assumed juice. Not a DK SGP price."),
        boostedEv: ev(0.03, "Same construct after +25% profit. Still ESTIMATE."),
        note: "Stack correlation remains. Boost does not make a correlated SGP a priced GOOD BET.",
      },
      {
        id: "b25-2",
        title: "2nd use · Cross unders",
        legs: ["Lawrence pass U (est.)", "Rush pass U (est.)"],
        minOdds: 140,
        normalEv: ev(-0.02, "Both legs unpriced at DK."),
        boostedEv: ev(0.05, "Boost helps juice, not line honesty."),
        note: "If either research line is wrong-sided vs the real DK number, boosted EV is fiction.",
      },
      {
        id: "b25-3",
        title: "3rd use · Mayer + Gibbs ATD",
        legs: ["Mayer rec O 39.5", "Gibbs ATD"],
        minOdds: 160,
        normalEv: ev(-0.06, "Cross-game, unpriced ATD."),
        boostedEv: ev(0.01, "Near-even after boost. Not a lock and not called one."),
        note: "Mayer is opportunity. Gibbs ATD has no DK price.",
      },
    ],
  },
  {
    id: "boost-50",
    label: "50% profit boost · 3 legs (seed inventory)",
    boostPct: 50,
    minOdds: 200,
    minLegs: 3,
    markets: ["ATD", "cross-game"],
    expires: "2026-09-13T13:00:00-04:00",
    quality: "ESTIMATE",
    candidates: [
      {
        id: "b50-1",
        title: "Best use · ATD cluster",
        legs: ["Gibbs ATD", "Henry ATD", "Chase ATD"],
        minOdds: 350,
        normalEv: ev(-0.12, "Longshot juice. Independent product ~19%."),
        boostedEv: ev(-0.02, "50% profit still may not clear a fair longshot."),
        note: "Boost shrinks the hole. It does not create a guaranteed plus-EV ticket.",
      },
      {
        id: "b50-2",
        title: "2nd use · CIN stack + Gibbs",
        legs: ["Burrow O 269.5", "Chase O 85.5", "Gibbs ATD"],
        minOdds: 300,
        normalEv: ev(-0.1, "Stack correlation ignored in the product."),
        boostedEv: ev(0.02, "Illustrative only."),
        note: "Same-game stack + separate TD. Combined P is optimistic.",
      },
      {
        id: "b50-3",
        title: "3rd use · Aggressive residual",
        legs: ["Mayer O 39.5", "Etienne O 56.5", "Chase 2+"],
        minOdds: 800,
        normalEv: ev(-0.2, "Chase 2+ dominates the miss rate."),
        boostedEv: ev(-0.08, "Still negative in the placeholder math."),
        note: "Shown so the 3rd-best path is honest: boost does not rescue a tail.",
      },
    ],
  },
];
