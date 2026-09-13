"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { MARKET_MOVES, movesForGame } from "@/data/week1/market-moves";
import { EmptyState } from "@/components/ds/EmptyState";
import { MarketMovementBadge, StatusChip, ToneChip } from "@/components/ds/badges";
import { formatNumber, spreadLabel } from "@/lib/format";
import type { MarketMoveEvent } from "@/lib/types/domain";

const HEAT_TONE = {
  QUIET: "blue",
  WARM: "yellow",
  STEAM: "orange",
} as const;

export function MarketsBoard() {
  const [heat, setHeat] = useState<"ALL" | MarketMoveEvent["heat"]>("ALL");
  const [drawer, setDrawer] = useState<string | null>(null);

  const games = useMemo(() => {
    return GAMES.filter((game) => {
      if (heat === "ALL") return true;
      return movesForGame(game.id).some((m) => m.heat === heat);
    });
  }, [heat]);

  const active = drawer ? movesForGame(drawer) : [];
  const activeGame = drawer ? GAMES.find((g) => g.id === drawer) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {(["ALL", "QUIET", "WARM", "STEAM"] as const).map((h) => (
          <button key={h} type="button" onClick={() => setHeat(h)} className={`action-btn ${heat === h ? "text-gold" : ""}`}>
            {h}
          </button>
        ))}
      </div>
      {games.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {games.map((game) => {
            const events = movesForGame(game.id);
            const latest = events[events.length - 1];
            const open = game.openingTotal?.value ?? game.total.value;
            const current = game.total.value;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setDrawer(game.id)}
                className="flex w-full items-center justify-between rounded-lg border border-line bg-card p-3 text-left hover:border-gold/40"
              >
                <div>
                  <p className="font-semibold">
                    {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
                  </p>
                  <p className="text-xs text-muted">{spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value)}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {open !== current ? <StatusChip id="LINE_MOVE" /> : null}
                    {latest?.heat === "STEAM" ? <StatusChip id="STEAM" /> : null}
                    {latest ? <ToneChip tone={HEAT_TONE[latest.heat]}>{latest.heat}</ToneChip> : null}
                    <MarketMovementBadge
                      direction={
                        open !== null && current !== null && current > open
                          ? "UP"
                          : open !== null && current !== null && current < open
                            ? "DOWN"
                            : open === current
                              ? "FLAT"
                              : "UNKNOWN"
                      }
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted">Open {formatNumber(open)}</p>
                  <p className="num text-2xl text-gold">{formatNumber(current)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {drawer && activeGame ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal>
          <button className="h-full flex-1" aria-label="Close timeline" onClick={() => setDrawer(null)} />
          <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-elev p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {TEAM_BY_ID[activeGame.awayTeamId].abbr} @ {TEAM_BY_ID[activeGame.homeTeamId].abbr} timeline
              </h3>
              <button type="button" onClick={() => setDrawer(null)} className="text-xs text-muted">
                Close
              </button>
            </div>
            <Link href={`/games/${activeGame.id}`} className="mb-3 inline-block text-xs text-gold">
              Open game
            </Link>
            {active.length === 0 ? (
              <EmptyState message="NO PLAYS MEET FILTERS" />
            ) : (
              <ol className="space-y-3">
                {active.map((event) => (
                  <li key={event.id} className="rounded-md border border-line bg-card p-3">
                    <div className="mb-1 flex flex-wrap gap-1">
                      <ToneChip tone={HEAT_TONE[event.heat]}>{event.heat}</ToneChip>
                      <ToneChip tone="blue">{event.market.replaceAll("_", " ")}</ToneChip>
                    </div>
                    <p className="num text-sm">
                      {formatNumber(event.from)} → {formatNumber(event.to)}
                    </p>
                    <p className="text-[11px] text-muted">{new Date(event.at).toLocaleString()}</p>
                    <p className="mt-1 text-sm">{event.note}</p>
                    <p className="mt-1 text-[10px] text-muted">{event.quality}</p>
                  </li>
                ))}
              </ol>
            )}
            {MARKET_MOVES.every((m) => m.heat !== "STEAM") ? (
              <p className="mt-4 text-xs text-muted">STEAM filter is empty on this seed — no captured steam print. Heat is WARM/QUIET only.</p>
            ) : null}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
