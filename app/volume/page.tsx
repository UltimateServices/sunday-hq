import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageSkeleton } from "@/components/ds/Skeleton";
import { VolumeBoard } from "@/components/boards/VolumeBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { volumeRows, volumeSource } from "@/lib/volume-board";

export const dynamic = "force-dynamic";

export default async function VolumePage() {
  const catalog = await getWeekCatalog();
  const research = !catalog.liveGate.actionable;
  const rows = volumeRows(volumeSource(catalog));

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Volume"
        lede="Safe / ceiling / floor boards from tagged volume. Role stability is LOW / MEDIUM / HIGH / ELITE ESTIMATE. Carries, targets, routes, attempts, and snaps stay DATA UNAVAILABLE."
      />
      <Suspense fallback={<PageSkeleton />}>
        <VolumeBoard rows={rows} research={research} />
      </Suspense>
    </div>
  );
}
