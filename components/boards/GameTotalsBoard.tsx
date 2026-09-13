"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import type { GameTotalRow } from "@/lib/game-total-view";
import { EmptyState } from "@/components/ds/EmptyState";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { MarketMovementBadge, StatusChip, ToneChip, WeatherBadge } from "@/components/ds/badges";
import { formatNumber, formatSigned } from "@/lib/format";
import type { StatusTone } from "@/lib/health";

const TONE: Record<string, StatusTone> = {
  SHOOTOUT: "green",
  NEUTRAL: "blue",
  CAPPED: "yellow",
  WEATHER_RISK: "orange",
  QB_DOWNGRADE: "red",
};

export function GameTotalsBoard({ rows }: { rows: GameTotalRow[] }) {
  const [window, setWindow] = useState<"ALL" | "EARLY" | "LATE" | "SNF">("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (window === "ALL" ? rows : rows.filter((r) => r.window === window)),
    [rows, window],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {(["ALL", "EARLY", "LATE", "SNF"] as const).map((w) => (
          <button key={w} type="button" onClick={() => setWindow(w)} className={`action-btn ${window === w ? "text-gold" : ""}`}>
            {w}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
              <tr className="border-b border-line">
                {["Game", "Window", "Open", "Current", "Move", "Env", "Wx", "Why"].map((h) => (
                  <th key={h} className="px-2 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <Fragment key={row.gameId}>
                  <tr className="border-b border-line/70 hover:bg-card-hover">
                    <td className="px-2 py-2">
                      <button type="button" onClick={() => setOpenId(openId === row.gameId ? null : row.gameId)} className="mr-1 text-muted">
                        {openId === row.gameId ? "▾" : "▸"}
                      </button>
                      <Link href={`/games/${row.gameId}`} className="font-semibold hover:text-gold">
                        {row.matchup}
                      </Link>
                      <div className="text-[10px] text-muted">{row.kickoff}</div>
                    </td>
                    <td className="px-2 py-2">{row.window}</td>
                    <td className="num px-2 py-2">{formatNumber(row.open)}</td>
                    <td className="num px-2 py-2 text-gold">{formatNumber(row.current)}</td>
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="num">{formatSigned(row.move)}</span>
                        {row.move && row.move !== 0 ? <StatusChip id="LINE_MOVE" /> : null}
                        <MarketMovementBadge direction={row.move && row.move > 0 ? "UP" : row.move && row.move < 0 ? "DOWN" : row.move === 0 ? "FLAT" : "UNKNOWN"} />
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <ToneChip tone={TONE[row.environment]}>{row.environment.replaceAll("_", " ")}</ToneChip>
                    </td>
                    <td className="px-2 py-2">
                      <WeatherBadge
                        impact={row.weatherImpact as "NONE" | "MINOR" | "MODERATE" | "SIGNIFICANT" | "UNKNOWN"}
                        indoor={row.indoor}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <WhyDrawer title={`${row.matchup} total`} lenses={row.lenses} sections={row.why} />
                    </td>
                  </tr>
                  {openId === row.gameId ? (
                    <tr className="border-b border-line bg-bg-elev/80">
                      <td colSpan={8} className="px-3 py-3 text-sm text-muted">
                        {row.why.modelCase.join(" ")} Game total is not an automatic over or under.
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
