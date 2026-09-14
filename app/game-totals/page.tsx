import { PageHeader } from "@/components/shared/PageHeader";
import { TicketQuarantine } from "@/components/ds/TicketQuarantine";
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
        lede={
          catalog.liveGate.actionable
            ? "Sunday totals. Live DraftKings overlay when the snapshot is fresh."
            : "Game-total tickets stay hidden until live DraftKings tape is fresh. Seed ESPN widget lines are not bets."
        }
      />
      <TicketQuarantine gate={catalog.liveGate} noun="game totals">
        <GameTotalsBoard rows={gameTotalRows(catalog.games, catalog.weather)} />
      </TicketQuarantine>
    </div>
  );
}
