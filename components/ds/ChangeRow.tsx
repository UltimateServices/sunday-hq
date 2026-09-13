import type { ChangeItem } from "@/lib/types/domain";
import { StatusChip } from "./badges";
import { ToneChip } from "./badges";

export function ChangeRow({ item }: { item: ChangeItem }) {
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-1 flex flex-wrap items-center gap-1">
        <ToneChip tone="blue">{item.category}</ToneChip>
        {item.quality === "SOURCE_CONFLICT" ? <StatusChip id="SOURCE_CONFLICT" /> : null}
        {item.quality === "STALE" ? <StatusChip id="STALE_DATA" /> : null}
        {item.quality === "LOW_SAMPLE" ? <StatusChip id="LOW_SAMPLE" /> : null}
      </div>
      <h3 className="text-sm font-semibold">{item.title}</h3>
      <p className="text-xs text-muted">
        {item.from} → {item.to}
      </p>
      <p className="mt-1 text-sm">{item.implication}</p>
    </article>
  );
}
