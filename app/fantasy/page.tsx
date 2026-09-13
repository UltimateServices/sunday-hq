import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { FantasyBoard } from "@/components/boards/FantasyBoard";
import { FANTASY } from "@/data/week1/fantasy";

export default function FantasyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Fantasy"
        lede="OVERALL / QB / RB / WR / TE / FLEX. HIGH DISAGREEMENT marks desk vs Sunday HQ placeholder gaps. A startable player is not a GOOD BET."
      />
      <SeedBanner>Not a hosted ranking service. GTD and SOURCE CONFLICT stay UNAVAILABLE — no invented points.</SeedBanner>
      <FantasyBoard rows={FANTASY} />
    </div>
  );
}
