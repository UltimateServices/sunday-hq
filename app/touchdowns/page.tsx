import { PageHeader } from "@/components/shared/PageHeader";
import { TDCard } from "@/components/ds/TDCard";
import { PROPS } from "@/data/week1/props";
import { toPropView } from "@/lib/prop-view";

export default function TouchdownsPage() {
  const views = PROPS.filter((p) => p.market === "ANYTIME_TD" || p.tdRole).map((p) => toPropView(p));
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Touchdowns"
        readiness="PLACEHOLDER"
        lede="Shared TDCard. Anytime prices DATA UNAVAILABLE. Research names, not tickets."
      />
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {views.map((view) => (
          <TDCard key={view.id} view={view} />
        ))}
      </div>
    </div>
  );
}
