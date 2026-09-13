import { AVOIDS, CHANGES, NEWS } from "./news";
import { FANTASY } from "./fantasy";
import { GAME_BY_ID, GAMES } from "./games";
import { INJURIES, injuryForPlayer } from "./injuries";
import { WEEK1_META } from "./meta";
import { PLAYER_BY_ID, PLAYERS, SUNDAY_PLAYERS } from "./players";
import { PROPS } from "./props";
import { TEAM_BY_ID, TEAMS } from "./teams";
import { WEATHER, WEATHER_BY_GAME } from "./weather";

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
};

export {
  AVOIDS,
  CHANGES,
  FANTASY,
  GAMES,
  GAME_BY_ID,
  INJURIES,
  NEWS,
  PLAYER_BY_ID,
  PLAYERS,
  PROPS,
  SUNDAY_PLAYERS,
  TEAM_BY_ID,
  TEAMS,
  WEATHER,
  WEATHER_BY_GAME,
  WEEK1_META,
  injuryForPlayer,
};
