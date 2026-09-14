import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageSkeleton } from "@/components/ds/Skeleton";
import { PropsBoard } from "@/components/props/PropsBoard";
import { TicketQuarantine } from "@/components/ds/TicketQuarantine";
import { getWeekCatalog } from "@/lib/catalog";
import { toPropView } from "@/lib/prop-view";

export const dynamic = "force-dynamic";

export default async function PropsPage() {
  const catalog = await getWeekCatalog();
  const views = catalog.props.map((p) => toPropView(p));
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Props"
        lede={
          catalog.liveGate.actionable
            ? "URL-driven filters. Sticky sortable table. Row expansion for floor/median/mean/ceiling. Live DK overlay."
            : "Prop tickets stay hidden until live DraftKings tape is fresh. Seed lines are not bets."
        }
      />
      <TicketQuarantine gate={catalog.liveGate} noun="props">
        <Suspense fallback={<PageSkeleton />}>
          <PropsBoard views={views} />
        </Suspense>
      </TicketQuarantine>
    </div>
  );
}
