import Link from "next/link";
import { DataStatus } from "@/components/shared/DataStatus";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { PendingPanel } from "@/components/shared/PendingPanel";
import { PropCard } from "@/components/shared/PropCard";
import { PropTable } from "@/components/shared/PropTable";
import { Section } from "@/components/shared/Section";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { CommandCenterVM } from "@/lib/command-center";
import { pendingForPhase } from "@/lib/pending";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { formatNumber } from "@/lib/format";
import type { StatusTone } from "@/lib/health";

const TIER_TONE: Record<string, StatusTone> = {
  SHOOTOUT: "green",
  NEUTRAL: "blue",
  CAPPED: "yellow",
  WEATHER_RISK: "orange",
  QB_DOWNGRADE: "red",
};

export function CommandCenter({ vm }: { vm: CommandCenterVM }) {
  const boostPending = pendingForPhase(5)!;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Layer 1 · Command Center</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sunday HQ</h1>
        <p className="max-w-3xl text-sm text-muted">{vm.meta.seedNote}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          <Stat label="Week" value={`${vm.stats.week}`} />
          <Stat label="Season" value={`${vm.stats.season}`} />
          <Stat label="Slate" value="Sun 9/13" />
          <Stat label="Updated" value={vm.stats.lastUpdated} />
          <Stat label="Sunday games" value={`${vm.stats.games}`} />
          <Stat label="Indoor" value={`${vm.stats.indoor}`} />
          <Stat label="High total" value={formatNumber(vm.stats.highestTotal)} />
          <Stat label="Low total" value={formatNumber(vm.stats.lowestTotal)} />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {vm.summaryCards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="rounded-lg border border-line bg-card p-3 hover:border-gold/40"
          >
            <p className="text-[10px] tracking-[0.14em] text-muted uppercase">{card.label}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{card.value}</p>
            <p className="mt-1 text-[11px] text-muted">{card.sub}</p>
            <div className="mt-2">
              <StatusBadge tone={card.tone}>{card.label}</StatusBadge>
            </div>
          </Link>
        ))}
      </div>

      <Section id="critical-news" eyebrow="01" title="Critical news">
        <ul className="space-y-2">
          {vm.news.map((item) => (
            <li key={item.id} className="rounded-lg border border-line bg-card p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <StatusBadge tone={item.severity === "CRITICAL" ? "red" : item.severity === "WATCH" ? "orange" : "blue"}>
                  {item.severity}
                </StatusBadge>
                <DataStatus quality={item.quality} />
              </div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="what-changed" eyebrow="02" title="What Changed">
        <div className="grid gap-2 md:grid-cols-2">
          {vm.changes.map((item) => (
            <article key={item.id} className="rounded-lg border border-line bg-card p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <DataStatus quality={item.quality} />
              </div>
              <p className="text-xs text-muted">
                {item.from} → {item.to}
              </p>
              <p className="mt-1 text-sm">{item.implication}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="top-opportunities" eyebrow="03" title="Top Opportunities">
        <p className="text-xs text-muted">
          Ranked by placeholder model edge. EV uses assumed -110 only when DK odds are missing — never shown as a
          verified DraftKings price.
        </p>
        <div className="grid gap-2 lg:grid-cols-2">
          {vm.opportunities.map((view) => (
            <PropCard key={view.id} view={view} />
          ))}
        </div>
      </Section>

      <Section id="top-volume" eyebrow="04" title="Top Volume">
        <PropTable views={vm.volume} />
      </Section>

      <Section id="td-leaders" eyebrow="05" title="TD Leaders">
        <p className="text-xs text-muted">Anytime prices are DATA UNAVAILABLE. These are research names, not tickets.</p>
        <PropTable views={vm.tdLeaders} />
      </Section>

      <Section id="environments" eyebrow="06" title="Game Environments">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {vm.environments.map((row) => (
            <Link key={row.gameId} href={`/games/${row.gameId}`} className="rounded-lg border border-line bg-card p-3 hover:border-gold/40">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{row.matchup}</p>
                <p className="num text-xl text-gold">{formatNumber(row.total)}</p>
              </div>
              <p className="text-xs text-muted">{row.spread} · {row.indoor ? "Indoor" : "Outdoor"}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <StatusBadge tone={TIER_TONE[row.tier]}>{row.tier.replaceAll("_", " ")}</StatusBadge>
              </div>
              <p className="mt-2 text-[11px] text-muted">{row.note}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="weather" eyebrow="07" title="Weather">
        <div className="grid gap-2 md:grid-cols-2">
          {vm.weather.map((wx) => (
            <Link key={wx.gameId} href={`/games/${wx.gameId}`} className="rounded-lg border border-line bg-card p-3">
              <div className="mb-1 flex flex-wrap gap-1">
                <StatusBadge tone={wx.impact === "SIGNIFICANT" ? "orange" : wx.impact === "NONE" ? "green" : "purple"}>
                  {wx.impact}
                </StatusBadge>
                <DataStatus quality={wx.quality} />
              </div>
              <p className="font-semibold">{wx.summary}</p>
              <p className="text-sm text-muted">{wx.impactNote}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="injury-board" eyebrow="08" title="Injury Board">
        <div className="space-y-2">
          {vm.injuries.map((inj) => (
            <article key={inj.id} className="rounded-lg border border-line bg-card p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <HealthBadge state={inj.health} />
                <DataStatus quality={inj.quality} />
              </div>
              <Link href={`/players/${inj.playerId}`} className="font-semibold hover:text-gold">
                {inj.headline}
              </Link>
              <p className="text-sm text-muted">{inj.detail}</p>
              {inj.beneficiaryPlayerIds.length > 0 ? (
                <p className="mt-1 text-[11px] text-gold">
                  Beneficiary:{" "}
                  {inj.beneficiaryPlayerIds
                    .map((id) => PLAYER_BY_ID[id]?.name ?? id)
                    .join(", ")}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      {(["QB", "RB", "WR", "TE"] as const).map((pos, idx) => (
        <Section key={pos} id={`${pos.toLowerCase()}-leaders`} eyebrow={String(9 + idx).padStart(2, "0")} title={`${pos} leaders`}>
          <PropTable views={vm.leaders[pos]} />
        </Section>
      ))}

      <Section id="team-totals" eyebrow="13" title="Team Totals">
        <p className="text-xs text-muted">Implied from verified DK spread + total. Not a listed DK team-total ticket.</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
          {vm.teamTotals.map((row) => (
            <Link key={row.id} href={`/games/${row.gameId}`} className="rounded-lg border border-line bg-card p-3">
              <p className="text-[10px] text-muted">{row.note}</p>
              <p className="text-sm font-semibold">{TEAM_BY_ID[row.teamId].abbr}</p>
              <p className="num text-2xl text-gold">{formatNumber(row.line.value)}</p>
              <StatusBadge tone={TIER_TONE[row.environment]}>{row.environment.replaceAll("_", " ")}</StatusBadge>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="prop-overs" eyebrow="14" title="Prop Overs">
        <PropTable views={vm.overs} />
      </Section>

      <Section id="prop-unders" eyebrow="15" title="Prop Unders">
        <p className="text-xs text-muted">Unders are first-class. No over bias in ranking.</p>
        <PropTable views={vm.unders} />
      </Section>

      <Section id="market-movement" eyebrow="16" title="Market Movement">
        <ul className="space-y-2">
          {vm.movement.map((item) => (
            <li key={item.id} className="rounded-lg border border-line bg-card p-3">
              <StatusBadge tone={item.direction === "UP" ? "yellow" : "orange"}>{item.direction}</StatusBadge>
              <p className="mt-1 font-semibold">{item.label}</p>
              <p className="text-sm text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="best-boost" eyebrow="17" title="Best Boost">
        <PendingPanel capability={boostPending} />
      </Section>

      <Section id="parlays" eyebrow="18" title="Parlays">
        <PendingPanel capability={boostPending} />
      </Section>

      <Section id="avoid" eyebrow="19" title="Avoid">
        <div className="grid gap-2 md:grid-cols-2">
          {vm.avoids.map((item) => (
            <Link key={item.id} href={item.href} className="rounded-lg border border-bad/30 bg-bad/5 p-3">
              <StatusBadge tone="red">{item.severity}</StatusBadge>
              <p className="mt-1 font-semibold">{item.title}</p>
              <p className="text-sm text-muted">{item.reason}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="my-card" eyebrow="20" title="My Card">
        <PendingPanel capability={boostPending} />
        <p className="text-xs text-muted">
          Unit rule (binding when this ships): no loss chasing and no unit inflation after early games.
        </p>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-card px-2 py-2">
      <p className="text-[9px] tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="num text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
