import Link from "next/link";
import type { PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { isProbabilityMarket } from "@/lib/odds";
import { formatMeasured, formatPct } from "@/lib/format";
import { ConfidenceBadge, EdgeBadge, HealthBadge, ToneChip } from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { oneLineWhy } from "@/lib/copy";
import type { HomeTape } from "@/lib/homepage";

export function HomePickCard({
  view,
  rank,
  tape,
}: {
  view: PropView;
  rank: number;
  tape: HomeTape;
}) {
  const td = isProbabilityMarket(view.market);
  const oddsMissing = view.oddsAmerican.value === null;
  const what = td
    ? `${MARKET_LABEL[view.market]}`
    : `${MARKET_LABEL[view.market]} ${view.side === "OVER" ? "over" : "under"}`;
  const line = td ? formatPct(view.model.value) : `${view.side === "OVER" ? "O" : "U"} ${formatMeasured(view.line)}`;

  return (
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] text-muted">#{rank}</p>
          <Link href={`/players/${view.playerId}`} className="mt-0.5 block text-[20px] font-semibold tracking-tight hover:text-gold">
            {view.playerName}
          </Link>
          <p className="mt-1 text-[14px] text-muted">
            {what}
            <span className="text-ink/40"> · </span>
            {view.teamAbbr} {view.position}
            <span className="text-ink/40"> · </span>
            {view.matchup}
          </p>
        </div>
        <p className="num shrink-0 text-[28px] font-semibold tracking-tight text-gold">{line}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <HealthBadge state={view.health} />
        <ConfidenceBadge grade={view.confidenceGrade} />
        <EdgeBadge value={view.pricing.edge.value} unit={td ? "prob" : "yards"} />
        {tape === "STALE" ? <ToneChip tone="orange">Stale</ToneChip> : null}
        {tape === "ESTIMATE" || view.model.quality === "ESTIMATE" ? <ToneChip tone="yellow">Estimate</ToneChip> : null}
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink/90">{oneLineWhy(view.whySections.modelCase, view.matchupNote)}</p>
      <p className="mt-1 text-[13px] text-muted">
        {oddsMissing
          ? "No DraftKings price yet. Edge is an estimate for ranking only."
          : `DraftKings ${formatMeasured(view.oddsAmerican, 0, "american")}.`}
      </p>

      <div className="mt-4">
        <WhyDrawer title={`${view.playerName} ${what}`} lenses={view.lenses} sections={view.whySections} />
      </div>
    </article>
  );
}
