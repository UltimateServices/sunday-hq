"use client";

import { useState } from "react";
import type { QualifierGrade, QualifierLens, WhySections } from "@/lib/types/domain";
import { ToneChip } from "./badges";
import type { StatusTone } from "@/lib/health";
import { LENS_LABEL } from "@/lib/copy";

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
        className="action-btn text-ink"
      >
        Why this bet
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] flex justify-end bg-black/55" role="dialog" aria-modal>
          <button className="h-full flex-1 cursor-default" aria-label="Close" onClick={() => setOpen(false)} />
          <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-elev p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] text-muted">Why this bet</p>
                <h3 className="mt-1 text-[22px] font-semibold tracking-tight text-ink">{title}</h3>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="action-btn">
                Close
              </button>
            </div>
            <p className="mb-5 text-[13px] leading-relaxed text-muted">
              Availability first, then projection, then price. A good player is not automatically a good bet.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-2">
              {(Object.keys(lenses) as QualifierLens[]).map((lens) => (
                <div key={lens} className="surface p-3">
                  <p className="mb-2 text-[12px] text-muted">{LENS_LABEL[lens]}</p>
                  <ToneChip tone={LENS_TONE[lenses[lens]]}>{lenses[lens] === "UNKNOWN" ? "Unknown" : lenses[lens] === "LEAN" ? "Lean" : lenses[lens] === "YES" ? "Yes" : "No"}</ToneChip>
                </div>
              ))}
            </div>
            <Block title="The case" items={resolved.modelCase} />
            <Block title="What supports it" items={resolved.supporting} />
            <Block title="Risks" items={resolved.risks} danger />
            <Block title="The market" items={resolved.marketContext} />
            <Block title="How sure we are" items={resolved.dataQuality} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function Block({ title, items, danger }: { title: string; items: string[]; danger?: boolean }) {
  return (
    <div className="mb-5">
      <h4 className={`mb-2 text-[15px] font-semibold ${danger ? "text-bad" : "text-ink"}`}>{title}</h4>
      {items.length === 0 ? (
        <p className="text-[14px] text-muted">Nothing stored here yet.</p>
      ) : (
        <ul className="space-y-2 text-[14px] leading-relaxed text-ink/90">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
