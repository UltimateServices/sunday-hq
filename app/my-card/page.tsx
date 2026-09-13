import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MyCardBoard } from "@/components/boards/MyCardBoard";

export default function MyCardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Ticket"
        title="My Card"
        lede="WATCHING / READY / PLACED / SETTLED. Place in units only. Line-change REVIEW warnings. No loss chasing, no unit inflation."
      />
      <SeedBanner>Seed + session card. EXAMPLE settled row is prior-slate illustration, not a live 2026 grade.</SeedBanner>
      <MyCardBoard />
    </div>
  );
}
