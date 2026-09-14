"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { titleFromPath } from "@/lib/nav";
import { seedRefresh } from "@/lib/refresh";
import { StatusChip, ToneChip } from "@/components/ds/badges";
import { useShell } from "./ShellProvider";
import { useLiveOps } from "./LiveOpsProvider";

export function TopHeader() {
  const pathname = usePathname();
  const { setSearchOpen, setAlertsOpen, refreshView, viewRefreshedAt, finalCard, setFinalCard } = useShell();
  const meta = seedRefresh();
  const ops = useLiveOps();

  return (
    <header className="sticky top-0 z-30 hidden border-b border-line bg-bg-elev/95 backdrop-blur lg:block">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{titleFromPath(pathname)}</p>
          <p className="text-[11px] text-muted">
            Week {meta.week} · {meta.slateLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-muted">Last {viewRefreshedAt ? "view " : ""}refresh</span>
          <span className="num text-ink">{viewRefreshedAt ? new Date(viewRefreshedAt).toLocaleTimeString() : ops.lastRefreshLabel || meta.lastRefreshLabel}</span>
          <span className="text-muted">Next</span>
          <span className="text-ink">{ops.nextRefreshLabel || meta.nextRefreshLabel}</span>
          <button type="button" onClick={refreshView} className="action-btn">
            Refresh
          </button>
          <button type="button" onClick={() => setSearchOpen(true)} className="action-btn">
            Search
          </button>
          <button type="button" onClick={() => setAlertsOpen(true)} className="action-btn">
            Alerts {ops.alerts.length}
          </button>
          <Link href="/settings" className="action-btn">
            Settings
          </Link>
          <button type="button" onClick={() => setFinalCard(!finalCard)} className="action-btn">
            {finalCard ? "Final Card ON" : "Final Card"}
          </button>
          {ops.liveGate.actionable ? (
            <StatusChip id="HEALTHY" />
          ) : (
            <StatusChip id="STALE_DATA" />
          )}
          <ToneChip tone={ops.liveGate.actionable ? "green" : "red"}>
            {ops.liveGate.actionable ? "Live tape" : "Not live"}
          </ToneChip>
        </div>
      </div>
    </header>
  );
}
