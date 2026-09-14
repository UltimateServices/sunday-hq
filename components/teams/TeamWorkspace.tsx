"use client";

import { useState } from "react";
import { GameCard } from "@/components/ds/GameCard";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { HealthBadge } from "@/components/ds/badges";
import { Section } from "@/components/shared/Section";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { PendingPanel } from "@/components/shared/PendingPanel";
import type { Game, HealthState, InjuryRecord, WeatherImpact } from "@/lib/types/domain";
import type { EnvironmentTier, LiveStatus } from "@/lib/types/domain";

const TABS = ["OVERVIEW", "OFFENSE", "DEFENSE", "PACE", "RED ZONE", "INJURIES", "PLAYERS", "MARKETS"] as const;

export function TeamWorkspace({
  teamName,
  abbr,
  game,
  matchup,
  kickoff,
  spread,
  indoor,
  tier,
  weatherImpact,
  live,
  players,
  injuries,
}: {
  teamName: string;
  abbr: string;
  game: Game | null;
  matchup?: string;
  kickoff?: string;
  spread?: string;
  indoor?: boolean;
  tier?: EnvironmentTier;
  weatherImpact?: WeatherImpact;
  live?: LiveStatus;
  players: Array<{
    id: string;
    name: string;
    position: string;
    health: HealthState;
    note?: string;
  }>;
  injuries: InjuryRecord[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("OVERVIEW");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`action-btn ${tab === item ? "text-gold" : ""}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === "OVERVIEW" ? (
        <div className="space-y-6">
          {game && matchup && kickoff && spread && tier && weatherImpact && live ? (
            <GameCard
              id={game.id}
              matchup={matchup}
              kickoff={kickoff}
              total={game.total.value}
              spread={spread}
              indoor={Boolean(indoor)}
              tier={tier}
              weatherImpact={weatherImpact}
              live={live}
            />
          ) : (
            <p className="text-sm text-muted">No Sunday game on this slate.</p>
          )}
          <p className="text-[13px] text-muted">
            {teamName} injury count {injuries.length}. Implied / model team totals beyond the posted game total stay PENDING.
          </p>
        </div>
      ) : null}

      {tab === "PLAYERS" || tab === "OVERVIEW" ? (
        <Section title="Players">
          <div className="grid gap-2 sm:grid-cols-2">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                id={player.id}
                name={player.name}
                team={abbr}
                position={player.position}
                health={player.health}
                note={player.note}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {tab === "INJURIES" ? (
        <Section title="Injuries">
          {injuries.length === 0 ? (
            <p className="text-[14px] text-muted">No stored injury rows for this team.</p>
          ) : (
            <div className="space-y-2">
              {injuries.map((row) => (
                <article key={row.id} className="surface p-4">
                  <HealthBadge state={row.health} />
                  <p className="mt-2 font-semibold">{PLAYER_BY_ID[row.playerId]?.name}</p>
                  <p className="text-[13px] text-muted">{row.headline}</p>
                </article>
              ))}
            </div>
          )}
        </Section>
      ) : null}

      {tab === "OFFENSE" || tab === "DEFENSE" || tab === "PACE" || tab === "RED ZONE" || tab === "MARKETS" ? (
        <PendingPanel
          capability={{
            id: `team-${tab.toLowerCase()}`,
            title: `${tab} tab`,
            phase: 4,
            summary: `${tab} splits are not invented from Week 1 seed. Route stays.`,
            blockedBy: ["No play-by-play store", "No team-level model totals beyond posted DK game lines"],
          }}
        />
      ) : null}
    </div>
  );
}
