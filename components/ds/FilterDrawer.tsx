"use client";

import { useState } from "react";

export function FilterDrawer({
  title = "Filters",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-line px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase md:hidden"
      >
        Filters
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 md:hidden" role="dialog" aria-modal>
          <button className="h-full flex-1" aria-label="Close filters" onClick={() => setOpen(false)} />
          <aside className="h-full w-[min(100%,360px)] overflow-y-auto border-l border-line bg-bg-elev p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{title}</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted">
                Close
              </button>
            </div>
            {children}
          </aside>
        </div>
      ) : null}
    </>
  );
}
