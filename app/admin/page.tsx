import { SCHEMA_STUBS } from "@/lib/types/schema";
import { StubRoute } from "@/components/shared/StubRoute";

export default function AdminPage() {
  return (
    <StubRoute
      title="Admin / Settings"
      phase={7}
      readiness="PENDING"
      lede="Weights, alerts, source keys. Secrets never live in the repo. This page only documents the future control surface."
    >
      <div className="rounded-lg border border-line bg-card p-3">
        <p className="mb-2 text-xs tracking-wide text-muted uppercase">Schema stubs</p>
        <ul className="space-y-1 text-sm">
          {SCHEMA_STUBS.map((table) => (
            <li key={table.name}>
              <span className="font-mono text-gold">{table.name}</span>
              <span className="text-muted"> · P{table.phase} · {table.purpose}</span>
            </li>
          ))}
        </ul>
      </div>
    </StubRoute>
  );
}
