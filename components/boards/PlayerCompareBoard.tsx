"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { comparablePlayers, playerCompareRows } from "@/lib/player-compare";
import { HealthBadge, ToneChip } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";

export function PlayerCompareBoard({ selectedIds }: { selectedIds: string[] }) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(selectedIds);
  const pool = useMemo(() => comparablePlayers(), []);
  const selected = useMemo(() => playerCompareRows(ids), [ids]);

  function toggle(id: string) {
    const next = ids.includes(id) ? ids.filter((row) => row !== id) : ids.length >= 4 ? ids : [...ids, id];
    setIds(next);
    const qs = new URLSearchParams();
    qs.set("mode", "players");
    if (next.length) qs.set("ids", next.join(","));
    router.replace(`/compare?${qs.toString()}`);
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-muted">
        2–4 players. Usage, alts, and DraftKings prices stay DATA UNAVAILABLE. Seed lines are labeled — not live tickets.
      </p>
      <div className="flex flex-wrap gap-1">
        {pool.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => toggle(player.id)}
            className={`action-btn ${ids.includes(player.id) ? "border-gold/60 text-gold" : ""}`}
          >
            {player.name}
          </button>
        ))}
      </div>
      {selected.length < 2 ? (
        <EmptyState message="Pick 2–4 players." hint="We will not invent a fourth name or a DK price to fill the table." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="text-[10px] tracking-wide text-muted uppercase">
              <tr className="border-b border-line">
                <th className="px-2 py-2">Field</th>
                {selected.map((row) => (
                  <th key={row.id} className="px-2 py-2">
                    <Link href={row.href} className="hover:text-gold">
                      {row.name}
                    </Link>
                    <p className="font-normal text-muted">
                      {row.teamAbbr} {row.position}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Matchup" cells={selected.map((row) => row.matchup)} />
              <Row label="Depth" cells={selected.map((row) => row.depth)} />
              <tr className="border-b border-line/70">
                <td className="px-2 py-2 text-muted">Health</td>
                {selected.map((row) => (
                  <td key={row.id} className="px-2 py-2">
                    <HealthBadge state={row.health} />
                  </td>
                ))}
              </tr>
              <Row label="Weather" cells={selected.map((row) => row.weather)} />
              <Row label="Usage" cells={selected.map((row) => row.usage)} />
              <Row label="Posted line" cells={selected.map((row) => row.postedLine)} />
              <Row label="Line quality" cells={selected.map((row) => row.postedLineQuality)} />
              <Row label="Model / projection" cells={selected.map((row) => `${row.projection} · ${row.projectionQuality}`)} />
              <Row label="Model TD P" cells={selected.map((row) => `${row.tdProb} · ${row.tdQuality}`)} />
              <Row label="DraftKings odds" cells={selected.map((row) => row.dkOdds)} />
              <Row label="Fantasy PPR" cells={selected.map((row) => row.fantasyPpr)} />
              <Row label="Seed note" cells={selected.map((row) => row.notes)} />
              <tr className="border-b border-line/70">
                <td className="px-2 py-2 text-muted">Confidence</td>
                {selected.map((row) => (
                  <td key={row.id} className="px-2 py-2">
                    <ToneChip tone="yellow">Research only</ToneChip>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-b border-line/70">
      <td className="px-2 py-2 text-muted">{label}</td>
      {cells.map((cell, i) => (
        <td key={`${label}-${i}`} className="px-2 py-2 align-top">
          {cell}
        </td>
      ))}
    </tr>
  );
}
