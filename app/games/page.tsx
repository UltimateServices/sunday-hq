import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataStatus } from "@/components/shared/DataStatus";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { environmentFor } from "@/lib/team-totals";
import { formatNumber, spreadLabel } from "@/lib/format";
import type { StatusTone } from "@/lib/health";

const TONE: Record<string, StatusTone> = {
  SHOOTOUT: "green",
  NEUTRAL: "blue",
  CAPPED: "yellow",
  WEATHER_RISK: "orange",
  QB_DOWNGRADE: "red",
};

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Games"
        lede="13 Sunday Week 1 games. Spreads and totals from DraftKings via ESPN schedule widget (2026-09-13). Click through for Layer 3 deep dives."
      />
      <div className="grid gap-2 md:grid-cols-2">
        {GAMES.map((game) => {
          const away = TEAM_BY_ID[game.awayTeamId];
          const home = TEAM_BY_ID[game.homeTeamId];
          const wx = WEATHER_BY_GAME[game.id];
          const tier = environmentFor(game, {
            qbDowngrade: game.id === "atl-pit",
            weatherRisk: game.id === "cle-jax",
          });
          return (
            <Link key={game.id} href={`/games/${game.id}`} className="rounded-lg border border-line bg-card p-4 hover:border-gold/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] text-muted">
                    {game.kickoffLabel} · {game.network} · {game.window}
                  </p>
                  <h2 className="text-lg font-semibold">
                    {away.abbr} @ {home.abbr}
                  </h2>
                  <p className="text-xs text-muted">
                    {game.venue} · {game.indoor ? "Indoor" : "Outdoor"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="num text-2xl text-gold">{formatNumber(game.total.value)}</p>
                  <p className="text-xs text-muted">{spreadLabel(home.abbr, game.spreadHome.value)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                <StatusBadge tone={TONE[tier]}>{tier.replaceAll("_", " ")}</StatusBadge>
                <DataStatus quality={game.total.quality} />
                {wx ? (
                  <StatusBadge tone={wx.impact === "SIGNIFICANT" ? "orange" : "blue"}>{wx.impact}</StatusBadge>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
