import Link from "next/link";
import type { PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import {
  ConfidenceBadge,
  EdgeBadge,
  EVBadge,
  HealthBadge,
  MarketMovementBadge,
  ProjectionBadge,
  WeatherBadge,
} from "./badges";
import { WhyDrawer } from "./WhyDrawer";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { PropActions } from "./PropActions";

export function PropCard({ view, compact = false }: { view: PropView; compact?: boolean }) {
  const wx = WEATHER_BY_GAME[view.gameId];
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <Link href={`/players/${view.playerId}`} className="text-sm font-semibold hover:text-gold">
            {view.playerName}
          </Link>
          <p className="text-[11px] text-muted">
            {view.teamAbbr} · {view.position} · {view.matchup}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted uppercase">{MARKET_LABEL[view.market]}</p>
          <p className="num text-xl font-semibold text-gold">
            {view.side === "OVER" ? "O" : "U"} {formatMeasured(view.line)}
          </p>
        </div>
      </div>
      <div className="mb-2 flex flex-wrap gap-1">
        <HealthBadge state={view.health} />
        <ConfidenceBadge grade={view.confidenceGrade} />
        <MarketMovementBadge direction={view.movement.direction} />
        {wx ? <WeatherBadge impact={wx.impact} indoor={wx.indoor} /> : null}
      </div>
      <div className={`grid gap-2 text-[11px] ${compact ? "grid-cols-2" : "grid-cols-3 sm:grid-cols-4"}`}>
        <Cell label="1 Avail" value={view.healthLabel} />
        <Cell label="2 Proj" value="" extra={<ProjectionBadge value={view.model} />} />
        <Cell label="3 Price" value={formatMeasured(view.oddsAmerican, 0, "american")} />
        <Cell label="4 Prob" value={formatMeasured(view.pricing.modelProb, 1, "pct")} />
        <Cell label="5 Edge" value="" extra={<EdgeBadge value={view.pricing.edge.value} unit="yards" />} />
        <Cell label="6 Conf" value="" extra={<ConfidenceBadge grade={view.confidenceGrade} />} />
        <Cell label="7 Matchup" value={view.matchup} />
        <Cell label="EV" value="" extra={<EVBadge value={view.pricing.ev.value} />} />
      </div>
      {!compact ? (
        <p className="mt-2 text-[11px] text-muted">
          8 WX · {view.weatherNote} · 9 Move · {view.movement.note}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <PropActions view={view} />
        <WhyDrawer title={`${view.playerName} ${MARKET_LABEL[view.market]}`} lenses={view.lenses} sections={view.whySections} />
      </div>
    </article>
  );
}

function Cell({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-sm bg-bg-elev px-1.5 py-1">
      <p className="text-[9px] tracking-wide text-muted uppercase">{label}</p>
      {extra ?? <p className="num truncate text-[12px]">{value}</p>}
    </div>
  );
}
