import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MarketsBoard } from "@/components/boards/MarketsBoard";
import { MarketsHeroCards } from "@/components/boards/MarketsHeroCards";
import { getWeekCatalog, liveMarketMoves } from "@/lib/catalog";
import { MARKET_MOVES } from "@/data/week1/market-moves";
import { marketHeroes } from "@/lib/markets-heroes";

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const catalog = await getWeekCatalog();
  const moves = [...liveMarketMoves(catalog.games, catalog.snapshot), ...MARKET_MOVES];
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Market Movement"
        lede="Hero cards from captured game-line prints only. Player-prop steam and American-odds moves stay PENDING. No Odds API."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <MarketsHeroCards cards={marketHeroes(catalog.games, moves)} />
      <MarketsBoard games={catalog.games} moves={moves} />
    </div>
  );
}
