import { PageHeader } from "@/components/shared/PageHeader";
import { GameCard } from "@/components/ds/GameCard";
import { WindowSwitch } from "@/components/games/WindowSwitch";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { getWeekCatalog } from "@/lib/catalog";
import { environmentFor } from "@/lib/team-totals";
import { liveStatus } from "@/lib/game-window";
import { spreadLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GamesPage({ searchParams }: PageProps<"/games">) {
  const catalog = await getWeekCatalog();
  const params = await searchParams;
  const windowFilter = typeof params.window === "string" ? params.window.toUpperCase() : "ALL";
  const games = catalog.games.filter((game) => {
    if (windowFilter === "ALL") return true;
    if (windowFilter === "EARLY") return game.window === "EARLY";
    if (windowFilter === "LATE") return game.window === "LATE";
    if (windowFilter === "SNF") return game.window === "SNF";
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        layer="This Sunday"
        title="Games"
        lede="Tap a card for environment scores, script, player table, and research stubs. Not a bet slip."
      />
      <WindowSwitch active={["ALL", "EARLY", "LATE", "SNF"].includes(windowFilter) ? windowFilter : "ALL"} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => {
          const away = TEAM_BY_ID[game.awayTeamId];
          const home = TEAM_BY_ID[game.homeTeamId];
          const wx = catalog.weather.find((row) => row.gameId === game.id);
          return (
            <GameCard
              key={game.id}
              id={game.id}
              matchup={`${away.abbr} @ ${home.abbr}`}
              kickoff={`${game.kickoffLabel} · ${game.network}`}
              total={game.total.value}
              spread={spreadLabel(home.abbr, game.spreadHome.value)}
              indoor={game.indoor}
              tier={environmentFor(game, {
                qbDowngrade: game.id === "atl-pit",
                weatherRisk: wx?.impact === "SIGNIFICANT",
              })}
              weatherImpact={wx?.impact ?? "UNKNOWN"}
              weatherSummary={wx?.summary}
              live={liveStatus(game)}
            />
          );
        })}
      </div>
    </div>
  );
}
