"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { EmptyState } from "@/components/ds/EmptyState";
import { FilterDrawer } from "@/components/ds/FilterDrawer";
import { TDCard } from "@/components/ds/TDCard";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { ConfidenceBadge, HealthBadge, WeatherBadge } from "@/components/ds/badges";
import { formatMeasured } from "@/lib/format";
import { WEATHER_BY_GAME } from "@/data/week1/weather";

const TABS = [
  { id: "ANYTIME_TD", label: "Anytime" },
  { id: "FIRST_TD", label: "First TD" },
  { id: "TWO_PLUS_TD", label: "2+ TD" },
  { id: "RUSH_TD", label: "QB Rush TD" },
] as const;

export function TouchdownsBoard({ views }: { views: PropView[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("ANYTIME_TD");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    let list = views.filter((v) => v.market === tab);
    if (tab === "RUSH_TD") list = list.filter((v) => v.position === "QB");
    if (q) {
      const n = q.toLowerCase();
      list = list.filter((v) => `${v.playerName} ${v.matchup}`.toLowerCase().includes(n));
    }
    return list.sort((a, b) => (b.model.value ?? 0) - (a.model.value ?? 0));
  }, [views, tab, q]);

  const filters = (
    <label className="text-[11px]">
      <span className="mb-1 block text-muted">Search</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
        placeholder="Player or game"
      />
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`action-btn ${tab === t.id ? "text-gold" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="hidden md:block">{filters}</div>
      <FilterDrawer title="TD filters">{filters}</FilterDrawer>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {rows.map((view) => (
              <TDCard key={view.id} view={view} />
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
              <thead className="sticky top-0 z-10 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
                <tr className="border-b border-line">
                  {["Player", "Market", "Role", "Game", "Model P", "Book", "Imp P", "EV", "Conf", "Health", "Wx", "Why"].map((h) => (
                    <th key={h} className="px-2 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((view) => {
                  const wx = WEATHER_BY_GAME[view.gameId];
                  return (
                    <tr key={view.id} className="border-b border-line/70 hover:bg-card-hover">
                      <td className="px-2 py-2">
                        <Link href={`/players/${view.playerId}`} className="font-semibold hover:text-gold">
                          {view.playerName}
                        </Link>
                        <div className="text-[10px] text-muted">{view.teamAbbr}</div>
                      </td>
                      <td className="px-2 py-2">{MARKET_LABEL[view.market]}</td>
                      <td className="px-2 py-2">{view.tdRole ?? "UNKNOWN"}</td>
                      <td className="px-2 py-2">
                        <Link href={`/games/${view.gameId}`} className="hover:text-gold">
                          {view.matchup}
                        </Link>
                      </td>
                      <td className="num px-2 py-2 text-gold">{formatMeasured(view.pricing.modelProb, 1, "pct")}</td>
                      <td className="num px-2 py-2">{formatMeasured(view.oddsAmerican, 0, "american")}</td>
                      <td className="num px-2 py-2">{formatMeasured(view.pricing.impliedProb, 1, "pct")}</td>
                      <td className="num px-2 py-2">{formatMeasured(view.pricing.ev, 1, "pct")}</td>
                      <td className="px-2 py-2">
                        <ConfidenceBadge grade={view.confidenceGrade} />
                      </td>
                      <td className="px-2 py-2">
                        <HealthBadge state={view.health} />
                      </td>
                      <td className="px-2 py-2">{wx ? <WeatherBadge impact={wx.impact} indoor={wx.indoor} /> : "—"}</td>
                      <td className="px-2 py-2">
                        <WhyDrawer title={`${view.playerName} ${MARKET_LABEL[view.market]}`} lenses={view.lenses} sections={view.whySections} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
