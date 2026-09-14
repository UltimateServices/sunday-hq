import type { DataHealthState } from "@/lib/types/domain";

export function DataHealthBanner({
  state,
  tape,
  issues,
  liveBanner,
  staleWarning,
}: {
  state: DataHealthState;
  tape?: "LIVE" | "STALE" | "ESTIMATE";
  issues?: string[];
  liveBanner?: string | null;
  staleWarning?: string | null;
}) {
  const live = state === "HEALTHY" && tape === "LIVE";
  if (live) {
    return (
      <div role="status" className="surface px-4 py-3">
        <p className="text-[15px] font-semibold text-ink">Live DraftKings tape</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {liveBanner ?? "Prices on this page came from the last fresh pull. Still research — not a guarantee."}
        </p>
      </div>
    );
  }
  return (
    <div role="alert" className="rounded-xl border border-alert/50 bg-alert/15 px-4 py-5">
      <p className="text-[20px] font-semibold tracking-tight text-ink">Not live — do not bet from this page.</p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        {staleWarning ??
          (issues?.[0] ?? "Live prices are not connected. Seed parlays and props are hidden.")}
      </p>
    </div>
  );
}
