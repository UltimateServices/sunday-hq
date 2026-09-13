export function SeedBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-line bg-card px-3 py-2 text-xs text-muted">
      {children}
    </p>
  );
}
