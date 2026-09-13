export function Section({
  id,
  eyebrow,
  title,
  aside,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-line pb-2">
        <div>
          {eyebrow ? (
            <p className="mb-0.5 text-[10px] tracking-[0.16em] text-gold uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">{title}</h2>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
