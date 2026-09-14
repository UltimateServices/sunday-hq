import type { QualifierLens } from "@/lib/types/domain";

/** Visitor-facing labels. Keep enums in the model; never print “healthy” for a player. */
export function titleCaseWords(raw: string): string {
  return raw
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function qualityLabel(quality: string): string {
  switch (quality) {
    case "VERIFIED":
      return "Verified";
    case "CONSENSUS":
      return "Consensus";
    case "ESTIMATE":
      return "Estimate";
    case "UNAVAILABLE":
      return "Not available";
    case "STALE":
      return "Stale";
    case "SOURCE_CONFLICT":
      return "Sources disagree";
    case "LOW_SAMPLE":
      return "Low sample";
    default:
      return titleCaseWords(quality);
  }
}

/** Bible item 108 three-tier overlay. Domain quality stays the source of truth. */
export function qualityTier(quality: string): "HIGH" | "MEDIUM" | "LOW" {
  if (quality === "VERIFIED") return "HIGH";
  if (quality === "CONSENSUS") return "MEDIUM";
  return "LOW";
}

export const LENS_LABEL: Record<QualifierLens, string> = {
  GOOD_PLAYER: "Good player",
  GOOD_MATCHUP: "Good matchup",
  GOOD_PROJECTION: "Good projection",
  GOOD_BET: "Good bet",
};

export function oneLineWhy(lines: string[] | undefined, fallback = "Open Why for the full case."): string {
  const first = lines?.find((line) => line.trim().length > 0);
  if (!first) return fallback;
  return first.length > 140 ? `${first.slice(0, 137).trim()}…` : first;
}
