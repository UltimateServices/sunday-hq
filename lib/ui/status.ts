import type { StatusTone } from "@/lib/health";
import type { StatusChipId } from "@/lib/types/domain";

export const STATUS_CHIPS: Record<
  StatusChipId,
  { label: string; tone: StatusTone; icon: string; domain: "data" | "player" | "weather" | "market" }
> = {
  HEALTHY: { label: "Data healthy", tone: "green", icon: "●", domain: "data" },
  QUESTIONABLE: { label: "Questionable", tone: "orange", icon: "?", domain: "player" },
  LIMITED: { label: "Limited", tone: "orange", icon: "▾", domain: "player" },
  OUT: { label: "Out", tone: "red", icon: "✕", domain: "player" },
  DOME: { label: "Indoor", tone: "blue", icon: "⌂", domain: "weather" },
  WIND: { label: "Wind", tone: "yellow", icon: "≈", domain: "weather" },
  RAIN: { label: "Rain", tone: "blue", icon: "☔", domain: "weather" },
  SNOW: { label: "Snow", tone: "blue", icon: "❄", domain: "weather" },
  ROLE_CHANGE: { label: "Role change", tone: "purple", icon: "↻", domain: "player" },
  LINE_MOVE: { label: "Line move", tone: "yellow", icon: "↕", domain: "market" },
  STEAM: { label: "Steam", tone: "orange", icon: "»", domain: "market" },
  HIGH_EDGE: { label: "High edge", tone: "green", icon: "▲", domain: "market" },
  HIGH_VOLATILITY: { label: "High volatility", tone: "orange", icon: "∿", domain: "market" },
  LOW_SAMPLE: { label: "Low sample", tone: "orange", icon: "n", domain: "data" },
  SOURCE_CONFLICT: { label: "Sources disagree", tone: "red", icon: "≠", domain: "data" },
  STALE_DATA: { label: "Stale", tone: "orange", icon: "⏱", domain: "data" },
};
