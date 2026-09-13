import type { CommandCenterMeta } from "@/lib/types/domain";

export const WEEK1_META: CommandCenterMeta = {
  week: 1,
  season: 2026,
  slateDate: "2026-09-13",
  slateLabel: "Sunday, September 13, 2026",
  lastUpdatedIso: "2026-09-13T12:00:00-04:00",
  lastUpdatedLabel: "Sun 12:00 PM ET",
  timezone: "America/New_York",
  seedNote:
    "Week 1 Sunday seed. Game spreads/totals attributed to DraftKings via ESPN schedule widget (2026-09-13). Player props are CONSENSUS/ESTIMATE unless marked otherwise. DK player-prop odds were not ingested — never treated as verified.",
};

export const SEED_HIGHLIGHTS = {
  highestTotalGameId: "tb-cin",
  lowestTotalGameId: "nyj-ten",
  lowestTotalNote:
    "Owner seed cited NYJ@TEN 38.5 as the floor. ESPN DK widget showed 39.5 at seed capture. Opening/consensus 38.5 stored as movement, current DK 39.5 verified via ESPN.",
};
