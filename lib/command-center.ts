import { AVOIDS, CHANGES, NEWS } from "@/data/week1/news";
import { ALERTS } from "@/data/week1/alerts";
import { GAMES } from "@/data/week1/games";
import { INJURIES } from "@/data/week1/injuries";
import { WEEK1_META } from "@/data/week1/meta";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER } from "@/data/week1/weather";
import type { WeekCatalog } from "@/lib/catalog";
import type { LiveGate } from "@/lib/live-gate";
import { weightRankBoost, type ModelWeights } from "@/lib/weights";
import { derivedTeamTotals, environmentFor, impliedTeamTotals } from "@/lib/team-totals";
import { MARKET_LABEL, toPropView, type PropView } from "@/lib/prop-view";
import { liveStatus } from "@/lib/game-window";
import type { EnvironmentTier, Position } from "@/lib/types/domain";

export type SummaryCard = {
  id: string;
  label: string;
  value: string;
  sub: string;
  href: string;
  tone: "green" | "yellow" | "orange" | "red" | "blue" | "purple";
};

export type EnvironmentRow = {
  gameId: string;
  matchup: string;
  total: number | null;
  spread: string;
  indoor: boolean;
  tier: EnvironmentTier;
  note: string;
  kickoff: string;
  window: "1PM" | "4PM" | "SNF";
  live: ReturnType<typeof liveStatus>;
  weatherImpact: (typeof WEATHER)[number]["impact"];
  weatherSummary: string;
};

function rankable(view: PropView): boolean {
  return view.line.value !== null && view.model.value !== null && view.pricing.edge.value !== null;
}

function byEdgeDesc(a: PropView, b: PropView, weights?: ModelWeights, minEdge = 4): number {
  const boostA = weights
    ? weightRankBoost({
        market: a.market,
        weatherImpact: a.weatherNote.toUpperCase().includes("SIGNIFICANT") ? "SIGNIFICANT" : "NONE",
        health: a.health,
        edgeYards: a.pricing.edge.value,
        weights,
        minEdgeYards: minEdge,
      })
    : 0;
  const boostB = weights
    ? weightRankBoost({
        market: b.market,
        weatherImpact: b.weatherNote.toUpperCase().includes("SIGNIFICANT") ? "SIGNIFICANT" : "NONE",
        health: b.health,
        edgeYards: b.pricing.edge.value,
        weights,
        minEdgeYards: minEdge,
      })
    : 0;
  return (b.pricing.edge.value ?? -999) + boostB * 8 - ((a.pricing.edge.value ?? -999) + boostA * 8);
}

export function buildCommandCenter(
  catalog?: Pick<
    WeekCatalog,
    | "games"
    | "props"
    | "changes"
    | "alerts"
    | "weather"
    | "matchups"
    | "modelWeights"
    | "thresholds"
    | "liveGate"
    | "health"
    | "liveBanner"
    | "staleWarning"
    | "oddsFresh"
  >,
) {
  const liveGate: LiveGate | undefined = catalog?.liveGate;
  const showTickets = liveGate?.actionable ?? false;
  const slate = catalog?.games ?? GAMES;
  const props = showTickets ? (catalog?.props ?? PROPS) : [];
  const views = props.map((p) => toPropView(p));
  const rank = (a: PropView, b: PropView) => byEdgeDesc(a, b, catalog?.modelWeights, catalog?.thresholds.minEdgeYards);
  const overs = views.filter((v) => v.side === "OVER" && v.market !== "ANYTIME_TD");
  const unders = views.filter((v) => v.side === "UNDER");
  const yardage = views.filter((v) => ["PASS_YDS", "RUSH_YDS", "REC_YDS"].includes(v.market));

  const bestOver = [...overs].filter(rankable).sort(rank)[0];
  const bestUnder = [...unders].filter(rankable).sort(rank)[0];
  const teamTotals = derivedTeamTotals(slate).sort((a, b) => (b.line.value ?? 0) - (a.line.value ?? 0));
  const bestTeamTotal = teamTotals[0];
  const shootout = slate.find((g) => g.id === "tb-cin") ?? GAMES.find((g) => g.id === "tb-cin")!;
  const matchups = catalog?.matchups ?? [];
  const bestQbMatch = [...matchups].filter((row) => row.position === "QB").sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];
  const bestRbMatch = [...matchups].filter((row) => row.position === "RB").sort((a, b) => (b.overall.value ?? 0) - (a.overall.value ?? 0))[0];
  const qbPlayer = bestQbMatch ? PLAYER_BY_ID[bestQbMatch.playerId] : null;
  const rbPlayer = bestRbMatch ? PLAYER_BY_ID[bestRbMatch.playerId] : null;

  const offAir = (label: string, href: string, tone: SummaryCard["tone"]): SummaryCard => ({
    id: label.toLowerCase().replaceAll(" ", "-"),
    label,
    value: "Not live",
    sub: "Hidden until fresh DraftKings tape. Do not bet from this page.",
    href,
    tone,
  });

  const summaryCards: SummaryCard[] = !showTickets
    ? [
        offAir("Best Over", "/props", "green"),
        offAir("Best Under", "/props", "blue"),
        offAir("Best TD", "/touchdowns", "purple"),
        offAir("Best Team Total", "/team-totals", "yellow"),
        offAir("Best QB Matchup", "/matchups", "blue"),
        offAir("Best RB Matchup", "/matchups", "green"),
        {
          id: "best-env",
          label: "Best Game Environment",
          value: `TB @ CIN ${shootout.total.value}`,
          sub: "Scoreboard research only — not a ticket.",
          href: "/games/tb-cin",
          tone: "green",
        },
        {
          id: "warning",
          label: "Biggest Warning",
          value: "ATL QB room is OUT / OUT",
          sub: "Rush starts. Do not chase ATL pass. Kamara is SOURCE CONFLICT.",
          href: "/games/atl-pit",
          tone: "red",
        },
      ]
    : [
    {
      id: "best-over",
      label: "Best Over",
      value: bestOver
        ? `${bestOver.playerName} ${MARKET_LABEL[bestOver.market]} O ${bestOver.line.value}`
        : "DATA UNAVAILABLE",
      sub: bestOver ? `Placeholder edge ${bestOver.pricing.edge.value?.toFixed(1)} yd · EV not a DK price` : "No priced over",
      href: bestOver ? `/players/${bestOver.playerId}` : "/props",
      tone: "green",
    },
    {
      id: "best-under",
      label: "Best Under",
      value: bestUnder
        ? `${bestUnder.playerName} ${MARKET_LABEL[bestUnder.market]} U ${bestUnder.line.value}`
        : "DATA UNAVAILABLE",
      sub: bestUnder ? `Placeholder edge ${bestUnder.pricing.edge.value?.toFixed(1)} yd · ${bestUnder.line.quality}` : "No priced under",
      href: bestUnder ? `/players/${bestUnder.playerId}` : "/props",
      tone: "blue",
    },
    {
      id: "best-td",
      label: "Best TD",
      value: "Jahmyr Gibbs ATD",
      sub: "Research lean only — DK anytime odds DATA UNAVAILABLE",
      href: "/touchdowns",
      tone: "purple",
    },
    {
      id: "best-tt",
      label: "Best Team Total",
      value: bestTeamTotal ? `${TEAM_BY_ID[bestTeamTotal.teamId].abbr} ${bestTeamTotal.line.value?.toFixed(1)}` : "DATA UNAVAILABLE",
      sub: "Derived from DK spread + total. Not a listed team-total ticket.",
      href: "/team-totals",
      tone: "yellow",
    },
    {
      id: "best-qb",
      label: "Best QB Matchup",
      value: qbPlayer ? `${qbPlayer.name} (${bestQbMatch?.overall.value ?? "—"})` : "DATA UNAVAILABLE",
      sub: bestQbMatch
        ? `${bestQbMatch.note} GOOD BET stays UNKNOWN without a DK price.`
        : "Matchup engine has no QB row.",
      href: qbPlayer ? `/players/${qbPlayer.id}` : "/matchups",
      tone: "blue",
    },
    {
      id: "best-rb",
      label: "Best RB Matchup",
      value: rbPlayer ? `${rbPlayer.name} (${bestRbMatch?.overall.value ?? "—"})` : "DATA UNAVAILABLE",
      sub: bestRbMatch
        ? `${bestRbMatch.note} OL module is in the grade. Coverage is a script proxy.`
        : "Matchup engine has no RB row.",
      href: rbPlayer ? `/players/${rbPlayer.id}` : "/matchups",
      tone: "green",
    },
    {
      id: "best-env",
      label: "Best Game Environment",
      value: `TB @ CIN ${shootout.total.value}`,
      sub: "Highest Sunday DK total. Shootout ≠ automatic overs.",
      href: "/games/tb-cin",
      tone: "green",
    },
    {
      id: "warning",
      label: "Biggest Warning",
      value: "ATL QB room is OUT / OUT",
      sub: "Rush starts. Do not chase ATL pass. Kamara is SOURCE CONFLICT.",
      href: "/games/atl-pit",
      tone: "red",
    },
  ];

  const environments: EnvironmentRow[] = slate.map((game) => {
    const away = TEAM_BY_ID[game.awayTeamId].abbr;
    const home = TEAM_BY_ID[game.homeTeamId].abbr;
    const spread = game.spreadHome.value;
    const spreadText =
      spread === null ? "DATA UNAVAILABLE" : spread === 0 ? "PK" : spread < 0 ? `${home} ${spread}` : `${away} -${spread}`;
    const wx = (catalog?.weather ?? WEATHER).find((w) => w.gameId === game.id);
    return {
      gameId: game.id,
      matchup: `${away} @ ${home}`,
      total: game.total.value,
      spread: spreadText,
      indoor: game.indoor,
      tier: environmentFor(game, {
        qbDowngrade: game.id === "atl-pit",
        weatherRisk: wx?.impact === "SIGNIFICANT",
      }),
      note:
        game.id === "tb-cin"
          ? "Sunday ceiling"
          : game.id === "nyj-ten"
            ? "Sunday floor (39.5 DK / 38.5 seed opener)"
            : game.id === "atl-pit"
              ? "Rush starts"
              : wx?.indoor || wx?.roof === "FIXED"
                ? "Indoor / fixed roof"
                : wx?.source === "NWS hourly"
                  ? wx.summary
                  : game.indoor
                    ? "Indoor"
                    : (wx?.summary ?? "Outdoor · NWS hourly not stored"),
      kickoff: game.kickoffLabel,
      window: (game.window === "SNF" ? "SNF" : game.window === "LATE" ? "4PM" : "1PM") as EnvironmentRow["window"],
      live: liveStatus(game),
      weatherImpact: wx?.impact ?? "UNKNOWN",
      weatherSummary: wx?.summary ?? "DATA UNAVAILABLE",
    };
  }).sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  const leadersFor = (position: Position) =>
    yardage
      .filter((v) => PLAYER_BY_ID[v.playerId]?.position === position && v.side === "OVER")
      .sort((a, b) => (b.model.value ?? b.line.value ?? 0) - (a.model.value ?? a.line.value ?? 0));

  const volume = views
    .filter((v) => v.volumeTag === "HIGH" && v.market !== "ANYTIME_TD" && v.side === "OVER")
    .sort((a, b) => (b.line.value ?? 0) - (a.line.value ?? 0));

  const criticalNews = NEWS.filter((n) => n.severity === "CRITICAL" || n.severity === "WATCH");
  const materialWeather = (catalog?.weather ?? WEATHER).filter((w) => w.impact === "SIGNIFICANT" || w.impact === "MODERATE");
  const materialInjuries = INJURIES.filter((i) =>
    ["OUT", "QUESTIONABLE", "GAME_TIME_DECISION", "EXPECTED_LIMITED", "HIGH_RISK"].includes(i.health),
  );

  return {
    meta: WEEK1_META,
    stats: {
      week: WEEK1_META.week,
      season: WEEK1_META.season,
      date: WEEK1_META.slateLabel,
      lastUpdated: WEEK1_META.lastUpdatedLabel,
      games: slate.length,
      indoor: slate.filter((g) => g.indoor).length,
      outdoor: slate.filter((g) => !g.indoor).length,
      highestTotal: Math.max(...slate.map((g) => g.total.value ?? 0)),
      lowestTotal: Math.min(...slate.map((g) => g.total.value ?? 99)),
    },
    summaryCards,
    news: criticalNews,
    changes: catalog?.changes ?? CHANGES,
    alerts: (catalog?.alerts ?? ALERTS).filter((a) => a.severity === "CRITICAL" || a.severity === "IMPORTANT"),
    opportunities: [...views].filter(rankable).sort(rank).slice(0, catalog?.thresholds.maxCard ?? 8),
    top5: [...views].filter(rankable).sort(rank).slice(0, 5),
    volume,
    tdLeaders: views.filter((v) => v.market === "ANYTIME_TD"),
    environments,
    environmentTop5: environments.slice(0, 5),
    weather: materialWeather,
    injuries: materialInjuries,
    leaders: {
      QB: leadersFor("QB"),
      RB: leadersFor("RB"),
      WR: leadersFor("WR"),
      TE: leadersFor("TE"),
    },
    teamTotals,
    overs: overs.filter((v) => v.line.value !== null),
    unders: unders.filter((v) => v.line.value !== null),
    avoids: AVOIDS,
    games: slate,
    implied: Object.fromEntries(slate.map((g) => [g.id, impliedTeamTotals(g)])),
    views,
    liveGate,
    healthState: catalog?.health.state ?? "DEGRADED",
    healthIssues: catalog?.health.issues ?? [],
    liveBanner: catalog?.liveBanner,
    staleWarning: catalog?.staleWarning ?? null,
    tape: catalog?.oddsFresh ? ("LIVE" as const) : ("ESTIMATE" as const),
  };
}

export type CommandCenterVM = ReturnType<typeof buildCommandCenter>;
