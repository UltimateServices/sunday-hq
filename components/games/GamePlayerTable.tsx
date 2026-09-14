"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { RoleBadge } from "@/components/ds/badges";
import { rbRoleFor } from "@/lib/rb-roles";
import { MARKET_LABEL, type PropView } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import type { Player, Position } from "@/lib/types/domain";

const TABS: Array<"ALL" | Position> = ["ALL", "QB", "RB", "WR", "TE"];

export function GamePlayerTable({ players, views }: { players: Player[]; views: PropView[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const rows = useMemo(
    () => players.filter((player) => tab === "ALL" || player.position === tab),
    [players, tab],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`action-btn ${tab === item ? "text-gold" : ""}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="sticky top-0 bg-bg-elev text-[11px] text-muted uppercase">
            <tr className="border-b border-line">
              <th className="px-2 py-2 font-medium">Player</th>
              <th className="px-2 py-2 font-medium">Usage</th>
              <th className="px-2 py-2 font-medium">Top prop</th>
              <th className="px-2 py-2 font-medium">Fantasy</th>
              <th className="px-2 py-2 font-medium">TD model</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((player) => {
              const playerViews = views.filter((view) => view.playerId === player.id);
              const top = [...playerViews].sort((a, b) => (b.model.value ?? 0) - (a.model.value ?? 0))[0];
              const td = playerViews.find((view) => view.market === "ANYTIME_TD");
              const fan = FANTASY_BY_PLAYER[player.id];
              const role = player.position === "RB" ? rbRoleFor(player) : null;
              return (
                <tr key={player.id} className="border-b border-line/70">
                  <td className="px-2 py-2">
                    <Link href={`/players/${player.id}`} className="font-semibold hover:text-gold">
                      {player.name}
                    </Link>
                    <div className="text-[11px] text-muted">
                      {TEAM_BY_ID[player.teamId]?.abbr} {player.position}
                    </div>
                    {role ? <RoleBadge role={role} /> : null}
                  </td>
                  <td className="px-2 py-2 text-muted">
                    {top ? `${MARKET_LABEL[top.market]} ${formatMeasured(top.model)}` : "DATA UNAVAILABLE"}
                  </td>
                  <td className="px-2 py-2">
                    {top ? (
                      <Link href={`/props?focus=${top.id}`} className="hover:text-gold">
                        {MARKET_LABEL[top.market]} {top.line.value !== null ? `${top.side === "OVER" ? "O" : "U"} ${top.line.value}` : ""}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="num px-2 py-2">{fan ? formatMeasured(fan.ppr) : "—"}</td>
                  <td className="num px-2 py-2">{td ? formatMeasured(td.model, 1, "pct") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
