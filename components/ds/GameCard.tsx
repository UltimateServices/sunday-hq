import Link from "next/link";
import type { EnvironmentTier, LiveStatus, WeatherImpact } from "@/lib/types/domain";
import { ToneChip, WeatherBadge } from "./badges";
import { formatNumber } from "@/lib/format";
import type { StatusTone } from "@/lib/health";

const TIER: Record<EnvironmentTier, StatusTone> = {
  SHOOTOUT: "green",
  NEUTRAL: "blue",
  CAPPED: "yellow",
  WEATHER_RISK: "orange",
  QB_DOWNGRADE: "red",
};

const LIVE: Record<LiveStatus, string> = {
  UPCOMING: "Upcoming",
  LIVE: "Live",
  FINAL: "Final",
};

const LIVE_TONE: Record<LiveStatus, StatusTone> = {
  UPCOMING: "blue",
  LIVE: "green",
  FINAL: "purple",
};

export function GameCard({
  id,
  matchup,
  kickoff,
  total,
  spread,
  indoor,
  tier,
  weatherImpact,
  weatherSummary,
  live,
  note,
}: {
  id: string;
  matchup: string;
  kickoff: string;
  total: number | null;
  spread: string;
  indoor: boolean;
  tier: EnvironmentTier;
  weatherImpact: WeatherImpact;
  weatherSummary?: string;
  live: LiveStatus;
  note?: string;
}) {
  return (
    <Link href={`/games/${id}`} className="surface block p-4 transition-colors hover:bg-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted">{kickoff}</p>
          <p className="mt-0.5 text-[17px] font-semibold tracking-tight">{matchup}</p>
          <p className="text-[13px] text-muted">{spread}</p>
        </div>
        <p className="num text-[26px] font-semibold tracking-tight text-gold">{formatNumber(total)}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <ToneChip tone={LIVE_TONE[live]}>{LIVE[live]}</ToneChip>
        <ToneChip tone={TIER[tier]}>{tier.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</ToneChip>
        <WeatherBadge impact={weatherImpact} indoor={indoor} summary={weatherSummary} />
      </div>
      {note ? <p className="mt-3 text-[13px] leading-relaxed text-muted">{note}</p> : null}
    </Link>
  );
}
