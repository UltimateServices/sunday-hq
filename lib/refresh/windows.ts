import type { SundayStage } from "@/lib/ingest/types";

/**
 * Sunday HQ cron windows.
 *
 * Docs assume **EDT = UTC-4** (in effect for Week 1 Sunday 2026-09-13).
 * Vercel cron schedules are UTC.
 *
 * | Local ET (EDT) | UTC     | Stage          | Why                                      |
 * | -------------- | ------- | -------------- | ---------------------------------------- |
 * | Sun 11:00 AM   | 15:00   | slate          | Collect Sunday slate before 1PM          |
 * | Sun 11:05 AM   | 15:05   | injuries       | Inactive / report sweep                  |
 * | Sun 11:10 AM   | 15:10   | weather        | NWS hourly if NWS_USER_AGENT is set      |
 * | Sun 12:00 PM   | 16:00   | odds           | Pre-1PM DK lock snapshot                 |
 * | Sun 12:15 PM   | 16:15   | projections    | Re-stamp model vs latest tape            |
 * | Sun 3:00 PM    | 19:00   | odds           | Pre-late (4:25 PM ET) lock               |
 * | Sun 7:00 PM    | 23:00   | odds           | Pre-SNF (8:20 PM ET) lock                |
 * | Mon 8:00 AM    | 12:00   | settle         | Public box scores + CLV                  |
 * | Mon 10:00 AM   | 14:00   | monday-learn   | REAL calibration only                    |
 */
export type CronWindow = {
  stage: SundayStage;
  schedule: string;
  etLabel: string;
  utcLabel: string;
};

export const STAGE_WINDOWS: CronWindow[] = [
  { stage: "slate", schedule: "0 15 * * 0", etLabel: "Sun 11:00 AM ET", utcLabel: "Sun 15:00 UTC" },
  { stage: "injuries", schedule: "5 15 * * 0", etLabel: "Sun 11:05 AM ET", utcLabel: "Sun 15:05 UTC" },
  { stage: "weather", schedule: "10 15 * * 0", etLabel: "Sun 11:10 AM ET", utcLabel: "Sun 15:10 UTC" },
  { stage: "odds", schedule: "0 16 * * 0", etLabel: "Sun 12:00 PM ET", utcLabel: "Sun 16:00 UTC" },
  { stage: "projections", schedule: "15 16 * * 0", etLabel: "Sun 12:15 PM ET", utcLabel: "Sun 16:15 UTC" },
  { stage: "odds", schedule: "0 19 * * 0", etLabel: "Sun 3:00 PM ET", utcLabel: "Sun 19:00 UTC" },
  { stage: "odds", schedule: "0 23 * * 0", etLabel: "Sun 7:00 PM ET", utcLabel: "Sun 23:00 UTC" },
  { stage: "settle", schedule: "0 12 * * 1", etLabel: "Mon 8:00 AM ET", utcLabel: "Mon 12:00 UTC" },
  { stage: "monday-learn", schedule: "0 14 * * 1", etLabel: "Mon 10:00 AM ET", utcLabel: "Mon 14:00 UTC" },
];

export const SCHEDULE_TO_STAGE: Record<string, SundayStage> = Object.fromEntries(
  STAGE_WINDOWS.map((window) => [window.schedule, window.stage]),
);

export function nextRefreshLabel(now = new Date()): string {
  const current = now.getUTCDay() * 24 * 60 + now.getUTCHours() * 60 + now.getUTCMinutes();
  const ranked = STAGE_WINDOWS.map((window) => {
    const [, minute, hour, , , dow] = window.schedule.split(" ");
    const day = Number(dow);
    const target = day * 24 * 60 + Number(hour) * 60 + Number(minute);
    const delta = target > current ? target - current : target + 7 * 24 * 60 - current;
    return { window, delta };
  }).sort((a, b) => a.delta - b.delta);
  const next = ranked[0]?.window;
  if (!next) return "LIVE POLL PENDING";
  return `${next.etLabel} · ${next.stage} attempt (not a data guarantee)`;
}
