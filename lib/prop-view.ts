import { injuryForPlayer } from "@/data/week1/injuries";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { GAME_BY_ID } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { computePricing, type EvComputation } from "@/lib/odds";
import { healthLabel } from "@/lib/health";
import { confidenceGrade } from "@/lib/ui/confidence";
import type {
  ConfidenceGrade,
  HealthState,
  MeasuredNumber,
  PropMarket,
  WhySections,
} from "@/lib/types/domain";

export type PropView = PropMarket & {
  playerName: string;
  teamAbbr: string;
  position: string;
  matchup: string;
  health: HealthState;
  healthLabel: string;
  pricing: EvComputation;
  bookLabel: string;
  confidenceGrade: ConfidenceGrade;
  whySections: WhySections;
  distribution: {
    floor: MeasuredNumber;
    mean: MeasuredNumber;
    median: MeasuredNumber;
    ceiling: MeasuredNumber;
  };
};

export function toPropView(prop: PropMarket, assumedJuice = true): PropView {
  const player = PLAYER_BY_ID[prop.playerId];
  const game = GAME_BY_ID[prop.gameId];
  const injury = injuryForPlayer(prop.playerId);
  const health: HealthState = injury?.health ?? "NO_KNOWN_LIMITATION";
  const away = TEAM_BY_ID[game.awayTeamId].abbr;
  const home = TEAM_BY_ID[game.homeTeamId].abbr;
  const pricing = computePricing({
    model: prop.model,
    line: prop.line,
    odds: prop.oddsAmerican,
    side: prop.side,
    allowAssumedJuice: assumedJuice,
  });

  const unavailable: MeasuredNumber = {
    value: null,
    quality: "UNAVAILABLE",
    source: "sunday-hq",
    asOf: null,
    note: "Trained distribution tails are Phase 3.",
  };

  return {
    ...prop,
    playerName: player.name,
    teamAbbr: TEAM_BY_ID[player.teamId].abbr,
    position: player.position,
    matchup: `${away} @ ${home}`,
    health,
    healthLabel: healthLabel(health),
    bookLabel: prop.book === "DRAFTKINGS" ? "DK" : prop.book === "CONSENSUS" ? "Consensus" : "Unknown",
    pricing,
    confidenceGrade: confidenceGrade({
      hasModel: prop.model.value !== null,
      hasLine: prop.line.value !== null,
      hasVerifiedOdds: prop.oddsAmerican.value !== null && prop.oddsAmerican.quality === "VERIFIED",
      health,
      lineQuality: prop.line.quality,
      modelQuality: prop.model.quality,
    }),
    whySections: {
      modelCase: prop.why,
      supporting: [
        prop.matchupNote,
        health === "NO_KNOWN_LIMITATION"
          ? "Availability: NO KNOWN LIMITATION (not “healthy”)."
          : `Availability: ${healthLabel(health)}.`,
      ],
      risks: prop.risks,
      marketContext: [
        `Book: ${prop.book}. Line quality ${prop.line.quality}.`,
        prop.oddsAmerican.note ?? "DK player-prop odds not ingested.",
        prop.movement.note,
      ],
      dataQuality: [
        `Line ${prop.line.quality} · Model ${prop.model.quality} · Odds ${prop.oddsAmerican.quality}`,
        "Week 1 = LOW SAMPLE. Placeholder model is not a trained engine.",
      ],
    },
    distribution: {
      floor: unavailable,
      mean: prop.model,
      median: prop.median,
      ceiling: unavailable,
    },
  };
}

export function weatherLine(gameId: string): string {
  const wx = WEATHER_BY_GAME[gameId];
  if (!wx) return "DATA UNAVAILABLE";
  return `${wx.impact.replaceAll("_", " ")} — ${wx.summary}`;
}

export const MARKET_LABEL: Record<string, string> = {
  PASS_YDS: "Pass Yds",
  PASS_TD: "Pass TD",
  RUSH_YDS: "Rush Yds",
  RUSH_TD: "Rush TD",
  COMPLETIONS: "Completions",
  REC_YDS: "Rec Yds",
  RECEPTIONS: "Receptions",
  REC_TD: "Rec TD",
  ANYTIME_TD: "Anytime TD",
  ALT_YDS: "Alt Yds",
  TEAM_TOTAL: "Team Total",
  GAME_TOTAL: "Game Total",
  SGP: "SGP",
  MULTI_GAME_PARLAY: "Multi-game",
  PROFIT_BOOST: "Profit Boost",
};
