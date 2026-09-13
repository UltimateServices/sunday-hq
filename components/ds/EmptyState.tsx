export function EmptyState({ message = "NO PLAYS MEET FILTERS" }: { message?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
      {message}
    </div>
  );
}
