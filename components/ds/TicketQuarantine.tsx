import type { LiveGate } from "@/lib/live-gate";
import { EmptyState } from "@/components/ds/EmptyState";

export function TicketQuarantine({
  gate,
  children,
  noun = "picks",
}: {
  gate: LiveGate;
  children: React.ReactNode;
  noun?: string;
}) {
  if (gate.actionable) return children;
  return (
    <EmptyState
      message={`No live ${noun}.`}
      hint="Seed constructs are hidden so they cannot look like tickets. Add ODDS_API_KEY in Vercel, redeploy, then run odds ingest."
    />
  );
}
