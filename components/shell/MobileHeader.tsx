"use client";

import { seedRefresh } from "@/lib/refresh";
import { useShell } from "./ShellProvider";
import { useLiveOps } from "./LiveOpsProvider";
import { ToneChip } from "@/components/ds/badges";

export function MobileHeader() {
  const { setSearchOpen, setAlertsOpen, refreshView } = useShell();
  const meta = seedRefresh();
  const ops = useLiveOps();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div>
          <p className="text-[17px] font-semibold tracking-tight">Sunday HQ</p>
          <p className="text-[12px] text-muted">Week {meta.week} · {ops.lastRefreshLabel || meta.lastRefreshLabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <ToneChip tone={ops.health.state === "DEGRADED" ? "orange" : "green"}>
            {ops.health.state === "DEGRADED" ? "Estimates" : "Current"}
          </ToneChip>
          <button type="button" onClick={refreshView} className="action-btn px-2.5 py-1">
            Refresh
          </button>
          <button type="button" onClick={() => setAlertsOpen(true)} className="action-btn px-2.5 py-1">
            Alerts
          </button>
          <button type="button" onClick={() => setSearchOpen(true)} className="action-btn px-2.5 py-1">
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
