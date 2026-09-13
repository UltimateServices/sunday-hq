import { PositionBoard } from "@/components/boards/PositionBoard";
import { PROPS } from "@/data/week1/props";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { toPropView } from "@/lib/prop-view";

export default function RunningBacksPage() {
  const views = PROPS.filter((p) => PLAYER_BY_ID[p.playerId]?.position === "RB").map((p) => toPropView(p));
  return <PositionBoard position="RB" title="Running Backs" views={views} />;
}
