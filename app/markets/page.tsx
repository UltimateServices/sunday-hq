import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { MarketMovementBadge, StatusChip } from "@/components/ds/badges";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { formatNumber, spreadLabel } from "@/lib/format";
import { PendingPanel } from "@/components/shared/PendingPanel";
import { pendingForPhase } from "@/lib/pending";

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Market Movement"
        lede="DraftKings-primary game lines. Player-prop tape not ingested. Steam detector PENDING."
      />
      <PendingPanel capability={pendingForPhase(3)!} />
      <div className="space-y-2">
        {GAMES.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
            <div>
              <p className="font-semibold">
                {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
              </p>
              <p className="text-xs text-muted">{spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value)}</p>
              {game.openingTotal ? (
                <div className="mt-1 flex gap-1">
                  <MarketMovementBadge direction="UP" />
                  <StatusChip id="LINE_MOVE" />
                </div>
              ) : null}
            </div>
            <p className="num text-2xl text-gold">{formatNumber(game.total.value)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
