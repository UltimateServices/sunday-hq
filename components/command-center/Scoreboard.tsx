"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/ds/GameCard";
import type { EnvironmentRow } from "@/lib/command-center";

const FILTERS = ["ALL", "1PM", "4PM", "SNF"] as const;

export function Scoreboard({ rows }: { rows: EnvironmentRow[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const visible = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((r) => r.window === filter)),
    [filter, rows],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`action-btn ${filter === f ? "text-gold" : ""}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {visible.map((row) => (
          <div key={row.gameId} className="min-w-[220px] max-w-[260px] shrink-0">
            <GameCard
              id={row.gameId}
              matchup={row.matchup}
              kickoff={`${row.kickoff} · ${row.window}`}
              total={row.total}
              spread={row.spread}
              indoor={row.indoor}
              tier={row.tier}
              weatherImpact={row.weatherImpact}
              weatherSummary={row.weatherSummary}
              live={row.live}
              note={row.note}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
