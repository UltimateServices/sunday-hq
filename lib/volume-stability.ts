import type { PropView } from "@/lib/prop-view";

export type VolumeStability = "LOW" | "MEDIUM" | "HIGH" | "ELITE";

export function volumeStability(view: Pick<PropView, "volumeTag" | "tdRole" | "line">): VolumeStability {
  if (view.volumeTag === "HIGH" && view.tdRole === "PRIMARY" && (view.line.value ?? 0) >= 80) return "ELITE";
  if (view.volumeTag === "HIGH") return "HIGH";
  if (view.volumeTag === "MED") return "MEDIUM";
  return "LOW";
}
