import Link from "next/link";
import { notFound } from "next/navigation";
import { DataStatus } from "@/components/shared/DataStatus";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { PropCard } from "@/components/shared/PropCard";
import { Section } from "@/components/shared/Section";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WhyDrawer } from "@/components/shared/WhyDrawer";
import { GAMES } from "@/data/week1/games";
import { INJURIES } from "@/data/week1/injuries";
import { NEWS } from "@/data/week1/news";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { PROPS } from "@/data/week1/props";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { formatNumber, spreadLabel } from "@/lib/format";
import { toPropView } from "@/lib/prop-view";
import { derivedTeamTotals, environmentFor, impliedTeamTotals } from "@/lib/team-totals";

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default async function GameDeepDive({ params }: PageProps<"/games/[gameId]">) {
  const { gameId } = await params;
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) notFound();

  const away = TEAM_BY_ID[game.awayTeamId];
  const home = TEAM_BY_ID[game.homeTeamId];
  const wx = WEATHER_BY_GAME[game.id];
  const implied = impliedTeamTotals(game);
  const totals = derivedTeamTotals().filter((row) => row.gameId === game.id);
  const props = PROPS.filter((p) => p.gameId === game.id).map((p) => toPropView(p));
  const injuries = INJURIES.filter((i) => i.gameId === game.id);
  const news = NEWS.filter((n) => n.gameId === game.id);
  const players = SUNDAY_PLAYERS.filter((p) => p.teamId === game.awayTeamId || p.teamId === game.homeTeamId);
  const tier = environmentFor(game, {
    qbDowngrade: game.id === "atl-pit",
    weatherRisk: game.id === "cle-jax",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Deep Dive"
        title={`${away.city} ${away.name} @ ${home.city} ${home.name}`}
        lede={`${game.kickoffLabel} · ${game.network} · ${game.venue}. Why drawers stay attached to every prop.`}
      />
      <div className="grid gap-2 sm:grid-cols-4">
        <Tile label="Total" value={formatNumber(game.total.value)} note={game.total.note} />
        <Tile label="Spread" value={spreadLabel(home.abbr, game.spreadHome.value)} />
        <Tile label={`${away.abbr} impl.`} value={formatNumber(implied.away)} />
        <Tile label={`${home.abbr} impl.`} value={formatNumber(implied.home)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge tone="blue">{tier.replaceAll("_", " ")}</StatusBadge>
        <DataStatus quality={game.total.quality} />
        <StatusBadge tone={game.indoor ? "green" : "yellow"}>{game.indoor ? "INDOOR" : "OUTDOOR"}</StatusBadge>
      </div>

      <Section title="Why this environment">
        <WhyDrawer
          title={`${away.abbr} @ ${home.abbr}`}
          lenses={{
            GOOD_PLAYER: "UNKNOWN",
            GOOD_MATCHUP: tier === "SHOOTOUT" ? "LEAN" : tier === "CAPPED" || tier === "QB_DOWNGRADE" ? "NO" : "UNKNOWN",
            GOOD_PROJECTION: "UNKNOWN",
            GOOD_BET: "UNKNOWN",
          }}
          why={[
            `DK total ${game.total.value} (${game.total.source}).`,
            wx?.impactNote ?? "Weather ingest incomplete.",
            ...totals.map((t) => `${TEAM_BY_ID[t.teamId].abbr} implied team total ${t.line.value?.toFixed(1)}.`),
          ]}
          risks={[
            "Game environment is not a parlay ticket.",
            "Matchup engine PENDING — do not invent defensive ranks.",
          ]}
        />
      </Section>

      {news.length > 0 ? (
        <Section title="News">
          <ul className="space-y-2">
            {news.map((item) => (
              <li key={item.id} className="rounded-lg border border-line bg-card p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {wx ? (
        <Section title="Weather">
          <article className="rounded-lg border border-line bg-card p-3">
            <div className="mb-2 flex flex-wrap gap-1">
              <StatusBadge tone={wx.impact === "SIGNIFICANT" ? "orange" : "blue"}>{wx.impact}</StatusBadge>
              <DataStatus quality={wx.quality} />
            </div>
            <p className="font-semibold">{wx.summary}</p>
            <p className="text-sm text-muted">{wx.impactNote}</p>
          </article>
        </Section>
      ) : null}

      <Section title="Injuries">
        {injuries.length === 0 ? (
          <p className="text-sm text-muted">No flagged injuries in the Week 1 seed for this game.</p>
        ) : (
          <div className="space-y-2">
            {injuries.map((inj) => (
              <article key={inj.id} className="rounded-lg border border-line bg-card p-3">
                <HealthBadge state={inj.health} />
                <p className="mt-1 font-semibold">{inj.headline}</p>
                <p className="text-sm text-muted">{inj.detail}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="Players on this slate">
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <Link key={player.id} href={`/players/${player.id}`} className="rounded-md border border-line px-2 py-1 text-sm hover:border-gold/50">
              {player.name} <span className="text-muted">{player.position}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Props">
        {props.length === 0 ? (
          <p className="text-sm text-muted">No seeded props for this game. Board remains; numbers are not invented.</p>
        ) : (
          <div className="grid gap-2 lg:grid-cols-2">
            {props.map((view) => (
              <PropCard key={view.id} view={view} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border border-line bg-card p-3" title={note}>
      <p className="text-[10px] text-muted uppercase">{label}</p>
      <p className="num text-xl text-gold">{value}</p>
    </div>
  );
}
