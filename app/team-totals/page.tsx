import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { TeamTotalsBoard } from "@/components/boards/TeamTotalsBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { teamTotalRows } from "@/lib/team-total-view";

export const dynamic = "force-dynamic";

export default async function TeamTotalsPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Team Totals"
        lede="Implied from DK spread + total (live overlay when fresh). Best Over / Under are placeholder tilts, not listed DK team-total tickets."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <TeamTotalsBoard rows={teamTotalRows(catalog.games)} />
    </div>
  );
}
