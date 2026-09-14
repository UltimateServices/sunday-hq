export function Section({
  id,
  eyebrow,
  title,
  aside,
  lede,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  aside?: React.ReactNode;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          {eyebrow ? <p className="mb-0.5 text-[13px] text-muted">{eyebrow}</p> : null}
          <h2 className="text-[20px] font-semibold tracking-tight text-ink">{title}</h2>
          {lede ? <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">{lede}</p> : null}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
