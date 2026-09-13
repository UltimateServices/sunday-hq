import type { StatusTone } from "@/lib/health";
import type { StatusChipId } from "@/lib/types/domain";

export const STATUS_CHIPS: Record<
  StatusChipId,
  { label: string; tone: StatusTone; icon: string; domain: "data" | "player" | "weather" | "market" }
> = {
  HEALTHY: { label: "HEALTHY", tone: "green", icon: "●", domain: "data" },
  QUESTIONABLE: { label: "QUESTIONABLE", tone: "orange", icon: "?", domain: "player" },
  LIMITED: { label: "LIMITED", tone: "orange", icon: "▾", domain: "player" },
  OUT: { label: "OUT", tone: "red", icon: "✕", domain: "player" },
  DOME: { label: "DOME", tone: "blue", icon: "⌂", domain: "weather" },
  WIND: { label: "WIND", tone: "yellow", icon: "≈", domain: "weather" },
  RAIN: { label: "RAIN", tone: "blue", icon: "☔", domain: "weather" },
  SNOW: { label: "SNOW", tone: "blue", icon: "❄", domain: "weather" },
  ROLE_CHANGE: { label: "ROLE CHANGE", tone: "purple", icon: "↻", domain: "player" },
  LINE_MOVE: { label: "LINE MOVE", tone: "yellow", icon: "↕", domain: "market" },
  STEAM: { label: "STEAM", tone: "orange", icon: "»", domain: "market" },
  HIGH_EDGE: { label: "HIGH EDGE", tone: "green", icon: "▲", domain: "market" },
  HIGH_VOLATILITY: { label: "HIGH VOLATILITY", tone: "orange", icon: "∿", domain: "market" },
  LOW_SAMPLE: { label: "LOW SAMPLE", tone: "orange", icon: "n", domain: "data" },
  SOURCE_CONFLICT: { label: "SOURCE CONFLICT", tone: "red", icon: "≠", domain: "data" },
  STALE_DATA: { label: "STALE DATA", tone: "orange", icon: "⏱", domain: "data" },
};
