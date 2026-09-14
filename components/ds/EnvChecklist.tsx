import type { EnvCheck } from "@/lib/env-status";
import { ToneChip } from "@/components/ds/badges";

export function EnvChecklist({ checks }: { checks: EnvCheck[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">
        Copy the name. Paste it in Vercel. Never put a real value in this repo or in chat.
      </p>
      {checks.map((row) => (
        <article key={row.id} className="rounded-lg border border-line bg-card p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <code className="text-[14px] font-semibold text-ink">{row.name}</code>
            <ToneChip tone={row.present ? "green" : row.requiredForLive ? "red" : "orange"}>
              {row.present ? "Set" : row.requiredForLive ? "Missing" : "Optional"}
            </ToneChip>
          </div>
          <p className="mt-1 text-sm">{row.purpose}</p>
          <p className="mt-1 text-[13px] text-muted">{row.present ? row.where : row.ifMissing}</p>
          <p className="mt-1 text-[11px] text-muted">{row.where}</p>
        </article>
      ))}
    </div>
  );
}
