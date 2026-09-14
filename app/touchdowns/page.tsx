import { PageHeader } from "@/components/shared/PageHeader";
import { TicketQuarantine } from "@/components/ds/TicketQuarantine";
import { TouchdownsBoard } from "@/components/boards/TouchdownsBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { toPropView } from "@/lib/prop-view";

export const dynamic = "force-dynamic";

export default async function TouchdownsPage() {
  const catalog = await getWeekCatalog();
  const views = catalog.props
    .filter((p) => ["ANYTIME_TD", "FIRST_TD", "TWO_PLUS_TD", "RUSH_TD"].includes(p.market))
    .map((p) => toPropView(p));

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Touchdowns"
        lede={
          catalog.liveGate.actionable
            ? "Anytime / First TD / 2+ / QB rush. Model P is ESTIMATE. DK anytime prices remain DATA UNAVAILABLE until priced."
            : "TD tickets stay hidden until live DraftKings tape is fresh. Seed ATD leans are not bets."
        }
      />
      <TicketQuarantine gate={catalog.liveGate} noun="touchdown leans">
        <TouchdownsBoard views={views} />
      </TicketQuarantine>
    </div>
  );
}
