import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataStatus } from "@/components/shared/DataStatus";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { formatNumber } from "@/lib/format";

export default function GameTotalsPage() {
  const rows = [...GAMES].sort((a, b) => (b.total.value ?? 0) - (a.total.value ?? 0));
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Game Totals"
        lede="Sunday totals from DraftKings via ESPN widget. TB@CIN 50.5 is the ceiling. NYJ@TEN 39.5 is the floor (owner seed cited 38.5 opener)."
      />
      <div className="space-y-2">
        {rows.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
            <div>
              <p className="font-semibold">
                {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
              </p>
              <p className="text-xs text-muted">
                {game.kickoffLabel}
                {game.openingTotal ? ` · opener/consensus ${game.openingTotal.value}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="num text-2xl text-gold">{formatNumber(game.total.value)}</p>
              <DataStatus quality={game.total.quality} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
