import Link from "next/link";
import type { PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { isProbabilityMarket } from "@/lib/odds";
import { formatMeasured, formatPct } from "@/lib/format";
import {
  ConfidenceBadge,
  EdgeBadge,
  EVBadge,
  HealthBadge,
  MarketMovementBadge,
  ProjectionBadge,
  StatusChip,
  ToneChip,
} from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { PropActions } from "@/components/ds/PropActions";
import { homeChipFor } from "@/lib/homepage";
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
  const chip = homeChipFor(view);
  const lineQuality = view.line.quality;
  const oddsMissing = view.oddsAmerican.value === null;

  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1">
            <span className="num text-[11px] text-gold">#{rank}</span>
            <ToneChip tone={chip === "TDS" ? "purple" : chip === "UNDERS" ? "blue" : "green"}>{chip}</ToneChip>
            {tape === "STALE" ? <StatusChip id="STALE_DATA" /> : null}
            {tape === "ESTIMATE" || lineQuality === "ESTIMATE" || view.model.quality === "ESTIMATE" ? (
              <ToneChip tone="yellow">ESTIMATE</ToneChip>
            ) : null}
          </div>
          <Link href={`/players/${view.playerId}`} className="text-sm font-semibold hover:text-gold">
            {view.playerName}
          </Link>
          <p className="text-[11px] text-muted">
            {view.teamAbbr} · {view.position} · {view.matchup}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted uppercase">{MARKET_LABEL[view.market]}</p>
          {td ? (
            <>
              <p className="num text-xl font-semibold text-gold">{formatPct(view.model.value)}</p>
              <p className="text-[10px] text-muted">model · not a DK price</p>
            </>
          ) : (
            <p className="num text-xl font-semibold text-gold">
              {view.side === "OVER" ? "O" : "U"} {formatMeasured(view.line)}
            </p>
          )}
        </div>
      </div>
      <div className="mb-2 flex flex-wrap gap-1">
        <HealthBadge state={view.health} />
        <ConfidenceBadge grade={view.confidenceGrade} />
        <MarketMovementBadge direction={view.movement.direction} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
        <Cell label="Proj" extra={<ProjectionBadge value={view.model} />} />
        <Cell
          label="DK price"
          value={oddsMissing ? "DATA UNAVAILABLE" : formatMeasured(view.oddsAmerican, 0, "american")}
        />
        <Cell
          label="Edge"
          extra={
            <EdgeBadge
              value={view.pricing.edge.value}
              unit={td ? "prob" : "yards"}
            />
          }
        />
        <Cell label="EV" extra={<EVBadge value={view.pricing.ev.value} />} />
      </div>
      <p className="mt-2 text-[11px] text-muted">
        {oddsMissing
          ? "Assumed -110 EV is ESTIMATE for ranking only. Not a DraftKings ticket."
          : view.pricing.ev.note ?? view.movement.note}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <PropActions view={view} />
        <WhyDrawer title={`${view.playerName} ${MARKET_LABEL[view.market]}`} lenses={view.lenses} sections={view.whySections} />
      </div>
    </article>
  );
}

function Cell({ label, value, extra }: { label: string; value?: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-sm bg-bg-elev px-1.5 py-1">
      <p className="text-[9px] tracking-wide text-muted uppercase">{label}</p>
      {extra ?? <p className="num truncate text-[12px]">{value}</p>}
    </div>
  );
}
