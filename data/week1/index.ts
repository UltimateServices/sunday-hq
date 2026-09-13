import { AVOIDS, CHANGES, NEWS } from "./news";
import { FANTASY } from "./fantasy";
import { GAME_BY_ID, GAMES } from "./games";
import { INJURIES, injuryForPlayer } from "./injuries";
import { WEEK1_META } from "./meta";
import { PLAYER_BY_ID, PLAYERS, SUNDAY_PLAYERS } from "./players";
import { PROPS } from "./props";
import { TEAM_BY_ID, TEAMS } from "./teams";
import { WEATHER, WEATHER_BY_GAME } from "./weather";
import { ALERTS } from "./alerts";
import { MATCHUPS } from "./matchups";
import { MARKET_MOVES } from "./market-moves";
import { SEED_CARD } from "./card";
import { PARLAYS } from "./parlays";
import { BOOSTS } from "./boosts";
import { RESULTS } from "./results";

export const week1 = {
  meta: WEEK1_META,
  teams: TEAMS,
  teamById: TEAM_BY_ID,
  games: GAMES,
  gameById: GAME_BY_ID,
  players: SUNDAY_PLAYERS,
  allPlayers: PLAYERS,
  playerById: PLAYER_BY_ID,
  injuries: INJURIES,
  injuryForPlayer,
  weather: WEATHER,
  weatherByGame: WEATHER_BY_GAME,
  props: PROPS,
  news: NEWS,
  changes: CHANGES,
  avoids: AVOIDS,
  fantasy: FANTASY,
  alerts: ALERTS,
  matchups: MATCHUPS,
  marketMoves: MARKET_MOVES,
  card: SEED_CARD,
  parlays: PARLAYS,
  boosts: BOOSTS,
  results: RESULTS,
};

export {
  AVOIDS,
  ALERTS,
  BOOSTS,
  CHANGES,
  FANTASY,
  GAMES,
  GAME_BY_ID,
  INJURIES,
  MARKET_MOVES,
  MATCHUPS,
  NEWS,
  PARLAYS,
  PLAYER_BY_ID,
  PLAYERS,
  PROPS,
  RESULTS,
  SEED_CARD,
  SUNDAY_PLAYERS,
  TEAM_BY_ID,
  TEAMS,
  WEATHER,
  WEATHER_BY_GAME,
  WEEK1_META,
  injuryForPlayer,
};
