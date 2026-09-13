import type { ConfidenceGrade, HealthState } from "@/lib/types/domain";

export const CONFIDENCE_GRADES: ConfidenceGrade[] = ["A+", "A", "A-", "B+", "B", "B-", "C", "PASS"];

/** Week 1 seed never returns A / A+. Placeholder model + LOW SAMPLE. */
export function confidenceGrade(input: {
  hasModel: boolean;
  hasLine: boolean;
  hasVerifiedOdds: boolean;
  health: HealthState;
  lineQuality: string;
  modelQuality: string;
}): ConfidenceGrade {
  if (!input.hasModel || !input.hasLine) return "PASS";
  if (input.health === "OUT" || input.health === "IR_PUP_NFI") return "PASS";
  if (input.health === "GAME_TIME_DECISION") return "PASS";
  if (input.lineQuality === "SOURCE_CONFLICT" || input.health === "QUESTIONABLE") return "C";
  if (input.lineQuality === "UNAVAILABLE") return "PASS";
  if (input.hasVerifiedOdds && input.lineQuality === "VERIFIED") return "B+";
  if (input.lineQuality === "CONSENSUS" && input.modelQuality === "ESTIMATE") return "B";
  if (input.lineQuality === "ESTIMATE" || input.modelQuality === "ESTIMATE") return "B-";
  return "C";
}
