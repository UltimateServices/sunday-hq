"use client";

import { useShell } from "@/components/shell/ShellProvider";

export function MyCardPreview() {
  const { watch, card } = useShell();
  return (
    <div className="grid gap-2 md:grid-cols-3">
      <Bucket title="Watching" count={watch.length} />
      <Bucket title="Ready" count={card.length} />
      <Bucket title="Placed" count={0} />
    </div>
  );
}

function Bucket({ title, count }: { title: string; count: number }) {
  return (
    <div className="rounded-lg border border-line bg-card p-3">
      <p className="text-[10px] tracking-wide text-muted uppercase">{title}</p>
      {count === 0 ? (
        <p className="mt-2 text-sm text-muted">NO PLAYS MEET FILTERS</p>
      ) : (
        <p className="num mt-2 text-2xl text-gold">{count}</p>
      )}
    </div>
  );
}
