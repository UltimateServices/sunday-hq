"use client";

import { useMemo, useState } from "react";
import type { ChangeCategory, ChangeItem } from "@/lib/types/domain";
import { ChangeRow } from "@/components/ds/ChangeRow";
import { EmptyState } from "@/components/ds/EmptyState";

const FILTERS: Array<"ALL" | ChangeCategory> = ["ALL", "INJURY", "PROJECTION", "MARKET", "WEATHER", "LINEUP"];

export function WhatChanged({ items }: { items: ChangeItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const rows = useMemo(
    () => (filter === "ALL" ? items : items.filter((i) => i.category === filter)),
    [filter, items],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`action-btn ${filter === f ? "text-gold" : ""}`}>
            {f}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {rows.map((item) => (
            <ChangeRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
