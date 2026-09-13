import type { StatusTone } from "@/lib/health";

const TONE: Record<StatusTone, string> = {
  green: "border-good/40 bg-good/10 text-good",
  yellow: "border-warn/40 bg-warn/10 text-warn",
  orange: "border-alert/40 bg-alert/10 text-alert",
  red: "border-bad/40 bg-bad/10 text-bad",
  blue: "border-info/40 bg-info/10 text-info",
  purple: "border-rare/40 bg-rare/10 text-rare",
};

export function StatusBadge({
  tone,
  icon,
  children,
}: {
  tone: StatusTone;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${TONE[tone]}`}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}
