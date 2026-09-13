import { getWeekCatalog } from "@/lib/catalog";
import { liveMarketMoves } from "@/lib/catalog";
import { MARKET_MOVES } from "@/data/week1/market-moves";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getWeekCatalog();
  return Response.json({
    asOf: catalog.lastRefreshIso,
    freshness: catalog.oddsFresh ? "FRESH" : catalog.snapshot?.freshness ?? "UNAVAILABLE",
    status: catalog.snapshot?.status ?? "UNAVAILABLE",
    staleWarning: catalog.staleWarning,
    liveBanner: catalog.liveBanner,
    storage: catalog.storage,
    health: catalog.health,
    games: catalog.games,
    props: catalog.props,
    snapshot: catalog.snapshot,
    moves: [...liveMarketMoves(catalog.games, catalog.snapshot), ...MARKET_MOVES],
  });
}
