"use client";

import { useMemo, useState } from "react";
import { RESULTS, RESULTS_SUMMARY } from "@/data/week1/results";
import { EmptyState } from "@/components/ds/EmptyState";
import { StatTile } from "@/components/ds/StatTile";
import { ToneChip } from "@/components/ds/badges";
import { formatMeasured, formatNumber, formatPct } from "@/lib/format";

export function ResultsBoard() {
  const [result, setResult] = useState("ALL");
  const [side, setSide] = useState("ALL");

  const rows = useMemo(() => {
    return RESULTS.filter((r) => (result === "ALL" || r.result === result) && (side === "ALL" || r.side === side));
  }, [result, side]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatTile label="Record" value={RESULTS_SUMMARY.record} hint={RESULTS_SUMMARY.note} />
        <StatTile label="Units" value={formatNumber(RESULTS_SUMMARY.units)} />
        <StatTile label="ROI" value={formatPct(RESULTS_SUMMARY.roi)} />
        <StatTile label="Avg CLV" value={formatNumber(RESULTS_SUMMARY.clvAvg)} />
      </div>
      <p className="text-xs text-muted">{RESULTS_SUMMARY.note}</p>
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
                    <ToneChip tone="orange">{row.seedLabel}</ToneChip>
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
