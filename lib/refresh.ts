import { WEEK1_META } from "@/data/week1/meta";
import type { DataHealthState } from "@/lib/types/domain";
import { nextRefreshLabel } from "@/lib/refresh/windows";

export const DATA_HEALTH: {
  state: DataHealthState;
  issues: string[];
} = {
  state: "DEGRADED",
  issues: [
    "DraftKings player-prop odds not ingested",
    "NWS hourly weather PENDING",
    "Kamara SOURCE CONFLICT",
  ],
};

export function seedRefresh() {
  return {
    lastRefreshLabel: WEEK1_META.lastUpdatedLabel,
    lastRefreshIso: WEEK1_META.lastUpdatedIso,
    nextRefreshLabel: nextRefreshLabel(),
    week: WEEK1_META.week,
    season: WEEK1_META.season,
    slateLabel: WEEK1_META.slateLabel,
  };
}
