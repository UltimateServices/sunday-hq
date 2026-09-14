"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ds/EmptyState";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "props", label: "Props" },
  { id: "usage", label: "Usage" },
  { id: "matchups", label: "Matchups" },
  { id: "log", label: "Game log" },
  { id: "market", label: "Market history" },
  { id: "model", label: "Model history" },
] as const;

export function PlayerDesk({
  overview,
  props,
  matchups,
}: {
  overview: React.ReactNode;
  props: React.ReactNode;
  matchups: React.ReactNode;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`action-btn ${tab === item.id ? "text-gold" : ""}`}>
            {item.label}
          </button>
        ))}
      </div>
      {tab === "overview" ? overview : null}
      {tab === "props" ? props : null}
      {tab === "matchups" ? matchups : null}
      {tab === "usage" || tab === "log" || tab === "market" || tab === "model" ? (
        <EmptyState
          message="DATA UNAVAILABLE"
          hint="Week 1 seed has no multi-week usage, game log, or CLV history. Tab kept so the desk is not redesigned around the hole."
        />
      ) : null}
    </div>
  );
}
