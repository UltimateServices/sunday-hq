import { notFound } from "next/navigation";
import { DataStatus } from "@/components/shared/DataStatus";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { PropCard } from "@/components/shared/PropCard";
import { Section } from "@/components/shared/Section";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WhyDrawer } from "@/components/shared/WhyDrawer";
import { EnvScoreTiles } from "@/components/ds/EnvScoreTiles";
import { ScriptBars } from "@/components/ds/ScriptBars";
import { InfoTip } from "@/components/ds/InfoTip";
import { GAMES } from "@/data/week1/games";
import { INJURIES } from "@/data/week1/injuries";
import { NEWS } from "@/data/week1/news";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { getWeekCatalog } from "@/lib/catalog";
import { gameScript } from "@/lib/game-script";
import { formatNumber, formatPct, spreadLabel } from "@/lib/format";
import { MARKET_LABEL, toPropView } from "@/lib/prop-view";
import { derivedTeamTotals, impliedTeamTotals } from "@/lib/team-totals";
import { buildGameDeskRow, gamePlayers, movesForGameDesk } from "@/lib/game-desk";
import { GamePlayerTable } from "@/components/games/GamePlayerTable";
import { GameBestBets } from "@/components/games/GameBestBets";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default async function GameDeepDive({ params }: PageProps<"/games/[gameId]">) {
  const { gameId } = await params;
  const catalog = await getWeekCatalog();
  const game = catalog.games.find((g) => g.id === gameId) ?? GAMES.find((g) => g.id === gameId);
  if (!game) notFound();

  const away = TEAM_BY_ID[game.awayTeamId];
  const home = TEAM_BY_ID[game.homeTeamId];
  const wx = catalog.weather.find((row) => row.gameId === game.id);
  const script = gameScript(game);
  const implied = impliedTeamTotals(game);
  const totals = derivedTeamTotals(catalog.games).filter((row) => row.gameId === game.id);
  const props = catalog.props.filter((p) => p.gameId === game.id).map((p) => toPropView(p));
  const injuries = INJURIES.filter((i) => i.gameId === game.id);
  const news = NEWS.filter((n) => n.gameId === game.id);
  const players = gamePlayers(game);
  const desk = buildGameDeskRow(catalog, game);
  const moves = movesForGameDesk(game.id);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Deep dive"
        title={`${away.city} ${away.name} @ ${home.city} ${home.name}`}
        lede={`${game.kickoffLabel} · ${game.network} · ${game.venue}. Environment scores are ESTIMATE.`}
      />
      <div className="grid gap-2 sm:grid-cols-4">
        <Tile label="Total" value={formatNumber(game.total.value)} note={game.total.note} />
        <Tile label="Spread" value={spreadLabel(home.abbr, game.spreadHome.value)} />
        <Tile label={`${away.abbr} impl.`} value={formatNumber(implied.away)} />
        <Tile label={`${home.abbr} impl.`} value={formatNumber(implied.home)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge tone="blue">{desk.tier.replaceAll("_", " ")}</StatusBadge>
        <DataStatus quality={game.total.quality} />
        <StatusBadge tone={game.indoor ? "green" : "yellow"}>{game.indoor ? "INDOOR" : "OUTDOOR"}</StatusBadge>
      </div>

      <Section title="Environment">
        <EnvScoreTiles scores={desk.env} />
      </Section>

      <Section title="Why this environment">
        <WhyDrawer
          title={`${away.abbr} @ ${home.abbr}`}
          lenses={{
            GOOD_PLAYER: "UNKNOWN",
            GOOD_MATCHUP: desk.tier === "SHOOTOUT" ? "LEAN" : desk.tier === "CAPPED" || desk.tier === "QB_DOWNGRADE" ? "NO" : "UNKNOWN",
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
            "Coverage on /matchups is a script proxy, not a CB rank.",
          ]}
        />
      </Section>

      <Section title="Key factors">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="surface p-4">
            <p className="text-[12px] text-muted">Positive</p>
            <ul className="mt-2 space-y-1 text-[14px] leading-relaxed">
              {desk.positives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="surface p-4">
            <p className="text-[12px] text-muted">Negative</p>
            <ul className="mt-2 space-y-1 text-[14px] leading-relaxed">
              {desk.negatives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
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

      <Section title="Game script">
        <article className="surface p-4">
          <ScriptBars
            homeLabel={home.abbr}
            awayLabel={away.abbr}
            pHomeWin={script.pHomeWin}
            pAwayWin={script.pAwayWin}
            pClose={1 - script.pBlowout}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Tile label={`${home.abbr} P(win)`} value={formatPct(script.pHomeWin)} />
            <Tile label="P(blowout)" value={formatPct(script.pBlowout)} />
            <Tile label="Cover" value="~50% (no vig split)" />
          </div>
          <p className="mt-3 text-sm">{script.note}</p>
          <p className="mt-2 text-sm text-muted">QB home: {script.qb.home}</p>
          <p className="text-sm text-muted">QB away: {script.qb.away}</p>
          <p className="mt-2 text-sm text-muted">RB home: {script.rb.home}</p>
          <p className="text-sm text-muted">RB away: {script.rb.away}</p>
        </article>
      </Section>

      {wx ? (
        <Section title="Weather">
          <article className="rounded-lg border border-line bg-card p-3">
            <div className="mb-2 flex flex-wrap gap-1">
              <StatusBadge tone={wx.impact === "SIGNIFICANT" ? "orange" : "blue"}>{wx.impact}</StatusBadge>
              <DataStatus quality={wx.quality} />
              <StatusBadge tone={wx.roof === "UNKNOWN" ? "yellow" : "blue"}>Roof {wx.roof ?? "UNKNOWN"}</StatusBadge>
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

      <Section title="Players">
        <GamePlayerTable players={players} views={props} />
      </Section>

      <Section title="Best bets">
        <GameBestBets views={props} totals={totals} live={catalog.liveGate.actionable} />
      </Section>

      <Section title="Market movement">
        <p className="mb-2 text-[13px] text-muted">
          <InfoTip term="Market Heat" /> Seed / catalog prints only. Player-prop tape stays DATA UNAVAILABLE.
        </p>
        {moves.length === 0 ? (
          <p className="text-sm text-muted">No stored move for this game.</p>
        ) : (
          <ol className="space-y-2">
            {moves.map((move) => (
              <li key={move.id} className="surface p-3">
                <p className="text-[13px] text-muted">
                  {MARKET_LABEL[move.market] ?? move.market} · {move.heat} · {move.quality}
                </p>
                <p className="num mt-1 text-[18px]">
                  {formatNumber(move.from)} → {formatNumber(move.to)}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{move.note}</p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section title="All props">
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
