import Link from "next/link";
import type { PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import { ConfidenceBadge, EdgeBadge, HealthBadge, ToneChip } from "./badges";
import { WhyDrawer } from "./WhyDrawer";
import { BOOK_LABEL, bestBookQuote } from "@/lib/books";
import { PropActions } from "./PropActions";
import { oneLineWhy } from "@/lib/copy";

export function PropCard({ view, compact = false }: { view: PropView; compact?: boolean }) {
  const bestOther = bestBookQuote(view.books ?? [], view.side);
  const what = `${MARKET_LABEL[view.market]} ${view.side === "OVER" ? "over" : "under"}`;
  const oddsMissing = view.oddsAmerican.value === null;

  return (
    <article className="surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/players/${view.playerId}`} className="text-[17px] font-semibold tracking-tight hover:text-gold">
            {view.playerName}
          </Link>
          <p className="mt-0.5 text-[13px] text-muted">
            {what}
            <span className="text-ink/40"> · </span>
            {view.teamAbbr} · {view.matchup}
          </p>
        </div>
        <p className="num shrink-0 text-[24px] font-semibold tracking-tight text-gold">
          {view.side === "OVER" ? "O" : "U"} {formatMeasured(view.line)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <HealthBadge state={view.health} />
        <ConfidenceBadge grade={view.confidenceGrade} />
        <EdgeBadge value={view.pricing.edge.value} unit={view.market.includes("TD") ? "prob" : "yards"} />
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-ink/90">{oneLineWhy(view.whySections.modelCase, view.matchupNote)}</p>
      <p className="mt-1 text-[13px] text-muted">
        {oddsMissing ? "DraftKings price not available." : `DraftKings ${formatMeasured(view.oddsAmerican, 0, "american")}.`}
      </p>

      {!compact && view.books && view.books.length > 1 ? (
        <p className="mt-2 text-[12px] text-muted">
          {view.books.map((quote, index) => {
            const isDk = quote.book === "DRAFTKINGS";
            const isBest = bestOther?.book === quote.book;
            return (
              <span key={`${quote.book}-${index}`} className={isBest ? "text-gold" : undefined}>
                {index ? " · " : ""}
                {isDk ? "DraftKings" : BOOK_LABEL[quote.book]} {formatMeasured(quote.line)} /{" "}
                {formatMeasured(quote.oddsAmerican, 0, "american")}
                {isBest ? " · best other" : ""}
              </span>
            );
          })}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <PropActions view={view} />
        <WhyDrawer title={`${view.playerName} ${what}`} lenses={view.lenses} sections={view.whySections} />
      </div>
      {oddsMissing && !compact ? (
        <p className="mt-2 text-[12px] text-muted">
          <ToneChip tone="yellow">Estimate</ToneChip>
          <span className="ml-2">EV at assumed −110 is for ranking only.</span>
        </p>
      ) : null}
    </article>
  );
}
