import { PLAYER_BY_ID } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { HealthState, InjuryRecord } from "@/lib/types/domain";

export type InjuryImpact = "HIGH" | "MED" | "LOW";

export function injuryImpact(health: HealthState): InjuryImpact {
  if (health === "OUT" || health === "IR_PUP_NFI" || health === "HIGH_RISK") return "HIGH";
  if (health === "GAME_TIME_DECISION" || health === "QUESTIONABLE" || health === "EXPECTED_LIMITED") return "MED";
  return "LOW";
}

export function availabilityLabel(health: HealthState): string {
  if (health === "OUT" || health === "IR_PUP_NFI") return "Out";
  if (health === "GAME_TIME_DECISION") return "Game-time decision";
  if (health === "QUESTIONABLE") return "Questionable";
  if (health === "EXPECTED_LIMITED") return "Expected limited";
  if (health === "HIGH_RISK") return "High risk";
  if (health === "MINOR_CONCERN") return "Expected to play · residual concern";
  return "No known limitation";
}

export function beneficiaryNote(row: InjuryRecord): string {
  if (row.beneficiaryPlayerIds.length === 0) {
    return "No named beneficiary. Snap / target shifts stay PENDING — not invented.";
  }
  const names = row.beneficiaryPlayerIds
    .map((id) => PLAYER_BY_ID[id]?.name)
    .filter(Boolean)
    .join(", ");
  return `${names} — volume lean only. Not a snap % or guaranteed usage.`;
}

export function filterInjuries(
  rows: InjuryRecord[],
  filters: {
    team?: string;
    pos?: string;
    status?: string;
    impact?: string;
    game?: string;
  },
): InjuryRecord[] {
  return rows.filter((row) => {
    const player = PLAYER_BY_ID[row.playerId];
    if (filters.team && filters.team !== "ALL" && row.teamId !== filters.team) return false;
    if (filters.pos && filters.pos !== "ALL" && player?.position !== filters.pos) return false;
    if (filters.status && filters.status !== "ALL" && row.health !== filters.status) return false;
    if (filters.impact && filters.impact !== "ALL" && injuryImpact(row.health) !== filters.impact) return false;
    if (filters.game && filters.game !== "ALL" && row.gameId !== filters.game) return false;
    return true;
  });
}

export function teamLabel(teamId: string): string {
  return TEAM_BY_ID[teamId]?.abbr ?? teamId;
}
