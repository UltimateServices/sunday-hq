import Link from "next/link";
import type { TeamTotalRow } from "@/lib/team-total-view";
import { EdgeBadge, StatusChip, ToneChip } from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { formatNumber } from "@/lib/format";

export function TeamTotalPickCard({ row, rank }: { row: TeamTotalRow; rank: number }) {
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-1">
            <span className="num text-[11px] text-gold">#{rank}</span>
            <ToneChip tone={row.side === "OVER" ? "green" : "blue"}>{row.side}</ToneChip>
            <ToneChip tone="yellow">ESTIMATE</ToneChip>
            <StatusChip id="LOW_SAMPLE" />
          </div>
          <Link href={`/games/${row.gameId}`} className="text-sm font-semibold hover:text-gold">
            {row.teamAbbr} team total
          </Link>
          <p className="text-[11px] text-muted">{row.matchup}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted uppercase">Derived</p>
          <p className="num text-xl font-semibold text-gold">
            {row.side === "OVER" ? "O" : "U"} {formatNumber(row.line.value)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-sm bg-bg-elev px-1.5 py-1">
          <p className="text-[9px] tracking-wide text-muted uppercase">Model</p>
          <p className="num text-[12px]">{formatNumber(row.model)}</p>
        </div>
        <div className="rounded-sm bg-bg-elev px-1.5 py-1">
          <p className="text-[9px] tracking-wide text-muted uppercase">Edge</p>
          <EdgeBadge value={row.edge} unit="yards" />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Derived from DK spread + total. Not a listed DraftKings team-total ticket.
      </p>
      <div className="mt-3 flex justify-end">
        <WhyDrawer title={`${row.teamAbbr} team total`} lenses={row.lenses} sections={row.why} />
      </div>
    </article>
  );
}
