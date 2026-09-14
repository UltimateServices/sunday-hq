"use client";

import { useMemo, useState } from "react";
import { RESULTS, RESULTS_SUMMARY } from "@/data/week1/results";
import { EmptyState } from "@/components/ds/EmptyState";
import { StatTile } from "@/components/ds/StatTile";
import { ToneChip } from "@/components/ds/badges";
import { formatMeasured, formatNumber, formatPct } from "@/lib/format";
import type { ResultRow } from "@/lib/types/domain";
import type { ResultsSummaryView } from "@/lib/catalog";

export function ResultsBoard({
  real = [],
  example = RESULTS,
  summary = { ...RESULTS_SUMMARY, realCount: 0, exampleCount: RESULTS.length },
}: {
  real?: ResultRow[];
  example?: ResultRow[];
  summary?: ResultsSummaryView;
}) {
  const [result, setResult] = useState("ALL");
  const [side, setSide] = useState("ALL");
  const [bucket, setBucket] = useState<"REAL" | "EXAMPLE">("REAL");

  const source = bucket === "REAL" ? real : example;
  const rows = useMemo(() => {
    return source.filter((r) => (result === "ALL" || r.result === result) && (side === "ALL" || r.side === side));
  }, [result, side, source]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatTile label="REAL record" value={summary.realCount ? summary.record : "0-0"} hint={summary.note} />
        <StatTile label="REAL units" value={formatNumber(summary.realCount ? summary.units : 0)} />
        <StatTile label="REAL ROI" value={summary.roi === null || !summary.realCount ? "DATA UNAVAILABLE" : formatPct(summary.roi)} />
        <StatTile label="REAL CLV" value={summary.clvAvg === null || !summary.realCount ? "DATA UNAVAILABLE" : formatNumber(summary.clvAvg)} />
      </div>
      <p className="text-xs text-muted">{summary.note}</p>
      <div className="flex flex-wrap gap-1">
        <button type="button" onClick={() => setBucket("REAL")} className={`action-btn ${bucket === "REAL" ? "text-gold" : ""}`}>
          REAL ({real.length})
        </button>
        <button type="button" onClick={() => setBucket("EXAMPLE")} className={`action-btn ${bucket === "EXAMPLE" ? "text-gold" : ""}`}>
          EXAMPLE/SEED ({example.length})
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {["ALL", "WIN", "LOSS", "PUSH", "VOID"].map((r) => (
          <button key={r} type="button" onClick={() => setResult(r)} className={`action-btn ${result === r ? "text-gold" : ""}`}>
            {r}
          </button>
        ))}
        {["ALL", "OVER", "UNDER"].map((s) => (
          <button key={s} type="button" onClick={() => setSide(s)} className={`action-btn ${side === s ? "text-gold" : ""}`}>
            {s}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead className="bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
              <tr className="border-b border-line">
                {["Ticket", "Side", "u", "Result", "Taken", "Close", "CLV", "Label"].map((h) => (
                  <th key={h} className="px-2 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-line/70">
                  <td className="px-2 py-2">
                    <p className="font-semibold">{row.label}</p>
                    <p className="text-[11px] text-muted">{row.note}</p>
                  </td>
                  <td className="px-2 py-2">{row.side}</td>
                  <td className="num px-2 py-2">{row.units}</td>
                  <td className="px-2 py-2">
                    <ToneChip tone={row.result === "WIN" ? "green" : row.result === "LOSS" ? "red" : "blue"}>{row.result}</ToneChip>
                  </td>
                  <td className="num px-2 py-2">{formatMeasured(row.lineTaken)}</td>
                  <td className="num px-2 py-2">{formatMeasured(row.closingLine)}</td>
                  <td className="num px-2 py-2">{formatMeasured(row.clv, 1, "signed")}</td>
                  <td className="px-2 py-2">
                    <ToneChip tone={row.seedLabel === "REAL" ? "green" : "orange"}>{row.seedLabel}</ToneChip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
