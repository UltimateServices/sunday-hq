import { GAMES } from "@/data/week1/games";
import { PLAYERS, SUNDAY_PLAYERS } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAMS } from "@/data/week1/teams";
import { MARKET_LABEL } from "@/lib/prop-view";
import { TEAM_BY_ID } from "@/data/week1/teams";

export type SearchHit = {
  id: string;
  kind: "player" | "team" | "game" | "prop" | "book";
  label: string;
  sub: string;
  href: string;
};

const BOARDS: SearchHit[] = [
  {
    id: "board-volume",
    kind: "prop",
    label: "Volume board",
    sub: "Safe / ceiling / floor · ELITE stability ESTIMATE",
    href: "/volume",
  },
];

const BOOKS: SearchHit[] = [
  {
    id: "book-dk",
    kind: "book",
    label: "DraftKings",
    sub: "Primary book · player-prop odds DATA UNAVAILABLE",
    href: "/markets",
  },
  {
    id: "book-consensus",
    kind: "book",
    label: "Consensus desk",
    sub: "Seed consensus lines · not a live DK price",
    href: "/props",
  },
];

export function searchIndex(): SearchHit[] {
  const players = SUNDAY_PLAYERS.map((p) => ({
    id: `player-${p.id}`,
    kind: "player" as const,
    label: p.name,
    sub: `${TEAM_BY_ID[p.teamId]?.abbr ?? ""} ${p.position}`,
    href: `/players/${p.id}`,
  }));
  const sundayTeamIds = new Set(GAMES.flatMap((g) => [g.awayTeamId, g.homeTeamId]));
  const teams = TEAMS.filter((t) => sundayTeamIds.has(t.id)).map((t) => ({
    id: `team-${t.id}`,
    kind: "team" as const,
    label: `${t.city} ${t.name}`,
    sub: t.abbr,
    href: `/teams/${t.id}`,
  }));
  const games = GAMES.map((g) => ({
    id: `game-${g.id}`,
    kind: "game" as const,
    label: `${TEAM_BY_ID[g.awayTeamId].abbr} @ ${TEAM_BY_ID[g.homeTeamId].abbr}`,
    sub: `${g.kickoffLabel} · ${g.network}`,
    href: `/games/${g.id}`,
  }));
  const props = PROPS.map((p) => {
    const player = PLAYERS.find((x) => x.id === p.playerId);
    return {
      id: `prop-${p.id}`,
      kind: "prop" as const,
      label: `${player?.name ?? p.playerId} ${MARKET_LABEL[p.market]} ${p.side}`,
      sub: p.line.value !== null ? `Line ${p.line.value} · ${p.line.quality}` : "Line DATA UNAVAILABLE",
      href: `/props?focus=${p.id}`,
    };
  });
  return [...players, ...teams, ...games, ...props, ...BOARDS, ...BOOKS];
}

export function runSearch(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  return searchIndex()
    .filter((hit) => `${hit.label} ${hit.sub} ${hit.kind}`.toLowerCase().includes(q))
    .slice(0, 20);
}
