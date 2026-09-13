import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { derivedTeamTotals, impliedTeamTotals } from "@/lib/team-totals";
import type { QualifierGrade, QualifierLens, Side, WhySections } from "@/lib/types/domain";
import type { DerivedTeamTotal, EnvironmentTier, Game } from "@/lib/types/domain";

export type TeamTotalRow = DerivedTeamTotal & {
  teamAbbr: string;
  teamName: string;
  matchup: string;
  side: Side;
  model: number | null;
  edge: number | null;
  impliedHome: number | null;
  impliedAway: number | null;
  lenses: Record<QualifierLens, QualifierGrade>;
  why: WhySections;
};

function modelFor(row: DerivedTeamTotal): number | null {
  if (row.line.value === null) return null;
  if (row.environment === "SHOOTOUT") return row.line.value + 1.4;
  if (row.environment === "CAPPED") return row.line.value - 1.2;
  if (row.environment === "WEATHER_RISK") return row.line.value - 1.6;
  if (row.environment === "QB_DOWNGRADE" && row.teamId === "atl") return row.line.value - 2.4;
  return row.line.value + 0.2;
}

function lensesFor(env: EnvironmentTier, teamId: string): Record<QualifierLens, QualifierGrade> {
  if (env === "QB_DOWNGRADE" && teamId === "atl") {
    return { GOOD_PLAYER: "NO", GOOD_MATCHUP: "NO", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" };
  }
  if (env === "SHOOTOUT") {
    return { GOOD_PLAYER: "YES", GOOD_MATCHUP: "LEAN", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" };
  }
  if (env === "WEATHER_RISK" || env === "CAPPED") {
    return { GOOD_PLAYER: "UNKNOWN", GOOD_MATCHUP: "NO", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" };
  }
  return { GOOD_PLAYER: "UNKNOWN", GOOD_MATCHUP: "UNKNOWN", GOOD_PROJECTION: "LEAN", GOOD_BET: "UNKNOWN" };
}

export function teamTotalRows(games: Game[] = GAMES): TeamTotalRow[] {
  return derivedTeamTotals(games).map((row) => {
    const team = TEAM_BY_ID[row.teamId];
    const game = games.find((g) => g.id === row.gameId) ?? GAMES.find((g) => g.id === row.gameId)!;
    const implied = impliedTeamTotals(game);
    const model = modelFor(row);
    const edge = model !== null && row.line.value !== null ? model - row.line.value : null;
    const side: Side = (edge ?? 0) >= 0 ? "OVER" : "UNDER";
    const wx = WEATHER_BY_GAME[row.gameId];
    return {
      ...row,
      teamAbbr: team.abbr,
      teamName: `${team.city} ${team.name}`,
      matchup: row.note,
      side,
      model,
      edge,
      impliedHome: implied.home,
      impliedAway: implied.away,
      lenses: lensesFor(row.environment, row.teamId),
      why: {
        modelCase: [
          `Implied ${team.abbr} team total ${row.line.value?.toFixed(1) ?? "DATA UNAVAILABLE"} from DK spread + total.`,
          `Placeholder model ${model?.toFixed(1) ?? "DATA UNAVAILABLE"} (${side}).`,
        ],
        supporting: [row.line.note ?? row.note, `Environment ${row.environment.replaceAll("_", " ")}.`],
        risks: [
          "Not a listed DraftKings team-total market until that book line is ingested.",
          wx?.impact === "SIGNIFICANT" ? wx.impactNote : "Weather may still move the derived number.",
        ],
        marketContext: [
          `DK game total ${game.total.value} (${game.total.quality}).`,
          "Derived number is not a ticket.",
        ],
        dataQuality: [
          `Line ${row.line.quality}. Week 1 LOW SAMPLE.`,
          "Placeholder environment tilt is not a trained team-total engine.",
        ],
      },
    };
  });
}
