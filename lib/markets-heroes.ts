import { TEAM_BY_ID } from "@/data/week1/teams";
import { formatNumber, formatSigned } from "@/lib/format";
import type { Game, MarketMoveEvent } from "@/lib/types/domain";

export type MarketHero = {
  id: string;
  label: string;
  value: string;
  sub: string;
  href: string;
};

function matchup(game: Game | undefined): string {
  if (!game) return "Unknown game";
  return `${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}`;
}

function numericMoves(moves: MarketMoveEvent[]) {
  return moves
    .filter((move) => move.from !== null && move.to !== null)
    .map((move) => ({
      ...move,
      delta: (move.to as number) - (move.from as number),
    }));
}

export function marketHeroes(games: Game[], moves: MarketMoveEvent[]): MarketHero[] {
  const gameById = Object.fromEntries(games.map((game) => [game.id, game]));
  const numbered = numericMoves(moves);

  const largest = [...numbered].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];
  const mostActiveId = Object.entries(
    moves.reduce<Record<string, number>>((acc, move) => {
      acc[move.gameId] = (acc[move.gameId] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0];

  const byKey = new Map<string, MarketMoveEvent[]>();
  for (const move of numbered.sort((a, b) => a.at.localeCompare(b.at))) {
    const key = `${move.gameId}:${move.market}`;
    const list = byKey.get(key) ?? [];
    list.push(move);
    byKey.set(key, list);
  }
  let reverse: (MarketMoveEvent & { delta: number }) | undefined;
  for (const list of byKey.values()) {
    for (let i = 1; i < list.length; i += 1) {
      const prev = list[i - 1] as MarketMoveEvent & { delta: number };
      const curr = list[i] as MarketMoveEvent & { delta: number };
      if (prev.delta !== 0 && curr.delta !== 0 && Math.sign(prev.delta) !== Math.sign(curr.delta)) {
        reverse = curr;
      }
    }
  }

  return [
    {
      id: "line",
      label: "Largest line move",
      value: largest && largest.delta !== 0 ? `${matchup(gameById[largest.gameId])} ${formatSigned(largest.delta)}` : "PENDING",
      sub: largest && largest.delta !== 0
        ? `${largest.market.replaceAll("_", " ")} ${formatNumber(largest.from)} → ${formatNumber(largest.to)} · ${largest.quality}`
        : "No captured open→current delta on this seed.",
      href: largest ? `/games/${largest.gameId}` : "/markets",
    },
    {
      id: "odds",
      label: "Largest odds move",
      value: "PENDING",
      sub: "No captured American-odds tape. Player-prop prices stay DATA UNAVAILABLE.",
      href: "/markets",
    },
    {
      id: "active",
      label: "Most active market",
      value: mostActiveId ? matchup(gameById[mostActiveId[0]]) : "PENDING",
      sub: mostActiveId ? `${mostActiveId[1]} captured prints · game totals / spreads only` : "No movement rows stored.",
      href: mostActiveId ? `/games/${mostActiveId[0]}` : "/markets",
    },
    {
      id: "reverse",
      label: "Largest reverse move",
      value: reverse ? `${matchup(gameById[reverse.gameId])} ${formatSigned(reverse.delta)}` : "PENDING",
      sub: reverse
        ? `${reverse.market.replaceAll("_", " ")} reversed vs the prior print.`
        : "No captured reverse (up then down, or down then up) on this seed.",
      href: reverse ? `/games/${reverse.gameId}` : "/markets",
    },
  ];
}
