import { CALIBRATION_BUCKETS, RESULTS_SUMMARY } from "@/data/week1/results";
import { StatTile } from "@/components/ds/StatTile";
import { ToneChip } from "@/components/ds/badges";
import { formatNumber, formatPct } from "@/lib/format";

export function ModelPerformanceBoard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatTile label="Accuracy" value="50.0%" hint="EXAMPLE 1-1 excluding push/void. LOW SAMPLE." />
        <StatTile label="ROI" value={formatPct(RESULTS_SUMMARY.roi)} hint="EXAMPLE/SEED units." />
        <StatTile label="CLV" value={formatNumber(RESULTS_SUMMARY.clvAvg)} hint="Yards illustration, not a closing archive." />
        <StatTile label="n" value="4" hint="Placeholder tickets only." />
      </div>
      <section>
        <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">Calibration buckets · illustrative</h2>
        <div className="space-y-2">
          {CALIBRATION_BUCKETS.map((b) => {
            const pred = b.predicted * 100;
            const obs = b.observed === null ? null : b.observed * 100;
            return (
              <div key={b.label} className="rounded-md border border-line bg-card p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{b.label}</p>
                  <ToneChip tone={b.quality === "UNAVAILABLE" ? "purple" : "yellow"}>{b.quality.replaceAll("_", " ")}</ToneChip>
                </div>
                <div className="space-y-1">
                  <Bar label="Predicted" pct={pred} />
                  {obs === null ? (
                    <p className="text-xs text-muted">Observed: DATA UNAVAILABLE · n={b.n}</p>
                  ) : (
                    <Bar label={`Observed n=${b.n}`} pct={obs} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <p className="text-xs text-muted">
        Week 1 Sunday is not settled. These buckets exist so the learning surface is usable. They are not proof the placeholder CDF is calibrated.
      </p>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-muted">
        <span>{label}</span>
        <span className="num">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-sm bg-bg-elev">
        <div className="h-full bg-gold" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
    </div>
  );
}
