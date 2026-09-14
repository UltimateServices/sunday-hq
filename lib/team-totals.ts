import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { DerivedTeamTotal, EnvironmentTier, Game } from "@/lib/types/domain";

export function impliedTeamTotals(game: Game): {
  home: number | null;
  away: number | null;
} {
  const total = game.total.value;
  const spread = game.spreadHome.value;
  if (total === null || spread === null) return { home: null, away: null };
  return {
    home: (total - spread) / 2,
    away: (total + spread) / 2,
  };
}

export function environmentFor(game: Game, extra?: { qbDowngrade?: boolean; weatherRisk?: boolean }): EnvironmentTier {
  if (extra?.weatherRisk) return "WEATHER_RISK";
  if (extra?.qbDowngrade) return "QB_DOWNGRADE";
  if (game.total.value !== null && game.total.value >= 49) return "SHOOTOUT";
  if (game.total.value !== null && game.total.value <= 41) return "CAPPED";
  return "NEUTRAL";
}

export function derivedTeamTotals(games: Game[] = GAMES): DerivedTeamTotal[] {
  return games.flatMap((game) => {
    const { home, away } = impliedTeamTotals(game);
    const qbDowngrade = game.id === "atl-pit";
    const weatherRisk = game.id === "cle-jax";
    const env = environmentFor(game, { qbDowngrade, weatherRisk });
    const quality = game.total.quality;
    const asOf = game.total.asOf;
    const source = "derived from DK spread + total (ESPN widget)";

    return [
      {
        id: `${game.id}-${game.homeTeamId}`,
        gameId: game.id,
        teamId: game.homeTeamId,
        line: {
          value: home,
          quality,
          source,
          asOf,
          note: `Implied ${TEAM_BY_ID[game.homeTeamId].abbr} team total. Not a listed DK team-total market.`,
        },
        environment: env,
        note: `${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}`,
      },
      {
        id: `${game.id}-${game.awayTeamId}`,
        gameId: game.id,
        teamId: game.awayTeamId,
        line: {
          value: away,
          quality,
          source,
          asOf,
          note: `Implied ${TEAM_BY_ID[game.awayTeamId].abbr} team total. Not a listed DK team-total market.`,
        },
        environment: env,
        note: `${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}`,
      },
    ];
  });
}
