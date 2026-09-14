import Link from "next/link";
import type { AlertItem } from "@/lib/types/domain";
import { ToneChip } from "./badges";
import type { StatusTone } from "@/lib/health";

const SEV: Record<AlertItem["severity"], StatusTone> = {
  INFO: "blue",
  WATCH: "yellow",
  IMPORTANT: "orange",
  CRITICAL: "red",
};

export function AlertRow({
  alert,
  unread = false,
  onOpen,
}: {
  alert: AlertItem;
  unread?: boolean;
  onOpen?: () => void;
}) {
  return (
    <Link
      href={alert.href}
      onClick={onOpen}
      className={`block rounded-md border bg-card p-3 hover:border-gold/40 ${unread ? "border-gold/50" : "border-line"}`}
    >
      <div className="mb-1 flex flex-wrap gap-1">
        {unread ? <ToneChip tone="orange">Unread</ToneChip> : null}
        <ToneChip tone={SEV[alert.severity]}>{alert.severity}</ToneChip>
        <ToneChip tone="purple">{alert.kind}</ToneChip>
      </div>
      <p className="text-sm font-semibold">{alert.title}</p>
      <p className="text-[12px] text-muted">{alert.body}</p>
    </Link>
  );
}
