"use client";

import { useState } from "react";
import { DEFAULT_SETTINGS, SETTINGS_KEY, type AppSettings } from "@/lib/settings";
import { ToneChip } from "@/components/ds/badges";
import { useShell } from "@/components/shell/ShellProvider";

function persistSettings(next: AppSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}

export function SettingsBoard() {
  const { finalCard, setFinalCard } = useShell();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    persistSettings(next);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <article className="rounded-lg border border-line bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold">Default game window</h2>
        <div className="flex flex-wrap gap-1">
          {(["ALL", "EARLY", "LATE", "SNF"] as const).map((w) => (
            <button key={w} type="button" onClick={() => update("defaultWindow", w)} className={`action-btn ${settings.defaultWindow === w ? "text-gold" : ""}`}>
              {w}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Persists locally. Scoreboard / props still honor URL filters when set.</p>
      </article>
      <article className="rounded-lg border border-line bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold">Density</h2>
        <div className="flex flex-wrap gap-1">
          {(["COMPACT", "COMFORTABLE"] as const).map((d) => (
            <button key={d} type="button" onClick={() => update("density", d)} className={`action-btn ${settings.density === d ? "text-gold" : ""}`}>
              {d}
            </button>
          ))}
        </div>
      </article>
      <article className="rounded-lg border border-line bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold">Alerts</h2>
        <div className="flex flex-wrap gap-1">
          {(["INFO", "WATCH", "IMPORTANT", "CRITICAL"] as const).map((s) => (
            <button key={s} type="button" onClick={() => update("minAlertSeverity", s)} className={`action-btn ${settings.minAlertSeverity === s ? "text-gold" : ""}`}>
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Drawer still shows all tabs. This is the preferred floor.</p>
      </article>
      <article className="rounded-lg border border-line bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold">Final Card</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="action-btn" onClick={() => setFinalCard(!finalCard)}>
            {finalCard ? "Final Card ON" : "Enable Final Card"}
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={() => update("confirmFinalCard", !settings.confirmFinalCard)}
          >
            Confirm toggle {settings.confirmFinalCard ? "ON" : "OFF"}
          </button>
          <ToneChip tone={finalCard ? "green" : "blue"}>{finalCard ? "DECLUTTERED" : "FULL TERMINAL"}</ToneChip>
        </div>
        <p className="mt-2 text-xs text-muted">Final Card keeps My Card, top recs, critical alerts, and last-minute changes. Secrets never live here.</p>
      </article>
      {saved ? <p className="text-xs text-good">Preferences saved on this device.</p> : null}
    </div>
  );
}
