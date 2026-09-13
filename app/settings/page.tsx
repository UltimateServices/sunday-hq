import { PageHeader } from "@/components/shared/PageHeader";
import { PendingPanel } from "@/components/shared/PendingPanel";
import { pendingForPhase } from "@/lib/pending";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        layer="System"
        title="Settings"
        readiness="PENDING"
        lede="Display density, default window, Final Card confirmation. Secrets never live here."
      />
      <PendingPanel capability={pendingForPhase(7)!} />
      <ul className="space-y-2 text-sm text-muted">
        <li>Default game window: ALL / EARLY / LATE / SNF — PENDING persist</li>
        <li>Final Card mode confirmation — UI toggle lives in the header now</li>
        <li>Alert severity filters — drawer tabs already wired</li>
      </ul>
    </div>
  );
}
