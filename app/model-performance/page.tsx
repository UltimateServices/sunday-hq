import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { ModelPerformanceBoard } from "@/components/boards/ModelPerformanceBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ModelPerformancePage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Record"
        title="Model Performance"
        lede="REAL accuracy / ROI / CLV sit apart from EXAMPLE/SEED calibration. Empty REAL buckets stay DATA UNAVAILABLE."
      />
      <SeedBanner>
        {catalog.realResults.length
          ? `${catalog.realResults.length} REAL grades. EXAMPLE buckets remain illustrative.`
          : "Placeholder CDF is not a model to certify. REAL buckets stay DATA UNAVAILABLE until settle."}
      </SeedBanner>
      <ModelPerformanceBoard
        realSummary={catalog.resultsSummary}
        exampleBuckets={catalog.calibration}
        realBuckets={catalog.realCalibration}
        realN={catalog.realResults.length}
      />
    </div>
  );
}
