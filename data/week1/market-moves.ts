import type { MarketMoveEvent } from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

export const MARKET_MOVES: MarketMoveEvent[] = [
  {
    id: "mv-nyj-ten-1",
    gameId: "nyj-ten",
    market: "GAME_TOTAL",
    at: "2026-09-10T18:00:00-04:00",
    from: null,
    to: 38.5,
    heat: "QUIET",
    note: "Owner seed opener / consensus floor. Not independently re-verified as a live DK print.",
    quality: "CONSENSUS",
  },
  {
    id: "mv-nyj-ten-2",
    gameId: "nyj-ten",
    market: "GAME_TOTAL",
    at: AS_OF,
    from: 38.5,
    to: 39.5,
    heat: "WARM",
    note: "ESPN DK widget 39.5 at capture. +1.0 vs owner floor. Still Sunday's lowest total.",
    quality: "VERIFIED",
  },
  {
    id: "mv-tb-cin",
    gameId: "tb-cin",
    market: "GAME_TOTAL",
    at: AS_OF,
    from: 50.5,
    to: 50.5,
    heat: "QUIET",
    note: "Highest Sunday DK total. No opener stored — movement UNKNOWN besides the live print.",
    quality: "VERIFIED",
  },
  {
    id: "mv-cle-jax",
    gameId: "cle-jax",
    market: "GAME_TOTAL",
    at: AS_OF,
    from: 40.5,
    to: 40.5,
    heat: "QUIET",
    note: "Capped environment. Weather flag is the research, not a steam alert.",
    quality: "VERIFIED",
  },
  {
    id: "mv-atl-pit",
    gameId: "atl-pit",
    market: "SPREAD",
    at: AS_OF,
    from: -3.5,
    to: -3.5,
    heat: "QUIET",
    note: "PIT -3.5 at capture. QB downgrade is news, not a captured spread steam.",
    quality: "VERIFIED",
  },
  {
    id: "mv-mayer",
    gameId: "mia-lv",
    market: "PROP",
    at: AS_OF,
    from: null,
    to: 39.5,
    heat: "WARM",
    note: "Mayer 39.5 consensus after Bowers OUT. Not a verified DK player-prop tape.",
    quality: "CONSENSUS",
  },
];

export function movesForGame(gameId: string): MarketMoveEvent[] {
  return MARKET_MOVES.filter((m) => m.gameId === gameId).sort((a, b) => a.at.localeCompare(b.at));
}
