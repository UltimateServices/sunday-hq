import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataStatus } from "@/components/shared/DataStatus";
import { FANTASY } from "@/data/week1/fantasy";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { formatMeasured } from "@/lib/format";

export default function FantasyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Fantasy"
        readiness="PLACEHOLDER"
        lede="Phase 2 placeholder points. Not a hosted ranking service. Week 1 LOW SAMPLE. A startable fantasy player is not automatically a GOOD BET."
      />
      <div className="grid gap-2 md:grid-cols-2">
        {FANTASY.map((row) => {
          const player = PLAYER_BY_ID[row.playerId];
          return (
            <Link key={row.playerId} href={`/players/${row.playerId}`} className="rounded-lg border border-line bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{player?.name}</p>
                  <p className="text-sm text-muted">{row.note}</p>
                </div>
                <DataStatus quality={row.ppr.quality} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <dt className="text-muted">PPR</dt>
                  <dd className="num text-lg text-gold">{formatMeasured(row.ppr)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Half</dt>
                  <dd className="num text-lg">{formatMeasured(row.halfPpr)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Std</dt>
                  <dd className="num text-lg">{formatMeasured(row.standard)}</dd>
                </div>
              </dl>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
