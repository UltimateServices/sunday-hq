import type { CalibrationBucket, ResultRow } from "@/lib/types/domain";

const AS_OF = "2026-09-06T20:00:00-04:00";

function clv(value: number, note: string) {
  return {
    value,
    quality: "ESTIMATE" as const,
    source: "EXAMPLE/SEED closing illustration",
    asOf: AS_OF,
    note,
  };
}

export const RESULTS: ResultRow[] = [
  {
    id: "res-ex-1",
    label: "EXAMPLE · Burrow pass over (prior slate)",
    market: "PASS_YDS",
    side: "OVER",
    units: 1,
    result: "LOSS",
    clv: clv(-1.5, "Line moved against the ticket. Illustration only."),
    closingLine: clv(266.5, "Not a verified 2026 archive print."),
    lineTaken: clv(264.5, "EXAMPLE entry."),
    seedLabel: "EXAMPLE",
    note: "No real Sunday HQ history exists yet. This row is labeled EXAMPLE so the table is usable.",
    week: 0,
  },
  {
    id: "res-ex-2",
    label: "EXAMPLE · Henry rush under (prior slate)",
    market: "RUSH_YDS",
    side: "UNDER",
    units: 0.5,
    result: "WIN",
    clv: clv(0.5, "Small plus CLV illustration."),
    closingLine: clv(76.5, "EXAMPLE close."),
    lineTaken: clv(77.5, "EXAMPLE entry."),
    seedLabel: "EXAMPLE",
    note: "Half-unit win. Not a live 2026 grade.",
    week: 0,
  },
  {
    id: "res-ex-3",
    label: "EXAMPLE · Team total CIN over (prior slate)",
    market: "TEAM_TOTAL",
    side: "OVER",
    units: 1,
    result: "PUSH",
    clv: clv(0, "Push. CLV flat."),
    closingLine: clv(26.5, "EXAMPLE."),
    lineTaken: clv(26.5, "EXAMPLE."),
    seedLabel: "EXAMPLE",
    note: "Push kept so the table is not win-biased.",
    week: 0,
  },
  {
    id: "res-ex-4",
    label: "SEED · Voided GTD illustration",
    market: "REC_YDS",
    side: "OVER",
    units: 1,
    result: "VOID",
    clv: { value: null, quality: "UNAVAILABLE", source: "void", asOf: null, note: "Voided. No CLV." },
    closingLine: { value: null, quality: "UNAVAILABLE", source: "void", asOf: null },
    lineTaken: clv(69.5, "EXAMPLE entry before inactive."),
    seedLabel: "SEED",
    note: "Shows the void path. Week 1 Nabers is the live analog — do not force a number onto a GTD.",
    week: 0,
  },
];

export const RESULTS_SUMMARY = {
  record: "1-1-1 + 1 void",
  units: 0.5,
  roi: 0.125,
  clvAvg: -0.25,
  note: "EXAMPLE/SEED only. Week 1 Sunday is not settled. Do not treat as model proof.",
};

export const CALIBRATION_BUCKETS: CalibrationBucket[] = [
  { label: "50–55%", predicted: 0.525, observed: 0.5, n: 4, quality: "LOW_SAMPLE" },
  { label: "55–60%", predicted: 0.575, observed: 0.5, n: 2, quality: "LOW_SAMPLE" },
  { label: "60–65%", predicted: 0.625, observed: null, n: 0, quality: "UNAVAILABLE" },
  { label: "65–70%", predicted: 0.675, observed: null, n: 0, quality: "UNAVAILABLE" },
  { label: "70%+", predicted: 0.75, observed: null, n: 0, quality: "UNAVAILABLE" },
];
