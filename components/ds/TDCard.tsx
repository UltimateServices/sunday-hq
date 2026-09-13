import type { PropView } from "@/lib/prop-view";
import { HealthBadge, ConfidenceBadge } from "./badges";
import { WhyDrawer } from "./WhyDrawer";
import Link from "next/link";

export function TDCard({ view }: { view: PropView }) {
  return (
    <article className="rounded-lg border border-line bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/players/${view.playerId}`} className="font-semibold hover:text-gold">
          {view.playerName}
        </Link>
        <HealthBadge state={view.health} />
      </div>
      <p className="text-[11px] text-muted">{view.matchup} · {view.tdRole ?? "UNKNOWN role"}</p>
      <p className="mt-2 text-xs text-muted">Anytime price DATA UNAVAILABLE. Research name only.</p>
      <div className="mt-2 flex items-center justify-between">
        <ConfidenceBadge grade={view.confidenceGrade} />
        <WhyDrawer title={`${view.playerName} ATD`} lenses={view.lenses} sections={view.whySections} />
      </div>
    </article>
  );
}
