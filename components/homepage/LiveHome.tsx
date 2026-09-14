"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StatusChip, ToneChip } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";
import { HomePickCard } from "@/components/homepage/HomePickCard";
import { TeamTotalPickCard } from "@/components/homepage/TeamTotalPickCard";
import { useShell } from "@/components/shell/ShellProvider";
import type { HomeChip, HomepageVM } from "@/lib/homepage";

const CHIPS: { id: HomeChip; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "OVERS", label: "Overs" },
  { id: "UNDERS", label: "Unders" },
  { id: "TDS", label: "TDs" },
  { id: "TEAM_TOTALS", label: "Team Totals" },
];

export function LiveHome({ vm }: { vm: HomepageVM }) {
  const [chip, setChip] = useState<HomeChip>("ALL");
  const { bets } = useShell();
  const watching = bets.filter((bet) => bet.status === "WATCHING").length;
  const ready = bets.filter((bet) => bet.status === "READY").length;

  const playerPicks = useMemo(() => (chip === "TEAM_TOTALS" ? [] : vm.picks[chip]), [chip, vm.picks]);

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-8">
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Sunday HQ · Live</p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Best picks this week</h1>
          </div>
          <Link href="/dashboard" className="shrink-0 pt-1 text-[11px] text-gold hover:underline">
            Full Command Center
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToneChip tone="blue">Week {vm.week}</ToneChip>
          <ToneChip tone="purple">Last {vm.lastRefreshLabel}</ToneChip>
          <ToneChip tone={vm.healthState === "DEGRADED" ? "orange" : "green"}>
            {vm.healthState === "DEGRADED" ? "Degraded" : "Healthy"}
          </ToneChip>
          {vm.tape === "LIVE" ? <ToneChip tone="green">LIVE</ToneChip> : null}
          {vm.tape === "STALE" ? <StatusChip id="STALE_DATA" /> : null}
          {vm.tape === "ESTIMATE" ? <ToneChip tone="yellow">ESTIMATE</ToneChip> : null}
        </div>
        <p className="text-[11px] text-muted">{vm.tape === "LIVE" ? vm.liveBanner : vm.staleWarning ?? vm.liveBanner}</p>
      </header>

      {vm.alerts.length > 0 ? (
        <section aria-label="Critical alerts" className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-card">
          {vm.alerts.map((alert) => (
            <Link key={alert.id} href={alert.href} className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-card-hover">
              <ToneChip tone={alert.severity === "CRITICAL" ? "red" : "orange"}>{alert.severity}</ToneChip>
              <span className="min-w-0 truncate text-[12px] font-medium">{alert.title}</span>
            </Link>
          ))}
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-card px-3 py-2">
        <p className="text-[12px]">
          <span className="text-[10px] tracking-wide text-muted uppercase">My Card</span>
          <span className="ml-2">
            <span className="num text-gold">{watching}</span> watching
            <span className="text-muted"> · </span>
            <span className="num text-gold">{ready}</span> ready
          </span>
        </p>
        <Link href="/my-card" className="action-btn">
          Open
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Pick filters">
          {CHIPS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={chip === item.id}
              onClick={() => setChip(item.id)}
              className={`action-btn shrink-0 ${chip === item.id ? "border-gold/60 text-gold" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {chip === "TEAM_TOTALS" ? (
          vm.teamTotals.length === 0 ? (
            <EmptyState message="NO PLAYS MEET FILTERS" />
          ) : (
            <div className="space-y-2">
              {vm.teamTotals.map((row, index) => (
                <TeamTotalPickCard key={row.id} row={row} rank={index + 1} />
              ))}
            </div>
          )
        ) : playerPicks.length === 0 ? (
          <EmptyState message="NO PLAYS MEET FILTERS" />
        ) : (
          <div className="space-y-2">
            {playerPicks.map((view, index) => (
              <HomePickCard key={view.id} view={view} rank={index + 1} tape={vm.tape} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
