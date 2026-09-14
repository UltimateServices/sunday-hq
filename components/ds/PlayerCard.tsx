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
    <Link href={`/players/${id}`} className="surface block p-4 transition-colors hover:bg-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted">
            {team} · {position}
          </p>
          <p className="mt-0.5 text-[17px] font-semibold tracking-tight">{name}</p>
        </div>
        <HealthBadge state={health} />
      </div>
      {projection ? (
        <div className="mt-3">
          <p className="text-[12px] text-muted">Projection</p>
          <ProjectionBadge value={projection} />
        </div>
      ) : null}
      {note ? <p className="mt-3 text-[13px] leading-relaxed text-muted">{note}</p> : null}
    </Link>
  );
}
