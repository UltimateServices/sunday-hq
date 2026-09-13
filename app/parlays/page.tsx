import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { ParlaysBoard } from "@/components/boards/ParlaysBoard";

export default function ParlaysPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Ticket"
        title="Parlays"
        lede="SGP / cross / TD / Conservative / Balanced / Aggressive. Combined P is an independent product. Correlation chips stay honest."
      />
      <SeedBanner>No DK parlay price. Stacked same-game products are optimistic. Not a recommendation to fire.</SeedBanner>
      <ParlaysBoard />
    </div>
  );
}
