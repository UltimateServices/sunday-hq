import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataStatus } from "@/components/shared/DataStatus";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { INJURIES } from "@/data/week1/injuries";
import { PLAYER_BY_ID } from "@/data/week1/players";

export default function InjuriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Injuries"
        lede="Exact health vocabulary only. Never 100% healthy. SOURCE CONFLICT is a first-class state."
      />
      <div className="space-y-2">
        {INJURIES.map((inj) => (
          <article key={inj.id} className="rounded-lg border border-line bg-card p-4">
            <div className="mb-2 flex flex-wrap gap-2">
              <HealthBadge state={inj.health} />
              <DataStatus quality={inj.quality} />
            </div>
            <Link href={`/players/${inj.playerId}`} className="text-lg font-semibold hover:text-gold">
              {PLAYER_BY_ID[inj.playerId]?.name} — {inj.bodyPart}
            </Link>
            <p className="mt-1 font-medium">{inj.headline}</p>
            <p className="text-sm text-muted">{inj.detail}</p>
            <p className="mt-2 text-[11px] text-muted">Sources: {inj.sources.join(" · ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
