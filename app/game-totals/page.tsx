import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { GameTotalsBoard } from "@/components/boards/GameTotalsBoard";
import { gameTotalRows } from "@/lib/game-total-view";

export default function GameTotalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Game Totals"
        lede="Sunday totals from DraftKings via ESPN widget. Open / current / move / environment / weather. TB@CIN 50.5 ceiling. NYJ@TEN 39.5 floor."
      />
      <SeedBanner>NYJ@TEN opener 38.5 is owner/consensus; 39.5 is the captured DK print. Highest total is not an automatic over.</SeedBanner>
      <GameTotalsBoard rows={gameTotalRows()} />
    </div>
  );
}
