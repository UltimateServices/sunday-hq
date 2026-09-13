import { HEALTH_ICON, HEALTH_TONE, healthLabel } from "@/lib/health";
import type { HealthState } from "@/lib/types/domain";
import { StatusBadge } from "./StatusBadge";

export function HealthBadge({ state }: { state: HealthState }) {
  return (
    <StatusBadge tone={HEALTH_TONE[state]} icon={HEALTH_ICON[state]}>
      {healthLabel(state)}
    </StatusBadge>
  );
}
