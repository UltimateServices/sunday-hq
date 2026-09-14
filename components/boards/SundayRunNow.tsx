"use client";

const STAGES = ["slate", "injuries", "weather", "odds", "projections", "settle", "monday-learn"] as const;

/** Desk control. Does not call The Odds API. Cron remains the runner. */
export function SundayRunNow() {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-[13px] leading-relaxed text-muted">
        RUN NOW is listed so the Sunday routine is not a missing product. Odds stage stays blocked until go-live keys.
        This desk does not call The Odds API.
      </p>
      {STAGES.map((stage) => (
        <div key={stage} className="flex items-center justify-between gap-3 rounded-md border border-line bg-bg-elev px-3 py-2">
          <p className="text-sm font-medium">{stage}</p>
          {stage === "odds" ? (
            <button type="button" disabled className="action-btn cursor-not-allowed opacity-50">
              Blocked · no Odds API tonight
            </button>
          ) : (
            <button type="button" disabled className="action-btn cursor-not-allowed opacity-50">
              Cron only · needs CRON_SECRET
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
