import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { TeamTotalsBoard } from "@/components/boards/TeamTotalsBoard";
import { teamTotalRows } from "@/lib/team-total-view";

export default function TeamTotalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Team Totals"
        lede="Implied from verified DK spread + total. Best Over / Under are placeholder tilts, not listed DK team-total tickets."
      />
      <SeedBanner>Derived numbers stay labeled. Do not treat implied totals as a DraftKings market.</SeedBanner>
      <TeamTotalsBoard rows={teamTotalRows()} />
    </div>
  );
}
