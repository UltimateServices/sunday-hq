import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageSkeleton } from "@/components/ds/Skeleton";
import { PropsBoard } from "@/components/props/PropsBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { toPropView } from "@/lib/prop-view";
import { SeedBanner } from "@/components/shared/SeedBanner";

export const dynamic = "force-dynamic";

export default async function PropsPage() {
  const catalog = await getWeekCatalog();
  const views = catalog.props.map((p) => toPropView(p));
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Research"
        title="Props"
        lede="Every player market this week. Cards on a phone, a table when you need to scan. Live DraftKings prices when the tape is fresh."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <Suspense fallback={<PageSkeleton />}>
        <PropsBoard views={views} />
      </Suspense>
    </div>
  );
}
