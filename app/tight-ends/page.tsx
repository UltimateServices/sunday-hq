import { PositionBoard } from "@/components/boards/PositionBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { positionViews } from "@/lib/position-board";

export const dynamic = "force-dynamic";

export default async function TightEndsPage() {
  const catalog = await getWeekCatalog();
  return (
    <PositionBoard
      position="TE"
      title="Tight Ends"
      views={positionViews(catalog, "TE")}
      matchups={catalog.matchups}
      live={catalog.liveGate.actionable}
    />
  );
}
