"use client";

import { GLOSSARY } from "@/lib/glossary";

export function InfoTip({ term, children }: { term: string; children?: React.ReactNode }) {
  const text = GLOSSARY[term] ?? term;
  return (
    <span className="group relative inline-flex items-center gap-1">
      {children ?? <span>{term}</span>}
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-line text-[10px] text-muted"
        aria-label={`What ${term} means`}
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full left-0 z-40 mt-1 hidden w-64 rounded-lg border border-line bg-bg-elev px-3 py-2 text-[12px] leading-relaxed text-ink shadow-lg group-hover:block group-focus-within:block"
      >
        {text}
      </span>
    </span>
  );
}
