import { PageHeader } from "@/components/shared/PageHeader";
import { ParlaysBoard } from "@/components/boards/ParlaysBoard";
import { LiveRequiredBanner } from "@/components/ds/LiveRequiredBanner";
import { EmptyState } from "@/components/ds/EmptyState";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ParlaysPage() {
  const catalog = await getWeekCatalog();
  const gate = catalog.liveGate;
  return (
    <div className="space-y-6">
      <LiveRequiredBanner gate={gate} />
      <PageHeader
        layer="Ticket"
        title="Parlays"
        lede={
          gate.actionable
            ? "Same-game and cross-game constructs against live tape. Combined probability is still an estimate — not a DraftKings parlay price."
            : "Parlay tickets stay hidden until live DraftKings tape is fresh. Seed SGPs are not bets."
        }
      />
      {gate.actionable ? (
        <ParlaysBoard />
      ) : (
        <EmptyState
          message="No live parlays."
          hint="Seed constructs (including the old DET SGP) are quarantined. They will not appear as tickets without a fresh snapshot."
        />
      )}
    </div>
  );
}
