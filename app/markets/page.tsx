import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MarketsBoard } from "@/components/boards/MarketsBoard";

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Market Movement"
        lede="Heat · open/current · timeline drawer. DraftKings-primary game lines. Player-prop tape not ingested."
      />
      <SeedBanner>STEAM is empty on this seed. NYJ@TEN 38.5 → 39.5 is the captured move. No fabricated steam prints.</SeedBanner>
      <MarketsBoard />
    </div>
  );
}
