import { MODEL_WEIGHTS, THRESHOLDS } from "@/data/week1/admin";
import type { AdminWeight } from "@/lib/types/domain";

export type ModelWeights = {
  pass: number;
  rush: number;
  rec: number;
  td: number;
  weather: number;
  availability: number;
};

export type ModelThresholds = {
  minEdgeYards: number;
  maxUnits: number;
  maxCard: number;
};

export type WeightsSnapshot = {
  asOf: string;
  weights: AdminWeight[];
  thresholds: ModelThresholds;
  updatedBy: string;
};

export const DEFAULT_THRESHOLDS: ModelThresholds = {
  minEdgeYards: Number(THRESHOLDS.find((row) => row.id === "min-edge")?.value ?? 4),
  maxUnits: Number(THRESHOLDS.find((row) => row.id === "max-units")?.value ?? 1.5),
  maxCard: Number(THRESHOLDS.find((row) => row.id === "max-card")?.value ?? 6),
};

export function defaultWeights(): ModelWeights {
  const byId = Object.fromEntries(MODEL_WEIGHTS.map((row) => [row.id, row.weight]));
  return {
    pass: byId["w-pass"] ?? 0.22,
    rush: byId["w-rush"] ?? 0.2,
    rec: byId["w-rec"] ?? 0.18,
    td: byId["w-td"] ?? 0.12,
    weather: byId["w-wx"] ?? 0.1,
    availability: byId["w-inj"] ?? 0.18,
  };
}

export function weightsFromAdmin(rows: AdminWeight[]): ModelWeights {
  const byId = Object.fromEntries(rows.map((row) => [row.id, row.weight]));
  return {
    pass: byId["w-pass"] ?? 0.22,
    rush: byId["w-rush"] ?? 0.2,
    rec: byId["w-rec"] ?? 0.18,
    td: byId["w-td"] ?? 0.12,
    weather: byId["w-wx"] ?? 0.1,
    availability: byId["w-inj"] ?? 0.18,
  };
}

/** Rank boost from admin weights. Used by homepage / props ranking. */
export function weightRankBoost(input: {
  market: string;
  weatherImpact: string;
  health: string;
  edgeYards: number | null;
  weights: ModelWeights;
  minEdgeYards: number;
}): number {
  const marketW =
    input.market.includes("PASS") || input.market === "COMPLETIONS"
      ? input.weights.pass
      : input.market.includes("RUSH")
        ? input.weights.rush
        : input.market.includes("TD")
          ? input.weights.td
          : input.weights.rec;
  const wx =
    input.weatherImpact === "SIGNIFICANT" ? -input.weights.weather : input.weatherImpact === "MODERATE" ? -input.weights.weather * 0.5 : 0;
  const avail = input.health === "OUT" || input.health === "GAME_TIME_DECISION" ? -input.weights.availability : 0;
  const edgeGate = input.edgeYards !== null && input.edgeYards < input.minEdgeYards ? -0.15 : 0;
  return marketW + wx + avail + edgeGate;
}
