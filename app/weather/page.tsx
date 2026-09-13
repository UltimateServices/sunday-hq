import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataStatus } from "@/components/shared/DataStatus";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER } from "@/data/week1/weather";
import { formatMeasured } from "@/lib/format";

export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Weather"
        lede="Indoor games are NONE. CLE@JAX is the only SIGNIFICANT flag in the seed (estimate, not a live NWS pull). Hourly ingest remains PENDING."
      />
      <div className="grid gap-2 md:grid-cols-2">
        {WEATHER.map((wx) => {
          const game = GAMES.find((g) => g.id === wx.gameId)!;
          return (
            <Link key={wx.gameId} href={`/games/${wx.gameId}`} className="rounded-lg border border-line bg-card p-3">
              <p className="text-[11px] text-muted">
                {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
              </p>
              <p className="font-semibold">{wx.summary}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <StatusBadge tone={wx.impact === "SIGNIFICANT" ? "orange" : wx.impact === "NONE" ? "green" : "purple"}>
                  {wx.impact}
                </StatusBadge>
                <DataStatus quality={wx.quality} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
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
              <p className="mt-2 text-sm text-muted">{wx.impactNote}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
