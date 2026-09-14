import { HEALTH_ICON, HEALTH_TONE, healthLabel, type StatusTone } from "@/lib/health";
import { STATUS_CHIPS } from "@/lib/ui/status";
import type {
  ConfidenceGrade,
  EdgeUnit,
  HealthState,
  MeasuredNumber,
  MovementDirection,
  StatusChipId,
  WeatherImpact,
} from "@/lib/types/domain";
import { formatMeasured, formatNumber, formatPct, formatSigned } from "@/lib/format";
import { qualityLabel } from "@/lib/copy";

const TONE: Record<StatusTone, string> = {
  green: "border-good/40 bg-good/10 text-good",
  yellow: "border-warn/40 bg-warn/10 text-warn",
  orange: "border-alert/40 bg-alert/10 text-alert",
  red: "border-bad/40 bg-bad/10 text-bad",
  blue: "border-info/40 bg-info/10 text-info",
  purple: "border-rare/40 bg-rare/10 text-rare",
};

export function ToneChip({
  tone,
  icon,
  children,
}: {
  tone: StatusTone;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-medium ${TONE[tone]}`}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}

export function StatusChip({ id }: { id: StatusChipId }) {
  const spec = STATUS_CHIPS[id];
  return <ToneChip tone={spec.tone} icon={spec.icon}>{spec.label}</ToneChip>;
}

export function HealthBadge({ state }: { state: HealthState }) {
  return (
    <ToneChip tone={HEALTH_TONE[state]} icon={HEALTH_ICON[state]}>
      {healthLabel(state)}
    </ToneChip>
  );
}

export function ProjectionBadge({ value }: { value: MeasuredNumber }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="num text-sm font-semibold text-gold">{formatMeasured(value)}</span>
      <ToneChip tone={value.quality === "UNAVAILABLE" ? "purple" : "blue"}>{qualityLabel(value.quality)}</ToneChip>
    </span>
  );
}

const CONF_TONE: Record<ConfidenceGrade, StatusTone> = {
  "A+": "green",
  A: "green",
  "A-": "green",
  "B+": "blue",
  B: "blue",
  "B-": "yellow",
  C: "orange",
  PASS: "purple",
};

export function ConfidenceBadge({ grade }: { grade: ConfidenceGrade }) {
  return <ToneChip tone={CONF_TONE[grade]}>Confidence {grade}</ToneChip>;
}

export function WeatherBadge({
  impact,
  indoor,
  summary,
}: {
  impact: WeatherImpact;
  indoor?: boolean;
  summary?: string;
}) {
  if (indoor) return <StatusChip id="DOME" />;
  if (impact === "SIGNIFICANT") return <ToneChip tone="orange">{summary ?? "Significant weather"}</ToneChip>;
  if (impact === "MODERATE") return <ToneChip tone="yellow">Moderate weather</ToneChip>;
  if (impact === "MINOR") return <ToneChip tone="blue">Light weather</ToneChip>;
  if (impact === "NONE") return <ToneChip tone="green">Clear</ToneChip>;
  return <ToneChip tone="purple">Weather unknown</ToneChip>;
}

export function MarketMovementBadge({ direction, note }: { direction: MovementDirection; note?: string }) {
  const tone: StatusTone =
    direction === "UP" ? "yellow" : direction === "DOWN" ? "orange" : direction === "FLAT" ? "blue" : "purple";
  return (
    <ToneChip tone={tone} icon={direction === "UP" ? "↑" : direction === "DOWN" ? "↓" : "·"}>
      {direction === "UNKNOWN" ? "Move unknown" : direction === "UP" ? "Line up" : direction === "DOWN" ? "Line down" : "Steady"}
      {note ? <span className="sr-only">{note}</span> : null}
    </ToneChip>
  );
}

export function EdgeBadge({
  value,
  unit,
}: {
  value: number | null;
  unit: EdgeUnit;
}) {
  const text =
    value === null
      ? "—"
      : unit === "yards"
        ? `${formatSigned(value, 1)} yd`
        : unit === "prob"
          ? `${formatSigned(value * 100, 1)}%`
          : `${formatSigned(value * 100, 1)}%`;
  const tone: StatusTone = value === null ? "purple" : value > 0 ? "green" : value < 0 ? "red" : "blue";
  return <ToneChip tone={tone}>{text}</ToneChip>;
}

export function EVBadge({ value }: { value: number | null }) {
  return <EdgeBadge value={value} unit="ev" />;
}

export function PriceBadge({ line, odds }: { line: MeasuredNumber; odds: MeasuredNumber }) {
  return (
    <span className="inline-flex flex-col">
      <span className="num text-sm text-gold">{formatMeasured(line)}</span>
      <span className="num text-[10px] text-muted">{formatMeasured(odds, 0, "american")}</span>
    </span>
  );
}

export function formatEdgeYards(value: number | null): string {
  if (value === null) return "DATA UNAVAILABLE";
  return `${formatSigned(value, 1)} yards`;
}

export function formatEdgeProb(value: number | null): string {
  if (value === null) return "DATA UNAVAILABLE";
  return `${formatSigned(value * 100, 1)}% probability edge`;
}

export function formatEdgeEv(value: number | null): string {
  if (value === null) return "DATA UNAVAILABLE";
  return `${formatSigned(value * 100, 1)}% EV`;
}

export { formatNumber, formatPct };
