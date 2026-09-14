import Link from "next/link";
import { AlertRow } from "@/components/ds/AlertRow";
import { GameCard } from "@/components/ds/GameCard";
import { HealthBadge, StatusChip, ToneChip } from "@/components/ds/badges";
import { ParlayCard } from "@/components/ds/ParlayCard";
import { PropCard } from "@/components/ds/PropCard";
import { RankingTable } from "@/components/ds/RankingTable";
import { Section } from "@/components/shared/Section";
import { StatTile } from "@/components/ds/StatTile";
import { TDCard } from "@/components/ds/TDCard";
import { EmptyState } from "@/components/ds/EmptyState";
import { DataHealthBanner } from "@/components/ds/DataHealthBanner";
import type { CommandCenterVM } from "@/lib/command-center";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { PARLAYS } from "@/data/week1/parlays";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { formatNumber } from "@/lib/format";
import { PrimaryCards } from "./PrimaryCards";
import { Scoreboard } from "./Scoreboard";
import { WhatChanged } from "./WhatChanged";
import { MyCardPreview } from "./MyCardPreview";

export function CommandCenter({ vm }: { vm: CommandCenterVM }) {
  const conservative = PARLAYS.find((p) => p.profile === "Conservative");
  const balanced = PARLAYS.find((p) => p.profile === "Balanced");
  const aggressive = PARLAYS.find((p) => p.profile === "Aggressive");

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <p className="text-[13px] text-muted">Research desk</p>
          <h1 className="mt-1 text-[32px] font-semibold tracking-tight">Command Center</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
            The full Sunday picture. Best picks live on the home page — this is for going deeper.
          </p>
        </div>
        <DataHealthBanner
          state={vm.healthState}
          tape={vm.tape}
          issues={vm.healthIssues}
          liveBanner={vm.liveBanner}
          staleWarning={vm.staleWarning}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          <StatTile label="Week" value={`${vm.stats.week}`} />
          <StatTile label="Season" value={`${vm.stats.season}`} />
          <StatTile label="Slate" value="Sun 9/13" />
          <StatTile label="Updated" value={vm.stats.lastUpdated} />
          <StatTile label="Sunday games" value={`${vm.stats.games}`} />
          <StatTile label="Indoor" value={`${vm.stats.indoor}`} />
          <StatTile label="High total" value={formatNumber(vm.stats.highestTotal)} />
          <StatTile label="Low total" value={formatNumber(vm.stats.lowestTotal)} />
        </div>
      </header>

      <div className="hidden space-y-8 lg:block">
        <PrimaryCards cards={vm.summaryCards} />
        <Section id="critical-news" title="Critical news" lede="Only items that can change a bet.">
          <div className="space-y-2">
            {vm.news.map((item) => (
              <article key={item.id} className="rounded-lg border border-line bg-card p-3">
                <ToneChip tone={item.severity === "CRITICAL" ? "red" : "orange"}>{item.severity}</ToneChip>
                <p className="mt-1 font-semibold">{item.title}</p>
                <p className="text-sm text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </Section>
        <Section id="what-changed" title="What changed" lede="Movement, injuries, and weather since the last pull.">
          <WhatChanged items={vm.changes} />
        </Section>
        <Section id="scoreboard" title="Sunday scoreboard" lede="Environment and weather at a glance.">
          <Scoreboard rows={vm.environments} />
        </Section>
        <Section id="top-opportunities" title="Top opportunities" lede="Ranked by edge. Assumed −110 EV is an estimate, never a DraftKings price.">
          <RankingTable views={vm.opportunities} />
        </Section>
        <Section id="top-volume" title="Top volume" lede="Highest-volume looks, not automatic bets.">
          <RankingTable views={vm.volume} />
        </Section>
        <Section id="td-leaders" title="Touchdown leaders" lede="Anytime TD research leans.">
          <div className="grid gap-2 md:grid-cols-3">
            {vm.tdLeaders.map((view) => (
              <TDCard key={view.id} view={view} />
            ))}
          </div>
        </Section>
        <Section id="weather" title="Weather that matters" lede="Only moderate or significant impact.">
          {vm.weather.length === 0 ? (
            <EmptyState message="NO PLAYS MEET FILTERS" />
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {vm.weather.map((wx) => (
                <Link key={wx.gameId} href={`/games/${wx.gameId}`} className="rounded-lg border border-line bg-card p-3">
                  <StatusChip id="RAIN" />
                  <p className="mt-1 font-semibold">{wx.summary}</p>
                  <p className="text-sm text-muted">{wx.impactNote}</p>
                </Link>
              ))}
            </div>
          )}
        </Section>
        <Section id="injury-board" title="Injuries that matter" lede="Out, questionable, and high-risk only.">
          <div className="space-y-2">
            {vm.injuries.map((inj) => (
              <article key={inj.id} className="rounded-lg border border-line bg-card p-3">
                <div className="mb-1 flex flex-wrap gap-1">
                  <HealthBadge state={inj.health} />
                  {inj.quality === "SOURCE_CONFLICT" ? <StatusChip id="SOURCE_CONFLICT" /> : null}
                </div>
                <Link href={`/players/${inj.playerId}`} className="font-semibold hover:text-gold">
                  {inj.headline}
                </Link>
                <p className="text-sm text-muted">{inj.detail}</p>
                {inj.beneficiaryPlayerIds.length > 0 ? (
                  <p className="mt-1 text-[11px] text-gold">
                    Beneficiary: {inj.beneficiaryPlayerIds.map((id) => PLAYER_BY_ID[id]?.name ?? id).join(", ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </Section>
        <Section id="environments" title="Best environments" lede="Highest totals and cleanest scripts.">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {vm.environmentTop5.map((row) => (
              <GameCard
                key={row.gameId}
                id={row.gameId}
                matchup={row.matchup}
                kickoff={row.kickoff}
                total={row.total}
                spread={row.spread}
                indoor={row.indoor}
                tier={row.tier}
                weatherImpact={row.weatherImpact}
                live={row.live}
                note={row.note}
              />
            ))}
          </div>
        </Section>
        <Section id="overs-unders" title="Overs and unders" lede="Both sides stay first-class.">
          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">Overs</h3>
              <RankingTable views={vm.overs} />
            </div>
            <div>
              <h3 className="mb-2 text-xs tracking-wide text-muted uppercase">Unders</h3>
              <RankingTable views={vm.unders} />
            </div>
          </div>
        </Section>
        <Section id="parlay-preview" title="Parlay preview" lede="Constructs, not tickets.">
          <div className="grid gap-2 md:grid-cols-3">
            <ParlayCard profile="Conservative" construct={conservative} />
            <ParlayCard profile="Balanced" construct={balanced} />
            <ParlayCard profile="Aggressive" construct={aggressive} />
          </div>
        </Section>
        <Section id="my-card-preview" title="Your card" lede="Watching, ready, and placed.">
          <MyCardPreview />
        </Section>
      </div>

      <div className="space-y-8 lg:hidden">
        <Section title="Need to know" lede="Only the alerts that can change a bet.">
          <div className="space-y-2">
            {vm.alerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </div>
        </Section>
        <Section title="Top five" lede="The same ranking as desktop, in cards.">
          <div className="space-y-2">
            {vm.top5.map((view) => (
              <PropCard key={view.id} view={view} compact />
            ))}
          </div>
        </Section>
        <Section title="My Card">
          <MyCardPreview />
        </Section>
        <Section title="TDs">
          <div className="space-y-2">
            {vm.tdLeaders.map((view) => (
              <TDCard key={view.id} view={view} />
            ))}
          </div>
        </Section>
        <Section title="Injuries">
          {vm.injuries.slice(0, 4).map((inj) => (
            <article key={inj.id} className="mb-2 rounded-lg border border-line bg-card p-3">
              <HealthBadge state={inj.health} />
              <p className="mt-1 font-semibold">{inj.headline}</p>
            </article>
          ))}
        </Section>
        <Section title="Weather">
          {vm.weather.map((wx) => (
            <p key={wx.gameId} className="rounded-lg border border-line bg-card p-3 text-sm">
              {wx.summary}
            </p>
          ))}
        </Section>
        <Section title="Games">
          <Scoreboard rows={vm.environments} />
        </Section>
        <Section title="Overs">
          {vm.overs.slice(0, 4).map((view) => (
            <div key={view.id} className="mb-2">
              <PropCard view={view} compact />
            </div>
          ))}
        </Section>
        <Section title="Unders">
          {vm.unders.slice(0, 4).map((view) => (
            <div key={view.id} className="mb-2">
              <PropCard view={view} compact />
            </div>
          ))}
        </Section>
        <Section title="Team Totals">
          <div className="grid grid-cols-2 gap-2">
            {vm.teamTotals.slice(0, 6).map((row) => (
              <Link key={row.id} href={`/games/${row.gameId}`} className="rounded-lg border border-line bg-card p-3">
                <p className="text-xs text-muted">{TEAM_BY_ID[row.teamId].abbr}</p>
                <p className="num text-xl text-gold">{formatNumber(row.line.value)}</p>
              </Link>
            ))}
          </div>
        </Section>
        <Section title="Parlays">
          <ParlayCard profile="Balanced" construct={balanced} />
        </Section>
      </div>
    </div>
  );
}
