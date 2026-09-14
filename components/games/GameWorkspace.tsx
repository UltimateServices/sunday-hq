import Link from "next/link";
import { ConfidenceBadge, ToneChip } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";
import { ScriptBars } from "@/components/ds/ScriptBars";
import { Section } from "@/components/shared/Section";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import type { GameWorkspaceVM } from "@/lib/game-workspace";
import { formatNumber, formatPct, spreadLabel } from "@/lib/format";
import { MARKET_LABEL } from "@/lib/prop-view";
import type { Game } from "@/lib/types/domain";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { GamePlayerTable } from "./GamePlayerTable";

export function GameWorkspace({
  game,
  vm,
}: {
  game: Game;
  vm: GameWorkspaceVM;
}) {
  const { away, home } = vm;
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[13px] text-muted">
          {game.kickoffLabel} · {game.network} · {game.venue}
        </p>
        <h1 className="text-[32px] font-semibold tracking-tight">
          {away.abbr} @ {home.abbr}
        </h1>
        <p className="text-[15px] text-muted">
          {away.city} {away.name} at {home.city} {home.name}
        </p>
        {!vm.live ? (
          <p className="text-[13px] text-muted">Not live. Research layout stays up. Do not bet from this page.</p>
        ) : null}
      </header>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Spread" value={spreadLabel(home.abbr, game.spreadHome.value)} />
        <Stat label="Total" value={formatNumber(game.total.value)} />
        <Stat label={`${away.abbr} implied`} value={formatNumber(vm.implied.away)} />
        <Stat label={`${home.abbr} implied`} value={formatNumber(vm.implied.home)} />
      </div>

      <Section id="env-scores" title="Environment scores" lede="0–100 ESTIMATE from posted total + weather + QB room. Not a trained engine.">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {vm.scores.map((score) => (
            <article key={score.id} className="surface p-4">
              <p className="text-[13px] text-muted">{score.label}</p>
              <p className="num mt-1 text-[28px] font-semibold tracking-tight">{score.score ?? "—"}</p>
              <ToneChip tone="yellow">Estimate</ToneChip>
            </article>
          ))}
        </div>
      </Section>

      <Section id="script" title="Game script" lede={vm.script.note}>
        <article className="surface p-4">
          <ScriptBars
            homeLabel={home.abbr}
            awayLabel={away.abbr}
            pHomeWin={vm.script.pHomeWin}
            pAwayWin={vm.script.pAwayWin}
            pClose={1 - vm.script.pBlowout}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Stat label={`${home.abbr} P(win)`} value={formatPct(vm.script.pHomeWin)} />
            <Stat label={`${away.abbr} P(win)`} value={formatPct(vm.script.pAwayWin)} />
            <Stat label="P(blowout)" value={formatPct(vm.script.pBlowout)} />
          </div>
          <p className="mt-3 text-[14px] text-muted">{vm.script.qb.home}</p>
          <p className="text-[14px] text-muted">{vm.script.qb.away}</p>
          <p className="mt-2 text-[14px] text-muted">{vm.script.rb.home}</p>
          <p className="text-[14px] text-muted">{vm.script.rb.away}</p>
        </article>
      </Section>

      <Section id="factors" title="Key factors">
        <div className="grid gap-2 md:grid-cols-2">
          <FactorList title="Positive" rows={vm.factors.filter((row) => row.side === "POSITIVE")} empty="No positive flags stored." />
          <FactorList title="Negative" rows={vm.factors.filter((row) => row.side === "NEGATIVE")} empty="No negative flags stored." />
        </div>
      </Section>

      {vm.wx ? (
        <Section title="Weather">
          <article className="surface p-4">
            <p className="text-[17px] font-semibold">{vm.wx.summary}</p>
            <p className="mt-1 text-[14px] text-muted">{vm.wx.impactNote}</p>
          </article>
        </Section>
      ) : null}

      <Section id="players" title="Player table" lede="ALL / QB / RB / WR / TE. Usage and tails that are missing stay DATA UNAVAILABLE.">
        <GamePlayerTable rows={vm.players} />
      </Section>

      <Section id="bets" title="Best bets" lede={vm.live ? "Grade then edge, this game only." : "Not live. Seed ranks shown as research stubs — not tickets."}>
        <div className="grid gap-4 xl:grid-cols-2">
          <BetList title="Best overs" rows={vm.overs} live={vm.live} />
          <BetList title="Best unders" rows={vm.unders} live={vm.live} />
          <BetList title="TDs" rows={vm.tds} live={vm.live} />
          <div className="surface p-4">
            <h3 className="text-[15px] font-semibold">Team totals</h3>
            {vm.teamTotals.length === 0 ? (
              <p className="mt-2 text-[13px] text-muted">DATA UNAVAILABLE</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {vm.teamTotals.map((row) => (
                  <li key={row.id} className="flex items-center justify-between text-[14px]">
                    <span>{TEAM_BY_ID[row.teamId].abbr}</span>
                    <span className="num">{formatNumber(row.line.value)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[12px] text-muted">Derived from spread + total. Not a listed DK team-total ticket.</p>
          </div>
        </div>
        <div className="mt-4 surface p-4">
          <h3 className="text-[15px] font-semibold">Parlays</h3>
          {vm.parlays.length === 0 ? (
            <EmptyState message="No same-game construct in seed." hint="Parlay center stays in the menu. We will not invent legs." />
          ) : (
            <ul className="mt-2 space-y-2">
              {vm.parlays.map((row) => (
                <li key={row.id}>
                  <Link href="/parlays" className="text-[15px] font-medium hover:text-gold">
                    {row.title}
                  </Link>
                  <p className="text-[13px] text-muted">
                    {row.profile} · {row.correlation} · {vm.live ? "Research construct" : "Not live"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section id="moves" title="Market movement" lede="Opening vs current from the catalog. Missing player-prop tape stays unlabeled.">
        {vm.moves.length === 0 ? (
          <EmptyState message="No stored moves for this game." />
        ) : (
          <ul className="space-y-2">
            {vm.moves.map((move) => (
              <li key={move.id} className="surface px-4 py-3">
                <p className="text-[15px] font-medium">
                  {move.market.replaceAll("_", " ")} {move.from} → {move.to}
                </p>
                <p className="text-[13px] text-muted">{move.note}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Why this environment">
        <WhyDrawer
          title={`${away.abbr} @ ${home.abbr}`}
          lenses={{
            GOOD_PLAYER: "UNKNOWN",
            GOOD_MATCHUP: "UNKNOWN",
            GOOD_PROJECTION: "UNKNOWN",
            GOOD_BET: "UNKNOWN",
          }}
          sections={{
            modelCase: [`DK total ${game.total.value} (${game.total.quality}). Spread ${spreadLabel(home.abbr, game.spreadHome.value)}.`],
            supporting: vm.factors.filter((row) => row.side === "POSITIVE").map((row) => row.detail),
            risks: vm.factors.filter((row) => row.side === "NEGATIVE").map((row) => row.detail),
            marketContext: [game.total.note ?? "Game line from catalog."],
            dataQuality: ["Week 1 LOW SAMPLE. Environment scores are ESTIMATE proxies."],
          }}
        />
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="num mt-1 text-[24px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function FactorList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: GameWorkspaceVM["factors"];
  empty: string;
}) {
  return (
    <article className="surface p-4">
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13px] text-muted">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.map((row) => (
            <li key={row.id}>
              <p className="text-[14px] font-medium">{row.title}</p>
              <p className="text-[13px] text-muted">{row.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function BetList({
  title,
  rows,
  live,
}: {
  title: string;
  rows: GameWorkspaceVM["overs"];
  live: boolean;
}) {
  return (
    <article className="surface p-4">
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13px] text-muted">NO PLAYS MEET FILTERS</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.map((view) => (
            <li key={view.id} className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/players/${view.playerId}`} className="text-[14px] font-medium hover:text-gold">
                  {view.playerName}
                </Link>
                <p className="text-[13px] text-muted">
                  {MARKET_LABEL[view.market]} {view.side === "OVER" ? "over" : "under"}
                </p>
              </div>
              <div className="text-right">
                <p className={`num text-[16px] font-semibold ${live ? "text-gold" : "text-ink"}`}>
                  {view.side === "OVER" ? "O" : "U"} {view.line.value ?? "—"}
                </p>
                <ConfidenceBadge grade={view.confidenceGrade} />
                {live ? null : <p className="mt-1 text-[11px] text-muted">Not live</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
