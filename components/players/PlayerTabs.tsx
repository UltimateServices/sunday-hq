"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ds/EmptyState";

const TABS = [
  "OVERVIEW",
  "PROPS",
  "USAGE",
  "MATCHUPS",
  "GAME LOG",
  "MARKET HISTORY",
  "MODEL HISTORY",
] as const;

const UNAVAILABLE: Record<(typeof TABS)[number], { lede: string; rows: Array<[string, string]> }> = {
  OVERVIEW: { lede: "", rows: [] },
  PROPS: { lede: "", rows: [] },
  MATCHUPS: { lede: "", rows: [] },
  USAGE: {
    lede: "Week 1 seed has no snap / route / target series. Fields stay so the tab is not a missing product.",
    rows: [
      ["Snap %", "DATA UNAVAILABLE"],
      ["Route %", "DATA UNAVAILABLE"],
      ["Targets", "DATA UNAVAILABLE"],
      ["Carries", "DATA UNAVAILABLE"],
      ["Target share", "DATA UNAVAILABLE"],
      ["Air yards", "DATA UNAVAILABLE"],
      ["First-read %", "DATA UNAVAILABLE"],
      ["Red-zone share", "DATA UNAVAILABLE"],
      ["Inside-5 share", "DATA UNAVAILABLE"],
      ["Goal-line share", "DATA UNAVAILABLE"],
    ],
  },
  "GAME LOG": {
    lede: "No 2026 in-season games are settled in this desk. Last-five is not backfilled from 2025.",
    rows: [
      ["Last 5 games", "DATA UNAVAILABLE"],
      ["Last 5 snap %", "DATA UNAVAILABLE"],
      ["Last 5 targets / carries", "DATA UNAVAILABLE"],
      ["Last 5 red-zone looks", "DATA UNAVAILABLE"],
    ],
  },
  "MARKET HISTORY": {
    lede: "DraftKings player-prop tape is not ingested. Open / close / CLV are not invented.",
    rows: [
      ["Opening line", "DATA UNAVAILABLE"],
      ["Current DK line", "DATA UNAVAILABLE"],
      ["Closing line", "DATA UNAVAILABLE"],
      ["CLV", "DATA UNAVAILABLE"],
      ["Juice history", "DATA UNAVAILABLE"],
    ],
  },
  "MODEL HISTORY": {
    lede: "Placeholder CDF has no week-over-week error log. REAL grades stay empty until settle.",
    rows: [
      ["Week-over-week error", "DATA UNAVAILABLE"],
      ["Hit rate", "DATA UNAVAILABLE"],
      ["Calibration residual", "DATA UNAVAILABLE"],
    ],
  },
};

export function PlayerTabs({
  overview,
  props,
  matchups,
}: {
  overview: React.ReactNode;
  props: React.ReactNode;
  matchups: React.ReactNode;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("OVERVIEW");
  const pending = UNAVAILABLE[tab];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Player sections">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`action-btn shrink-0 ${tab === item ? "bg-card text-ink" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "OVERVIEW" ? overview : null}
      {tab === "PROPS" ? props : null}
      {tab === "MATCHUPS" ? matchups : null}
      {pending.rows.length > 0 ? (
        <div className="surface px-4 py-5">
          <p className="text-[15px] font-medium">PENDING · {tab}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{pending.lede}</p>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            {pending.rows.map(([label, value]) => (
              <div key={label} className="rounded-md border border-line bg-bg-elev px-3 py-2">
                <dt className="text-[11px] text-muted uppercase">{label}</dt>
                <dd className="mt-1 text-[13px]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <EmptyState message="No invented series." hint="Live usage and DK history stay off until those stores exist." />
          </div>
        </div>
      ) : null}
    </div>
  );
}
