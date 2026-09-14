"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { RankingTable } from "@/components/ds/RankingTable";
import { Section } from "@/components/shared/Section";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { RoleBadge } from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { EmptyState } from "@/components/ds/EmptyState";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { injuryForPlayer } from "@/data/week1/injuries";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { heroesFor } from "@/lib/position-heroes";
import { rbRoleFor } from "@/lib/rb-roles";
import type { PropView } from "@/lib/prop-view";
import type { MatchupGrade, Position } from "@/lib/types/domain";

export function PositionBoard({
  position,
  title,
  views,
  matchups = [],
}: {
  position: Position;
  title: string;
  views: PropView[];
  matchups?: MatchupGrade[];
}) {
  const players = SUNDAY_PLAYERS.filter((p) => p.position === position);
  const heroes = heroesFor(position, views, matchups);
  const [drawerPlayer, setDrawerPlayer] = useState<string | null>(null);
  const drawerGrade = matchups.find((row) => row.playerId === drawerPlayer);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Research board"
        title={title}
        lede="Top cards from seeded projections and script-proxy matchups. Coverage grades are not CB ranks."
      />
      {heroes.length > 0 ? (
        <Section title="Top cards">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {heroes.map((hero) =>
              hero.href === "#" ? (
                <article key={hero.id} className="surface p-4">
                  <p className="text-[12px] text-muted">{hero.label}</p>
                  <p className="mt-1 text-[16px] font-semibold">{hero.who}</p>
                  <p className="mt-2 text-[13px] text-muted">{hero.detail}</p>
                </article>
              ) : (
                <Link key={hero.id} href={hero.href} className="surface block p-4 hover:bg-card-hover">
                  <p className="text-[12px] text-muted">{hero.label}</p>
                  <p className="mt-1 text-[16px] font-semibold tracking-tight">{hero.who}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{hero.detail}</p>
                </Link>
              ),
            )}
          </div>
        </Section>
      ) : null}
      <Section title="Roster on Sunday slate">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => {
            const fan = FANTASY_BY_PLAYER[player.id];
            const role = player.position === "RB" ? rbRoleFor(player) : null;
            const grade = matchups.find((row) => row.playerId === player.id);
            return (
              <div key={player.id} className="space-y-2">
                <PlayerCard
                  id={player.id}
                  name={player.name}
                  team={TEAM_BY_ID[player.teamId].abbr}
                  position={player.position}
                  health={injuryForPlayer(player.id)?.health ?? "NO_KNOWN_LIMITATION"}
                  projection={fan?.ppr}
                  note={player.notes}
                />
                <div className="flex flex-wrap gap-1.5">
                  {role ? <RoleBadge role={role} /> : null}
                  {grade ? (
                    <button type="button" className="action-btn" onClick={() => setDrawerPlayer(player.id)}>
                      Matchup
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <Section title="Projection / prop board">
        {views.length === 0 ? (
          <p className="text-sm text-muted">No live props for this position. Seed lines stay hidden until DraftKings tape is fresh.</p>
        ) : (
          <RankingTable views={views} />
        )}
      </Section>
      {drawerGrade ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal>
          <div className="surface w-full max-w-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-semibold">Matchup · script proxy</p>
              <button type="button" className="text-sm text-muted" onClick={() => setDrawerPlayer(null)}>
                Close
              </button>
            </div>
            <p className="text-[13px] text-muted">{drawerGrade.note}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {drawerGrade.factors.map((factor) => (
                <div key={factor.id} className="rounded-md border border-line bg-bg-elev p-2">
                  <p className="text-[10px] text-muted uppercase">{factor.label}</p>
                  <p className="num text-sm">{factor.score ?? "—"}</p>
                  <p className="text-[11px] text-muted">{factor.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <WhyDrawer title="Matchup why" lenses={drawerGrade.lenses} sections={drawerGrade.why} />
            </div>
          </div>
        </div>
      ) : null}
      {position === "WR" && matchups.length === 0 ? (
        <EmptyState message="Coverage drawer needs a stored matchup grade." hint="Engine is a script proxy, not PFF." />
      ) : null}
    </div>
  );
}
