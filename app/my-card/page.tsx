import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MyCardBoard } from "@/components/boards/MyCardBoard";

export default function MyCardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Your ticket"
        title="My Card"
        lede="Watching, ready, placed, settled. Units only — no chasing after an early red."
      />
      <SeedBanner>Placing a bet locks the line, odds, projection, confidence, health, and weather. Example results stay labeled. Nothing here is a lock.</SeedBanner>
      <MyCardBoard />
    </div>
  );
}
