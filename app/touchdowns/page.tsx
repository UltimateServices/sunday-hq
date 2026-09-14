import { PageHeader } from "@/components/shared/PageHeader";
import { TouchdownsBoard } from "@/components/boards/TouchdownsBoard";
import { PROPS } from "@/data/week1/props";
import { getWeekCatalog } from "@/lib/catalog";
import { toPropView } from "@/lib/prop-view";

export const dynamic = "force-dynamic";

export default async function TouchdownsPage() {
  const catalog = await getWeekCatalog();
  const source = catalog.props.length > 0 ? catalog.props : PROPS;
  const views = source
    .filter((p) => ["ANYTIME_TD", "FIRST_TD", "TWO_PLUS_TD", "RUSH_TD"].includes(p.market))
    .map((p) => toPropView(p));
  const live = catalog.liveGate.actionable;

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Touchdowns"
        lede={
          live
            ? "Anytime / First TD / 2+ / QB rush. Model P is ESTIMATE. DK anytime prices remain DATA UNAVAILABLE until priced."
            : "Hero + tabs stay as research stubs. Ticket table stays hidden until live DraftKings tape is fresh."
        }
      />
      <TouchdownsBoard views={views} live={live} tickets={live} />
    </div>
  );
}
