"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GamePlayerRow } from "@/lib/game-workspace";
import type { Position } from "@/lib/types/domain";

const TABS: Array<Position | "ALL"> = ["ALL", "QB", "RB", "WR", "TE"];

export function GamePlayerTable({ rows }: { rows: GamePlayerRow[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const filtered = useMemo(
    () => (tab === "ALL" ? rows : rows.filter((row) => row.position === tab)),
    [rows, tab],
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Position">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`action-btn shrink-0 ${tab === item ? "bg-card text-ink" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto surface">
        <table className="min-w-[720px] w-full text-left text-[13px]">
          <thead className="sticky top-0 border-b border-line text-[11px] text-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Player</th>
              <th className="px-3 py-2 font-medium">Usage</th>
              <th className="px-3 py-2 font-medium">Yards</th>
              <th className="px-3 py-2 font-medium">Rec</th>
              <th className="px-3 py-2 font-medium">TD %</th>
              <th className="px-3 py-2 font-medium">Fantasy</th>
              <th className="px-3 py-2 font-medium">Top prop</th>
              <th className="px-3 py-2 font-medium">Conf</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.playerId} className="border-t border-line/70">
                <td className="px-3 py-2">
                  <Link href={`/players/${row.playerId}`} className="font-medium hover:text-gold">
                    {row.name}
                  </Link>
                  <p className="text-[12px] text-muted">
                    {row.teamAbbr} {row.position}
                  </p>
                </td>
                <td className="px-3 py-2">{row.usage}</td>
                <td className="num px-3 py-2">{row.yards}</td>
                <td className="num px-3 py-2">{row.receptions}</td>
                <td className="num px-3 py-2">{row.tdProb}</td>
                <td className="num px-3 py-2">{row.fantasy}</td>
                <td className="px-3 py-2">{row.topProp}</td>
                <td className="px-3 py-2">{row.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
