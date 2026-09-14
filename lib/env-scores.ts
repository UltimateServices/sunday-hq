import type { EnvironmentTier, Game, WeatherImpact, WeatherRecord } from "@/lib/types/domain";
import { environmentFor } from "@/lib/team-totals";

export type EnvScores = {
  game: number;
  passing: number;
  rushing: number;
  td: number;
  tier: EnvironmentTier;
  quality: "ESTIMATE";
  note: string;
};

function clamp(n: number): number {
  return Math.max(8, Math.min(96, Math.round(n)));
}

/** 0–100 ESTIMATE. Posted total + weather + known QB downgrade. Not a trained env model. */
export function envScoresFor(
  game: Game,
  wx?: WeatherRecord,
  extra?: { qbDowngrade?: boolean },
): EnvScores {
  const qbDowngrade = extra?.qbDowngrade ?? game.id === "atl-pit";
  const weatherRisk = wx?.impact === "SIGNIFICANT" || game.id === "cle-jax";
  const tier = environmentFor(game, { qbDowngrade, weatherRisk });
  const total = game.total.value ?? 44;
  let gameScore = 50 + (total - 44) * 4;
  let pass = gameScore + (total >= 49 ? 6 : total <= 41 ? -8 : 0);
  let rush = 52 + (total >= 49 ? -4 : 2);
  let td = 48 + (total - 44) * 3;

  if (game.indoor) {
    pass += 4;
    gameScore += 2;
  }
  if (wx?.impact === "SIGNIFICANT" || weatherRisk) {
    gameScore -= 12;
    pass -= 16;
    rush -= 6;
    td -= 10;
  } else if (wx?.impact === "MODERATE") {
    pass -= 8;
    gameScore -= 5;
  }
  if (qbDowngrade) {
    gameScore -= 10;
    pass -= 14;
    td -= 12;
  }

  return {
    game: clamp(gameScore),
    passing: clamp(pass),
    rushing: clamp(rush),
    td: clamp(td),
    tier,
    quality: "ESTIMATE",
    note: "Derived from the posted total, indoor flag, weather impact, and known QB OUT flags. Not a trained environment model.",
  };
}

export function weatherImpactOf(wx?: WeatherRecord): WeatherImpact {
  return wx?.impact ?? "UNKNOWN";
}
