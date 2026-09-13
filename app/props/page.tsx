import { PageHeader } from "@/components/shared/PageHeader";
import { PendingPanel } from "@/components/shared/PendingPanel";
import { PropTable } from "@/components/shared/PropTable";
import { Section } from "@/components/shared/Section";
import { PROPS } from "@/data/week1/props";
import { pendingForPhase } from "@/lib/pending";
import { toPropView } from "@/lib/prop-view";

export default function PropsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Props"
        readiness="PLACEHOLDER"
        lede="Consensus / estimate desk for owner markets. Full EV engine is Phase 3. Overs and unders both listed. DK player-prop odds are DATA UNAVAILABLE."
      />
      <PendingPanel capability={pendingForPhase(3)!} />
      <Section title="Seeded prop board">
        <PropTable views={PROPS.map((p) => toPropView(p))} />
      </Section>
    </div>
  );
}
