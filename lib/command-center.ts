import { AVOIDS, CHANGES, NEWS } from "@/data/week1/news";
import { GAMES } from "@/data/week1/games";
import { INJURIES } from "@/data/week1/injuries";
import { WEEK1_META } from "@/data/week1/meta";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER } from "@/data/week1/weather";
import { derivedTeamTotals, environmentFor, impliedTeamTotals } from "@/lib/team-totals";
import { MARKET_LABEL, toPropView, type PropView } from "@/lib/prop-view";
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
};

function rankable(view: PropView): boolean {
  return view.line.value !== null && view.model.value !== null && view.pricing.edge.value !== null;
}

function byEdgeDesc(a: PropView, b: PropView): number {
  return (b.pricing.edge.value ?? -999) - (a.pricing.edge.value ?? -999);
}

export function buildCommandCenter() {
  const views = PROPS.map((p) => toPropView(p));
  const overs = views.filter((v) => v.side === "OVER" && v.market !== "ANYTIME_TD");
  const unders = views.filter((v) => v.side === "UNDER");
  const yardage = views.filter((v) =>
    ["PASS_YDS", "RUSH_YDS", "REC_YDS"].includes(v.market),
  );

  const bestOver = [...overs].filter(rankable).sort(byEdgeDesc)[0];
  const bestUnder = [...unders].filter(rankable).sort(byEdgeDesc)[0];

  const teamTotals = derivedTeamTotals().sort(
    (a, b) => (b.line.value ?? 0) - (a.line.value ?? 0),
  );
  const bestTeamTotal = teamTotals[0];

  const shootout = GAMES.find((g) => g.id === "tb-cin")!;
  const gibbs = views.find((v) => v.playerId === "gibbs" && v.market === "RUSH_YDS");
  const burrow = views.find((v) => v.playerId === "burrow" && v.side === "OVER");

  const summaryCards: SummaryCard[] = [
    {
      id: "best-prop",
      label: "Best Prop",
      value: bestOver
        ? `${bestOver.playerName} ${MARKET_LABEL[bestOver.market]} ${bestOver.side} ${bestOver.line.value}`
        : "DATA UNAVAILABLE",
      sub: bestOver
        ? `Placeholder edge ${bestOver.pricing.edge.value?.toFixed(1)} · EV not a DK price`
        : "No priced over",
      href: bestOver ? `/players/${bestOver.playerId}` : "/props",
      tone: "green",
    },
    {
      id: "best-under",
      label: "Best Under",
      value: bestUnder
        ? `${bestUnder.playerName} ${MARKET_LABEL[bestUnder.market]} U ${bestUnder.line.value}`
        : "DATA UNAVAILABLE",
      sub: bestUnder
        ? `Placeholder edge ${bestUnder.pricing.edge.value?.toFixed(1)} · line quality ${bestUnder.line.quality}`
        : "No priced under",
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
      value: bestTeamTotal
        ? `${TEAM_BY_ID[bestTeamTotal.teamId].abbr} ${bestTeamTotal.line.value?.toFixed(1)}`
        : "DATA UNAVAILABLE",
      sub: "Derived from DK spread + total. Not a listed team-total ticket.",
      href: "/team-totals",
      tone: "yellow",
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
      id: "best-qb",
      label: "Best QB Matchup",
      value: burrow ? "Joe Burrow vs TB" : "DATA UNAVAILABLE",
      sub: "GOOD PLAYER + high total. Matchup engine PENDING. GOOD BET UNKNOWN.",
      href: "/players/burrow",
      tone: "blue",
    },
    {
      id: "best-rb",
      label: "Best RB Matchup",
      value: gibbs ? "Jahmyr Gibbs vs NO" : "DATA UNAVAILABLE",
      sub: "Indoor favorite. Box-count engine PENDING.",
      href: "/players/gibbs",
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

  const environments: EnvironmentRow[] = GAMES.map((game) => {
    const away = TEAM_BY_ID[game.awayTeamId].abbr;
    const home = TEAM_BY_ID[game.homeTeamId].abbr;
    const spread = game.spreadHome.value;
    const spreadText =
      spread === null
        ? "DATA UNAVAILABLE"
        : spread === 0
          ? "PK"
          : spread < 0
            ? `${home} ${spread}`
            : `${away} -${spread}`;
    return {
      gameId: game.id,
      matchup: `${away} @ ${home}`,
      total: game.total.value,
      spread: spreadText,
      indoor: game.indoor,
      tier: environmentFor(game, {
        qbDowngrade: game.id === "atl-pit",
        weatherRisk: game.id === "cle-jax",
      }),
      note:
        game.id === "tb-cin"
          ? "Sunday ceiling"
          : game.id === "nyj-ten"
            ? "Sunday floor (39.5 DK / 38.5 seed opener)"
            : game.id === "cle-jax"
              ? "Heat / storms"
              : game.id === "atl-pit"
                ? "Rush starts"
                : game.indoor
                  ? "Indoor"
                  : "Outdoor · hourly WX PENDING",
    };
  }).sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  const leadersFor = (position: Position) =>
    yardage
      .filter((v) => PLAYER_BY_ID[v.playerId]?.position === position && v.side === "OVER")
      .sort((a, b) => (b.model.value ?? b.line.value ?? 0) - (a.model.value ?? a.line.value ?? 0));

  const volume = views
    .filter((v) => v.volumeTag === "HIGH" && v.market !== "ANYTIME_TD" && v.side === "OVER")
    .sort((a, b) => (b.line.value ?? 0) - (a.line.value ?? 0));

  const movement = [
    {
      id: "mov-ten",
      label: "NYJ @ TEN total",
      detail: "38.5 consensus / owner floor → 39.5 DK (ESPN widget)",
      direction: "UP" as const,
    },
    {
      id: "mov-atl",
      label: "ATL QB",
      detail: "Starter market voided. Rush is the only active QB path.",
      direction: "DOWN" as const,
    },
    {
      id: "mov-lv",
      label: "LV TE",
      detail: "Bowers off the board. Mayer 39.5 consensus opened as residual.",
      direction: "UP" as const,
    },
  ];

  return {
    meta: WEEK1_META,
    stats: {
      week: WEEK1_META.week,
      season: WEEK1_META.season,
      date: WEEK1_META.slateLabel,
      lastUpdated: WEEK1_META.lastUpdatedLabel,
      games: GAMES.length,
      indoor: GAMES.filter((g) => g.indoor).length,
      outdoor: GAMES.filter((g) => !g.indoor).length,
      highestTotal: Math.max(...GAMES.map((g) => g.total.value ?? 0)),
      lowestTotal: Math.min(...GAMES.map((g) => g.total.value ?? 99)),
    },
    summaryCards,
    news: NEWS,
    changes: CHANGES,
    opportunities: [...views].filter(rankable).sort(byEdgeDesc).slice(0, 8),
    volume,
    tdLeaders: views.filter((v) => v.market === "ANYTIME_TD"),
    environments,
    weather: WEATHER,
    injuries: INJURIES,
    leaders: {
      QB: leadersFor("QB"),
      RB: leadersFor("RB"),
      WR: leadersFor("WR"),
      TE: leadersFor("TE"),
    },
    teamTotals,
    overs: overs.filter((v) => v.line.value !== null),
    unders: unders.filter((v) => v.line.value !== null),
    movement,
    avoids: AVOIDS,
    games: GAMES,
    implied: Object.fromEntries(
      GAMES.map((g) => [g.id, impliedTeamTotals(g)]),
    ),
    views,
  };
}

export type CommandCenterVM = ReturnType<typeof buildCommandCenter>;
