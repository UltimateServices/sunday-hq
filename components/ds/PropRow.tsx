"use client";

import Link from "next/link";
import { useState } from "react";
import type { PropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { formatMeasured } from "@/lib/format";
import {
  ConfidenceBadge,
  EdgeBadge,
  EVBadge,
  HealthBadge,
  MarketMovementBadge,
  ProjectionBadge,
} from "./badges";
import { WhyDrawer } from "./WhyDrawer";
import { PropActions } from "./PropActions";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { WeatherBadge } from "./badges";

export function PropRow({ view }: { view: PropView }) {
  const [open, setOpen] = useState(false);
  const wx = WEATHER_BY_GAME[view.gameId];

  return (
    <>
      <tr className="border-b border-line/70 hover:bg-card-hover">
        <td className="px-2 py-2">
          <button type="button" onClick={() => setOpen((v) => !v)} className="mr-1 text-muted">
            {open ? "▾" : "▸"}
          </button>
          <Link href={`/players/${view.playerId}`} className="font-semibold hover:text-gold">
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
        <td className="px-2 py-2">
          <ProjectionBadge value={view.model} />
        </td>
        <td className="px-2 py-2">
          <EdgeBadge value={view.pricing.edge.value} unit="yards" />
        </td>
        <td className="num px-2 py-2">{formatMeasured(view.pricing.modelProb, 1, "pct")}</td>
        <td className="px-2 py-2">
          <EVBadge value={view.pricing.ev.value} />
        </td>
        <td className="px-2 py-2">
          <ConfidenceBadge grade={view.confidenceGrade} />
        </td>
        <td className="px-2 py-2">{view.matchup}</td>
        <td className="px-2 py-2">
          <HealthBadge state={view.health} />
        </td>
        <td className="px-2 py-2">{wx ? <WeatherBadge impact={wx.impact} indoor={wx.indoor} /> : "—"}</td>
        <td className="px-2 py-2">
          <MarketMovementBadge direction={view.movement.direction} />
        </td>
        <td className="px-2 py-2">
          <WhyDrawer title={`${view.playerName} ${MARKET_LABEL[view.market]}`} lenses={view.lenses} sections={view.whySections} />
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-line bg-bg-elev/80">
          <td colSpan={15} className="px-3 py-3">
            <p className="mb-2 text-[10px] tracking-wide text-muted uppercase">Expansion · floor / median / mean / ceiling · books · alts</p>
            <dl className="mb-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-muted">Floor</dt>
                <dd className="num">{formatMeasured(view.distribution.floor)}</dd>
              </div>
              <div>
                <dt className="text-muted">Median</dt>
                <dd className="num">{formatMeasured(view.distribution.median)}</dd>
              </div>
              <div>
                <dt className="text-muted">Mean</dt>
                <dd className="num">{formatMeasured(view.distribution.mean)}</dd>
              </div>
              <div>
                <dt className="text-muted">Ceiling</dt>
                <dd className="num">{formatMeasured(view.distribution.ceiling)}</dd>
              </div>
            </dl>
            <p className="mb-2 text-xs text-muted">
              Books: {view.bookLabel} {formatMeasured(view.line)} · DK odds DATA UNAVAILABLE. Alts: DATA UNAVAILABLE.
            </p>
            <PropActions view={view} />
          </td>
        </tr>
      ) : null}
    </>
  );
}
