import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { ResultsBoard } from "@/components/boards/ResultsBoard";

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Record"
        title="Results"
        lede="Record / units / ROI / CLV plus a filterable table. Week 1 Sunday is not settled — rows are EXAMPLE/SEED."
      />
      <SeedBanner>Every settled row is labeled EXAMPLE or SEED. Do not treat this as live model proof.</SeedBanner>
      <ResultsBoard />
    </div>
  );
}
