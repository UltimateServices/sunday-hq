import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataStatus } from "@/components/shared/DataStatus";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { derivedTeamTotals } from "@/lib/team-totals";
import { formatNumber } from "@/lib/format";
import type { StatusTone } from "@/lib/health";

const TONE: Record<string, StatusTone> = {
  SHOOTOUT: "green",
  NEUTRAL: "blue",
  CAPPED: "yellow",
  WEATHER_RISK: "orange",
  QB_DOWNGRADE: "red",
};

export default function TeamTotalsPage() {
  const rows = derivedTeamTotals().sort((a, b) => (b.line.value ?? 0) - (a.line.value ?? 0));
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Team Totals"
        readiness="PLACEHOLDER"
        lede="Implied from verified DK spread + total. Not a listed DraftKings team-total market until that book line is ingested."
      />
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <Link key={row.id} href={`/games/${row.gameId}`} className="rounded-lg border border-line bg-card p-3">
            <p className="text-[11px] text-muted">{row.note}</p>
            <p className="text-sm font-semibold">{TEAM_BY_ID[row.teamId].city} {TEAM_BY_ID[row.teamId].name}</p>
            <p className="num text-2xl text-gold">{formatNumber(row.line.value)}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <StatusBadge tone={TONE[row.environment]}>{row.environment.replaceAll("_", " ")}</StatusBadge>
              <DataStatus quality={row.line.quality} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
