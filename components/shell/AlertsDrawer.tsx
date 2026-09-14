"use client";

import { useMemo, useState } from "react";
import { AlertRow } from "@/components/ds/AlertRow";
import { EmptyState } from "@/components/ds/EmptyState";
import type { AlertKind } from "@/lib/types/domain";
import { useLiveAlerts } from "./LiveOpsProvider";
import { useShell } from "./ShellProvider";

const TABS: Array<"ALL" | AlertKind> = ["ALL", "INJURIES", "WEATHER", "MARKETS", "PROJECTIONS"];

export function AlertsDrawer() {
  const { alertsOpen, setAlertsOpen } = useShell();
  const alerts = useLiveAlerts();
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const rows = useMemo(
    () => (tab === "ALL" ? alerts : alerts.filter((a) => a.kind === tab)),
    [tab, alerts],
  );
  if (!alertsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal>
      <button className="h-full flex-1" aria-label="Close alerts" onClick={() => setAlertsOpen(false)} />
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-elev p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Alerts</h2>
          <button type="button" onClick={() => setAlertsOpen(false)} className="text-xs text-muted">
            Close
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`action-btn ${tab === t ? "text-gold" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rows.length === 0 ? (
            <EmptyState />
          ) : (
            rows.map((alert) => <AlertRow key={alert.id} alert={alert} />)
          )}
        </div>
      </aside>
    </div>
  );
}
