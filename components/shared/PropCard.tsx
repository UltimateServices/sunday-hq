import Link from "next/link";
import { DataStatus } from "./DataStatus";
import { HealthBadge } from "./HealthBadge";
import { WhyDrawer } from "./WhyDrawer";
import { MARKET_LABEL, weatherLine, type PropView } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";

export function PropCard({ view }: { view: PropView }) {
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <Link href={`/players/${view.playerId}`} className="text-sm font-semibold text-ink hover:text-gold">
            {view.playerName}
          </Link>
          <p className="text-[11px] text-muted">
            {view.teamAbbr} · {view.position} · {view.matchup}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-wide text-muted uppercase">{MARKET_LABEL[view.market]}</p>
          <p className="num text-xl font-semibold text-gold">
            {view.side === "OVER" ? "O" : "U"} {formatMeasured(view.line)}
          </p>
        </div>
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        <DataStatus quality={view.line.quality} title={view.line.note} />
        <HealthBadge state={view.health} />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-[11px] sm:grid-cols-4">
        <Stat label="Book" value={view.bookLabel} />
        <Stat label="Odds" value={formatMeasured(view.oddsAmerican, 0, "american")} />
        <Stat label="Model" value={formatMeasured(view.model)} />
        <Stat label="Median" value={formatMeasured(view.median)} />
        <Stat label="Edge" value={formatMeasured(view.pricing.edge, 1, "signed")} />
        <Stat label="Model P" value={formatMeasured(view.pricing.modelProb, 1, "pct")} />
        <Stat label="Implied" value={formatMeasured(view.pricing.impliedProb, 1, "pct")} />
        <Stat label="EV" value={formatMeasured(view.pricing.ev, 3, "signed")} />
      </dl>
      <p className="mt-2 text-[11px] text-muted">
        {view.matchupNote} · {weatherLine(view.gameId)}
      </p>
      <p className="mt-1 text-[11px] text-muted">Movement: {view.movement.note}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Link href={`/games/${view.gameId}`} className="text-[11px] text-info hover:underline">
          Game board
        </Link>
        <WhyDrawer title={`${view.playerName} ${MARKET_LABEL[view.market]}`} lenses={view.lenses} why={view.why} risks={view.risks} />
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-bg-elev px-1.5 py-1">
      <dt className="text-[9px] tracking-wide text-muted uppercase">{label}</dt>
      <dd className="num text-[12px] text-ink">{value}</dd>
    </div>
  );
}
