import type { HealthState, InjuryRecord } from "@/lib/types/domain";

export type PracticeTrend = "FULL" | "LIMITED" | "DNP" | "UNKNOWN";

/** Parse practice language already in the seed detail. Never invent a report. */
export function practiceTrendFor(inj: InjuryRecord): PracticeTrend {
  const text = `${inj.detail} ${inj.headline}`.toLowerCase();
  if (inj.health === "OUT" || inj.health === "IR_PUP_NFI") return "DNP";
  if (text.includes("full practice") || text.includes("full friday")) return "FULL";
  if (text.includes("limited")) return "LIMITED";
  return "UNKNOWN";
}

export function expectedAvailability(health: HealthState): string {
  switch (health) {
    case "OUT":
    case "IR_PUP_NFI":
      return "OUT";
    case "GAME_TIME_DECISION":
      return "GAME-TIME";
    case "HIGH_RISK":
      return "HIGH RISK";
    case "EXPECTED_LIMITED":
      return "EXPECTED LIMITED";
    case "QUESTIONABLE":
      return "QUESTIONABLE";
    case "MINOR_CONCERN":
      return "EXPECTED TO PLAY";
    default:
      return "NO KNOWN LIMITATION";
  }
}

export function practiceTrendLabel(trend: PracticeTrend): string {
  if (trend === "UNKNOWN") return "DATA UNAVAILABLE";
  return trend;
}
