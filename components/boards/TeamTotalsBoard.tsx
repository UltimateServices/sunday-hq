"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import type { TeamTotalRow } from "@/lib/team-total-view";
import { EmptyState } from "@/components/ds/EmptyState";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { EdgeBadge, StatusChip, ToneChip } from "@/components/ds/badges";
import { DataStatus } from "@/components/shared/DataStatus";
import { formatNumber } from "@/lib/format";
import type { StatusTone } from "@/lib/health";

const TONE: Record<string, StatusTone> = {
  SHOOTOUT: "green",
  NEUTRAL: "blue",
  CAPPED: "yellow",
  WEATHER_RISK: "orange",
  QB_DOWNGRADE: "red",
};

export function TeamTotalsBoard({ rows }: { rows: TeamTotalRow[] }) {
  const [side, setSide] = useState<"ALL" | "OVER" | "UNDER">("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (side === "ALL" ? rows : rows.filter((r) => r.side === side)).sort((a, b) => Math.abs(b.edge ?? 0) - Math.abs(a.edge ?? 0)),
    [rows, side],
  );
  const bestOver = [...rows].filter((r) => r.side === "OVER").sort((a, b) => (b.edge ?? 0) - (a.edge ?? 0))[0];
  const bestUnder = [...rows].filter((r) => r.side === "UNDER").sort((a, b) => (a.edge ?? 0) - (b.edge ?? 0))[0];

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-2">
        <Summary label="Best Over" row={bestOver} />
        <Summary label="Best Under" row={bestUnder} />
      </div>
      <div className="flex flex-wrap gap-1">
        {(["ALL", "OVER", "UNDER"] as const).map((s) => (
          <button key={s} type="button" onClick={() => setSide(s)} className={`action-btn ${side === s ? "text-gold" : ""}`}>
            {s}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
              <tr className="border-b border-line">
                {["Team", "Game", "Implied", "Model", "Side", "Edge", "Env", "Quality", "Why"].map((h) => (
                  <th key={h} className="px-2 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-line/70 hover:bg-card-hover">
                    <td className="px-2 py-2">
                      <button type="button" onClick={() => setOpenId(openId === row.id ? null : row.id)} className="mr-1 text-muted">
                        {openId === row.id ? "▾" : "▸"}
                      </button>
                      <span className="font-semibold">{row.teamAbbr}</span>
                    </td>
                    <td className="px-2 py-2">
                      <Link href={`/games/${row.gameId}`} className="hover:text-gold">
                        {row.matchup}
                      </Link>
                    </td>
                    <td className="num px-2 py-2 text-gold">{formatNumber(row.line.value)}</td>
                    <td className="num px-2 py-2">{formatNumber(row.model)}</td>
                    <td className="px-2 py-2">
                      <ToneChip tone={row.side === "OVER" ? "green" : "blue"}>{row.side}</ToneChip>
                    </td>
                    <td className="px-2 py-2">
                      <EdgeBadge value={row.edge} unit="yards" />
                    </td>
                    <td className="px-2 py-2">
                      <ToneChip tone={TONE[row.environment]}>{row.environment.replaceAll("_", " ")}</ToneChip>
                    </td>
                    <td className="px-2 py-2">
                      <DataStatus quality={row.line.quality} />
                    </td>
                    <td className="px-2 py-2">
                      <WhyDrawer title={`${row.teamAbbr} team total`} lenses={row.lenses} sections={row.why} />
                    </td>
                  </tr>
                  {openId === row.id ? (
                    <tr key={`${row.id}-exp`} className="border-b border-line bg-bg-elev/80">
                      <td colSpan={9} className="px-3 py-3 text-sm text-muted">
                        {row.line.note} Derived home {formatNumber(row.impliedHome)} / away {formatNumber(row.impliedAway)}. Not a listed DK team-total ticket.
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Summary({ label, row }: { label: string; row?: TeamTotalRow }) {
  if (!row) return <EmptyState message="NO PLAYS MEET FILTERS" />;
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <p className="text-[10px] tracking-wide text-muted uppercase">{label}</p>
      <p className="text-lg font-semibold">
        {row.teamAbbr} {row.side} {formatNumber(row.line.value)}
      </p>
      <p className="text-xs text-muted">{row.matchup}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <StatusChip id="LOW_SAMPLE" />
        <ToneChip tone={TONE[row.environment]}>{row.environment.replaceAll("_", " ")}</ToneChip>
      </div>
    </article>
  );
}
