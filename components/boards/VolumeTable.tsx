import Link from "next/link";
import { ConfidenceBadge, VolumeStabilityBadge } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";
import { MARKET_LABEL } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import type { VolumeRow } from "@/lib/volume-board";

export function VolumeTable({
  rows,
  research = false,
}: {
  rows: VolumeRow[];
  research?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        message="NO PLAYS CURRENTLY MEET YOUR FILTERS"
        hint="We will not invent a volume row. Try All, or wait for tagged HIGH-volume looks."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
          <tr className="border-b border-line">
            {["Player", "Market", "Projected opps", "Recent opps", "Role stability", "Conf"].map((header) => (
              <th key={header} className="px-2 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.view.id} className="border-b border-line/70">
              <td className="px-2 py-2">
                <Link href={`/players/${row.view.playerId}`} className="font-semibold hover:text-gold">
                  {row.view.playerName}
                </Link>
                <div className="text-[10px] text-muted">
                  {row.view.teamAbbr} · {row.view.matchup}
                </div>
              </td>
              <td className="px-2 py-2">
                {MARKET_LABEL[row.view.market]}
                <div className="text-[10px] text-muted">
                  {research ? "Not live · " : ""}
                  {row.view.line.quality} line {formatMeasured(row.view.line)}
                </div>
              </td>
              <td className="px-2 py-2 text-muted">{row.projectedOpps}</td>
              <td className="px-2 py-2 text-muted">{row.recentOpps}</td>
              <td className="px-2 py-2">
                <VolumeStabilityBadge value={row.stability} />
              </td>
              <td className="px-2 py-2">
                <ConfidenceBadge grade={row.view.confidenceGrade} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[12px] text-muted">
        Stability is an ESTIMATE from volume tag + TD role + availability. Carries / targets / snaps / air yards stay
        DATA UNAVAILABLE. Not a DraftKings price.
      </p>
    </div>
  );
}
