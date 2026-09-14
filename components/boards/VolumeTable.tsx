import Link from "next/link";
import { ConfidenceBadge, ToneChip } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";
import { MARKET_LABEL, type PropView } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import { volumeStability } from "@/lib/volume-stability";
import type { VolumeStability } from "@/lib/volume-stability";

const STABILITY_TONE: Record<VolumeStability, "purple" | "yellow" | "blue" | "green"> = {
  LOW: "purple",
  MEDIUM: "yellow",
  HIGH: "blue",
  ELITE: "green",
};

export function VolumeTable({ views }: { views: PropView[] }) {
  if (views.length === 0) return <EmptyState message="No live volume rows." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
          <tr className="border-b border-line">
            {["Player", "Market", "Line", "Volume stability", "Conf"].map((h) => (
              <th key={h} className="px-2 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {views.map((view) => {
            const stability = volumeStability(view);
            return (
              <tr key={view.id} className="border-b border-line/70">
                <td className="px-2 py-2">
                  <Link href={`/players/${view.playerId}`} className="font-semibold hover:text-gold">
                    {view.playerName}
                  </Link>
                </td>
                <td className="px-2 py-2">{MARKET_LABEL[view.market]}</td>
                <td className="num px-2 py-2">{formatMeasured(view.line)}</td>
                <td className="px-2 py-2">
                  <ToneChip tone={STABILITY_TONE[stability]}>{stability}</ToneChip>
                </td>
                <td className="px-2 py-2">
                  <ConfidenceBadge grade={view.confidenceGrade} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-[12px] text-muted">
        Stability is an ESTIMATE from volume tag + role. Recent-opportunity time series stays PENDING.
      </p>
    </div>
  );
}
