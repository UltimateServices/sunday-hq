import Link from "next/link";
import { EmptyState } from "@/components/ds/EmptyState";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { MARKET_LABEL, type PropView } from "@/lib/prop-view";
import type { DerivedTeamTotal } from "@/lib/types/domain";

function topSide(views: PropView[], side: "OVER" | "UNDER"): PropView[] {
  return views
    .filter((view) => view.side === side && view.market !== "ANYTIME_TD" && view.confidenceGrade !== "PASS")
    .sort((a, b) => (b.pricing.edge.value ?? -999) - (a.pricing.edge.value ?? -999))
    .slice(0, 3);
}

export function GameBestBets({
  views,
  totals,
  live,
}: {
  views: PropView[];
  totals: DerivedTeamTotal[];
  live: boolean;
}) {
  if (!live) {
    return (
      <EmptyState
        message="Not live — do not bet from this page."
        hint="Best-bet lists stay structured. Seed tickets stay hidden."
      />
    );
  }

  const overs = topSide(views, "OVER");
  const unders = topSide(views, "UNDER");
  const tds = views
    .filter((view) => view.market === "ANYTIME_TD" && view.confidenceGrade !== "PASS")
    .sort((a, b) => (b.model.value ?? 0) - (a.model.value ?? 0))
    .slice(0, 3);
  const teamLean = [...totals].sort((a, b) => (b.line.value ?? 0) - (a.line.value ?? 0))[0];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <List title="Best overs" rows={overs} />
      <List title="Best unders" rows={unders} />
      <List title="TDs" rows={tds} />
      <article className="surface p-4">
        <p className="text-[12px] text-muted">Team total lean</p>
        {teamLean ? (
          <>
            <p className="mt-1 text-[17px] font-semibold">{TEAM_BY_ID[teamLean.teamId]?.abbr}</p>
            <p className="mt-1 text-[13px] text-muted">
              Implied {teamLean.line.value?.toFixed(1)} · {teamLean.line.quality}. Not a listed DK team-total market.
            </p>
          </>
        ) : (
          <p className="mt-2 text-[13px] text-muted">DATA UNAVAILABLE</p>
        )}
      </article>
    </div>
  );
}

function List({ title, rows }: { title: string; rows: PropView[] }) {
  return (
    <article className="surface p-4">
      <p className="text-[12px] text-muted">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13px] text-muted">NO PLAYS CURRENTLY MEET YOUR FILTERS</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.map((view) => (
            <li key={view.id}>
              <Link href={`/players/${view.playerId}`} className="font-semibold hover:text-gold">
                {view.playerName}
              </Link>
              <p className="text-[13px] text-muted">
                {MARKET_LABEL[view.market]} {view.line.value !== null ? `${view.side === "OVER" ? "O" : "U"} ${view.line.value}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
