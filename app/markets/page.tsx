import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MarketsBoard } from "@/components/boards/MarketsBoard";
import { getWeekCatalog, liveMarketMoves } from "@/lib/catalog";
import { MARKET_MOVES } from "@/data/week1/market-moves";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Market Movement"
        lede="Heat · open/current · timeline drawer. DraftKings-primary. Live snapshot overlays seed when fresh."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <MarketsBoard games={catalog.games} moves={[...liveMarketMoves(catalog.games, catalog.snapshot), ...MARKET_MOVES]} />
    </div>
  );
}
