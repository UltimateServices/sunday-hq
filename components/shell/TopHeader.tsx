"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { titleFromPath } from "@/lib/nav";
import { seedRefresh } from "@/lib/refresh";
import { ToneChip } from "@/components/ds/badges";
import { InfoTip } from "@/components/ds/InfoTip";
import { WindowSwitcher } from "@/components/ds/WindowSwitcher";
import { useShell } from "./ShellProvider";
import { useLiveOps } from "./LiveOpsProvider";

export function TopHeader() {
  const pathname = usePathname();
  const { setSearchOpen, setAlertsOpen, refreshView, viewRefreshedAt, finalCard, setFinalCard, gameWindow, setGameWindow } =
    useShell();
  const meta = seedRefresh();
  const ops = useLiveOps();
  const healthTone = ops.health.state === "HEALTHY" ? "green" : "orange";

  return (
    <header className="sticky top-0 z-30 hidden border-b border-line bg-bg/80 backdrop-blur-xl lg:block">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold tracking-tight">{titleFromPath(pathname)}</p>
          <p className="text-[13px] text-muted">
            Week {meta.week} · {meta.slateLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="text-muted">
            Updated {viewRefreshedAt ? new Date(viewRefreshedAt).toLocaleTimeString() : ops.lastRefreshLabel || meta.lastRefreshLabel}
          </span>
          <span className="text-muted">Next {ops.nextRefreshLabel || meta.nextRefreshLabel}</span>
          <InfoTip term="Data Health">
            <ToneChip tone={healthTone}>{ops.health.state === "HEALTHY" ? "Healthy" : "Degraded"}</ToneChip>
          </InfoTip>
          <button
            type="button"
            onClick={() => {
              refreshView();
              void ops.reload();
            }}
            className="action-btn"
          >
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
            {finalCard ? "Final card on" : "Final card"}
          </button>
          <ToneChip tone={ops.liveGate.actionable ? "green" : "red"}>
            {ops.liveGate.actionable ? "Live tape" : "Not live"}
          </ToneChip>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 px-6 py-2">
        <WindowSwitcher value={gameWindow} onChange={setGameWindow} />
        {ops.health.issues[0] ? <p className="text-[12px] text-muted">{ops.health.issues[0]}</p> : null}
      </div>
    </header>
  );
}
