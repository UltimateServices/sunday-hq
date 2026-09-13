"use client";

import { useState } from "react";
import type { QualifierGrade, QualifierLens } from "@/lib/types/domain";
import { StatusBadge } from "./StatusBadge";
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
  why,
  risks,
}: {
  title: string;
  lenses: Record<QualifierLens, QualifierGrade>;
  why: string[];
  risks: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm border border-line bg-bg-elev px-2 py-1 text-[11px] font-semibold tracking-wide text-gold uppercase hover:border-gold/50"
      >
        Why
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal>
          <button className="h-full flex-1 cursor-default" aria-label="Close" onClick={() => setOpen(false)} />
          <aside className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-bg-elev p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-gold uppercase">Deep dive · Why</p>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-sm border border-line px-2 py-1 text-xs text-muted hover:text-ink"
              >
                Close
              </button>
            </div>
            <p className="mb-3 text-xs text-muted">
              Four lenses are independent. A good player is not a good bet.
            </p>
            <div className="mb-5 grid grid-cols-2 gap-2">
              {(Object.keys(lenses) as QualifierLens[]).map((lens) => (
                <div key={lens} className="rounded-md border border-line bg-card p-2">
                  <p className="mb-1 text-[10px] text-muted">{lens.replaceAll("_", " ")}</p>
                  <StatusBadge tone={LENS_TONE[lenses[lens]]}>{lenses[lens]}</StatusBadge>
                </div>
              ))}
            </div>
            <h4 className="mb-2 text-[11px] tracking-wide text-ink uppercase">Why</h4>
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-ink/90">
              {why.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4 className="mb-2 text-[11px] tracking-wide text-bad uppercase">Risks</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink/90">
              {risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-[11px] text-muted">
              Language ban: no LOCK, GUARANTEED, or 100% BET copy. Probability + EV + implied odds
              when a real price exists.
            </p>
          </aside>
        </div>
      ) : null}
    </>
  );
}
