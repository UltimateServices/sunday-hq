import { PLAYERS } from "@/data/week1/players";
import { TEAMS } from "@/data/week1/teams";
import { PARLAYS } from "@/data/week1/parlays";
import { PROPS } from "@/data/week1/props";
import { FANTASY } from "@/data/week1/fantasy";
import { MATCHUPS } from "@/data/week1/matchups";

/**
 * Known-wrong or out-of-desk names. Montgomery is HOU (traded from DET March 2026)
 * and is not in the Week 1 player seed — do not write him as a Lions RB2 / Gibbs vulture.
 */
const STALE_PLAYER_NAMES = [
  "montgomery",
  "saylors",
  "vaki",
  "pacheco",
  "craig reynolds",
  "sione vaki",
];

function narrativeBlobs(): string[] {
  const blobs: string[] = [];
  for (const row of PARLAYS) {
    blobs.push(...row.whyFit, ...row.howLoses, row.correlationNote);
  }
  for (const row of PROPS) {
    blobs.push(...row.why, ...row.risks, row.weatherNote, row.movement.note);
  }
  for (const row of FANTASY) {
    blobs.push(row.note);
  }
  for (const row of MATCHUPS) {
    blobs.push(row.note);
    for (const factor of row.factors) blobs.push(factor.note);
    if (row.why) {
      blobs.push(...row.why.modelCase, ...row.why.supporting, ...row.why.risks, ...row.why.marketContext, ...row.why.dataQuality);
    }
  }
  return blobs;
}

export function staleRosterHits(texts: string[] = narrativeBlobs()): string[] {
  const roster = new Set(
    PLAYERS.flatMap((player) => {
      const parts = player.name.toLowerCase().split(/\s+/);
      return [player.id.toLowerCase(), player.name.toLowerCase(), parts[parts.length - 1] ?? ""];
    }),
  );
  const hits: string[] = [];
  for (const text of texts) {
    const lower = text.toLowerCase();
    for (const name of STALE_PLAYER_NAMES) {
      if (!lower.includes(name)) continue;
      if (roster.has(name)) continue;
      hits.push(`${name} ← "${text}"`);
    }
  }
  return hits;
}

export function assertRosterNarratives(): void {
  const hits = staleRosterHits();
  if (hits.length) {
    throw new Error(
      `Stale roster narrative (name not in data/week1/players.ts). Prefer generic copy (“committee RB vultures TDs”) until live roster ingest exists.\n${hits.join("\n")}`,
    );
  }
}

/** Team tokens are valid in copy even when the player is not modeled. */
export function rosterTeamTokens(): string[] {
  return TEAMS.flatMap((team) => [team.abbr, team.city, team.name]);
}
