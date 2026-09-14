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
  injuryCount,
  bestProp,
  primaryRisk,
  envScore,
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
  injuryCount?: number;
  bestProp?: string | null;
  primaryRisk?: string | null;
  envScore?: number | null;
}) {
  return (
    <Link href={`/games/${id}`} className="surface block p-4 transition-colors hover:bg-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted">{kickoff}</p>
          <p className="mt-0.5 text-[17px] font-semibold tracking-tight">{matchup}</p>
          <p className="text-[13px] text-muted">{spread}</p>
        </div>
        <div className="text-right">
          <p className="num text-[26px] font-semibold tracking-tight text-ink">{formatNumber(total)}</p>
          <p className="text-[11px] text-muted">Posted total</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <ToneChip tone={LIVE_TONE[live]}>{LIVE[live]}</ToneChip>
        <ToneChip tone={TIER[tier]}>{tier.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</ToneChip>
        {envScore != null ? <ToneChip tone="yellow">Env {envScore} EST</ToneChip> : null}
        <WeatherBadge impact={weatherImpact} indoor={indoor} summary={weatherSummary} />
        {injuryCount !== undefined ? <ToneChip tone={injuryCount > 0 ? "orange" : "blue"}>{injuryCount} inj</ToneChip> : null}
      </div>
      {bestProp ? <p className="mt-3 text-[13px] leading-relaxed text-ink/90">Lean · {bestProp}</p> : null}
      {primaryRisk ? <p className="mt-1 text-[13px] leading-relaxed text-muted">Risk · {primaryRisk}</p> : null}
      {note ? <p className="mt-3 text-[13px] leading-relaxed text-muted">{note}</p> : null}
    </Link>
  );
}
