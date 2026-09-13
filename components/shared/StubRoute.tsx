import { PageHeader } from "./PageHeader";
import { PendingPanel } from "./PendingPanel";
import { pendingForPhase } from "@/lib/pending";
import type { PhaseId, RouteReadiness } from "@/lib/types/domain";

export function StubRoute({
  title,
  lede,
  phase,
  readiness,
  children,
}: {
  title: string;
  lede: string;
  phase: PhaseId;
  readiness: RouteReadiness;
  children?: React.ReactNode;
}) {
  const pending = pendingForPhase(phase);
  return (
    <div className="space-y-6">
      <PageHeader layer="Architecture stub" title={title} lede={lede} readiness={readiness} />
      {pending ? <PendingPanel capability={pending} /> : null}
      {children}
    </div>
  );
}
