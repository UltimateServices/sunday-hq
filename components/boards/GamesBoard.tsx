"use client";

import { useMemo, useState } from "react";
import { GameCard } from "@/components/ds/GameCard";
import { EmptyState } from "@/components/ds/EmptyState";
import { EnvScoreTiles } from "@/components/ds/EnvScoreTiles";
import { ScriptBars } from "@/components/ds/ScriptBars";
import { useShell } from "@/components/shell/ShellProvider";
import type { GameDeskRow } from "@/lib/game-desk";

export function GamesBoard({ rows }: { rows: GameDeskRow[] }) {
  const { gameWindow } = useShell();
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      rows.filter((row) => {
        if (gameWindow === "ALL") return true;
        return row.window === gameWindow;
      }),
    [rows, gameWindow],
  );

  return (
    <div className="space-y-3">
      {visible.length === 0 ? (
        <EmptyState message="NO PLAYS CURRENTLY MEET YOUR FILTERS" hint="Switch the window chip in the header." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const expanded = openId === row.id;
            return (
              <div key={row.id} className="space-y-2">
                <GameCard
                  id={row.id}
                  matchup={row.matchup}
                  kickoff={`${row.kickoff} · ${row.network}`}
                  total={row.total}
                  spread={row.spread}
                  indoor={row.indoor}
                  tier={row.tier}
                  weatherImpact={row.weatherImpact}
                  weatherSummary={row.weatherSummary}
                  live={row.live}
                  injuryCount={row.injuryCount}
                  bestProp={row.bestProp}
                  primaryRisk={row.primaryRisk}
                />
                <button
                  type="button"
                  onClick={() => setOpenId(expanded ? null : row.id)}
                  className="action-btn w-full"
                >
                  {expanded ? "Hide script" : "Expand script"}
                </button>
                {expanded ? (
                  <div className="surface space-y-4 p-4">
                    <EnvScoreTiles scores={row.env} />
                    <ScriptBars
                      homeLabel={row.homeAbbr}
                      awayLabel={row.awayAbbr}
                      pHomeWin={row.script.pHomeWin}
                      pAwayWin={row.script.pAwayWin}
                      pClose={row.script.pClose}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[12px] text-muted">Positive</p>
                        <ul className="mt-1 space-y-1 text-[13px] leading-relaxed">
                          {row.positives.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[12px] text-muted">Negative</p>
                        <ul className="mt-1 space-y-1 text-[13px] leading-relaxed">
                          {row.negatives.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
