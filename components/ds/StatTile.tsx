export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-line bg-card px-2 py-2" title={hint}>
      <p className="text-[9px] tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="num text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
