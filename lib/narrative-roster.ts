import { PLAYERS, PLAYER_BY_ID } from "@/data/week1/players";
import { TEAMS } from "@/data/week1/teams";
import { GAME_BY_ID, GAMES } from "@/data/week1/games";
import { PARLAYS } from "@/data/week1/parlays";
import { PROPS } from "@/data/week1/props";
import { FANTASY } from "@/data/week1/fantasy";
import { MATCHUPS } from "@/data/week1/matchups";
import { AVOIDS, CHANGES, NEWS } from "@/data/week1/news";
import { ALERTS } from "@/data/week1/alerts";
import { BOOSTS } from "@/data/week1/boosts";
import { OL_UNITS } from "@/data/week1/ol";
import { SEED_CARD } from "@/data/week1/card";
import { INJURIES } from "@/data/week1/injuries";
import { DATA_SOURCES, FEATURE_FLAGS, SUNDAY_ROUTINE } from "@/data/week1/admin";
import { MARKET_MOVES } from "@/data/week1/market-moves";
import { RESULTS } from "@/data/week1/results";

/**
 * Known-wrong or out-of-desk names. Montgomery is HOU (traded from DET March 2026)
 * and is not in the Week 1 player seed — do not write him as a Lions RB2 / Gibbs vulture.
 */
const STALE_PLAYER_NAMES = [
  "montgomery",
  "david montgomery",
  "saylors",
  "craig reynolds",
  "vaki",
  "sione vaki",
  "pacheco",
  "isiah pacheco",
  "lions rb2",
  "detroit rb2",
  "det rb2",
];

function narrativeBlobs(): string[] {
  const blobs: string[] = [];
  for (const row of PARLAYS) {
    blobs.push(...row.whyFit, ...row.howLoses, row.correlationNote);
  }
  for (const row of PROPS) {
    blobs.push(...row.why, ...row.risks, row.weatherNote, row.movement.note, row.matchupNote);
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
  for (const row of NEWS) {
    blobs.push(row.title, row.body);
  }
  for (const row of CHANGES) {
    blobs.push(row.title, row.from, row.to, row.implication);
  }
  for (const row of AVOIDS) {
    blobs.push(row.title, row.reason);
  }
  for (const row of ALERTS) {
    blobs.push(row.title, row.body);
  }
  for (const row of BOOSTS) {
    blobs.push(row.label);
    for (const candidate of row.candidates) {
      blobs.push(candidate.title, candidate.note, ...candidate.legs);
    }
  }
  for (const row of OL_UNITS) {
    blobs.push(row.note);
  }
  for (const row of SEED_CARD) {
    blobs.push(row.note);
  }
  for (const row of INJURIES) {
    blobs.push(row.headline, row.detail);
  }
  for (const row of DATA_SOURCES) {
    blobs.push(row.name, row.note);
  }
  for (const row of FEATURE_FLAGS) {
    blobs.push(row.label, row.note);
  }
  for (const row of SUNDAY_ROUTINE) {
    blobs.push(row.label, row.note);
  }
  for (const row of MARKET_MOVES) {
    blobs.push(row.note);
  }
  for (const row of RESULTS) {
    blobs.push(row.label, row.note);
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

function playerOnGame(playerId: string, gameId: string): boolean {
  const player = PLAYER_BY_ID[playerId];
  const game = GAME_BY_ID[gameId] ?? GAMES.find((row) => row.id === gameId);
  if (!player || !game) return false;
  return game.homeTeamId === player.teamId || game.awayTeamId === player.teamId;
}

function seedRefHits(): string[] {
  const hits: string[] = [];

  function requirePlayer(id: string, where: string) {
    if (!PLAYER_BY_ID[id]) hits.push(`missing player ${id} ← ${where}`);
  }

  function requirePlayerOnGame(playerId: string, gameId: string, where: string) {
    requirePlayer(playerId, where);
    if (!GAME_BY_ID[gameId] && !GAMES.some((row) => row.id === gameId)) {
      hits.push(`missing game ${gameId} ← ${where}`);
      return;
    }
    if (PLAYER_BY_ID[playerId] && !playerOnGame(playerId, gameId)) {
      const player = PLAYER_BY_ID[playerId];
      hits.push(`wrong-team ${player.name} (${player.teamId}) on ${gameId} ← ${where}`);
    }
  }

  for (const row of PROPS) {
    requirePlayerOnGame(row.playerId, row.gameId, `prop ${row.id}`);
  }
  for (const row of FANTASY) {
    requirePlayerOnGame(row.playerId, row.gameId, `fantasy ${row.playerId}`);
  }
  for (const row of MATCHUPS) {
    requirePlayerOnGame(row.playerId, row.gameId, `matchup ${row.id}`);
  }
  for (const row of INJURIES) {
    requirePlayerOnGame(row.playerId, row.gameId, `injury ${row.id}`);
    const player = PLAYER_BY_ID[row.playerId];
    if (player && player.teamId !== row.teamId) {
      hits.push(`injury team ${row.teamId} ≠ roster ${player.teamId} for ${player.name}`);
    }
    for (const beneficiary of row.beneficiaryPlayerIds) {
      requirePlayer(beneficiary, `injury ${row.id} beneficiary`);
    }
  }
  for (const row of NEWS) {
    for (const playerId of row.playerIds) {
      if (row.gameId) requirePlayerOnGame(playerId, row.gameId, `news ${row.id}`);
      else requirePlayer(playerId, `news ${row.id}`);
    }
  }
  return hits;
}

export function assertRosterNarratives(): void {
  const hits = [...staleRosterHits(), ...seedRefHits()];
  if (hits.length) {
    throw new Error(
      `Stale or wrong-team seed (name/id not on this year's desk). Prefer generic copy (“committee RB vultures TDs”) until live roster ingest exists.\n${hits.join("\n")}`,
    );
  }
}

/** Team tokens are valid in copy even when the player is not modeled. */
export function rosterTeamTokens(): string[] {
  return TEAMS.flatMap((team) => [team.abbr, team.city, team.name]);
}
