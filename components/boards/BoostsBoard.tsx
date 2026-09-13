"use client";

import { useMemo, useState } from "react";
import { BOOSTS } from "@/data/week1/boosts";
import { EmptyState } from "@/components/ds/EmptyState";
import { EVBadge, ToneChip } from "@/components/ds/badges";
import { formatPct } from "@/lib/format";

export function BoostsBoard() {
  const [boostPct, setBoostPct] = useState(25);
  const [minOdds, setMinOdds] = useState(-110);
  const [legs, setLegs] = useState(2);
  const [market, setMarket] = useState("ALL");

  const offers = useMemo(() => {
    return BOOSTS.filter((b) => {
      if (b.boostPct !== boostPct) return false;
      if (b.minLegs > legs) return false;
      if (market !== "ALL" && !b.markets.some((m) => m.toLowerCase().includes(market.toLowerCase()))) return false;
      return true;
    });
  }, [boostPct, legs, market]);

  return (
    <div className="space-y-4">
      <form className="grid gap-2 rounded-lg border border-line bg-card p-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Boost %</span>
          <select value={boostPct} onChange={(e) => setBoostPct(Number(e.target.value))} className="w-full rounded-md border border-line bg-bg-elev px-2 py-1.5 text-sm">
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Min odds (American)</span>
          <input
            value={minOdds}
            onChange={(e) => setMinOdds(Number(e.target.value))}
            className="w-full rounded-md border border-line bg-bg-elev px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Legs</span>
          <select value={legs} onChange={(e) => setLegs(Number(e.target.value))} className="w-full rounded-md border border-line bg-bg-elev px-2 py-1.5 text-sm">
            <option value={2}>2+</option>
            <option value={3}>3+</option>
          </select>
        </label>
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Markets</span>
          <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full rounded-md border border-line bg-bg-elev px-2 py-1.5 text-sm">
            <option value="ALL">ALL</option>
            <option value="SGP">SGP</option>
            <option value="TD">TD</option>
            <option value="cross">Cross-game</option>
          </select>
        </label>
      </form>
      <p className="text-xs text-muted">
        Filter is seed inventory, not a live DK boost feed. Min odds {minOdds} is applied as a research gate only.
      </p>
      {offers.length === 0 ? (
        <EmptyState />
      ) : (
        offers.map((offer) => (
          <section key={offer.id} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">{offer.label}</h2>
              <ToneChip tone="purple">{offer.quality}</ToneChip>
            </div>
            {offer.candidates
              .filter((c) => c.minOdds >= minOdds || minOdds <= 0)
              .map((c) => (
                <article key={c.id} className="rounded-lg border border-line bg-card p-3">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-xs text-muted">{c.legs.join(" · ")}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-md border border-line bg-bg-elev p-2">
                      <p className="text-[10px] text-muted uppercase">Normal EV</p>
                      <EVBadge value={c.normalEv.value} />
                      <p className="mt-1 text-[11px] text-muted">{c.normalEv.note}</p>
                    </div>
                    <div className="rounded-md border border-gold/30 bg-bg-elev p-2">
                      <p className="text-[10px] text-muted uppercase">Boosted EV · {offer.boostPct}%</p>
                      <EVBadge value={c.boostedEv.value} />
                      <p className="mt-1 text-[11px] text-muted">{c.boostedEv.note}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{c.note}</p>
                  <p className="mt-1 text-[11px] text-muted">Min odds {c.minOdds > 0 ? `+${c.minOdds}` : c.minOdds} · {formatPct(c.boostedEv.value)} boosted illustration</p>
                </article>
              ))}
          </section>
        ))
      )}
    </div>
  );
}
