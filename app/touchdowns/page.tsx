import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { TouchdownsBoard } from "@/components/boards/TouchdownsBoard";
import { PROPS } from "@/data/week1/props";
import { toPropView } from "@/lib/prop-view";

export default function TouchdownsPage() {
  const views = PROPS.filter((p) =>
    ["ANYTIME_TD", "FIRST_TD", "TWO_PLUS_TD", "RUSH_TD"].includes(p.market),
  ).map((p) => toPropView(p));

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Touchdowns"
        lede="Anytime / First TD / 2+ / QB rush. Model P is ESTIMATE. DK anytime prices remain DATA UNAVAILABLE."
      />
      <SeedBanner>Research names and placeholder probabilities. Not tickets. No LOCK language.</SeedBanner>
      <TouchdownsBoard views={views} />
    </div>
  );
}
