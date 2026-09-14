import { PageHeader } from "@/components/shared/PageHeader";
import { TicketQuarantine } from "@/components/ds/TicketQuarantine";
import { TeamTotalsBoard } from "@/components/boards/TeamTotalsBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { teamTotalRows } from "@/lib/team-total-view";

export const dynamic = "force-dynamic";

export default async function TeamTotalsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Team Totals"
        lede={
          catalog.liveGate.actionable
            ? "Implied from DK spread + total (live overlay). Best Over / Under are placeholder tilts, not listed DK team-total tickets."
            : "Team-total tickets stay hidden until live DraftKings tape is fresh."
        }
      />
      <TicketQuarantine gate={catalog.liveGate} noun="team totals">
        <TeamTotalsBoard rows={teamTotalRows(catalog.games)} />
      </TicketQuarantine>
    </div>
  );
}
