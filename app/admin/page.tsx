import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { AdminBoard } from "@/components/boards/AdminBoard";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="System"
        title="Admin"
        lede="Data sources, weights, thresholds, books, automation, alerts, flags, data health, Sunday routine with last-run metadata. Secrets never live here."
      />
      <SeedBanner>
        {catalog.staleWarning ?? catalog.liveBanner} Ingest last success{" "}
        {catalog.health.ingestLastSuccessAt ?? "never"} · last failure {catalog.health.ingestLastFailureAt ?? "none"}.
      </SeedBanner>
      <AdminBoard catalog={catalog} />
    </div>
  );
}
