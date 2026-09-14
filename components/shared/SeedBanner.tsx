export function SeedBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="surface px-4 py-3 text-[13px] leading-relaxed text-muted">
      {children}
    </p>
  );
}
