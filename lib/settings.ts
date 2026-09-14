import type { AlertSeverity, GameWindowFilter } from "@/lib/types/domain";

export type AppSettings = {
  defaultWindow: GameWindowFilter;
  density: "COMPACT" | "COMFORTABLE";
  confirmFinalCard: boolean;
  minAlertSeverity: AlertSeverity;
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultWindow: "ALL",
  density: "COMPACT",
  confirmFinalCard: true,
  minAlertSeverity: "INFO",
};

export const SETTINGS_KEY = "sunday-hq-settings";
export const CARD_KEY = "sunday-hq-card";
export const STARS_KEY = "sunday-hq-stars";
