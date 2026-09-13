import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { ModelPerformanceBoard } from "@/components/boards/ModelPerformanceBoard";

export default function ModelPerformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Record"
        title="Model Performance"
        lede="Accuracy / ROI / CLV cards and calibration buckets. Illustrative until Week 1 grades."
      />
      <SeedBanner>Placeholder CDF is not a model to certify. Empty buckets stay DATA UNAVAILABLE.</SeedBanner>
      <ModelPerformanceBoard />
    </div>
  );
}
