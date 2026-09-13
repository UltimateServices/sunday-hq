import type { DataQuality } from "@/lib/types/domain";
import type { StatusTone } from "@/lib/health";
import { StatusBadge } from "./StatusBadge";

const TONE: Record<DataQuality, StatusTone> = {
  VERIFIED: "green",
  CONSENSUS: "blue",
  ESTIMATE: "yellow",
  LOW_SAMPLE: "orange",
  STALE: "orange",
  SOURCE_CONFLICT: "red",
  UNAVAILABLE: "purple",
};

export function DataStatus({ quality, title }: { quality: DataQuality; title?: string }) {
  return (
    <span title={title}>
      <StatusBadge tone={TONE[quality]}>{quality.replaceAll("_", " ")}</StatusBadge>
    </span>
  );
}
