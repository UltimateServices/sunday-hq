import { PageHeader } from "@/components/shared/PageHeader";
import { PropTable } from "@/components/shared/PropTable";
import { Section } from "@/components/shared/Section";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { injuryForPlayer } from "@/data/week1/injuries";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { DataStatus } from "@/components/shared/DataStatus";
import { formatMeasured } from "@/lib/format";
import type { PropView } from "@/lib/prop-view";
import type { Position } from "@/lib/types/domain";
import Link from "next/link";

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
        readiness="PLACEHOLDER"
        lede="Phase 2 projection board. Placeholder model only. DK player-prop odds are not ingested. Week 1 = LOW SAMPLE."
      />
      <Section title="Roster on Sunday slate">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {players.map((player) => {
            const inj = injuryForPlayer(player.id);
            const fan = FANTASY_BY_PLAYER[player.id];
            return (
              <Link key={player.id} href={`/players/${player.id}`} className="rounded-lg border border-line bg-card p-3">
                <p className="font-semibold">{player.name}</p>
                <p className="text-[11px] text-muted">{player.notes ?? "Research subject"}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <HealthBadge state={inj?.health ?? "NO_KNOWN_LIMITATION"} />
                  {fan ? <DataStatus quality={fan.ppr.quality} /> : null}
                </div>
                {fan ? (
                  <p className="num mt-2 text-sm text-gold">PPR {formatMeasured(fan.ppr)}</p>
                ) : (
                  <p className="mt-2 text-[11px] text-muted">Fantasy placeholder DATA UNAVAILABLE</p>
                )}
              </Link>
            );
          })}
        </div>
      </Section>
      <Section title="Projection / prop board">
        <PropTable views={views} />
      </Section>
    </div>
  );
}
