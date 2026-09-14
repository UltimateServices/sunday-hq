"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-3 px-4 py-16">
      <h1 className="text-[28px] font-semibold tracking-tight">This board failed to load</h1>
      <p className="text-[15px] leading-relaxed text-muted">
        Last valid tape may still be in memory. We did not invent a replacement board or a DraftKings price.
      </p>
      {error.digest ? <p className="text-[12px] text-muted">Ref {error.digest}</p> : null}
      <button type="button" onClick={reset} className="action-btn">
        Retry
      </button>
    </div>
  );
}
