import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { RankingTable } from "@/components/ds/RankingTable";
import { Section } from "@/components/shared/Section";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { ToneChip } from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { injuryForPlayer } from "@/data/week1/injuries";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { PropView } from "@/lib/prop-view";
import type { MatchupGrade, Position } from "@/lib/types/domain";
import { positionHeroes, rbRole } from "@/lib/position-board";

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
  const players = SUNDAY_PLAYERS.filter((player) => player.position === position);
  const heroes = positionHeroes(position, views, matchups);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title={title}
        lede="Hero cards from seed/catalog ranks. Missing columns stay PENDING. Not a bet slip."
      />
      <Section title="Top cards" lede={live ? "Highest available projection / matchup / edge." : "Not live. Research stubs only."}>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {heroes.map((card) => (
            <Link key={card.id} href={card.href} className="surface block p-4 hover:bg-card-hover">
              <p className="text-[12px] text-muted">{card.label}</p>
              <p className="mt-1 text-[17px] font-semibold tracking-tight">{card.value}</p>
              <p className="mt-1 text-[13px] text-muted">{card.sub}</p>
              {live ? null : <p className="mt-2 text-[11px] text-muted">Not live</p>}
            </Link>
          ))}
        </div>
      </Section>
      <Section title="Roster on Sunday slate">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => {
            const fan = FANTASY_BY_PLAYER[player.id];
            const view = views.find((row) => row.playerId === player.id);
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
                {position === "RB" && view ? (
                  <ToneChip tone={rbRole(view) === "ROLE UNCERTAIN" ? "purple" : "blue"}>{rbRole(view)}</ToneChip>
                ) : null}
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
                    <p className="text-[17px] font-semibold">{views.find((view) => view.playerId === row.playerId)?.playerName ?? row.playerId}</p>
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
      <Section title="Projection / prop board">
        {views.length === 0 ? (
          <p className="text-[14px] text-muted">No live props for this position. Seed lines stay labeled until DraftKings tape is fresh.</p>
        ) : (
          <RankingTable views={views} />
        )}
      </Section>
    </div>
  );
}
