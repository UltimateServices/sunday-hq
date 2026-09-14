import { formatMeasured } from "@/lib/format";
import type { WeatherRecord } from "@/lib/types/domain";

export function isMeaningfulWeather(wx: WeatherRecord): boolean {
  return wx.impact === "SIGNIFICANT" || wx.impact === "MODERATE";
}

export type WeatherTimelineSlot = {
  slot: "Kickoff" | "Q2" | "Halftime" | "Q3" | "Q4";
  value: string;
  pending: boolean;
};

export function weatherTimeline(wx: WeatherRecord): WeatherTimelineSlot[] {
  const nws = /nws/i.test(wx.source);
  const kickoffHasData = wx.tempF.value !== null || wx.windMph.value !== null || wx.precipChance.value !== null;
  const kickoff = kickoffHasData
    ? `${formatMeasured(wx.tempF, 0)}° / wind ${formatMeasured(wx.windMph, 0)} / precip ${formatMeasured(wx.precipChance, 0)}`
    : "PENDING";
  return [
    {
      slot: "Kickoff",
      value: kickoffHasData ? `${kickoff}${nws ? " · NWS hourly" : " · seed / ESTIMATE"}` : "PENDING — no kickoff hour stored",
      pending: !kickoffHasData,
    },
    { slot: "Q2", value: "PENDING", pending: true },
    { slot: "Halftime", value: "PENDING", pending: true },
    { slot: "Q3", value: "PENDING", pending: true },
    { slot: "Q4", value: "PENDING", pending: true },
  ];
}

export function splitWeather(rows: WeatherRecord[]) {
  const meaningful = rows.filter(isMeaningfulWeather);
  const outdoor = rows.filter((row) => !row.indoor && !isMeaningfulWeather(row));
  const indoor = rows.filter((row) => row.indoor);
  return { meaningful, outdoor, indoor };
}
