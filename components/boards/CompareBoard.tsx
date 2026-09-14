"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PropMarket } from "@/lib/types/domain";
import { toPropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { BOOK_LABEL, bestBookQuote } from "@/lib/books";
import { formatMeasured, formatNumber } from "@/lib/format";
import { ConfidenceBadge, EdgeBadge } from "@/components/ds/badges";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { EmptyState } from "@/components/ds/EmptyState";
import Link from "next/link";

export function CompareBoard({ props, selectedIds }: { props: PropMarket[]; selectedIds: string[] }) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(selectedIds);
  const views = useMemo(() => props.map((prop) => toPropView(prop)), [props]);
  const selected = ids.map((id) => views.find((view) => view.id === id)).filter(Boolean);

  function toggle(id: string) {
    const next = ids.includes(id) ? ids.filter((row) => row !== id) : ids.length >= 4 ? ids : [...ids, id];
    setIds(next);
    router.replace(next.length ? `/compare?mode=props&ids=${next.join(",")}` : "/compare?mode=props");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => toggle(view.id)}
            className={`action-btn ${ids.includes(view.id) ? "border-gold/60 text-gold" : ""}`}
          >
            {view.playerName} {MARKET_LABEL[view.market]} {view.side === "OVER" ? "O" : "U"}
          </button>
        ))}
      </div>
      {selected.length < 2 ? (
        <EmptyState message="Pick 2–4 props. Same player across markets is allowed." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="text-[10px] tracking-wide text-muted uppercase">
              <tr className="border-b border-line">
                <th className="px-2 py-2">Field</th>
                {selected.map((view) => (
                  <th key={view!.id} className="px-2 py-2">
                    <Link href={`/players/${view!.playerId}`} className="hover:text-gold">
                      {view!.playerName}
                    </Link>
                    <p className="font-normal text-muted">
                      {MARKET_LABEL[view!.market]} {view!.side === "OVER" ? "O" : "U"}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Posted line" cells={selected.map((v) => formatMeasured(v!.line))} />
              <Row
                label="Line quality"
                cells={selected.map((v) => `${v!.bookLabel} · ${v!.line.quality.replaceAll("_", " ")} · not assumed to be DK`)}
              />
              <Row label="DraftKings odds" cells={selected.map((v) => formatMeasured(v!.oddsAmerican, 0, "american"))} />
              <Row label="Model / mean" cells={selected.map((v) => formatMeasured(v!.distribution.mean))} />
              <Row label="P(side) ESTIMATE" cells={selected.map((v) => formatMeasured(v!.pricing.modelProb, 1, "pct"))} />
              <Row
                label="Implied P / EV"
                cells={selected.map((v) =>
                  v!.oddsAmerican.value === null
                    ? "DATA UNAVAILABLE at DK · assumed −110 EV is ESTIMATE ranking only"
                    : `${formatMeasured(v!.pricing.impliedProb, 1, "pct")} / ${formatMeasured(v!.pricing.ev, 1, "pct")}`,
                )}
              />
              <Row
                label="Floor / med / ceil"
                cells={selected.map(
                  (v) =>
                    `${formatNumber(v!.distribution.floor.value)} / ${formatNumber(v!.distribution.median.value)} / ${formatNumber(v!.distribution.ceiling.value)}`,
                )}
              />
              <tr className="border-b border-line/70">
                <td className="px-2 py-2 text-muted">Edge</td>
                {selected.map((v) => (
                  <td key={v!.id} className="px-2 py-2">
                    <EdgeBadge value={v!.pricing.edge.value} unit={v!.market.includes("TD") ? "prob" : "yards"} />
                  </td>
                ))}
              </tr>
              <tr className="border-b border-line/70">
                <td className="px-2 py-2 text-muted">Conf</td>
                {selected.map((v) => (
                  <td key={v!.id} className="px-2 py-2">
                    <ConfidenceBadge grade={v!.confidenceGrade} />
                  </td>
                ))}
              </tr>
              <Row
                label="Best other book"
                cells={selected.map((v) => {
                  const best = bestBookQuote(v!.books ?? [], v!.side);
                  return best
                    ? `${BOOK_LABEL[best.book]} ${formatMeasured(best.line)} / ${formatMeasured(best.oddsAmerican, 0, "american")}`
                    : "DATA UNAVAILABLE";
                })}
              />
              <tr className="border-b border-line/70">
                <td className="px-2 py-2 text-muted">Why</td>
                {selected.map((v) => (
                  <td key={v!.id} className="px-2 py-2">
                    <WhyDrawer title={`${v!.playerName} ${MARKET_LABEL[v!.market]}`} lenses={v!.lenses} sections={v!.whySections} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-b border-line/70">
      <td className="px-2 py-2 text-muted">{label}</td>
      {cells.map((cell, i) => (
        <td key={`${label}-${i}`} className="num px-2 py-2">
          {cell}
        </td>
      ))}
    </tr>
  );
}
