"use client";

import { useState } from "react";

const TABS = [
  "OVERVIEW",
  "PROPS",
  "USAGE",
  "MATCHUPS",
  "GAME LOG",
  "MARKET HISTORY",
  "MODEL HISTORY",
] as const;

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
      {tab === "USAGE" || tab === "GAME LOG" || tab === "MARKET HISTORY" || tab === "MODEL HISTORY" ? (
        <div className="surface px-4 py-8">
          <p className="text-[15px] font-medium">PENDING</p>
          <p className="mt-1 text-[13px] text-muted">
            {tab} is in the bible. Week 1 seed has no trained history here. Route stays. Numbers are not invented.
          </p>
        </div>
      ) : null}
    </div>
  );
}
