import Link from "next/link";
import { ConfidenceBadge, EdgeBadge, ToneChip } from "@/components/ds/badges";
import type { HomeScanRow } from "@/lib/homepage";

export function HomeScanCard({
  row,
  rank,
  live,
}: {
  row: HomeScanRow;
  rank: number;
  live: boolean;
}) {
  return (
    <article className={`surface px-4 py-4 ${live ? "" : "opacity-[0.96]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] text-muted">#{rank}</p>
          <Link href={row.href} className="mt-0.5 block truncate text-[20px] font-semibold tracking-tight hover:text-gold">
            {row.who}
          </Link>
          <p className="mt-1 text-[14px] text-muted">
            {row.what}
            <span className="text-ink/35"> · </span>
            {row.context}
          </p>
        </div>
        <p className={`num shrink-0 text-[26px] font-semibold tracking-tight ${live ? "text-gold" : "text-ink"}`}>
          {row.line}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ConfidenceBadge grade={row.grade} />
        <EdgeBadge value={row.edgeValue} unit={row.edgeUnit} />
        <ToneChip tone={row.quality === "VERIFIED" ? "blue" : "yellow"}>{row.qualityLabel}</ToneChip>
        {live ? null : <ToneChip tone="orange">Not live</ToneChip>}
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-ink/90">{row.why}</p>
    </article>
  );
}
