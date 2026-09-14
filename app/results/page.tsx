import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { ResultsBoard } from "@/components/boards/ResultsBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Record"
        title="Results"
        lede="REAL grades from ESPN box scores + CLV vs last pre-kick snapshot. EXAMPLE/SEED rows stay in their own bucket."
      />
      <SeedBanner>
        {catalog.realResults.length
          ? `${catalog.realResults.length} REAL settled tickets. EXAMPLE/SEED is a separate table.`
          : "No REAL grades yet. Week 1 Sunday is not forced to settle. EXAMPLE/SEED remains labeled."}
      </SeedBanner>
      <ResultsBoard real={catalog.realResults} example={catalog.exampleResults} summary={catalog.resultsSummary} />
    </div>
  );
}
