import { PositionBoard } from "@/components/boards/PositionBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { positionViews } from "@/lib/position-board";

export const dynamic = "force-dynamic";

export default async function QuarterbacksPage() {
  const catalog = await getWeekCatalog();
  return (
    <PositionBoard
      position="QB"
      title="Quarterbacks"
      views={positionViews(catalog, "QB")}
      matchups={catalog.matchups}
      live={catalog.liveGate.actionable}
    />
  );
}
