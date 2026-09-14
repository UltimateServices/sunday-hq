import { formatPct } from "@/lib/format";

export function ScriptBars({
  homeLabel,
  awayLabel,
  pHomeWin,
  pAwayWin,
  pClose,
}: {
  homeLabel: string;
  awayLabel: string;
  pHomeWin: number;
  pAwayWin: number;
  pClose: number;
}) {
  const rows = [
    { label: `${homeLabel} win`, value: pHomeWin },
    { label: "Close game", value: pClose },
    { label: `${awayLabel} win`, value: pAwayWin },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted">ESTIMATE · spread logistic. Not a cover model.</p>
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex justify-between text-[12px]">
            <span>{row.label}</span>
            <span className="num text-muted">{formatPct(row.value)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gold/80" style={{ width: `${Math.round(row.value * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
