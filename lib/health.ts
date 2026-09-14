import type { HealthState } from "@/lib/types/domain";

export const HEALTH_LABEL: Record<HealthState, string> = {
  NO_KNOWN_LIMITATION: "No Known Limitation",
  MINOR_CONCERN: "Minor Concern",
  QUESTIONABLE: "Questionable",
  EXPECTED_LIMITED: "Expected Limited",
  GAME_TIME_DECISION: "Game-Time Decision",
  HIGH_RISK: "High Risk",
  OUT: "Out",
  IR_PUP_NFI: "IR / PUP / NFI",
};

export type StatusTone = "green" | "yellow" | "orange" | "red" | "blue" | "purple";

export const HEALTH_TONE: Record<HealthState, StatusTone> = {
  NO_KNOWN_LIMITATION: "green",
  MINOR_CONCERN: "yellow",
  QUESTIONABLE: "orange",
  EXPECTED_LIMITED: "orange",
  GAME_TIME_DECISION: "purple",
  HIGH_RISK: "red",
  OUT: "red",
  IR_PUP_NFI: "blue",
};

export const HEALTH_ICON: Record<HealthState, string> = {
  NO_KNOWN_LIMITATION: "●",
  MINOR_CONCERN: "◑",
  QUESTIONABLE: "?",
  EXPECTED_LIMITED: "▾",
  GAME_TIME_DECISION: "◐",
  HIGH_RISK: "!",
  OUT: "✕",
  IR_PUP_NFI: "■",
};

/** Binding: never render "healthy" / "100%" / "full go". */
export function healthLabel(state: HealthState): string {
  return HEALTH_LABEL[state];
}
