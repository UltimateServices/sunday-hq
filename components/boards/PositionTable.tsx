import Link from "next/link";
import { ConfidenceBadge, HealthBadge, ToneChip } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";
import { positionTableColumns, type PositionTableRow } from "@/lib/position-board";
import type { Position } from "@/lib/types/domain";

export function PositionTable({
  position,
  rows,
}: {
  position: Position;
  rows: PositionTableRow[];
}) {
  if (rows.length === 0) return <EmptyState message="NO PLAYS MEET FILTERS" hint="No seed/catalog rows for this position." />;
  const columns = positionTableColumns(position);

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
          <tr className="border-b border-line">
            <th className="px-2 py-2 font-medium">#</th>
            <th className="px-2 py-2 font-medium">{position}</th>
            <th className="px-2 py-2 font-medium">Opponent</th>
            {columns.map((col) => (
              <th key={col} className="px-2 py-2 font-medium">
                {col}
              </th>
            ))}
            <th className="px-2 py-2 font-medium">Health</th>
            <th className="px-2 py-2 font-medium">Conf</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.playerId} className="border-b border-line/70 hover:bg-card-hover">
              <td className="num px-2 py-2 text-muted">{index + 1}</td>
              <td className="px-2 py-2">
                <Link href={row.href} className="font-semibold hover:text-gold">
                  {row.playerName}
                </Link>
                <div className="text-[10px] text-muted">{row.teamAbbr}</div>
                {row.role ? (
                  <div className="mt-1">
                    <ToneChip tone={row.role === "ROLE UNCERTAIN" ? "purple" : "blue"}>{row.role}</ToneChip>
                  </div>
                ) : null}
              </td>
              <td className="px-2 py-2">{row.opponent}</td>
              {row.cells.map((cell) => (
                <td key={cell.label} className={`px-2 py-2 ${cell.pending ? "text-muted" : "num"}`}>
                  {cell.value}
                </td>
              ))}
              <td className="px-2 py-2">
                <HealthBadge state={row.health} />
              </td>
              <td className="px-2 py-2">
                <ConfidenceBadge grade={row.confidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
