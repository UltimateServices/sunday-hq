import { ToneChip } from "@/components/ds/badges";
import type { SundayMilestone } from "@/lib/sunday-timeline";

const TONE = {
  DONE: "green",
  LIVE: "blue",
  PENDING: "purple",
} as const;

export function SundayTimeline({ milestones }: { milestones: SundayMilestone[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
      {milestones.map((item) => (
        <li key={item.id} className="surface p-3">
          <ToneChip tone={TONE[item.status]}>{item.status}</ToneChip>
          <p className="mt-2 text-[14px] font-semibold">{item.label}</p>
          <p className="mt-1 text-[12px] text-muted">
            {item.at ? new Date(item.at).toLocaleString("en-US", { timeZone: "America/New_York" }) : "No timestamp"}
          </p>
          <p className="mt-1 text-[12px] text-muted">{item.note}</p>
        </li>
      ))}
    </ol>
  );
}
