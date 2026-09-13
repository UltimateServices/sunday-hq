"use client";

import { seedRefresh } from "@/lib/refresh";
import { useShell } from "./ShellProvider";
import { ALERTS } from "@/data/week1/alerts";
import { ToneChip } from "@/components/ds/badges";

export function MobileHeader() {
  const { setSearchOpen, setAlertsOpen, refreshView } = useShell();
  const meta = seedRefresh();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg-elev/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div>
          <p className="text-sm font-semibold">Sunday HQ</p>
          <p className="text-[10px] text-muted">Week {meta.week} · {meta.lastRefreshLabel}</p>
        </div>
        <div className="flex items-center gap-1">
          <ToneChip tone="orange">Degraded</ToneChip>
          <button type="button" onClick={refreshView} className="action-btn">
            Ref
          </button>
          <button type="button" onClick={() => setAlertsOpen(true)} className="action-btn">
            Alerts {ALERTS.length}
          </button>
          <button type="button" onClick={() => setSearchOpen(true)} className="action-btn">
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
