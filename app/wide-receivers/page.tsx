import { PositionBoard } from "@/components/boards/PositionBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { positionViews } from "@/lib/position-board";

export const dynamic = "force-dynamic";

export default async function WideReceiversPage() {
  const catalog = await getWeekCatalog();
  return (
    <PositionBoard
      position="WR"
      title="Wide Receivers"
      views={positionViews(catalog, "WR")}
      matchups={catalog.matchups}
      live={catalog.liveGate.actionable}
    />
  );
}
