import { PageHeader } from "@/components/shared/PageHeader";
import { PropTable } from "@/components/shared/PropTable";
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
        lede="Anytime TD research board. DK anytime odds are not ingested. Names are volume/role leans, not priced bets."
      />
      <PropTable views={views} />
    </div>
  );
}
