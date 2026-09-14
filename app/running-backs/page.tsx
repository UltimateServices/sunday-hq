import { PositionBoard } from "@/components/boards/PositionBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { positionViews } from "@/lib/position-board";

export const dynamic = "force-dynamic";

export default async function RunningBacksPage() {
  const catalog = await getWeekCatalog();
  return (
    <PositionBoard
      position="RB"
      title="Running Backs"
      views={positionViews(catalog, "RB")}
      matchups={catalog.matchups}
      live={catalog.liveGate.actionable}
    />
  );
}
