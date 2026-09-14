"use client";

import Link from "next/link";
import { ALERTS } from "@/data/week1/alerts";
import { CHANGES } from "@/data/week1/news";
import { PARLAYS } from "@/data/week1/parlays";
import { AlertRow } from "@/components/ds/AlertRow";
import { ChangeRow } from "@/components/ds/ChangeRow";
import { PropCard } from "@/components/ds/PropCard";
import { Section } from "@/components/shared/Section";
import { EmptyState } from "@/components/ds/EmptyState";
import { ToneChip } from "@/components/ds/badges";
import { useShell } from "./ShellProvider";
import { PROP_BY_ID } from "@/data/week1/props";
import { toPropView } from "@/lib/prop-view";
import { buildCommandCenter } from "@/lib/command-center";

export function FinalCardView() {
  const { bets, setFinalCard } = useShell();
  const vm = buildCommandCenter();
  const critical = ALERTS.filter((a) => a.severity === "CRITICAL" || a.severity === "IMPORTANT");
  const lastChanges = CHANGES.filter((c) => c.severity === "CRITICAL" || c.severity === "IMPORTANT" || c.severity === "WATCH");
  const placedOrReady = bets.filter((b) => b.status === "READY" || b.status === "PLACED" || b.status === "WATCHING");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Final Card mode</p>
          <h1 className="text-2xl font-semibold">Decluttered Sunday</h1>
          <p className="max-w-2xl text-sm text-muted">
            My Card + top recs + critical alerts + last-minute changes. No casino extras. Exit any time.
          </p>
        </div>
        <button type="button" className="action-btn text-gold" onClick={() => setFinalCard(false)}>
          Exit Final Card
        </button>
      </header>

      <Section title="Critical alerts">
        <div className="grid gap-2 md:grid-cols-2">
          {critical.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </div>
      </Section>

      <Section title="Last-minute changes">
        <div className="grid gap-2 md:grid-cols-2">
          {lastChanges.map((item) => (
            <ChangeRow key={item.id} item={item} />
          ))}
        </div>
      </Section>

      <Section title="My Card">
        {placedOrReady.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {placedOrReady.map((bet) => {
              const prop = PROP_BY_ID[bet.propId];
              if (!prop) return null;
              return (
                <div key={bet.id} className="space-y-1">
                  <ToneChip tone="blue">{bet.status}</ToneChip>
                  <PropCard view={toPropView(prop)} compact />
                </div>
              );
            })}
          </div>
        )}
        <Link href="/my-card" className="mt-2 inline-block text-xs text-gold">
          Open full card
        </Link>
      </Section>

      <Section title="Top recs">
        {vm.top5.length === 0 ? (
          <EmptyState
            message="No live recs."
            hint="Seed picks and seed parlays stay hidden until DraftKings tape is fresh."
          />
        ) : (
          <>
            <div className="space-y-2">
              {vm.top5.map((view) => (
                <PropCard key={view.id} view={view} compact />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              Conservative construct: {PARLAYS.find((p) => p.profile === "Conservative")?.title}. Not a priced ticket.
            </p>
          </>
        )}
      </Section>
    </div>
  );
}
