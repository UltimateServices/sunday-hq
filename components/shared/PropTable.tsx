import Link from "next/link";
import { DataStatus } from "./DataStatus";
import { HealthBadge } from "./HealthBadge";
import { WhyDrawer } from "./WhyDrawer";
import { MARKET_LABEL, type PropView } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";

export function PropTable({ views }: { views: PropView[] }) {
  if (views.length === 0) {
    return <p className="text-sm text-muted">DATA UNAVAILABLE for this board.</p>;
  }

  return (
    <>
      <div className="space-y-2 md:hidden">
        {views.map((view) => (
          <div key={view.id} className="rounded-lg border border-line bg-card p-3">
            <p className="text-sm font-semibold">
              {view.playerName} · {MARKET_LABEL[view.market]} {view.side}
            </p>
            <p className="num text-lg text-gold">{formatMeasured(view.line)}</p>
            <p className="text-[11px] text-muted">
              Model {formatMeasured(view.model)} · EV {formatMeasured(view.pricing.ev, 3, "signed")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <DataStatus quality={view.line.quality} />
              <HealthBadge state={view.health} />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
          <thead className="text-[10px] tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              {[
                "Player",
                "Market",
                "Book",
                "Line",
                "Odds",
                "Model",
                "Median",
                "Edge",
                "Model Prob",
                "Implied",
                "EV",
                "Conf",
                "Matchup",
                "Health",
                "Wx",
                "Move",
                "Why",
                "Risks",
              ].map((h) => (
                <th key={h} className="px-2 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {views.map((view) => (
              <tr key={view.id} className="border-b border-line/70 hover:bg-card-hover">
                <td className="px-2 py-2">
                  <Link href={`/players/${view.playerId}`} className="font-semibold text-ink hover:text-gold">
                    {view.playerName}
                  </Link>
                  <div className="text-[10px] text-muted">{view.teamAbbr}</div>
                </td>
                <td className="px-2 py-2">
                  {MARKET_LABEL[view.market]} {view.side === "OVER" ? "O" : "U"}
                </td>
                <td className="px-2 py-2">{view.bookLabel}</td>
                <td className="num px-2 py-2 text-gold">{formatMeasured(view.line)}</td>
                <td className="num px-2 py-2">{formatMeasured(view.oddsAmerican, 0, "american")}</td>
                <td className="num px-2 py-2">{formatMeasured(view.model)}</td>
                <td className="num px-2 py-2">{formatMeasured(view.median)}</td>
                <td className="num px-2 py-2">{formatMeasured(view.pricing.edge, 1, "signed")}</td>
                <td className="num px-2 py-2">{formatMeasured(view.pricing.modelProb, 1, "pct")}</td>
                <td className="num px-2 py-2">{formatMeasured(view.pricing.impliedProb, 1, "pct")}</td>
                <td className="num px-2 py-2">{formatMeasured(view.pricing.ev, 3, "signed")}</td>
                <td className="px-2 py-2">
                  <DataStatus quality={view.confidence.quality} />
                </td>
                <td className="px-2 py-2">{view.matchup}</td>
                <td className="px-2 py-2">
                  <HealthBadge state={view.health} />
                </td>
                <td className="max-w-[140px] px-2 py-2 text-muted">{view.weatherNote}</td>
                <td className="max-w-[140px] px-2 py-2 text-muted">{view.movement.note}</td>
                <td className="px-2 py-2">
                  <WhyDrawer
                    title={`${view.playerName} ${MARKET_LABEL[view.market]}`}
                    lenses={view.lenses}
                    why={view.why}
                    risks={view.risks}
                  />
                </td>
                <td className="max-w-[180px] px-2 py-2 text-muted">{view.risks[0] ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
