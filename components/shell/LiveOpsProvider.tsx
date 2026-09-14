"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ALERTS } from "@/data/week1/alerts";
import { CHANGES } from "@/data/week1/news";
import { DATA_HEALTH, seedRefresh } from "@/lib/refresh";
import type { AlertItem, ChangeItem } from "@/lib/types/domain";
import type { PublicOps } from "@/lib/ingest/types";

const fallback: PublicOps = {
  health: {
    state: DATA_HEALTH.state,
    issues: DATA_HEALTH.issues,
    ingestLastSuccessAt: null,
    ingestLastFailureAt: null,
    ingestLastFailureNote: null,
  },
  routine: [],
  alerts: ALERTS,
  changes: CHANGES,
  staleWarning: DATA_HEALTH.issues[0] ?? null,
  nextRefreshLabel: seedRefresh().nextRefreshLabel,
  lastRefreshLabel: seedRefresh().lastRefreshLabel,
  lastRefreshIso: seedRefresh().lastRefreshIso,
  storage: "memory",
  liveGate: {
    actionable: false,
    reason: "NO_KEY",
    headline: "Not live — do not bet from this page.",
    body: "Waiting on live tape status. Seed picks stay hidden.",
    keyConfigured: false,
  },
  envChecks: [],
};

const LiveOpsContext = createContext<PublicOps>(fallback);

export function LiveOpsProvider({ children }: { children: React.ReactNode }) {
  const [ops, setOps] = useState<PublicOps>(fallback);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/api/ops/status", { cache: "no-store" });
        if (!response.ok) return;
        const json = (await response.json()) as PublicOps;
        if (!cancelled) setOps(json);
      } catch {
        // seed fallback stays
      }
    };
    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const value = useMemo(() => ops, [ops]);
  return <LiveOpsContext.Provider value={value}>{children}</LiveOpsContext.Provider>;
}

export function useLiveOps(): PublicOps {
  return useContext(LiveOpsContext);
}

export function useLiveAlerts(): AlertItem[] {
  return useLiveOps().alerts;
}

export function useLiveChanges(): ChangeItem[] {
  return useLiveOps().changes;
}
