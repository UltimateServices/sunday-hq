import Link from "next/link";
import { DataStatus } from "@/components/shared/DataStatus";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { WeekCatalog } from "@/lib/catalog";
import { formatMeasured } from "@/lib/format";

function material(impact: string): boolean {
  return impact === "SIGNIFICANT" || impact === "MODERATE" || impact === "MINOR";
}

export function WeatherBoard({ catalog }: { catalog: WeekCatalog }) {
  const rows = catalog.weather
    .map((wx) => {
      const game = catalog.gameById[wx.gameId];
      return game ? { wx, game } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
  const meaningful = rows.filter((row) => material(row.wx.impact));
  const rest = rows.filter((row) => !material(row.wx.impact));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-[20px] font-semibold tracking-tight">Meaningful weather</h2>
        {meaningful.length === 0 ? (
          <p className="text-[15px] text-muted">NO MATERIAL WEATHER ISSUES</p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {meaningful.map((row) => (
              <WeatherCard key={row.wx.gameId} wx={row.wx} game={row.game} />
            ))}
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-[20px] font-semibold tracking-tight">All outdoor / stored games</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {rest.map((row) => (
            <WeatherCard key={row.wx.gameId} wx={row.wx} game={row.game} />
          ))}
        </div>
      </section>
    </div>
  );
}

function WeatherCard({ wx, game }: { wx: WeekCatalog["weather"][number]; game: WeekCatalog["games"][number] }) {
  return (
    <Link href={`/games/${wx.gameId}`} className="surface block p-4">
      <p className="text-[13px] text-muted">
        {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr} · {game.kickoffLabel}
      </p>
      <p className="mt-1 text-[17px] font-semibold tracking-tight">{wx.summary}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        <StatusBadge tone={wx.impact === "SIGNIFICANT" ? "orange" : wx.impact === "NONE" ? "green" : "purple"}>
          {wx.impact}
        </StatusBadge>
        <DataStatus quality={wx.quality} />
        <StatusBadge tone={wx.roof === "UNKNOWN" ? "yellow" : "blue"}>Roof {wx.roof ?? "UNKNOWN"}</StatusBadge>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
        <div>
          <dt className="text-muted">Temp F</dt>
          <dd className="num">{formatMeasured(wx.tempF, 0)}</dd>
        </div>
        <div>
          <dt className="text-muted">Wind</dt>
          <dd className="num">{formatMeasured(wx.windMph, 0)}</dd>
        </div>
        <div>
          <dt className="text-muted">Precip</dt>
          <dd className="num">{formatMeasured(wx.precipChance, 0)}</dd>
        </div>
      </dl>
      <ol className="mt-3 space-y-1 text-[12px] text-muted">
        <li>Kickoff · {wx.hourlyAsOf ? "hourly stored" : "kickoff row only"}</li>
        <li>Q2 · DATA UNAVAILABLE</li>
        <li>Halftime · DATA UNAVAILABLE</li>
        <li>Q3 · DATA UNAVAILABLE</li>
        <li>Q4 · DATA UNAVAILABLE</li>
      </ol>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{wx.impactNote}</p>
    </Link>
  );
}
