import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { GameTotalsBoard } from "@/components/boards/GameTotalsBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { gameTotalRows } from "@/lib/game-total-view";

export const dynamic = "force-dynamic";

export default async function GameTotalsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Game Totals"
        lede="Sunday totals. Live DraftKings overlay when the snapshot is fresh; otherwise seed DK-via-ESPN with a stale warning."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <GameTotalsBoard rows={gameTotalRows(catalog.games, catalog.weather)} />
    </div>
  );
}
