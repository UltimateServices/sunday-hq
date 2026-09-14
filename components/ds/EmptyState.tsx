export function EmptyState({
  message = "Nothing matches these filters.",
  hint = "Try All, or clear a filter. We will not invent a play to fill the gap.",
}: {
  message?: string;
  hint?: string;
}) {
  return (
    <div className="surface px-6 py-12 text-center">
      <p className="text-[15px] font-medium text-ink">{message}</p>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">{hint}</p>
    </div>
  );
}
