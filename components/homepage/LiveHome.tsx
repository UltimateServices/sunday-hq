"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LiveRequiredBanner } from "@/components/ds/LiveRequiredBanner";
import { EmptyState } from "@/components/ds/EmptyState";
import { HomePickCard } from "@/components/homepage/HomePickCard";
import { TeamTotalPickCard } from "@/components/homepage/TeamTotalPickCard";
import { useShell } from "@/components/shell/ShellProvider";
import type { HomeChip, HomepageVM } from "@/lib/homepage";

const CHIPS: { id: HomeChip; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "OVERS", label: "Overs" },
  { id: "UNDERS", label: "Unders" },
  { id: "TDS", label: "Touchdowns" },
  { id: "TEAM_TOTALS", label: "Team totals" },
];

export function LiveHome({ vm }: { vm: HomepageVM }) {
  const [chip, setChip] = useState<HomeChip>("ALL");
  const { bets } = useShell();
  const watching = bets.filter((bet) => bet.status === "WATCHING").length;
  const ready = bets.filter((bet) => bet.status === "READY").length;
  const live = vm.liveGate.actionable;

  const playerPicks = useMemo(() => (chip === "TEAM_TOTALS" ? [] : vm.picks[chip]), [chip, vm.picks]);

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-8">
      <LiveRequiredBanner gate={vm.liveGate} />

      <header className="space-y-2">
        <div>
          <p className="text-[13px] text-muted">
            Week {vm.week} · {vm.slateLabel}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight sm:text-[32px]">
            {live ? "Best picks this week" : "Picks are off until tape is live"}
          </h1>
        </div>
      </header>

      {!live ? (
        <EmptyState
          message="No live picks."
          hint="This page will not show seed parlays or seed props as bets. When a fresh DraftKings snapshot lands, ranked singles appear here."
        />
      ) : null}

      {live && vm.alerts.length > 0 ? (
        <section aria-label="Need to know" className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
          {vm.alerts.map((alert) => (
            <Link key={alert.id} href={alert.href} className="block px-4 py-3 hover:bg-card-hover">
              <p className="text-[15px] font-medium">{alert.title}</p>
            </Link>
          ))}
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-card px-4 py-3">
        <p className="text-[14px]">
          <span className="text-muted">Your card</span>
          <span className="ml-2">
            <span className="num font-semibold">{watching}</span> watching
            <span className="text-muted"> · </span>
            <span className="num font-semibold">{ready}</span> ready
          </span>
        </p>
        <div className="flex gap-2">
          <Link href="/my-card" className="action-btn">
            Open card
          </Link>
          <Link href="/dashboard" className="action-btn">
            Research desk
          </Link>
        </div>
      </div>

      {live ? (
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
              <EmptyState />
            ) : (
              <div className="space-y-2">
                {vm.teamTotals.map((row, index) => (
                  <TeamTotalPickCard key={row.id} row={row} rank={index + 1} />
                ))}
              </div>
            )
          ) : playerPicks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {playerPicks.map((view, index) => (
                <HomePickCard key={view.id} view={view} rank={index + 1} tape={vm.tape} />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
