"use client";

import { useMemo, useState } from "react";
import { PARLAYS } from "@/data/week1/parlays";
import type { ParlayConstruct, ParlayKind } from "@/lib/types/domain";
import { EmptyState } from "@/components/ds/EmptyState";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { ToneChip } from "@/components/ds/badges";
import { formatPct } from "@/lib/format";

const TABS: ParlayKind[] = ["SGP", "CROSS", "TD", "CONSERVATIVE", "BALANCED", "AGGRESSIVE"];

const CORR_TONE = {
  STACKED: "orange",
  SAME_GAME: "yellow",
  ANTI_CORR: "blue",
  INDEPENDENT: "green",
  UNKNOWN: "purple",
} as const;

export function ParlaysBoard() {
  const [tab, setTab] = useState<ParlayKind>("SGP");
  const rows = useMemo(() => PARLAYS.filter((p) => p.kind === tab || p.profile.toUpperCase() === tab), [tab]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`action-btn ${tab === t ? "text-gold" : ""}`}>
            {t}
          </button>
        ))}
      </div>
      {rows.length === 0 ? <EmptyState /> : rows.map((row) => <ParlayDetail key={row.id} row={row} />)}
    </div>
  );
}

function ParlayDetail({ row }: { row: ParlayConstruct }) {
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="mb-2 flex flex-wrap items-center gap-1">
        <ToneChip tone="blue">{row.kind}</ToneChip>
        <ToneChip tone="purple">{row.profile}</ToneChip>
        <ToneChip tone={CORR_TONE[row.correlation]}>{row.correlation.replaceAll("_", " ")}</ToneChip>
      </div>
      <h3 className="text-lg font-semibold">{row.title}</h3>
      <p className="text-xs text-muted">{row.correlationNote}</p>
      <p className="num mt-2 text-2xl text-gold">{formatPct(row.combinedProb.value)}</p>
      <p className="text-[11px] text-muted">{row.combinedProb.note}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {row.legs.map((leg) => (
          <li key={leg.propId} className="rounded-md border border-line bg-bg-elev px-2 py-1">
            {leg.label} · P {formatPct(leg.modelProb.value)}
          </li>
        ))}
      </ul>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <h4 className="mb-1 text-[11px] tracking-wide uppercase">Why these legs fit</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {row.whyFit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1 text-[11px] tracking-wide text-bad uppercase">How this loses</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {row.howLoses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3">
        <WhyDrawer
          title={row.title}
          lenses={row.lenses}
          sections={{
            modelCase: row.whyFit,
            supporting: [row.correlationNote],
            risks: row.howLoses,
            marketContext: ["No DK parlay price ingested. Combined P is a placeholder product."],
            dataQuality: [row.combinedProb.note ?? "ESTIMATE"],
          }}
        />
      </div>
    </article>
  );
}
