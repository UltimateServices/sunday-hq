import { CALIBRATION_BUCKETS, RESULTS_SUMMARY } from "@/data/week1/results";
import { StatTile } from "@/components/ds/StatTile";
import { ToneChip } from "@/components/ds/badges";
import { formatNumber, formatPct } from "@/lib/format";
import type { CalibrationBucket } from "@/lib/types/domain";
import type { ResultsSummaryView } from "@/lib/catalog";

export function ModelPerformanceBoard({
  realSummary,
  exampleBuckets = CALIBRATION_BUCKETS,
  realBuckets,
  realN = 0,
}: {
  realSummary?: ResultsSummaryView;
  exampleBuckets?: CalibrationBucket[];
  realBuckets?: CalibrationBucket[];
  realN?: number;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatTile
          label="REAL n"
          value={`${realN}`}
          hint={realN ? "Settled REAL tickets only." : "No REAL grades. Not a model proof."}
        />
        <StatTile
          label="REAL ROI"
          value={realSummary?.realCount && realSummary.roi !== null ? formatPct(realSummary.roi) : "DATA UNAVAILABLE"}
          hint="EXAMPLE/SEED excluded."
        />
        <StatTile
          label="REAL CLV"
          value={realSummary?.realCount && realSummary.clvAvg !== null ? formatNumber(realSummary.clvAvg) : "DATA UNAVAILABLE"}
          hint="Vs last pre-kick DK snapshot."
        />
        <StatTile label="EXAMPLE n" value="4" hint="Illustrative tickets only." />
      </div>
      <section>
        <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">Calibration · REAL</h2>
        <BucketList
          buckets={realBuckets ?? exampleBuckets.map((b) => ({ ...b, observed: null, n: 0, quality: "UNAVAILABLE" as const }))}
          empty="Observed stays DATA UNAVAILABLE until settle writes model-prob onto lock snapshots."
        />
      </section>
      <section>
        <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">Calibration · EXAMPLE/SEED (illustrative)</h2>
        <BucketList buckets={exampleBuckets} empty="Illustrative only." />
      </section>
      <p className="text-xs text-muted">
        EXAMPLE/SEED buckets exist so the learning surface is usable. They are not proof the placeholder CDF is
        calibrated. ROI {formatPct(RESULTS_SUMMARY.roi)} is EXAMPLE-only.
      </p>
    </div>
  );
}

function BucketList({ buckets, empty }: { buckets: CalibrationBucket[]; empty: string }) {
  return (
    <div className="space-y-2">
      {buckets.map((b) => {
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
                <p className="text-xs text-muted">Observed: DATA UNAVAILABLE · n={b.n}. {empty}</p>
              ) : (
                <Bar label={`Observed n=${b.n}`} pct={obs} />
              )}
            </div>
          </div>
        );
      })}
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
