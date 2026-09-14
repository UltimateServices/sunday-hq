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
import { FocusTrap } from "@/components/ds/FocusTrap";
import { PositionTable } from "@/components/boards/PositionTable";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { injuryForPlayer } from "@/data/week1/injuries";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { heroesFor } from "@/lib/position-heroes";
import { rbRoleFor } from "@/lib/rb-roles";
import { positionTableRows } from "@/lib/position-board";
import type { PropView } from "@/lib/prop-view";
import type { MatchupGrade, Position } from "@/lib/types/domain";

export function PositionBoard({
  position,
  title,
  views,
  matchups = [],
  live = false,
}: {
  position: Position;
  title: string;
  views: PropView[];
  matchups?: MatchupGrade[];
  live?: boolean;
}) {
  const players = SUNDAY_PLAYERS.filter((p) => p.position === position);
  const heroes = heroesFor(position, views, matchups);
  const tableRows = positionTableRows(position, views, matchups);
  const [drawerPlayer, setDrawerPlayer] = useState<string | null>(null);
  const drawerGrade = matchups.find((row) => row.playerId === drawerPlayer);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Research board"
        title={title}
        lede="Top cards from seeded projections and script-proxy matchups. Coverage grades are not CB ranks. Missing attempts / snaps stay PENDING."
      />
      {heroes.length > 0 ? (
        <Section title="Top cards" lede={live ? "Highest available projection / matchup / edge." : "Not live. Research stubs only."}>
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
                  {live ? null : <p className="mt-2 text-[11px] text-muted">Not live</p>}
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
      {position === "WR" ? (
        <Section title="WR matchup drawer" lede="Coverage type / CB / slot stay PENDING. Score is a script proxy, not a CB rank.">
          {matchups.filter((row) => row.position === "WR").length === 0 ? (
            <p className="text-[14px] text-muted">No WR matchup rows. Drawer stays. Grades are not invented.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {matchups
                .filter((row) => row.position === "WR")
                .slice(0, 4)
                .map((row) => (
                  <article key={row.id} className="surface p-4">
                    <p className="text-[17px] font-semibold">
                      {views.find((view) => view.playerId === row.playerId)?.playerName ?? row.playerId}
                    </p>
                    <p className="num mt-1 text-[22px]">{row.overall.value}</p>
                    <p className="text-[13px] text-muted">{row.note}</p>
                    <p className="mt-2 text-[12px] text-muted">Coverage / man-zone / safety help: PENDING</p>
                    <div className="mt-3">
                      <WhyDrawer title="WR matchup" lenses={row.lenses} sections={row.why} />
                    </div>
                  </article>
                ))}
            </div>
          )}
        </Section>
      ) : null}
      <Section title="Position table" lede="Bible columns. Attempts, snaps, air yards, and coverage ranks stay PENDING when the seed has no number.">
        <div className="space-y-2 md:hidden">
          {tableRows.map((row) => (
            <Link key={row.playerId} href={row.href} className="surface block p-4">
              <p className="text-[17px] font-semibold">{row.playerName}</p>
              <p className="text-[13px] text-muted">
                {row.teamAbbr} · {row.opponent}
              </p>
              <p className="mt-2 text-[13px] text-muted">
                {row.cells
                  .filter((cell) => !cell.pending)
                  .slice(0, 3)
                  .map((cell) => `${cell.label} ${cell.value}`)
                  .join(" · ") || "PENDING columns only"}
              </p>
            </Link>
          ))}
        </div>
        <PositionTable position={position} rows={tableRows} />
      </Section>
      <Section title="Projection / prop board">
        {views.length === 0 ? (
          <p className="text-[14px] text-muted">No live props for this position. Seed lines stay labeled until DraftKings tape is fresh.</p>
        ) : (
          <RankingTable views={views} />
        )}
      </Section>
      {drawerGrade && drawerPlayer ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal>
          <FocusTrap onEscape={() => setDrawerPlayer(null)} className="w-full max-w-lg">
            <div className="surface w-full p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[15px] font-semibold">Detail · script proxy</p>
                <button type="button" className="text-sm text-muted" onClick={() => setDrawerPlayer(null)}>
                  Close
                </button>
              </div>
              <p className="text-[13px] text-muted">{drawerGrade.note}</p>
              <p className="mt-2 text-[12px] text-muted">
                SUMMARY / PROPS / GAME LOG / MARKET live on the player desk. This drawer is matchup factors only — not a coverage rank.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {drawerGrade.factors.map((factor) => (
                  <div key={factor.id} className="rounded-md border border-line bg-bg-elev p-2">
                    <p className="text-[10px] text-muted uppercase">{factor.label}</p>
                    <p className="num text-sm">{factor.score ?? "—"}</p>
                    <p className="text-[11px] text-muted">{factor.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <WhyDrawer title="Matchup why" lenses={drawerGrade.lenses} sections={drawerGrade.why} />
                <Link href={`/players/${drawerPlayer}`} className="action-btn">
                  Open player desk
                </Link>
              </div>
            </div>
          </FocusTrap>
        </div>
      ) : null}
      {position === "WR" && matchups.length === 0 ? (
        <EmptyState message="Coverage drawer needs a stored matchup grade." hint="Engine is a script proxy, not PFF." />
      ) : null}
    </div>
  );
}
