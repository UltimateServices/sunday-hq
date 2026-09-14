import { PositionBoard } from "@/components/boards/PositionBoard";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { getWeekCatalog } from "@/lib/catalog";
import { toPropView } from "@/lib/prop-view";

export const dynamic = "force-dynamic";

export default async function QuarterbacksPage() {
  const catalog = await getWeekCatalog();
  const views = catalog.props.filter((p) => PLAYER_BY_ID[p.playerId]?.position === "QB").map((p) => toPropView(p));
  return <PositionBoard position="QB" title="Quarterbacks" views={views} matchups={catalog.matchups} />;
}
