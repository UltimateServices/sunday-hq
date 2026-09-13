"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MatchupGrade, Position } from "@/lib/types/domain";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { GAME_BY_ID } from "@/data/week1/games";
import { EmptyState } from "@/components/ds/EmptyState";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { DataStatus } from "@/components/shared/DataStatus";
import { ToneChip } from "@/components/ds/badges";
import { formatNumber } from "@/lib/format";

const POS: Position[] = ["QB", "RB", "WR", "TE"];

export function MatchupsBoard({ grades }: { grades: MatchupGrade[] }) {
  const [pos, setPos] = useState<Position>("QB");
  const rows = useMemo(() => grades.filter((g) => g.position === pos), [grades, pos]);
  const best = rows.filter((r) => r.panel === "BEST");
  const worst = rows.filter((r) => r.panel === "WORST");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1">
        {POS.map((p) => (
          <button key={p} type="button" onClick={() => setPos(p)} className={`action-btn ${pos === p ? "text-gold" : ""}`}>
            {p}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title={`Best ${pos}`} rows={best} />
          <Panel title={`Worst ${pos}`} rows={worst} />
        </div>
      )}
    </div>
  );
}

function Panel({ title, rows }: { title: string; rows: MatchupGrade[] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <section className="space-y-2">
      <h2 className="text-xs tracking-wide text-muted uppercase">{title}</h2>
      {rows.map((row) => {
        const player = PLAYER_BY_ID[row.playerId];
        const game = GAME_BY_ID[row.gameId];
        const matchup = `${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}`;
        return (
          <article key={row.id} className="rounded-lg border border-line bg-card p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <Link href={`/players/${row.playerId}`} className="font-semibold hover:text-gold">
                  {player.name}
                </Link>
                <p className="text-[11px] text-muted">
                  <Link href={`/games/${row.gameId}`} className="hover:text-gold">
                    {matchup}
                  </Link>
                </p>
              </div>
              <div className="text-right">
                <p className="num text-xl text-gold">{formatNumber(row.overall.value)}</p>
                <DataStatus quality={row.overall.quality} />
              </div>
            </div>
            <p className="mb-3 text-sm text-muted">{row.note}</p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {row.factors.map((f) => (
                <div key={f.id} className="rounded-md border border-line bg-bg-elev p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[10px] text-muted uppercase">{f.label}</p>
                    <ToneChip tone={f.score === null ? "purple" : f.score >= 7 ? "green" : f.score <= 3 ? "red" : "yellow"}>
                      {f.score === null ? "UNAVAILABLE" : f.score.toFixed(0)}
                    </ToneChip>
                  </div>
                  <p className="text-[11px] text-ink/90">{f.note}</p>
                </div>
              ))}
            </div>
            <WhyDrawer title={`${player.name} matchup`} lenses={row.lenses} sections={row.why} />
          </article>
        );
      })}
    </section>
  );
}
