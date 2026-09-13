import type { DataQuality, MeasuredNumber } from "@/lib/types/domain";

export function formatNumber(
  value: number | null | undefined,
  digits = 1,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatSigned(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const abs = formatNumber(Math.abs(value), digits);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return abs;
}

export function formatAmerican(odds: number | null | undefined): string {
  if (odds === null || odds === undefined) return "DATA UNAVAILABLE";
  return odds > 0 ? `+${odds}` : `${odds}`;
}

export function formatPct(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

export function formatMeasured(
  m: MeasuredNumber,
  digits = 1,
  kind: "num" | "pct" | "american" | "signed" = "num",
): string {
  if (m.value === null) return qualityFallback(m.quality);
  if (kind === "pct") return formatPct(m.value);
  if (kind === "american") return formatAmerican(m.value);
  if (kind === "signed") return formatSigned(m.value, digits);
  return formatNumber(m.value, digits);
}

export function qualityFallback(quality: DataQuality): string {
  switch (quality) {
    case "UNAVAILABLE":
      return "DATA UNAVAILABLE";
    case "STALE":
      return "STALE";
    case "SOURCE_CONFLICT":
      return "SOURCE CONFLICT";
    case "LOW_SAMPLE":
      return "LOW SAMPLE";
    default:
      return "DATA UNAVAILABLE";
  }
}

export function qualityShort(quality: DataQuality): string {
  return quality.replaceAll("_", " ");
}

export function spreadLabel(homeAbbr: string, spreadHome: number | null): string {
  if (spreadHome === null) return "DATA UNAVAILABLE";
  if (spreadHome === 0) return "PK";
  if (spreadHome < 0) return `${homeAbbr} ${spreadHome}`;
  return `${homeAbbr} +${spreadHome}`;
}
