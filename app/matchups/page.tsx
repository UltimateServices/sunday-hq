import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MatchupsBoard } from "@/components/boards/MatchupsBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function MatchupsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Matchups"
        lede="BEST / WORST from the live factor engine: coverage/script proxy, volume, environment, weather, injury, OL starters. Admin weights change the overall. Not a PFF coverage rank."
      />
      <SeedBanner>
        GOOD PLAYER ≠ GOOD MATCHUP ≠ GOOD PROJECTION ≠ GOOD BET. Coverage is a script proxy. OL is an ESTIMATE desk module.
      </SeedBanner>
      <MatchupsBoard grades={catalog.matchups} />
    </div>
  );
}
