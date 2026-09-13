"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useShell } from "@/components/shell/ShellProvider";
import { PROP_BY_ID } from "@/data/week1/props";
import { toPropView } from "@/lib/prop-view";
import { MARKET_LABEL } from "@/lib/prop-view";
import { EmptyState } from "@/components/ds/EmptyState";
import { WhyDrawer } from "@/components/ds/WhyDrawer";
import { ConfidenceBadge, EdgeBadge, HealthBadge, ToneChip } from "@/components/ds/badges";
import { AlertRow } from "@/components/ds/AlertRow";
import { ALERTS } from "@/data/week1/alerts";
import type { CardStatus } from "@/lib/types/domain";
import { formatNumber } from "@/lib/format";

const TABS: CardStatus[] = ["WATCHING", "READY", "PLACED", "SETTLED"];

export function MyCardBoard() {
  const { bets, placeBet, setBetStatus } = useShell();
  const [tab, setTab] = useState<CardStatus>("READY");
  const [units, setUnits] = useState<Record<string, string>>({});

  const rows = useMemo(() => bets.filter((b) => b.status === tab), [bets, tab]);
  const cardAlerts = ALERTS.filter((a) => a.href === "/my-card" || a.title.toLowerCase().includes("edge") || a.title.toLowerCase().includes("card"));

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-4">
        {TABS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setTab(status)}
            className={`rounded-lg border p-3 text-left ${tab === status ? "border-gold/50 bg-card" : "border-line bg-card"}`}
          >
            <p className="text-[10px] tracking-wide text-muted uppercase">{status}</p>
            <p className="num text-2xl text-gold">{bets.filter((b) => b.status === status).length}</p>
          </button>
        ))}
      </div>

      {cardAlerts.length > 0 ? (
        <div className="grid gap-2 md:grid-cols-2">
          {cardAlerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {rows.map((bet) => {
            const prop = PROP_BY_ID[bet.propId];
            if (!prop) return null;
            const view = toPropView(prop);
            return (
              <article key={bet.id} className="rounded-lg border border-line bg-card p-3">
                <div className="mb-2 flex flex-wrap items-center gap-1">
                  <ToneChip tone="blue">{bet.status}</ToneChip>
                  <ToneChip tone={bet.seedLabel === "EXAMPLE" ? "orange" : "purple"}>{bet.seedLabel}</ToneChip>
                  {bet.review === "LINE_MOVED" ? <ToneChip tone="orange">REVIEW · LINE</ToneChip> : null}
                  {bet.review === "EDGE_LOST" ? <ToneChip tone="red">EDGE LOST</ToneChip> : null}
                  {bet.review === "EDGE_IMPROVED" ? <ToneChip tone="green">EDGE IMPROVED</ToneChip> : null}
                  {bet.result ? <ToneChip tone={bet.result === "WIN" ? "green" : bet.result === "LOSS" ? "red" : "blue"}>{bet.result}</ToneChip> : null}
                </div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link href={`/players/${view.playerId}`} className="font-semibold hover:text-gold">
                      {view.playerName}
                    </Link>
                    <p className="text-xs text-muted">
                      {MARKET_LABEL[view.market]} {view.side} {formatNumber(view.line.value)} · {view.matchup}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <HealthBadge state={view.health} />
                    <ConfidenceBadge grade={view.confidenceGrade} />
                    <EdgeBadge value={view.pricing.edge.value} unit={view.market.includes("TD") ? "prob" : "yards"} />
                  </div>
                </div>
                <p className="mt-2 text-sm">{bet.note}</p>
                <p className="mt-1 text-[11px] text-muted">
                  Line at add {formatNumber(bet.lineAtAdd)} → current {formatNumber(bet.currentLine)} · units {bet.units ?? "unset"} (no dollars)
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <WhyDrawer title={`${view.playerName} card`} lenses={view.lenses} sections={view.whySections} />
                  {bet.status === "WATCHING" ? (
                    <button type="button" className="action-btn" onClick={() => setBetStatus(bet.id, "READY")}>
                      Move to ready
                    </button>
                  ) : null}
                  {bet.status === "READY" ? (
                    <>
                      <label className="text-[11px] text-muted">
                        Units
                        <input
                          inputMode="decimal"
                          value={units[bet.id] ?? ""}
                          onChange={(e) => setUnits((s) => ({ ...s, [bet.id]: e.target.value }))}
                          className="ml-2 w-16 rounded-md border border-line bg-bg-elev px-2 py-1 text-sm text-ink"
                          placeholder="1"
                        />
                      </label>
                      <button
                        type="button"
                        className="action-btn text-gold"
                        onClick={() => {
                          const n = Number(units[bet.id] || "1");
                          if (!Number.isFinite(n) || n <= 0) return;
                          placeBet(bet.id, n);
                        }}
                      >
                        Place bet
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="text-xs text-muted">No loss chasing. No unit inflation after early games. Place uses units only — never dollars.</p>
    </div>
  );
}
