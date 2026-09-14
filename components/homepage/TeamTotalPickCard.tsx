import Link from "next/link";
import type { TeamTotalRow } from "@/lib/team-total-view";
import { EdgeBadge, ToneChip } from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { formatNumber } from "@/lib/format";
import { oneLineWhy } from "@/lib/copy";

export function TeamTotalPickCard({ row, rank }: { row: TeamTotalRow; rank: number }) {
  return (
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] text-muted">#{rank}</p>
          <Link href={`/games/${row.gameId}`} className="mt-0.5 block text-[20px] font-semibold tracking-tight hover:text-gold">
            {row.teamAbbr} team total
          </Link>
          <p className="mt-1 text-[14px] text-muted">
            {row.side === "OVER" ? "Over" : "Under"} · {row.matchup}
          </p>
        </div>
        <p className="num shrink-0 text-[28px] font-semibold tracking-tight text-gold">
          {row.side === "OVER" ? "O" : "U"} {formatNumber(row.line.value)}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <EdgeBadge value={row.edge} unit="yards" />
        <ToneChip tone="yellow">Estimate</ToneChip>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-ink/90">
        {oneLineWhy(row.why.modelCase, "Built from the game spread and total — not a listed DraftKings team-total ticket.")}
      </p>
      <div className="mt-4">
        <WhyDrawer title={`${row.teamAbbr} team total`} lenses={row.lenses} sections={row.why} />
      </div>
    </article>
  );
}
