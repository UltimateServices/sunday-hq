import type { DataQuality, MeasuredNumber, Side } from "@/lib/types/domain";

export function americanToImplied(odds: number): number {
  if (odds < 0) return Math.abs(odds) / (Math.abs(odds) + 100);
  return 100 / (odds + 100);
}

export function expectedValue(modelProb: number, oddsAmerican: number): number {
  const profit = oddsAmerican < 0 ? 100 / Math.abs(oddsAmerican) : oddsAmerican / 100;
  return modelProb * profit - (1 - modelProb) * 1;
}

export function edgePoints(model: number | null, line: number | null, side: Side): number | null {
  if (model === null || line === null) return null;
  return side === "OVER" ? model - line : line - model;
}

export type EvComputation = {
  modelProb: MeasuredNumber;
  impliedProb: MeasuredNumber;
  ev: MeasuredNumber;
  edge: MeasuredNumber;
};

const ASSUMED_JUICE = -110;

/**
 * EV is only VERIFIED when both model prob and book odds are verified.
 * Missing DK odds → implied/EV UNAVAILABLE.
 * Optional illustrative path uses assumed -110 and is always ESTIMATE.
 */
export function computePricing(input: {
  model: MeasuredNumber;
  line: MeasuredNumber;
  odds: MeasuredNumber;
  side: Side;
  sigma?: number;
  allowAssumedJuice?: boolean;
}): EvComputation {
  const unavailable = (note: string): MeasuredNumber => ({
    value: null,
    quality: "UNAVAILABLE",
    source: "sunday-hq",
    asOf: null,
    note,
  });

  const edgeValue = edgePoints(input.model.value, input.line.value, input.side);
  const edge: MeasuredNumber = {
    value: edgeValue,
    quality: edgeValue === null ? "UNAVAILABLE" : worseQuality(input.model.quality, input.line.quality),
    source: "model-vs-line",
    asOf: input.model.asOf,
    note: "Projection minus line is not a bet. EV requires a price.",
  };

  if (input.model.value === null || input.line.value === null) {
    return {
      modelProb: unavailable("Need model and line to estimate probability."),
      impliedProb: unavailable("Need book odds to compute implied probability."),
      ev: unavailable("Need model probability and book odds to compute EV."),
      edge,
    };
  }

  const sigma = input.sigma ?? Math.max(8, Math.abs(input.line.value) * 0.18);
  const z =
    input.side === "OVER"
      ? (input.model.value - input.line.value) / sigma
      : (input.line.value - input.model.value) / sigma;
  const modelProbValue = normalCdf(z);

  const modelProb: MeasuredNumber = {
    value: modelProbValue,
    quality: worseQuality(input.model.quality, "ESTIMATE"),
    source: "placeholder-normal-cdf",
    asOf: input.model.asOf,
    note: `Normal CDF placeholder (σ=${sigma.toFixed(1)}). Phase 3 replaces this.`,
  };

  if (input.odds.value !== null) {
    const implied = americanToImplied(input.odds.value);
    return {
      modelProb,
      impliedProb: {
        value: implied,
        quality: input.odds.quality,
        source: input.odds.source,
        asOf: input.odds.asOf,
      },
      ev: {
        value: expectedValue(modelProbValue, input.odds.value),
        quality: worseQuality(modelProb.quality, input.odds.quality),
        source: "ev-engine-stub",
        asOf: input.odds.asOf,
      },
      edge,
    };
  }

  if (input.allowAssumedJuice) {
    const implied = americanToImplied(ASSUMED_JUICE);
    return {
      modelProb,
      impliedProb: {
        value: implied,
        quality: "ESTIMATE",
        source: "assumed-juice",
        asOf: null,
        note: `DK price unknown. Implied uses assumed ${ASSUMED_JUICE} for ranking only.`,
      },
      ev: {
        value: expectedValue(modelProbValue, ASSUMED_JUICE),
        quality: "ESTIMATE",
        source: "assumed-juice",
        asOf: null,
        note: `Illustrative EV at assumed ${ASSUMED_JUICE}. Not a DraftKings price.`,
      },
      edge,
    };
  }

  return {
    modelProb,
    impliedProb: unavailable("DraftKings odds not ingested. Implied probability unavailable."),
    ev: unavailable("DraftKings odds not ingested. EV unavailable."),
    edge,
  };
}

export function worseQuality(a: DataQuality, b: DataQuality): DataQuality {
  const rank: DataQuality[] = [
    "VERIFIED",
    "CONSENSUS",
    "LOW_SAMPLE",
    "ESTIMATE",
    "STALE",
    "SOURCE_CONFLICT",
    "UNAVAILABLE",
  ];
  return rank.indexOf(a) >= rank.indexOf(b) ? a : b;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}
