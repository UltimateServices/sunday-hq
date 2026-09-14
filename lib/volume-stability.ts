import type { PropView } from "@/lib/prop-view";
import type { StatusTone } from "@/lib/health";

export type VolumeStability = "LOW" | "MEDIUM" | "HIGH" | "ELITE";

export const STABILITY_ORDER: Record<VolumeStability, number> = {
  ELITE: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export const STABILITY_TONE: Record<VolumeStability, StatusTone> = {
  LOW: "purple",
  MEDIUM: "yellow",
  HIGH: "blue",
  ELITE: "green",
};

/**
 * Role-stability ESTIMATE from tagged volume + TD role + availability.
 * Does not invent carry / target / snap counts. Not a live DK signal.
 */
export function volumeStability(
  view: Pick<PropView, "volumeTag" | "tdRole" | "health">,
): VolumeStability {
  const limited = view.health !== "NO_KNOWN_LIMITATION" && view.health !== "MINOR_CONCERN";
  if (view.volumeTag === "HIGH" && view.tdRole === "PRIMARY" && !limited) return "ELITE";
  if (view.volumeTag === "HIGH") return "HIGH";
  if (view.volumeTag === "MED") return "MEDIUM";
  return "LOW";
}
