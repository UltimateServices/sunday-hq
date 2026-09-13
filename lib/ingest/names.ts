import { PLAYERS } from "@/data/week1/players";
import { TEAMS } from "@/data/week1/teams";

export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’.]/g, "")
    .replace(/\b(jr|sr|iii|ii|iv)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const PLAYER_INDEX = new Map(PLAYERS.map((player) => [normalizeName(player.name), player.id]));

const LAST_NAME_INDEX = new Map<string, string[]>();
for (const player of PLAYERS) {
  const parts = normalizeName(player.name).split(" ");
  const last = parts[parts.length - 1];
  const list = LAST_NAME_INDEX.get(last) ?? [];
  list.push(player.id);
  LAST_NAME_INDEX.set(last, list);
}

export function matchPlayerId(name: string): string | null {
  const key = normalizeName(name);
  const exact = PLAYER_INDEX.get(key);
  if (exact) return exact;

  for (const [known, id] of PLAYER_INDEX) {
    if (known === key || known.includes(key) || key.includes(known)) return id;
  }

  const parts = key.split(" ");
  const last = parts[parts.length - 1];
  const candidates = LAST_NAME_INDEX.get(last) ?? [];
  if (candidates.length === 1) return candidates[0];
  return null;
}

export function teamFullName(teamId: string): string {
  const team = TEAMS.find((row) => row.id === teamId);
  if (!team) return teamId;
  return `${team.city} ${team.name}`;
}

const TEAM_ALIASES: Record<string, string> = {
  "washington football team": "was",
  "la chargers": "lac",
  "los angeles chargers": "lac",
  "la rams": "lar",
  "new york jets": "nyj",
  "new york giants": "nyg",
};

for (const team of TEAMS) {
  TEAM_ALIASES[normalizeName(`${team.city} ${team.name}`)] = team.id;
  TEAM_ALIASES[normalizeName(team.abbr)] = team.id;
  TEAM_ALIASES[normalizeName(team.name)] = team.id;
}

export function matchTeamId(name: string): string | null {
  return TEAM_ALIASES[normalizeName(name)] ?? null;
}

export function matchGameId(awayName: string, homeName: string): string | null {
  const away = matchTeamId(awayName);
  const home = matchTeamId(homeName);
  if (!away || !home) return null;
  return `${away}-${home}`;
}
