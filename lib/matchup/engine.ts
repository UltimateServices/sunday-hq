import { OL_BY_TEAM } from "@/data/week1/ol";
import { injuryForPlayer, INJURIES } from "@/data/week1/injuries";
import { PLAYER_BY_ID, SUNDAY_PLAYERS } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { gameScript } from "@/lib/game-script";
import { impliedTeamTotals, environmentFor } from "@/lib/team-totals";
import type { ModelWeights } from "@/lib/weights";
import { defaultWeights } from "@/lib/weights";
import type {
  Game,
  HealthState,
  MatchupFactor,
  MatchupGrade,
  Position,
  QualifierGrade,
  WeatherRecord,
} from "@/lib/types/domain";

function clamp(n: number): number {
  return Math.max(0, Math.min(10, n));
}

function healthScore(health: HealthState): number {
  switch (health) {
    case "NO_KNOWN_LIMITATION":
      return 8;
    case "MINOR_CONCERN":
      return 6.5;
    case "QUESTIONABLE":
      return 4;
    case "EXPECTED_LIMITED":
      return 3.5;
    case "GAME_TIME_DECISION":
      return 2;
    case "HIGH_RISK":
      return 1.5;
    case "OUT":
    case "IR_PUP_NFI":
      return 0;
    default:
      return 5;
  }
}

function weatherScore(wx?: WeatherRecord): { score: number; note: string } {
  if (!wx) return { score: 5, note: "Weather DATA UNAVAILABLE." };
  if (wx.indoor || wx.roof === "FIXED" || wx.roof === "CLOSED") {
    return { score: 8, note: `Roof ${wx.roof ?? "FIXED"}. Weather is not the limiter.` };
  }
  if (wx.impact === "SIGNIFICANT") return { score: 2, note: wx.impactNote };
  if (wx.impact === "MODERATE") return { score: 4, note: wx.impactNote };
  if (wx.impact === "MINOR") return { score: 6, note: wx.impactNote };
  if (wx.impact === "NONE") return { score: 8, note: wx.impactNote };
  return { score: 5, note: `${wx.impactNote} Impact UNKNOWN until hourly lands.` };
}

function coverageProxy(position: Position, game: Game, teamId: string): { score: number; note: string } {
  const implied = impliedTeamTotals(game);
  const teamImplied = teamId === game.homeTeamId ? implied.home : implied.away;
  const oppImplied = teamId === game.homeTeamId ? implied.away : implied.home;
  if (teamImplied === null || oppImplied === null) {
    return { score: 5, note: "Coverage rank not invented. Implied totals DATA UNAVAILABLE." };
  }
  if (position === "QB" || position === "WR" || position === "TE") {
    const score = clamp(5 + (teamImplied - 22) * 0.35);
    return {
      score,
      note: `Not a CB/PFF grade. Script proxy from implied team total ${teamImplied.toFixed(1)} vs opp ${oppImplied.toFixed(1)}.`,
    };
  }
  const score = clamp(5 + (teamImplied - 22) * 0.25);
  return {
    score,
    note: `Box-count engine not claimed. Rush environment proxy from implied ${teamImplied.toFixed(1)}.`,
  };
}

export function buildMatchupGrades(
  games: Game[],
  weather: WeatherRecord[],
  weights: ModelWeights = defaultWeights(),
): MatchupGrade[] {
  const wxByGame = Object.fromEntries(weather.map((row) => [row.gameId, row]));
  const grades: MatchupGrade[] = [];

  for (const player of SUNDAY_PLAYERS) {
    if (!["QB", "RB", "WR", "TE"].includes(player.position)) continue;
    const game = games.find((g) => g.awayTeamId === player.teamId || g.homeTeamId === player.teamId);
    if (!game) continue;
    const inj = injuryForPlayer(player.id);
    const health = inj?.health ?? "NO_KNOWN_LIMITATION";
    const qbInjury = INJURIES.find(
      (row) =>
        row.gameId === game.id &&
        PLAYER_BY_ID[row.playerId]?.position === "QB" &&
        PLAYER_BY_ID[row.playerId]?.teamId === player.teamId,
    );
    const env = environmentFor(game, {
      qbDowngrade: game.id === "atl-pit" || qbInjury?.health === "OUT",
      weatherRisk: wxByGame[game.id]?.impact === "SIGNIFICANT",
    });
    const implied = impliedTeamTotals(game);
    const teamImplied = player.teamId === game.homeTeamId ? implied.home : implied.away;
    const script = gameScript(game);
    const ol = OL_BY_TEAM[player.teamId];
    const wx = weatherScore(wxByGame[game.id]);
    const cover = coverageProxy(player.position, game, player.teamId);
    const volume = teamImplied === null ? 5 : clamp(4 + (teamImplied - 20) * 0.4);
    const pace = game.total.value === null ? 5 : clamp((game.total.value - 36) * 0.55);
    const avail = healthScore(health);
    const olScore = ol ? clamp(ol.grade + (player.position === "QB" ? ol.qbImpact : player.position === "RB" ? ol.rbImpact : 0)) : 5;

    const w = weights;
    const overallRaw =
      (player.position === "QB" ? w.pass : player.position === "RB" ? w.rush : w.rec) * 10 * (volume / 10) +
      w.td * 10 * (pace / 10) +
      w.weather * 10 * (wx.score / 10) +
      w.availability * 10 * (avail / 10) +
      0.12 * olScore +
      0.1 * cover.score;
    const overall = health === "OUT" || health === "IR_PUP_NFI" ? 0 : clamp(overallRaw);

    const factors: MatchupFactor[] = [
      { id: "coverage", label: "Coverage / script proxy", score: cover.score, quality: "ESTIMATE", note: cover.note },
      { id: "volume", label: "Volume", score: volume, quality: teamImplied === null ? "UNAVAILABLE" : "CONSENSUS", note: `Implied team total ${teamImplied?.toFixed(1) ?? "DATA UNAVAILABLE"}.` },
      { id: "env", label: "Environment", score: env === "SHOOTOUT" ? 8.5 : env === "CAPPED" || env === "QB_DOWNGRADE" ? 2.5 : env === "WEATHER_RISK" ? 3 : 5.5, quality: "ESTIMATE", note: `${env.replaceAll("_", " ")}. ${script.note}` },
      { id: "weather", label: "Weather", score: wx.score, quality: wxByGame[game.id]?.quality ?? "UNAVAILABLE", note: wx.note },
      { id: "injury", label: "Injury context", score: avail, quality: inj?.quality ?? "CONSENSUS", note: inj?.detail ?? "NO KNOWN LIMITATION (not “healthy”)." },
      { id: "ol", label: "OL starters", score: ol ? olScore : null, quality: ol?.quality ?? "UNAVAILABLE", note: ol?.note ?? "OL unit not in the Week 1 desk." },
    ];

    const goodPlayer: QualifierGrade = health === "OUT" ? "NO" : player.position === "QB" && env === "QB_DOWNGRADE" ? "NO" : "LEAN";
    const goodMatchup: QualifierGrade = overall >= 6.8 ? "YES" : overall <= 3.5 ? "NO" : "LEAN";

    grades.push({
      id: `mu-live-${player.id}`,
      playerId: player.id,
      gameId: game.id,
      position: player.position as Position,
      panel: "MID",
      overall: {
        value: Number(overall.toFixed(1)),
        quality: "ESTIMATE",
        source: "sunday-hq-matchup-engine",
        asOf: game.total.asOf,
        note: "Weighted ESTIMATE from script, volume, weather, injury, OL. Not a coverage rank.",
      },
      factors,
      lenses: {
        GOOD_PLAYER: goodPlayer,
        GOOD_MATCHUP: goodMatchup,
        GOOD_PROJECTION: "LEAN",
        GOOD_BET: "UNKNOWN",
      },
      why: {
        modelCase: [
          `${player.name} ${player.position} vs ${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}.`,
          `Overall ${overall.toFixed(1)} using admin weights (pass ${w.pass}, rush ${w.rush}, rec ${w.rec}, wx ${w.weather}, avail ${w.availability}).`,
        ],
        supporting: [cover.note, ol?.note ?? "OL UNAVAILABLE", script.note],
        risks: [
          "Coverage number is a script proxy — not a CB grade.",
          "Week 1 LOW SAMPLE. GOOD BET stays UNKNOWN without a DK price.",
        ],
        marketContext: [`DK total ${game.total.value ?? "DATA UNAVAILABLE"}.`],
        dataQuality: ["Engine uses seed + live overlays. Factors stay labeled."],
      },
      note: `${env.replaceAll("_", " ")} · OL ${ol ? ol.grade.toFixed(1) : "n/a"} · weather ${wxByGame[game.id]?.impact ?? "UNKNOWN"}`,
    });
  }

  const byPos = new Map<Position, MatchupGrade[]>();
  for (const grade of grades) {
    const list = byPos.get(grade.position) ?? [];
    list.push(grade);
    byPos.set(grade.position, list);
  }
  for (const list of byPos.values()) {
    list.sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0));
    if (list[0]) list[0].panel = "BEST";
    if (list.length > 1) list[list.length - 1].panel = "WORST";
    const mid = list.filter((row) => row.panel === "MID").sort((a, b) => (a.overall.value ?? 0) - (b.overall.value ?? 0));
    if (mid[0] && list.filter((row) => row.panel === "WORST").length === 0) mid[0].panel = "WORST";
  }

  return grades.sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0));
}

export function matchupForPlayer(grades: MatchupGrade[], playerId: string): MatchupGrade | undefined {
  return grades.find((row) => row.playerId === playerId);
}
