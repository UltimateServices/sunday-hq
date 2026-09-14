import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { GameCard } from "@/components/ds/GameCard";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { getWeekCatalog } from "@/lib/catalog";
import { environmentFor } from "@/lib/team-totals";
import { liveStatus } from "@/lib/game-window";
import { spreadLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="This Sunday"
        title="Games"
        lede="Thirteen Week 1 games. Tap a card for script, weather, and props."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {catalog.games.map((game) => {
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
