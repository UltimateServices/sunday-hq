"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FantasyProjection, Position } from "@/lib/types/domain";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { EmptyState } from "@/components/ds/EmptyState";
import { StatusChip, ToneChip } from "@/components/ds/badges";
import { DataStatus } from "@/components/shared/DataStatus";
import { formatMeasured } from "@/lib/format";

const TABS = ["OVERALL", "QB", "RB", "WR", "TE", "FLEX"] as const;

export function FantasyBoard({ rows }: { rows: FantasyProjection[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("OVERALL");
  const [onlyDisagreement, setOnlyDisagreement] = useState(false);

  const filtered = useMemo(() => {
    let list = [...rows];
    if (tab === "FLEX") list = list.filter((r) => r.flexEligible);
    else if (tab !== "OVERALL") {
      list = list.filter((r) => PLAYER_BY_ID[r.playerId]?.position === (tab as Position));
    }
    if (onlyDisagreement) list = list.filter((r) => r.disagreement);
    return list.sort((a, b) => (b.ppr.value ?? -1) - (a.ppr.value ?? -1));
  }, [rows, tab, onlyDisagreement]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`action-btn ${tab === t ? "text-gold" : ""}`}>
            {t}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOnlyDisagreement((v) => !v)}
          className={`action-btn ${onlyDisagreement ? "text-gold" : ""}`}
        >
          High disagreement
        </button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map((row) => {
            const player = PLAYER_BY_ID[row.playerId];
            return (
              <Link key={row.playerId} href={`/players/${row.playerId}`} className="rounded-lg border border-line bg-card p-3 hover:border-gold/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{player?.name}</p>
                    <p className="text-[11px] text-muted">
                      {player ? TEAM_BY_ID[player.teamId].abbr : ""} · {player?.position}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    {row.disagreement ? <ToneChip tone="orange">HIGH DISAGREEMENT</ToneChip> : null}
                    <DataStatus quality={row.ppr.quality} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted">{row.note}</p>
                <dl className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <dt className="text-muted">PPR</dt>
                    <dd className="num text-lg text-gold">{formatMeasured(row.ppr)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Half</dt>
                    <dd className="num text-lg">{formatMeasured(row.halfPpr)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Std</dt>
                    <dd className="num text-lg">{formatMeasured(row.standard)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Desk</dt>
                    <dd className="num text-lg">{row.deskPpr ? formatMeasured(row.deskPpr) : "—"}</dd>
                  </div>
                </dl>
                {row.ppr.quality === "UNAVAILABLE" ? <div className="mt-2"><StatusChip id="LOW_SAMPLE" /></div> : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
