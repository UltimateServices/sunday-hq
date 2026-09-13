import type { FantasyProjection } from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

function placeholder(value: number, note: string) {
  return {
    value,
    quality: "ESTIMATE" as const,
    source: "Phase 2 fantasy placeholder",
    asOf: AS_OF,
    note,
  };
}

function unavailable(note: string) {
  return {
    value: null,
    quality: "UNAVAILABLE" as const,
    source: "sunday-hq",
    asOf: null,
    note,
  };
}

export const FANTASY: FantasyProjection[] = [
  {
    playerId: "gibbs",
    gameId: "no-det",
    ppr: placeholder(19.4, "Placeholder only. Not a hosted fantasy projection service."),
    halfPpr: placeholder(17.1, "Placeholder only."),
    standard: placeholder(14.8, "Placeholder only."),
    note: "Lead Lions back, indoor favorite. Touch split with Montgomery not modeled.",
  },
  {
    playerId: "henry",
    gameId: "bal-ind",
    ppr: placeholder(16.8, "Placeholder only."),
    halfPpr: placeholder(16.2, "Placeholder only."),
    standard: placeholder(15.6, "Placeholder only."),
    note: "Workhorse. Lamar vulture risk in standard/TD-heavy.",
  },
  {
    playerId: "chase",
    gameId: "tb-cin",
    ppr: placeholder(18.6, "Placeholder only."),
    halfPpr: placeholder(16.4, "Placeholder only."),
    standard: placeholder(14.2, "Placeholder only."),
    note: "Highest-total game. Residual knee concern.",
  },
  {
    playerId: "etienne",
    gameId: "no-det",
    ppr: placeholder(14.2, "Conditional on Kamara status."),
    halfPpr: placeholder(12.8, "Conditional on Kamara status."),
    standard: placeholder(11.5, "Conditional on Kamara status."),
    note: "SOURCE CONFLICT on Kamara. Treat as a range, not a point.",
  },
  {
    playerId: "mayer",
    gameId: "mia-lv",
    ppr: placeholder(9.4, "Bowers OUT residual."),
    halfPpr: placeholder(8.1, "Bowers OUT residual."),
    standard: placeholder(6.8, "Bowers OUT residual."),
    note: "Opportunity TE, not a locked TE1.",
  },
  {
    playerId: "nabers",
    gameId: "dal-nyg",
    ppr: unavailable("GAME-TIME DECISION. No fantasy point invented."),
    halfPpr: unavailable("GAME-TIME DECISION."),
    standard: unavailable("GAME-TIME DECISION."),
    note: "If active, he is a player you start in fantasy. That is not a prop bet.",
  },
  {
    playerId: "rush",
    gameId: "atl-pit",
    ppr: placeholder(8.2, "Emergency start. Superflex fringe only."),
    halfPpr: placeholder(8.2, "Emergency start."),
    standard: placeholder(8.2, "Emergency start."),
    note: "ESPN: do not start even in superflex. Placeholder kept low on purpose.",
  },
  {
    playerId: "bijan",
    gameId: "atl-pit",
    ppr: placeholder(17.5, "QB downgrade does not automatically bench Bijan."),
    halfPpr: placeholder(16.2, "Placeholder."),
    standard: placeholder(14.9, "Placeholder."),
    note: "GOOD PLAYER can survive a backup QB. GOOD BET on ATL pass does not.",
  },
];

export const FANTASY_BY_PLAYER = Object.fromEntries(FANTASY.map((f) => [f.playerId, f]));
