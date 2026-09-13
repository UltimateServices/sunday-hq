import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageSkeleton } from "@/components/ds/Skeleton";
import { PropsBoard } from "@/components/props/PropsBoard";
import { PROPS } from "@/data/week1/props";
import { toPropView } from "@/lib/prop-view";

export default function PropsPage() {
  const views = PROPS.map((p) => toPropView(p));
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Props"
        readiness="PLACEHOLDER"
        lede="URL-driven filters. Sticky sortable table. Row expansion for floor/median/mean/ceiling. DK player-prop odds remain DATA UNAVAILABLE."
      />
      <Suspense fallback={<PageSkeleton />}>
        <PropsBoard views={views} />
      </Suspense>
    </div>
  );
}
