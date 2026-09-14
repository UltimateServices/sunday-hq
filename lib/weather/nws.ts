import { GAMES } from "@/data/week1/games";
import { VENUE_BY_GAME } from "@/data/week1/venues";
import { WEATHER } from "@/data/week1/weather";
import { nwsUserAgent } from "@/lib/ingest/env";
import type { DataQuality, RoofState, WeatherImpact, WeatherRecord } from "@/lib/types/domain";

export type WeatherSnapshot = {
  asOf: string;
  source: "nws" | "seed";
  status: "LIVE" | "DEGRADED" | "UNAVAILABLE";
  note: string;
  rows: WeatherRecord[];
  userAgent: string;
};

type HourlyPeriod = {
  startTime?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  probabilityOfPrecipitation?: { value?: number | null };
  shortForecast?: string;
};

function impactFrom(tempF: number | null, windMph: number | null, precip: number | null): WeatherImpact {
  if (tempF === null && windMph === null && precip === null) return "UNKNOWN";
  if ((windMph ?? 0) >= 20 || (precip ?? 0) >= 50 || (tempF ?? 70) >= 90 || (tempF ?? 70) <= 25) return "SIGNIFICANT";
  if ((windMph ?? 0) >= 15 || (precip ?? 0) >= 30 || (tempF ?? 70) >= 85) return "MODERATE";
  if ((windMph ?? 0) >= 10 || (precip ?? 0) >= 20) return "MINOR";
  return "NONE";
}

function parseWind(raw?: string): number | null {
  if (!raw) return null;
  const nums = raw.match(/[\d.]+/g)?.map(Number) ?? [];
  if (!nums.length) return null;
  return Math.max(...nums);
}

function pickHour(periods: HourlyPeriod[], kickoffIso: string): HourlyPeriod | null {
  if (!periods.length) return null;
  const kick = Date.parse(kickoffIso);
  let best = periods[0];
  let bestDelta = Infinity;
  for (const period of periods) {
    if (!period.startTime) continue;
    const delta = Math.abs(Date.parse(period.startTime) - kick);
    if (delta < bestDelta) {
      best = period;
      bestDelta = delta;
    }
  }
  return best;
}

function roofFor(gameId: string, indoor: boolean): RoofState {
  const venue = VENUE_BY_GAME[gameId];
  if (!venue) return indoor ? "FIXED" : "OPEN";
  if (venue.roof === "FIXED_INDOOR") return "FIXED";
  if (venue.roof === "OUTDOOR") return "OPEN";
  return "UNKNOWN";
}

function seedRow(gameId: string): WeatherRecord | undefined {
  return WEATHER.find((row) => row.gameId === gameId);
}

export function overlayWeather(snapshot: WeatherSnapshot | null): WeatherRecord[] {
  const byId = new Map((snapshot?.rows ?? []).map((row) => [row.gameId, row]));
  return GAMES.map((game) => {
    const live = byId.get(game.id);
    const seed = seedRow(game.id);
    if (live) return { ...seed, ...live, roof: live.roof ?? roofFor(game.id, game.indoor) };
    return {
      ...(seed ?? {
        gameId: game.id,
        indoor: game.indoor,
        summary: game.indoor ? "Indoor" : "Outdoor — hourly DATA UNAVAILABLE",
        tempF: { value: null, quality: "UNAVAILABLE", source: "sunday-hq", asOf: null },
        windMph: { value: null, quality: "UNAVAILABLE", source: "sunday-hq", asOf: null },
        precipChance: { value: null, quality: "UNAVAILABLE", source: "sunday-hq", asOf: null },
        impact: game.indoor ? "NONE" : "UNKNOWN",
        impactNote: "No weather row stored.",
        quality: "UNAVAILABLE",
        source: "pending-nws",
      }),
      roof: seed?.roof ?? roofFor(game.id, game.indoor),
    };
  });
}

export async function pullNwsHourly(): Promise<WeatherSnapshot> {
  const agent = nwsUserAgent();
  const asOf = new Date().toISOString();
  const rows: WeatherRecord[] = [];
  const notes: string[] = [];

  for (const game of GAMES) {
    const venue = VENUE_BY_GAME[game.id];
    const seed = seedRow(game.id);
    const roof = roofFor(game.id, game.indoor);
    if (!venue || game.indoor || roof === "FIXED") {
      rows.push({
        ...(seed ?? overlayWeather(null).find((row) => row.gameId === game.id)!),
        roof,
        source: seed?.source ?? "venue",
        hourlyAsOf: asOf,
        impactNote:
          roof === "UNKNOWN"
            ? `${seed?.impactNote ?? "Retractable roof."} Roof state UNKNOWN — NWS cannot confirm OPEN/CLOSED.`
            : seed?.impactNote ?? "Indoor / fixed roof. Weather is not a limiter.",
      });
      continue;
    }

    try {
      const meta = await fetch(`https://api.weather.gov/points/${venue.lat},${venue.lon}`, {
        headers: { "User-Agent": agent, Accept: "application/geo+json" },
        cache: "no-store",
      });
      if (!meta.ok) {
        notes.push(`${game.id}: points ${meta.status}`);
        if (seed) rows.push({ ...seed, roof, quality: seed.quality === "VERIFIED" ? "STALE" : seed.quality });
        continue;
      }
      const json = (await meta.json()) as { properties?: { forecastHourly?: string } };
      if (!json.properties?.forecastHourly) {
        notes.push(`${game.id}: no hourly URL`);
        if (seed) rows.push({ ...seed, roof });
        continue;
      }
      const hourly = await fetch(json.properties.forecastHourly, {
        headers: { "User-Agent": agent, Accept: "application/geo+json" },
        cache: "no-store",
      });
      if (!hourly.ok) {
        notes.push(`${game.id}: hourly ${hourly.status}`);
        if (seed) rows.push({ ...seed, roof, quality: "STALE" });
        continue;
      }
      const body = (await hourly.json()) as { properties?: { periods?: HourlyPeriod[]; updateTime?: string } };
      const period = pickHour(body.properties?.periods ?? [], game.kickoffIso);
      const temp = period?.temperature ?? null;
      const wind = parseWind(period?.windSpeed);
      const precip = period?.probabilityOfPrecipitation?.value ?? null;
      const impact = impactFrom(temp, wind, precip);
      const quality: DataQuality = "VERIFIED";
      rows.push({
        gameId: game.id,
        indoor: false,
        summary: period?.shortForecast
          ? `${period.shortForecast} · ${temp ?? "—"}F · wind ${wind ?? "—"} mph`
          : seed?.summary ?? "NWS hourly",
        tempF: {
          value: temp,
          quality: temp === null ? "UNAVAILABLE" : quality,
          source: "NWS hourly",
          asOf,
          note: `Kickoff-hour period from ${venue.name}.`,
        },
        windMph: {
          value: wind,
          quality: wind === null ? "UNAVAILABLE" : quality,
          source: "NWS hourly",
          asOf,
        },
        precipChance: {
          value: precip,
          quality: precip === null ? "UNAVAILABLE" : quality,
          source: "NWS hourly",
          asOf,
        },
        impact,
        impactNote: `${impact} from NWS hourly at kickoff. Roof ${roof}. Not a METAR. ${seed?.impactNote ?? ""}`.trim(),
        quality,
        source: "NWS hourly",
        roof,
        hourlyAsOf: body.properties?.updateTime ?? asOf,
        shortForecast: period?.shortForecast ?? null,
      });
      notes.push(`${game.id}: ${impact} ${temp ?? "?"}F`);
    } catch (error) {
      notes.push(`${game.id}: ${error instanceof Error ? error.message : "nws fail"}`);
      if (seed) rows.push({ ...seed, roof, quality: "STALE" });
    }
  }

  const liveCount = rows.filter((row) => row.source === "NWS hourly").length;
  return {
    asOf,
    source: liveCount ? "nws" : "seed",
    status: liveCount ? "LIVE" : "DEGRADED",
    note: liveCount
      ? `NWS hourly stored for ${liveCount} outdoor games. UA ${agent}. Retractable roofs stay UNKNOWN.`
      : `NWS hourly did not land. Seed weather kept. ${notes.join(" · ")}`,
    rows,
    userAgent: agent,
  };
}
