import { EmptyState } from "./EmptyState";
import { ToneChip } from "./badges";
import { formatPct } from "@/lib/format";
import type { ParlayConstruct } from "@/lib/types/domain";

export function ParlayCard({
  profile,
  note,
  construct,
}: {
  profile: "Conservative" | "Balanced" | "Aggressive";
  note?: string;
  construct?: ParlayConstruct;
}) {
  if (!construct) {
    return (
      <article className="rounded-lg border border-dashed border-line bg-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">{profile}</p>
          <ToneChip tone="purple">NO MATCH</ToneChip>
        </div>
        <EmptyState message={note ?? "NO PLAYS MEET FILTERS"} />
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
        <p className="text-sm font-semibold">{construct.title}</p>
        <ToneChip tone="blue">{construct.profile}</ToneChip>
      </div>
      <p className="num text-xl text-gold">{formatPct(construct.combinedProb.value)}</p>
      <p className="text-[11px] text-muted">{construct.correlation.replaceAll("_", " ")} · {construct.legs.length} legs</p>
      <ul className="mt-2 space-y-1 text-xs text-ink/90">
        {construct.legs.map((leg) => (
          <li key={leg.propId}>{leg.label}</li>
        ))}
      </ul>
    </article>
  );
}
