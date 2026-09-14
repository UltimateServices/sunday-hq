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
    <div role="alert" className="rounded-xl border border-alert/50 bg-alert/15 px-4 py-5">
      <p className="text-[20px] font-semibold tracking-tight text-ink">{gate.headline}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{gate.body}</p>
    </div>
  );
}
