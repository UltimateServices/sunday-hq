"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertRow } from "@/components/ds/AlertRow";
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
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="space-y-2">
        <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Sunday HQ · Live</p>
        <h1 className="text-2xl font-semibold tracking-tight">Best picks this week</h1>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToneChip tone="blue">Week {vm.week}</ToneChip>
          <ToneChip tone="blue">{vm.slateLabel}</ToneChip>
          <ToneChip tone="purple">Last {vm.lastRefreshLabel}</ToneChip>
          <ToneChip tone={vm.healthState === "DEGRADED" ? "orange" : "green"}>
            {vm.healthState === "DEGRADED" ? "Degraded" : "Healthy"}
          </ToneChip>
          {vm.tape === "LIVE" ? <ToneChip tone="green">LIVE</ToneChip> : null}
          {vm.tape === "STALE" ? <StatusChip id="STALE_DATA" /> : null}
          {vm.tape === "ESTIMATE" ? <ToneChip tone="yellow">ESTIMATE</ToneChip> : null}
        </div>
        <p className="text-[12px] text-muted">{vm.tape === "LIVE" ? vm.liveBanner : vm.staleWarning ?? vm.liveBanner}</p>
        {vm.healthIssues.length > 0 ? (
          <p className="text-[11px] text-muted">{vm.healthIssues.join(" · ")}</p>
        ) : null}
      </header>

      {vm.alerts.length > 0 ? (
        <section aria-label="Critical alerts" className="space-y-2">
          {vm.alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">Best picks this week</h2>
            <p className="text-[11px] text-muted">
              Overs, unders, and TDs mixed by edge + confidence. One list — not three copies of the same board.
            </p>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {CHIPS.map((item) => (
            <button
              key={item.id}
              type="button"
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

      <section className="rounded-lg border border-line bg-card p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-wide text-muted uppercase">My Card</p>
            <p className="text-sm">
              <span className="num text-gold">{watching}</span> watching
              <span className="text-muted"> · </span>
              <span className="num text-gold">{ready}</span> ready
            </p>
          </div>
          <Link href="/my-card" className="action-btn">
            Open card
          </Link>
        </div>
      </section>

      <p className="pb-2 text-center">
        <Link href="/dashboard" className="text-sm text-gold hover:underline">
          Full Command Center
        </Link>
      </p>
    </div>
  );
}
