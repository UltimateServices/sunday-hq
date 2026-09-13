import { GAMES } from "@/data/week1/games";
import { WEEK1_META } from "@/data/week1/meta";
import { matchPlayerId, matchTeamId } from "@/lib/ingest/names";
import type { Game } from "@/lib/types/domain";

const SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const SUMMARY = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary";
const INJURIES = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/injuries";

export const ESPN_SOURCE = "ESPN public site API (no key) — https://site.api.espn.com";

export type EspnGameResult = {
  gameId: string;
  espnEventId: string;
  status: Game["status"];
  homeScore: number | null;
  awayScore: number | null;
};

export type EspnPlayerStat = {
  playerId: string;
  name: string;
  passingYards: number;
  passingTouchdowns: number;
  completions: number;
  rushingYards: number;
  rushingTouchdowns: number;
  receivingYards: number;
  receptions: number;
  receivingTouchdowns: number;
};

function slateDateStamp(): string {
  return WEEK1_META.slateDate.replaceAll("-", "");
}

function num(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function readStat(keys: string[], stats: unknown[], name: string): number {
  const index = keys.findIndex((key) => key.toLowerCase() === name.toLowerCase());
  if (index < 0) return 0;
  const raw = stats[index];
  if (typeof raw === "string" && raw.includes("/")) return num(raw.split("/")[0]);
  return num(raw);
}

export async function fetchEspnScoreboard(): Promise<EspnGameResult[]> {
  const url = `${SCOREBOARD}?dates=${slateDateStamp()}&seasontype=2&week=${WEEK1_META.week}&limit=100`;
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`ESPN scoreboard ${response.status}`);
  }
  const json = (await response.json()) as {
    events?: Array<{
      id: string;
      competitions?: Array<{
        status?: { type?: { state?: string; completed?: boolean } };
        competitors?: Array<{ homeAway?: string; score?: string; team?: { abbreviation?: string } }>;
      }>;
    }>;
  };

  const rows: EspnGameResult[] = [];
  for (const event of json.events ?? []) {
    const competition = event.competitions?.[0];
    const home = competition?.competitors?.find((c) => c.homeAway === "home");
    const away = competition?.competitors?.find((c) => c.homeAway === "away");
    const homeId = home?.team?.abbreviation ? matchTeamId(home.team.abbreviation) : null;
    const awayId = away?.team?.abbreviation ? matchTeamId(away.team.abbreviation) : null;
    const gameId = homeId && awayId ? `${awayId}-${homeId}` : null;
    if (!gameId || !GAMES.some((game) => game.id === gameId)) continue;
    const state = competition?.status?.type?.state;
    const completed = competition?.status?.type?.completed;
    rows.push({
      gameId,
      espnEventId: event.id,
      status: completed || state === "post" ? "FINAL" : state === "in" ? "LIVE" : "SCHEDULED",
      homeScore: home?.score !== undefined ? num(home.score) : null,
      awayScore: away?.score !== undefined ? num(away.score) : null,
    });
  }
  return rows;
}

export async function fetchEspnBox(eventId: string): Promise<EspnPlayerStat[]> {
  const url = `${SUMMARY}?event=${eventId}`;
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`ESPN summary ${response.status} for ${eventId}`);
  }
  const json = (await response.json()) as {
    boxscore?: {
      players?: Array<{
        statistics?: Array<{
          name?: string;
          keys?: string[];
          labels?: string[];
          athletes?: Array<{
            athlete?: { displayName?: string };
            stats?: unknown[];
          }>;
        }>;
      }>;
    };
  };

  const byPlayer = new Map<string, EspnPlayerStat>();
  const ensure = (name: string): EspnPlayerStat | null => {
    const playerId = matchPlayerId(name);
    if (!playerId) return null;
    const existing = byPlayer.get(playerId);
    if (existing) return existing;
    const created: EspnPlayerStat = {
      playerId,
      name,
      passingYards: 0,
      passingTouchdowns: 0,
      completions: 0,
      rushingYards: 0,
      rushingTouchdowns: 0,
      receivingYards: 0,
      receptions: 0,
      receivingTouchdowns: 0,
    };
    byPlayer.set(playerId, created);
    return created;
  };

  for (const team of json.boxscore?.players ?? []) {
    for (const group of team.statistics ?? []) {
      const keys = group.keys ?? group.labels ?? [];
      for (const athlete of group.athletes ?? []) {
        const name = athlete.athlete?.displayName;
        if (!name) continue;
        const row = ensure(name);
        if (!row) continue;
        const stats = athlete.stats ?? [];
        const groupName = (group.name ?? "").toLowerCase();
        if (groupName.includes("pass")) {
          row.passingYards += readStat(keys, stats, "passingYards") || readStat(keys, stats, "YDS");
          row.passingTouchdowns += readStat(keys, stats, "passingTouchdowns") || readStat(keys, stats, "TD");
          row.completions += readStat(keys, stats, "completions") || readStat(keys, stats, "C/ATT") || readStat(keys, stats, "completions/passingAttempts");
        } else if (groupName.includes("rush")) {
          row.rushingYards += readStat(keys, stats, "rushingYards") || readStat(keys, stats, "YDS");
          row.rushingTouchdowns += readStat(keys, stats, "rushingTouchdowns") || readStat(keys, stats, "TD");
        } else if (groupName.includes("receiv")) {
          row.receivingYards += readStat(keys, stats, "receivingYards") || readStat(keys, stats, "YDS");
          row.receptions += readStat(keys, stats, "receptions") || readStat(keys, stats, "REC");
          row.receivingTouchdowns += readStat(keys, stats, "receivingTouchdowns") || readStat(keys, stats, "TD");
        }
      }
    }
  }

  return [...byPlayer.values()];
}

export type EspnInjuryHit = {
  playerId: string;
  status: string;
  description: string;
};

export async function fetchEspnInjuries(): Promise<EspnInjuryHit[]> {
  const response = await fetch(INJURIES, { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`ESPN injuries ${response.status}`);
  }
  const json = (await response.json()) as {
    injuries?: Array<{
      injuries?: Array<{
        athlete?: { displayName?: string };
        status?: string;
        details?: { type?: string; detail?: string; fantasyStatus?: { description?: string } };
      }>;
    }>;
  };
  const hits: EspnInjuryHit[] = [];
  for (const team of json.injuries ?? []) {
    for (const row of team.injuries ?? []) {
      const name = row.athlete?.displayName;
      if (!name) continue;
      const playerId = matchPlayerId(name);
      if (!playerId) continue;
      hits.push({
        playerId,
        status: row.status ?? row.details?.type ?? "Unknown",
        description: row.details?.detail ?? row.details?.fantasyStatus?.description ?? row.status ?? "ESPN injury row",
      });
    }
  }
  return hits;
}

export function actualForMarket(stat: EspnPlayerStat | undefined, market: string): number | null {
  if (!stat) return null;
  switch (market) {
    case "PASS_YDS":
      return stat.passingYards;
    case "PASS_TD":
      return stat.passingTouchdowns;
    case "COMPLETIONS":
      return stat.completions;
    case "RUSH_YDS":
      return stat.rushingYards;
    case "RUSH_TD":
      return stat.rushingTouchdowns;
    case "REC_YDS":
      return stat.receivingYards;
    case "RECEPTIONS":
      return stat.receptions;
    case "REC_TD":
      return stat.receivingTouchdowns;
    case "ANYTIME_TD":
    case "FIRST_TD":
    case "TWO_PLUS_TD":
      return stat.rushingTouchdowns + stat.receivingTouchdowns;
    default:
      return null;
  }
}
