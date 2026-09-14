import { TEAM_BY_ID } from "@/data/week1/teams";
import type { Game } from "@/lib/types/domain";

export type GameScriptView = {
  gameId: string;
  pHomeWin: number;
  pAwayWin: number;
  pHomeCover: number;
  pBlowout: number;
  favoriteTeamId: string | null;
  dogTeamId: string | null;
  quality: "ESTIMATE";
  note: string;
  qb: { home: string; away: string };
  rb: { home: string; away: string };
};

/** Logistic from home spread. ESTIMATE only — not a closing-line model. */
export function gameScript(game: Game): GameScriptView {
  const spread = game.spreadHome.value;
  const total = game.total.value;
  const home = TEAM_BY_ID[game.homeTeamId];
  const away = TEAM_BY_ID[game.awayTeamId];
  if (spread === null) {
    return {
      gameId: game.id,
      pHomeWin: 0.5,
      pAwayWin: 0.5,
      pHomeCover: 0.5,
      pBlowout: 0.12,
      favoriteTeamId: null,
      dogTeamId: null,
      quality: "ESTIMATE",
      note: "Spread DATA UNAVAILABLE. Script is a coin until a DK number exists.",
      qb: { home: "Pass volume UNKNOWN.", away: "Pass volume UNKNOWN." },
      rb: { home: "Rush volume UNKNOWN.", away: "Rush volume UNKNOWN." },
    };
  }
  const homeMargin = -spread;
  const pHomeWin = 1 / (1 + Math.exp(-0.13 * homeMargin));
  const pBlowout = Math.min(0.42, 0.08 + Math.abs(homeMargin) * 0.025);
  const favoriteTeamId = homeMargin > 0 ? game.homeTeamId : homeMargin < 0 ? game.awayTeamId : null;
  const dogTeamId = favoriteTeamId === game.homeTeamId ? game.awayTeamId : favoriteTeamId === game.awayTeamId ? game.homeTeamId : null;
  const favAbbr = favoriteTeamId ? TEAM_BY_ID[favoriteTeamId].abbr : "neither";
  const dogAbbr = dogTeamId ? TEAM_BY_ID[dogTeamId].abbr : "neither";
  const shootout = (total ?? 0) >= 49;
  return {
    gameId: game.id,
    pHomeWin,
    pAwayWin: 1 - pHomeWin,
    pHomeCover: 0.5,
    pBlowout,
    favoriteTeamId,
    dogTeamId,
    quality: "ESTIMATE",
    note: `P(${home.abbr} win) ${(pHomeWin * 100).toFixed(0)}% from DK home spread ${spread}. Total ${total ?? "DATA UNAVAILABLE"}. Not a trained win model.`,
    qb: {
      home:
        favoriteTeamId === game.homeTeamId
          ? `${home.abbr} favorite: fewer trash-time attempts unless ${shootout ? "the 49+ total keeps both QBs alive" : "the game stays one-score"}.`
          : `${home.abbr} dog: trailing script raises pass attempts / checkdowns.`,
      away:
        favoriteTeamId === game.awayTeamId
          ? `${away.abbr} favorite: designed pass still exists; blowout (${(pBlowout * 100).toFixed(0)}%) can sit starters.`
          : `${away.abbr} dog: negative script → more dropbacks, worse rushing efficiency.`,
    },
    rb: {
      home:
        favoriteTeamId === game.homeTeamId
          ? `${home.abbr} favorite: positive script supports designed rush + closer carries. ${favAbbr} volume lean.`
          : `${home.abbr} dog: rush attempts compress; receiving work for the back can rise.`,
      away:
        favoriteTeamId === game.awayTeamId
          ? `${away.abbr} favorite: ${favAbbr} rush environment. ${dogAbbr} backs need pass-game juice.`
          : `${away.abbr} dog: designed rush tax. Pass-down RB is the more honest volume path.`,
    },
  };
}
