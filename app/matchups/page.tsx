import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { MatchupsBoard } from "@/components/boards/MatchupsBoard";
import { MATCHUPS } from "@/data/week1/matchups";

export default function MatchupsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Matchups"
        lede="BEST / WORST panels by position with factor breakdown. Week 1 scores are LOW SAMPLE. Coverage / box count stay UNAVAILABLE when not wired."
      />
      <SeedBanner>
        GOOD PLAYER ≠ GOOD MATCHUP ≠ GOOD PROJECTION ≠ GOOD BET. Missing factors are labeled, not invented.
      </SeedBanner>
      <MatchupsBoard grades={MATCHUPS} />
    </div>
  );
}
