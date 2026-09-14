import { PositionBoard } from "@/components/boards/PositionBoard";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { getWeekCatalog } from "@/lib/catalog";
import { toPropView } from "@/lib/prop-view";

export const dynamic = "force-dynamic";

export default async function TightEndsPage() {
  const catalog = await getWeekCatalog();
  const views = catalog.props.filter((p) => PLAYER_BY_ID[p.playerId]?.position === "TE").map((p) => toPropView(p));
  return <PositionBoard position="TE" title="Tight Ends" views={views} />;
}
