import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { AdminBoard } from "@/components/boards/AdminBoard";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="System"
        title="Admin"
        lede="Data sources, weights, thresholds, books, automation, alerts, flags, data health, Sunday routine with timestamps. Secrets never live here."
      />
      <SeedBanner>Control surface is visible. Keys stay in the Vercel dashboard when ingest exists.</SeedBanner>
      <AdminBoard />
    </div>
  );
}
