import type { AlertSeverity, GameWindowFilter } from "@/lib/types/domain";
import { TIMELINE_MILESTONE_IDS, type TimelineMilestoneId } from "@/lib/sunday-timeline";

export type AppSettings = {
  defaultWindow: GameWindowFilter;
  density: "COMPACT" | "COMFORTABLE";
  confirmFinalCard: boolean;
  minAlertSeverity: AlertSeverity;
  hiddenTimelineMilestones: TimelineMilestoneId[];
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultWindow: "ALL",
  density: "COMPACT",
  confirmFinalCard: true,
  minAlertSeverity: "INFO",
  hiddenTimelineMilestones: [],
};

export const SETTINGS_KEY = "sunday-hq-settings";
export const CARD_KEY = "sunday-hq-card";
export const STARS_KEY = "sunday-hq-stars";
export const READ_ALERTS_KEY = "sunday-hq-read-alerts";
export const SETTINGS_EVENT = "sunday-hq-settings";

let settingsCache: AppSettings = DEFAULT_SETTINGS;
let settingsRaw = "";

function parseSettings(raw: string): AppSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const hidden = Array.isArray(parsed.hiddenTimelineMilestones)
      ? parsed.hiddenTimelineMilestones.filter((id): id is TimelineMilestoneId =>
          (TIMELINE_MILESTONE_IDS as readonly string[]).includes(id),
        )
      : [];
    return { ...DEFAULT_SETTINGS, ...parsed, hiddenTimelineMilestones: hidden };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function readSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(SETTINGS_KEY) ?? "";
  if (raw === settingsRaw) return settingsCache;
  settingsRaw = raw;
  settingsCache = parseSettings(raw);
  return settingsCache;
}

export function writeSettings(next: AppSettings) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(next);
  localStorage.setItem(SETTINGS_KEY, raw);
  settingsRaw = raw;
  settingsCache = next;
  window.dispatchEvent(new Event(SETTINGS_EVENT));
}

export function subscribeSettings(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(SETTINGS_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SETTINGS_EVENT, handler);
  };
}

export function getServerSettings(): AppSettings {
  return DEFAULT_SETTINGS;
}
