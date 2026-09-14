"use client";

import { useMemo, useState } from "react";
import type { PropView } from "@/lib/prop-view";
import { PropRow } from "./PropRow";
import { PropCard } from "./PropCard";
import { EmptyState } from "./EmptyState";

const COLS = [
  { key: "player", label: "Player" },
  { key: "market", label: "Market" },
  { key: "book", label: "Book" },
  { key: "line", label: "Line" },
  { key: "odds", label: "Odds" },
  { key: "model", label: "Model" },
  { key: "edge", label: "Edge" },
  { key: "prob", label: "Prob" },
  { key: "ev", label: "EV" },
  { key: "conf", label: "Conf" },
  { key: "matchup", label: "Matchup" },
  { key: "health", label: "Health" },
  { key: "wx", label: "Wx" },
  { key: "move", label: "Move" },
  { key: "why", label: "Why" },
] as const;

type SortKey = (typeof COLS)[number]["key"];

function valueFor(view: PropView, key: SortKey): string | number {
  switch (key) {
    case "player":
      return view.playerName;
    case "market":
      return view.market;
    case "book":
      return view.bookLabel;
    case "line":
      return view.line.value ?? Number.NEGATIVE_INFINITY;
    case "odds":
      return view.oddsAmerican.value ?? Number.NEGATIVE_INFINITY;
    case "model":
      return view.model.value ?? Number.NEGATIVE_INFINITY;
    case "edge":
      return view.pricing.edge.value ?? Number.NEGATIVE_INFINITY;
    case "prob":
      return view.pricing.modelProb.value ?? Number.NEGATIVE_INFINITY;
    case "ev":
      return view.pricing.ev.value ?? Number.NEGATIVE_INFINITY;
    case "conf":
      return view.confidenceGrade;
    case "matchup":
      return view.matchup;
    case "health":
      return view.health;
    case "wx":
      return view.weatherNote;
    case "move":
      return view.movement.direction;
    default:
      return 0;
  }
}

export function RankingTable({ views }: { views: PropView[] }) {
  const [sort, setSort] = useState<SortKey>("edge");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const copy = [...views];
    copy.sort((a, b) => {
      const av = valueFor(a, sort);
      const bv = valueFor(b, sort);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [views, sort, dir]);

  if (views.length === 0) return <EmptyState />;

  function toggle(key: SortKey) {
    if (key === "why") return;
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "player" || key === "market" || key === "matchup" ? "asc" : "desc");
    }
  }

  return (
    <>
      <div className="space-y-2 md:hidden">
        {rows.map((view) => (
          <PropCard key={view.id} view={view} compact />
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1200px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              {COLS.map((col) => (
                <th key={col.key} className="px-2 py-2 font-medium">
                  {col.key === "why" ? (
                    col.label
                  ) : (
                    <button type="button" className="uppercase tracking-wide" onClick={() => toggle(col.key)}>
                      {col.label}
                      {sort === col.key ? (dir === "asc" ? " ↑" : " ↓") : ""}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((view) => (
              <PropRow key={view.id} view={view} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
