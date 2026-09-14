import {
  ALERT_RULES,
  AUTOMATION,
  DATA_SOURCES,
  FEATURE_FLAGS,
  MODEL_WEIGHTS,
  SPORTSBOOKS,
  SUNDAY_ROUTINE,
  THRESHOLDS,
} from "@/data/week1/admin";
import { WeightsEditor } from "@/components/boards/WeightsEditor";
import { SCHEMA_STUBS } from "@/lib/types/schema";
import { Section } from "@/components/shared/Section";
import { ToneChip } from "@/components/ds/badges";
import type { WeekCatalog } from "@/lib/catalog";

function stamp(iso: string | null) {
  return iso ? new Date(iso).toLocaleString() : "PENDING";
}

export function AdminBoard({ catalog }: { catalog?: WeekCatalog }) {
  const sources = catalog?.sources ?? DATA_SOURCES;
  const automation = catalog?.automation ?? AUTOMATION;
  const flags = catalog?.featureFlags ?? FEATURE_FLAGS;
  const routine = catalog?.routine ?? SUNDAY_ROUTINE;
  const health = catalog?.health;

  return (
    <div className="space-y-8">
      <Section title="Data Sources">
        <div className="grid gap-2 md:grid-cols-2">
          {sources.map((s) => (
            <article key={s.id} className="rounded-lg border border-line bg-card p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold">{s.name}</p>
                <ToneChip tone={s.status === "LIVE" ? "green" : "purple"}>{s.status}</ToneChip>
              </div>
              <p className="text-[11px] text-muted">Last pull {stamp(s.lastPull)}</p>
              <p className="mt-1 text-sm">{s.note}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Model Weights">
        <p className="mb-2 text-[11px] text-muted">
          These weights change matchup overall scores and research ranking. Persist to Blob / local snapshots. Last saved{" "}
          {catalog?.adminWeights.updatedBy ?? "seed"} · {stamp(catalog?.adminWeights.asOf ?? null)}.
        </p>
        <WeightsEditor weights={catalog?.adminWeights.weights ?? MODEL_WEIGHTS} thresholds={catalog?.thresholds ?? { minEdgeYards: 4, maxUnits: 1.5, maxCard: 6 }} />
      </Section>
      <Section title="Thresholds">
        <div className="grid gap-2 md:grid-cols-2">
          {THRESHOLDS.map((t) => {
            const live =
              t.id === "min-edge"
                ? catalog?.thresholds.minEdgeYards
                : t.id === "max-units"
                  ? catalog?.thresholds.maxUnits
                  : t.id === "max-card"
                    ? catalog?.thresholds.maxCard
                    : undefined;
            return (
              <article key={t.id} className="rounded-lg border border-line bg-card p-3">
                <p className="text-[10px] text-muted uppercase">{t.label}</p>
                <p className="num text-xl text-gold">{live ?? t.value}</p>
                <p className="text-sm text-muted">{t.note}</p>
              </article>
            );
          })}
        </div>
      </Section>
      <Section title="Sportsbooks">
        <div className="grid gap-2 md:grid-cols-3">
          {SPORTSBOOKS.map((b) => (
            <article key={b.id} className="rounded-lg border border-line bg-card p-3">
              <p className="font-semibold">{b.name}</p>
              <p className="text-xs text-muted">{b.role}</p>
              <p className="mt-1 text-sm">{b.status}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Automation">
        <div className="space-y-2">
          {automation.map((a) => (
            <article key={a.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
              <div>
                <p className="font-semibold">{a.label}</p>
                <p className="text-sm text-muted">{a.note}</p>
              </div>
              <div className="text-right">
                <ToneChip tone={a.status === "PENDING" ? "purple" : "blue"}>{a.status}</ToneChip>
                <p className="mt-1 text-[11px] text-muted">{stamp(a.last)}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Alerts">
        <div className="grid gap-2 md:grid-cols-2">
          {ALERT_RULES.map((r) => (
            <article key={r.id} className="rounded-lg border border-line bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{r.label}</p>
                <ToneChip tone={r.enabled ? "green" : "purple"}>{r.enabled ? "ON" : "OFF"}</ToneChip>
              </div>
              <p className="text-xs text-muted">{r.severity}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Feature Flags">
        <div className="grid gap-2 md:grid-cols-2">
          {flags.map((f) => (
            <article key={f.id} className="rounded-lg border border-line bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{f.label}</p>
                <ToneChip tone={f.on ? "green" : "red"}>{f.on ? "ON" : "OFF"}</ToneChip>
              </div>
              <p className="text-sm text-muted">{f.note}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Data Health">
        <article className="rounded-lg border border-line bg-card p-3">
          <ToneChip tone={health?.state === "HEALTHY" ? "green" : "orange"}>{health?.state ?? "DEGRADED"}</ToneChip>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {(health?.issues ?? ["DraftKings player-prop odds not ingested"]).map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            Ingest last success {stamp(health?.ingestLastSuccessAt ?? null)} · last failure{" "}
            {stamp(health?.ingestLastFailureAt ?? null)}
            {health?.ingestLastFailureNote ? ` · ${health.ingestLastFailureNote}` : ""}
          </p>
          <p className="mt-1 text-[11px] text-muted">Snapshot storage: {catalog?.storage ?? "seed"}</p>
        </article>
      </Section>
      <Section title="Sunday routine">
        <ol className="space-y-2">
          {routine.map((step) => (
            <li key={step.id} className="flex items-start justify-between gap-3 rounded-lg border border-line bg-card p-3">
              <div>
                <p className="font-semibold">{step.label}</p>
                <p className="text-sm text-muted">{step.note}</p>
              </div>
              <div className="text-right">
                <ToneChip tone={step.status === "DONE" ? "green" : step.status === "LIVE" ? "blue" : "purple"}>{step.status}</ToneChip>
                <p className="mt-1 text-[11px] text-muted">{stamp(step.at)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Schema stubs">
        <ul className="space-y-1 text-sm">
          {SCHEMA_STUBS.map((table) => (
            <li key={table.name}>
              <span className="font-mono text-gold">{table.name}</span>
              <span className="text-muted">
                {" "}
                · P{table.phase} · {table.purpose}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
