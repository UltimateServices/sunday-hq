"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DataHealthBanner } from "@/components/ds/DataHealthBanner";
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

  const playerPicks = useMemo(() => (chip === "TEAM_TOTALS" ? [] : vm.picks[chip]), [chip, vm.picks]);

  return (
    <div className="mx-auto max-w-[640px] space-y-8 pb-10">
      <header className="space-y-4">
        <div>
          <p className="text-[13px] text-muted">Week {vm.week} · {vm.slateLabel}</p>
          <h1 className="mt-1 text-[34px] font-semibold tracking-tight">Best picks this week</h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
            One ranked list. Who, what, the line, the edge, and why — then the risk.
          </p>
        </div>
        <DataHealthBanner
          state={vm.healthState}
          tape={vm.tape}
          issues={vm.healthIssues}
          liveBanner={vm.liveBanner}
          staleWarning={vm.staleWarning}
        />
      </header>

      {vm.alerts.length > 0 ? (
        <section aria-label="Need to know" className="space-y-2">
          <h2 className="text-[13px] font-medium text-muted">Need to know</h2>
          <div className="surface divide-y divide-line overflow-hidden">
            {vm.alerts.map((alert) => (
              <Link key={alert.id} href={alert.href} className="block px-4 py-3 hover:bg-card-hover">
                <p className="text-[15px] font-medium">{alert.title}</p>
                <p className="mt-0.5 text-[13px] text-muted">{alert.severity === "CRITICAL" ? "Act on this" : "Worth a look"}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="surface flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-[14px]">
          <span className="text-muted">Your card</span>
          <span className="ml-2">
            <span className="num font-semibold">{watching}</span> watching
            <span className="text-muted"> · </span>
            <span className="num font-semibold">{ready}</span> ready
          </span>
        </p>
        <div className="flex gap-2">
          <Link href="/my-card" className="action-btn text-ink">
            Open card
          </Link>
          <Link href="/dashboard" className="action-btn">
            Full research
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Pick filters">
          {CHIPS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={chip === item.id}
              onClick={() => setChip(item.id)}
              className={`action-btn shrink-0 ${chip === item.id ? "bg-card text-ink" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {chip === "TEAM_TOTALS" ? (
          vm.teamTotals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {vm.teamTotals.map((row, index) => (
                <TeamTotalPickCard key={row.id} row={row} rank={index + 1} />
              ))}
            </div>
          )
        ) : playerPicks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {playerPicks.map((view, index) => (
              <HomePickCard key={view.id} view={view} rank={index + 1} tape={vm.tape} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
