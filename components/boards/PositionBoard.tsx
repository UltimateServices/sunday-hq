import { PageHeader } from "@/components/shared/PageHeader";
import { RankingTable } from "@/components/ds/RankingTable";
import { Section } from "@/components/shared/Section";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { injuryForPlayer } from "@/data/week1/injuries";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { TEAM_BY_ID } from "@/data/week1/teams";
import type { PropView } from "@/lib/prop-view";
import type { Position } from "@/lib/types/domain";

export function PositionBoard({
  position,
  title,
  views,
}: {
  position: Position;
  title: string;
  views: PropView[];
}) {
  const players = SUNDAY_PLAYERS.filter((p) => p.position === position);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title={title}
        lede="Position board using shared PlayerCard + RankingTable. Week 1 = LOW SAMPLE."
      />
      <Section title="Roster on Sunday slate">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => {
            const fan = FANTASY_BY_PLAYER[player.id];
            return (
              <PlayerCard
                key={player.id}
                id={player.id}
                name={player.name}
                team={TEAM_BY_ID[player.teamId].abbr}
                position={player.position}
                health={injuryForPlayer(player.id)?.health ?? "NO_KNOWN_LIMITATION"}
                projection={fan?.ppr}
                note={player.notes}
              />
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
    </div>
  );
}
