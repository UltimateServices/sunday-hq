"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AlertRow } from "@/components/ds/AlertRow";
import { EmptyState } from "@/components/ds/EmptyState";
import type { AlertKind } from "@/lib/types/domain";
import {
  getReadAlertsServer,
  getReadAlertsSnapshot,
  markAlertsRead,
  subscribeReadAlerts,
} from "@/lib/read-alerts";
import { useLiveAlerts } from "./LiveOpsProvider";
import { useShell } from "./ShellProvider";

const TABS: Array<"ALL" | AlertKind> = ["ALL", "INJURIES", "WEATHER", "MARKETS", "PROJECTIONS"];

export function AlertsDrawer() {
  const { alertsOpen, setAlertsOpen } = useShell();
  const alerts = useLiveAlerts();
  const readIds = useSyncExternalStore(subscribeReadAlerts, getReadAlertsSnapshot, getReadAlertsServer);
  const readSet = useMemo(() => new Set(readIds), [readIds]);
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const [inbox, setInbox] = useState<"UNREAD" | "ALL">("UNREAD");
  const rows = useMemo(() => {
    let list = tab === "ALL" ? alerts : alerts.filter((alert) => alert.kind === tab);
    if (inbox === "UNREAD") list = list.filter((alert) => !readSet.has(alert.id));
    return list;
  }, [tab, alerts, inbox, readSet]);
  const unreadCount = alerts.filter((alert) => !readSet.has(alert.id)).length;
  if (!alertsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal aria-label="Notification center">
      <button className="h-full flex-1" aria-label="Close notification center" onClick={() => setAlertsOpen(false)} />
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-elev p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Notification center</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Projection, health, market, weather, availability, and My Card status only. No invented fade alerts.
            </p>
          </div>
          <button type="button" onClick={() => setAlertsOpen(false)} className="text-xs text-muted">
            Close
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setInbox("UNREAD")}
            className={`action-btn ${inbox === "UNREAD" ? "text-gold" : ""}`}
          >
            Unread {unreadCount}
          </button>
          <button type="button" onClick={() => setInbox("ALL")} className={`action-btn ${inbox === "ALL" ? "text-gold" : ""}`}>
            All
          </button>
          {unreadCount > 0 ? (
            <button type="button" onClick={() => markAlertsRead(alerts.map((alert) => alert.id))} className="action-btn">
              Mark all read
            </button>
          ) : null}
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
            <EmptyState
              message={inbox === "UNREAD" ? "No unread notifications." : "No notifications in this filter."}
              hint="We will not invent a market or fade alert to fill this list."
            />
          ) : (
            rows.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                unread={!readSet.has(alert.id)}
                onOpen={() => markAlertsRead([alert.id])}
              />
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
