import type { DataQuality, MeasuredNumber } from "@/lib/types/domain";

function binaryMarket(market: string): boolean {
  return ["ANYTIME_TD", "FIRST_TD", "TWO_PLUS_TD", "RUSH_TD", "PASS_TD", "REC_TD"].includes(market);
}

export function projectionSigma(line: number | null, market: string): number {
  if (line === null) return 8;
  if (binaryMarket(market)) return 0.18;
  if (market.includes("YDS")) return Math.max(8, Math.abs(line) * 0.18);
  if (market === "RECEPTIONS" || market === "COMPLETIONS") return Math.max(1.2, Math.abs(line) * 0.22);
  return Math.max(0.8, Math.abs(line) * 0.2);
}

function measured(value: number | null, quality: DataQuality, note: string): MeasuredNumber {
  return {
    value,
    quality,
    source: "sunday-hq-normal",
    asOf: null,
    note,
  };
}

export function buildDistribution(input: {
  model: MeasuredNumber;
  line: MeasuredNumber;
  market: string;
}): {
  floor: MeasuredNumber;
  mean: MeasuredNumber;
  median: MeasuredNumber;
  ceiling: MeasuredNumber;
  sigma: number;
} {
  const model = input.model.value;
  const line = input.line.value;
  const sigma = projectionSigma(line ?? model, input.market);
  if (model === null) {
    const missing = measured(null, "UNAVAILABLE", "Need a model mean to build tails.");
    return { floor: missing, mean: input.model, median: input.model, ceiling: missing, sigma };
  }
  const quality: DataQuality = input.model.quality === "VERIFIED" ? "ESTIMATE" : "ESTIMATE";
  const note = `Normal P10/P50/P90 with σ=${sigma.toFixed(1)}. ESTIMATE — not a trained residual model.`;
  if (binaryMarket(input.market)) {
    return {
      floor: measured(Math.max(0, model - 0.16), quality, note),
      mean: { ...input.model, note: input.model.note ?? note },
      median: measured(model, quality, "Median ≈ mean for the binary placeholder."),
      ceiling: measured(Math.min(0.95, model + 0.16), quality, note),
      sigma,
    };
  }
  return {
    floor: measured(model - 1.2816 * sigma, quality, note),
    mean: { ...input.model, note: input.model.note ?? note },
    median: measured(model, quality, "Median set to mean until a skewed residual is fit."),
    ceiling: measured(model + 1.2816 * sigma, quality, note),
    sigma,
  };
}
