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
    <div className="surface px-3 py-3" title={hint}>
      <p className="text-[12px] text-muted">{label}</p>
      <p className="num mt-1 text-[15px] font-semibold text-ink">{value}</p>
    </div>
  );
}
