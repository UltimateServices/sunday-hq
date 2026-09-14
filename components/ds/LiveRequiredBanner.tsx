import type { LiveGate } from "@/lib/live-gate";

export function LiveRequiredBanner({ gate }: { gate: LiveGate }) {
  if (gate.actionable) {
    return (
      <div role="status" className="rounded-xl border border-good/30 bg-good/10 px-4 py-3">
        <p className="text-[15px] font-semibold text-ink">{gate.headline}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{gate.body}</p>
      </div>
    );
  }
  return (
    <div role="alert" className="surface border-alert/40 bg-alert/10 px-5 py-4">
      <p className="text-[17px] font-semibold tracking-tight text-ink">{gate.headline}</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{gate.body}</p>
    </div>
  );
}
