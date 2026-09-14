import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { movesForGame } from "@/data/week1/market-moves";
import { environmentFor } from "@/lib/team-totals";
import type { EnvironmentTier, Game, QualifierGrade, QualifierLens, WeatherRecord, WhySections } from "@/lib/types/domain";

export type GameTotalRow = {
  gameId: string;
  matchup: string;
  window: string;
  kickoff: string;
  indoor: boolean;
  open: number | null;
  current: number | null;
  move: number | null;
  environment: EnvironmentTier;
  weatherImpact: string;
  why: WhySections;
  lenses: Record<QualifierLens, QualifierGrade>;
};

export function gameTotalRows(games: Game[] = GAMES, weather?: WeatherRecord[]): GameTotalRow[] {
  return [...games]
    .sort((a, b) => (b.total.value ?? 0) - (a.total.value ?? 0))
    .map((game) => {
      const open = game.openingTotal?.value ?? game.total.value;
      const current = game.total.value;
      const move = open !== null && current !== null ? current - open : null;
      const wx = weather?.find((row) => row.gameId === game.id) ?? WEATHER_BY_GAME[game.id];
      const env = environmentFor(game, {
        qbDowngrade: game.id === "atl-pit",
        weatherRisk: wx?.impact === "SIGNIFICANT",
      });
      const away = TEAM_BY_ID[game.awayTeamId].abbr;
      const home = TEAM_BY_ID[game.homeTeamId].abbr;
      const timeline = movesForGame(game.id);
      return {
        gameId: game.id,
        matchup: `${away} @ ${home}`,
        window: game.window,
        kickoff: game.kickoffLabel,
        indoor: game.indoor,
        open,
        current,
        move,
        environment: env,
        weatherImpact: wx?.impact ?? "UNKNOWN",
        lenses: {
          GOOD_PLAYER: "UNKNOWN",
          GOOD_MATCHUP: env === "SHOOTOUT" ? "LEAN" : env === "CAPPED" || env === "WEATHER_RISK" ? "NO" : "UNKNOWN",
          GOOD_PROJECTION: "LEAN",
          GOOD_BET: "UNKNOWN",
        },
        why: {
          modelCase: [
            `Current DK total ${current ?? "DATA UNAVAILABLE"} (${game.total.quality}).`,
            open !== current && open !== null
              ? `Opener/consensus ${open} → current ${current}.`
              : "No stored opener — movement UNKNOWN besides the live print.",
          ],
          supporting: [
            `${env.replaceAll("_", " ")} environment.`,
            game.indoor || wx?.roof === "FIXED" ? "Indoor / fixed roof — weather NONE." : (wx?.summary ?? "NWS hourly not stored."),
          ],
          risks: [
            "Game total is not an automatic over or under.",
            env === "WEATHER_RISK" ? "Weather thesis uses stored hourly / seed impact. Retractable roofs stay UNKNOWN." : "Week 1 LOW SAMPLE.",
          ],
          marketContext: [
            timeline.length ? `${timeline.length} captured move event(s).` : "No timeline beyond the live print.",
            "Player-prop tape not ingested.",
          ],
          dataQuality: [
            `Spread/total source: ${game.total.source}.`,
            "Steam detector is a heat label on captured prints, not a live book feed.",
          ],
        },
      };
    });
}
