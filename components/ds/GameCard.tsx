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

const LIVE: Record<LiveStatus, StatusTone> = {
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
    <Link href={`/games/${id}`} className="block rounded-lg border border-line bg-card p-3 hover:border-gold/40">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] text-muted">{kickoff}</p>
          <p className="font-semibold">{matchup}</p>
          <p className="text-xs text-muted">{spread}</p>
        </div>
        <p className="num text-2xl text-gold">{formatNumber(total)}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <ToneChip tone={LIVE[live]}>{live}</ToneChip>
        <ToneChip tone={TIER[tier]}>{tier.replaceAll("_", " ")}</ToneChip>
        <WeatherBadge impact={weatherImpact} indoor={indoor} summary={weatherSummary} />
      </div>
      {note ? <p className="mt-2 text-[11px] text-muted">{note}</p> : null}
    </Link>
  );
}
