"use client";

import { useMemo } from "react";
import { GameCard } from "@/components/ds/GameCard";
import { WindowSwitcher } from "@/components/ds/WindowSwitcher";
import { useShell } from "@/components/shell/ShellProvider";
import type { EnvironmentRow } from "@/lib/command-center";

export function Scoreboard({ rows }: { rows: EnvironmentRow[] }) {
  const { gameWindow, setGameWindow } = useShell();
  const visible = useMemo(() => {
    if (gameWindow === "ALL") return rows;
    if (gameWindow === "EARLY") return rows.filter((r) => r.window === "1PM");
    if (gameWindow === "LATE") return rows.filter((r) => r.window === "4PM");
    return rows.filter((r) => r.window === "SNF");
  }, [gameWindow, rows]);

  return (
    <div className="space-y-2">
      <WindowSwitcher value={gameWindow} onChange={setGameWindow} />
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
