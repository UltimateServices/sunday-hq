"use client";

import { useState } from "react";
import type { QualifierGrade, QualifierLens, WhySections } from "@/lib/types/domain";
import { LENS_LABEL } from "@/lib/copy";
import { ToneChip } from "./badges";
import type { StatusTone } from "@/lib/health";

const LENS_TONE: Record<QualifierGrade, StatusTone> = {
  YES: "green",
  LEAN: "yellow",
  NO: "red",
  UNKNOWN: "purple",
};

export function WhyDrawer({
  title,
  lenses,
  sections,
  why,
  risks,
}: {
  title: string;
  lenses: Record<QualifierLens, QualifierGrade>;
  sections?: WhySections;
  why?: string[];
  risks?: string[];
}) {
  const [open, setOpen] = useState(false);
  const resolved: WhySections = sections ?? {
    modelCase: why ?? [],
    supporting: [],
    risks: risks ?? [],
    marketContext: [],
    dataQuality: [],
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          window.setTimeout(() => setOpen(true), 0);
        }}
        className="rounded-sm border border-line bg-bg-elev px-2 py-1 text-[11px] font-semibold tracking-wide text-gold uppercase hover:border-gold/50"
      >
        Why
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] flex justify-end bg-black/60" role="dialog" aria-modal>
          <button className="h-full flex-1 cursor-default" aria-label="Close" onClick={() => setOpen(false)} />
          <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-elev p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-gold uppercase">Explanation</p>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-sm border border-line px-2 py-1 text-xs text-muted hover:text-ink">
                Close
              </button>
            </div>
            <p className="mb-3 text-xs text-muted">Why this bet: availability, then projection, then price — never a lock.</p>
            <div className="mb-5 grid grid-cols-2 gap-2">
              {(Object.keys(lenses) as QualifierLens[]).map((lens) => (
                <div key={lens} className="rounded-md border border-line bg-card p-2">
                  <p className="mb-1 text-[10px] text-muted">{LENS_LABEL[lens]}</p>
                  <ToneChip tone={LENS_TONE[lenses[lens]]}>{lenses[lens]}</ToneChip>
                </div>
              ))}
            </div>
            <Block title="1 · Why it fits" items={resolved.modelCase} />
            <Block title="2 · What else supports it" items={resolved.supporting} />
            <Block title="3 · How it loses" items={resolved.risks} danger />
            <Block title="4 · Market" items={resolved.marketContext} />
            <Block title="5 · Data quality" items={resolved.dataQuality} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function Block({ title, items, danger }: { title: string; items: string[]; danger?: boolean }) {
  return (
    <div className="mb-4">
      <h4 className={`mb-2 text-[11px] tracking-wide uppercase ${danger ? "text-bad" : "text-ink"}`}>{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted">DATA UNAVAILABLE</p>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink/90">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
