"use client";

import { useState } from "react";
import type { AdminWeight } from "@/lib/types/domain";
import type { ModelThresholds } from "@/lib/weights";

export function WeightsEditor({
  weights,
  thresholds,
}: {
  weights: AdminWeight[];
  thresholds: ModelThresholds;
}) {
  const [rows, setRows] = useState(weights);
  const [minEdge, setMinEdge] = useState(String(thresholds.minEdgeYards));
  const [maxUnits, setMaxUnits] = useState(String(thresholds.maxUnits));
  const [maxCard, setMaxCard] = useState(String(thresholds.maxCard));
  const [note, setNote] = useState<string | null>(null);
  const [secret, setSecret] = useState("");

  async function save() {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (secret.trim()) headers["x-ingest-secret"] = secret.trim();
    const response = await fetch("/api/admin/weights", {
      method: "POST",
      headers,
      body: JSON.stringify({
        weights: rows,
        minEdgeYards: Number(minEdge),
        maxUnits: Number(maxUnits),
        maxCard: Number(maxCard),
      }),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    setNote(json.ok ? "Saved. Rankings / matchup scores recompute on the next load." : json.error ?? "Save failed");
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="text-[10px] tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Weight</th>
              <th className="px-2 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-b border-line/70">
                <td className="px-2 py-2 font-semibold">{row.name}</td>
                <td className="px-2 py-2">
                  <input
                    className="num w-20 rounded-sm border border-line bg-bg-elev px-1 py-0.5"
                    value={row.weight}
                    onChange={(event) => {
                      const next = [...rows];
                      next[index] = { ...row, weight: Number(event.target.value) };
                      setRows(next);
                    }}
                  />
                </td>
                <td className="px-2 py-2 text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-[11px] text-muted">
          Min edge (yd)
          <input className="mt-1 block w-full rounded-sm border border-line bg-bg-elev px-2 py-1 text-ink" value={minEdge} onChange={(e) => setMinEdge(e.target.value)} />
        </label>
        <label className="text-[11px] text-muted">
          Max units / play
          <input className="mt-1 block w-full rounded-sm border border-line bg-bg-elev px-2 py-1 text-ink" value={maxUnits} onChange={(e) => setMaxUnits(e.target.value)} />
        </label>
        <label className="text-[11px] text-muted">
          Max Sunday units
          <input className="mt-1 block w-full rounded-sm border border-line bg-bg-elev px-2 py-1 text-ink" value={maxCard} onChange={(e) => setMaxCard(e.target.value)} />
        </label>
      </div>
      <label className="block text-[11px] text-muted">
        Ingest secret (required on Vercel production)
        <input
          type="password"
          className="mt-1 block w-full max-w-sm rounded-sm border border-line bg-bg-elev px-2 py-1 text-ink"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          autoComplete="off"
        />
      </label>
      <button type="button" onClick={() => void save()} className="action-btn text-gold">
        Save weights
      </button>
      {note ? <p className="text-[11px] text-muted">{note}</p> : null}
    </div>
  );
}
