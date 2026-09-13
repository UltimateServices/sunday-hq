import { EmptyState } from "./EmptyState";
import { ToneChip } from "./badges";

export function ParlayCard({
  profile,
  note,
}: {
  profile: "Conservative" | "Balanced" | "Aggressive";
  note?: string;
}) {
  return (
    <article className="rounded-lg border border-dashed border-rare/40 bg-rare/5 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">{profile}</p>
        <ToneChip tone="purple">PENDING</ToneChip>
      </div>
      <EmptyState message={note ?? "NO PLAYS MEET FILTERS · parlay engine PENDING"} />
    </article>
  );
}
