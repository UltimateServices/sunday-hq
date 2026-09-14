import Link from "next/link";
import type { HealthState, MeasuredNumber } from "@/lib/types/domain";
import { HealthBadge, ProjectionBadge, QualityTierChip } from "./badges";

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "?";
}

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
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-bg-elev text-[13px] font-semibold"
          >
            {initials(name)}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] text-muted">
              {team} · {position}
            </p>
            <p className="mt-0.5 text-[17px] font-semibold tracking-tight">{name}</p>
            <p className="mt-1 text-[11px] text-muted">No photo in seed — initials only.</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <HealthBadge state={health} />
          {projection ? <QualityTierChip quality={projection.quality} /> : <QualityTierChip quality="UNAVAILABLE" />}
        </div>
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
