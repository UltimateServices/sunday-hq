"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { GameCard } from "@/components/ds/GameCard";
import { Section } from "@/components/shared/Section";
import { GAMES } from "@/data/week1/games";
import { INJURIES, injuryForPlayer } from "@/data/week1/injuries";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { TEAMS, TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { environmentFor, impliedTeamTotals } from "@/lib/team-totals";
import { liveStatus } from "@/lib/game-window";
import { formatNumber, spreadLabel } from "@/lib/format";
import { HealthBadge } from "@/components/shared/HealthBadge";

const TABS = ["Overview", "Players", "Injuries"] as const;

export default function TeamDeepDive({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = use(params);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const team = TEAMS.find((t) => t.id === teamId);
  if (!team) notFound();
  const game = GAMES.find((g) => g.awayTeamId === teamId || g.homeTeamId === teamId);
  const players = SUNDAY_PLAYERS.filter((p) => p.teamId === teamId);
  const wx = game ? WEATHER_BY_GAME[game.id] : undefined;
  const implied = game ? impliedTeamTotals(game) : { home: null, away: null };
  const teamImplied = game ? (teamId === game.homeTeamId ? implied.home : implied.away) : null;
  const injuries = INJURIES.filter((row) => row.teamId === teamId);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Deep dive"
        title={`${team.city} ${team.name}`}
        lede={`${team.abbr} · ${team.conference} ${team.division}. Implied total is derived from the posted spread + total.`}
      />
      <div className="grid gap-2 sm:grid-cols-3">
        <article className="surface p-4">
          <p className="text-[12px] text-muted">Implied total</p>
          <p className="num mt-1 text-[26px] font-semibold text-gold">{formatNumber(teamImplied)}</p>
        </article>
        <article className="surface p-4">
          <p className="text-[12px] text-muted">Injury flags</p>
          <p className="num mt-1 text-[26px] font-semibold">{injuries.length}</p>
        </article>
        <article className="surface p-4">
          <p className="text-[12px] text-muted">Environment</p>
          <p className="mt-1 text-[16px] font-semibold">
            {game
              ? environmentFor(game, { qbDowngrade: game.id === "atl-pit", weatherRisk: game.id === "cle-jax" }).replaceAll("_", " ")
              : "DATA UNAVAILABLE"}
          </p>
        </article>
      </div>
      <div className="flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`action-btn ${tab === item ? "text-gold" : ""}`}>
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" ? (
        game ? (
          <GameCard
            id={game.id}
            matchup={`${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}`}
            kickoff={game.kickoffLabel}
            total={game.total.value}
            spread={spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value)}
            indoor={game.indoor}
            tier={environmentFor(game, {
              qbDowngrade: game.id === "atl-pit",
              weatherRisk: game.id === "cle-jax",
            })}
            weatherImpact={wx?.impact ?? "UNKNOWN"}
            live={liveStatus(game)}
            injuryCount={injuries.length}
          />
        ) : (
          <p className="text-sm text-muted">No Sunday game on this slate.</p>
        )
      ) : null}
      {tab === "Players" ? (
        <Section title="Players">
          <div className="grid gap-2 sm:grid-cols-2">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                id={player.id}
                name={player.name}
                team={team.abbr}
                position={player.position}
                health={injuryForPlayer(player.id)?.health ?? "NO_KNOWN_LIMITATION"}
                note={player.notes}
              />
            ))}
          </div>
        </Section>
      ) : null}
      {tab === "Injuries" ? (
        <Section title="Injuries">
          {injuries.length === 0 ? (
            <p className="text-sm text-muted">No flagged injuries for this club in the Week 1 seed.</p>
          ) : (
            <div className="space-y-2">
              {injuries.map((inj) => (
                <article key={inj.id} className="surface p-4">
                  <HealthBadge state={inj.health} />
                  <p className="mt-2 font-semibold">{inj.headline}</p>
                  <p className="text-sm text-muted">{inj.detail}</p>
                </article>
              ))}
            </div>
          )}
        </Section>
      ) : null}
      <p className="text-xs text-muted">
        <Link href="/games" className="text-info hover:underline">
          All games
        </Link>
      </p>
    </div>
  );
}
