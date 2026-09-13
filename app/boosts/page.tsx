import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { BoostsBoard } from "@/components/boards/BoostsBoard";

export default function BoostsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Ticket"
        title="Boosts"
        lede="Boost % / min odds / legs / markets. Best / 2nd / 3rd use with Normal EV vs Boosted EV. Boosts do not create guaranteed plus-EV."
      />
      <SeedBanner>Seed inventory, not a live DK boost feed. EV stays ESTIMATE at assumed juice.</SeedBanner>
      <BoostsBoard />
    </div>
  );
}
