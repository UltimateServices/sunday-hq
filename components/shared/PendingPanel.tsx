import type { PendingCapability } from "@/lib/types/domain";

export function PendingPanel({ capability }: { capability: PendingCapability }) {
  return (
    <section className="rounded-lg border border-dashed border-rare/40 bg-rare/5 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-sm border border-rare/40 bg-rare/15 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-rare uppercase">
          PENDING · PHASE {capability.phase}
        </span>
        <h2 className="text-sm font-semibold text-ink">{capability.title}</h2>
      </div>
      <p className="mb-3 text-sm text-muted">{capability.summary}</p>
      <p className="mb-1 text-[11px] tracking-wide text-muted uppercase">Blocked by</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-ink/90">
        {capability.blockedBy.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Route kept on purpose. The product is not redesigned around this gap.
      </p>
    </section>
  );
}
