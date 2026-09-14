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
  const missingOdds = (issues ?? []).some((issue) => /odds|DraftKings|ODDS_API/i.test(issue)) || tape === "ESTIMATE";
  const calm =
    state === "HEALTHY" && tape === "LIVE"
      ? "Live DraftKings tape is in. Numbers below are priced."
      : missingOdds
        ? "Live prices are not connected yet. What you see is research — estimates, not tickets. Dylan can add the Odds API key in Vercel to turn prices on."
        : (staleWarning ?? liveBanner ?? "Using the last good snapshot. We do not invent a DraftKings price.");

  return (
    <div className="surface px-4 py-3">
      <p className="text-[13px] font-medium text-ink">
        {state === "HEALTHY" ? "Data looks current" : "Working from estimates"}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{calm}</p>
    </div>
  );
}
