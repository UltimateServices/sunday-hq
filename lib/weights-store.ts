import { MODEL_WEIGHTS } from "@/data/week1/admin";
import { readJson, writeJson } from "@/lib/ingest/store";
import { STORE_KEYS } from "@/lib/ingest/types";
import type { AdminWeight } from "@/lib/types/domain";
import { DEFAULT_THRESHOLDS, type ModelThresholds, type WeightsSnapshot } from "@/lib/weights";

export async function readWeights(): Promise<WeightsSnapshot> {
  const stored = await readJson<WeightsSnapshot>(STORE_KEYS.weights);
  if (stored) return stored;
  return {
    asOf: MODEL_WEIGHTS[0]?.updatedAt ?? new Date().toISOString(),
    weights: MODEL_WEIGHTS,
    thresholds: DEFAULT_THRESHOLDS,
    updatedBy: "seed",
  };
}

export async function writeWeights(input: {
  weights: AdminWeight[];
  thresholds?: ModelThresholds;
  updatedBy?: string;
}): Promise<WeightsSnapshot> {
  const next: WeightsSnapshot = {
    asOf: new Date().toISOString(),
    weights: input.weights,
    thresholds: input.thresholds ?? DEFAULT_THRESHOLDS,
    updatedBy: input.updatedBy ?? "admin",
  };
  await writeJson(STORE_KEYS.weights, next);
  return next;
}
