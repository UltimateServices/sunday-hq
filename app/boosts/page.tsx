import { PageHeader } from "@/components/shared/PageHeader";
import { TicketQuarantine } from "@/components/ds/TicketQuarantine";
import { BoostsBoard } from "@/components/boards/BoostsBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function BoostsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Ticket"
        title="Boosts"
        lede={
          catalog.liveGate.actionable
            ? "Boost % / min odds / legs / markets. Best / 2nd / 3rd use with Normal EV vs Boosted EV. Boosts do not create guaranteed plus-EV."
            : "Boost inventory stays hidden until live tape is fresh. Seed boosts are not tickets."
        }
      />
      <TicketQuarantine gate={catalog.liveGate} noun="boosts">
        <BoostsBoard />
      </TicketQuarantine>
    </div>
  );
}
