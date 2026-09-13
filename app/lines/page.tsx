import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataStatus } from "@/components/shared/DataStatus";
import { GAMES } from "@/data/week1/games";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { formatNumber, spreadLabel } from "@/lib/format";

export default function LinesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Lines"
        lede="DraftKings-primary game lines captured via ESPN widget. Player-prop DK odds are not on this board — see Props (PENDING engine)."
      />
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[10px] tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              <th className="py-2">Game</th>
              <th>Spread</th>
              <th>Total</th>
              <th>Open / consensus</th>
              <th>Quality</th>
            </tr>
          </thead>
          <tbody>
            {GAMES.map((game) => (
              <tr key={game.id} className="border-b border-line/70">
                <td className="py-2">
                  <Link href={`/games/${game.id}`} className="hover:text-gold">
                    {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
                  </Link>
                </td>
                <td className="num">{spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value)}</td>
                <td className="num text-gold">{formatNumber(game.total.value)}</td>
                <td className="num">{game.openingTotal ? formatNumber(game.openingTotal.value) : "—"}</td>
                <td>
                  <DataStatus quality={game.total.quality} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 md:hidden">
        {GAMES.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="block rounded-lg border border-line bg-card p-3">
            <p className="font-semibold">
              {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
            </p>
            <p className="num text-gold">{formatNumber(game.total.value)}</p>
            <p className="text-xs text-muted">{spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
