import Link from "next/link";
import { StubRoute } from "@/components/shared/StubRoute";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";

export default function MatchupsPage() {
  return (
    <StubRoute
      title="Matchups"
      phase={4}
      readiness="PENDING"
      lede="Empty board on purpose. Phase 4 matchup engine will grade coverage, pace, pressure, and box count. Week 1 sample is LOW SAMPLE even after it ships."
    >
      <div className="grid gap-2 md:grid-cols-2">
        {GAMES.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="rounded-lg border border-dashed border-line bg-card/50 p-3">
            <p className="font-semibold">
              {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
            </p>
            <p className="text-sm text-muted">Matchup features: DATA UNAVAILABLE · engine PENDING</p>
          </Link>
        ))}
      </div>
    </StubRoute>
  );
}
