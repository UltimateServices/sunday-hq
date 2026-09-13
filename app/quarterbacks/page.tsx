import { PositionBoard } from "@/components/boards/PositionBoard";
import { PROPS } from "@/data/week1/props";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { toPropView } from "@/lib/prop-view";

export default function QuarterbacksPage() {
  const views = PROPS.filter((p) => PLAYER_BY_ID[p.playerId]?.position === "QB").map((p) => toPropView(p));
  return <PositionBoard position="QB" title="Quarterbacks" views={views} />;
}
