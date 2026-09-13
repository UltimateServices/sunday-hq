import Link from "next/link";
import type { HealthState, MeasuredNumber } from "@/lib/types/domain";
import { HealthBadge, ProjectionBadge } from "./badges";

export function PlayerCard({
  id,
  name,
  team,
  position,
  health,
  projection,
  note,
}: {
  id: string;
  name: string;
  team: string;
  position: string;
  health: HealthState;
  projection?: MeasuredNumber;
  note?: string;
}) {
  return (
    <Link href={`/players/${id}`} className="block rounded-lg border border-line bg-card p-3 hover:border-gold/40">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] text-muted">
            {team} · {position}
          </p>
          <p className="font-semibold">{name}</p>
        </div>
        <HealthBadge state={health} />
      </div>
      {projection ? (
        <div className="mt-2">
          <p className="text-[9px] tracking-wide text-muted uppercase">Projection</p>
          <ProjectionBadge value={projection} />
        </div>
      ) : null}
      {note ? <p className="mt-2 text-[11px] text-muted">{note}</p> : null}
    </Link>
  );
}
