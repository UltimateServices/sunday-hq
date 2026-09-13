"use client";

import Link from "next/link";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { useShell } from "./ShellProvider";

export function MoreDrawer() {
  const { moreOpen, setMoreOpen } = useShell();
  if (!moreOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" role="dialog" aria-modal>
      <button className="absolute inset-0" aria-label="Close more" onClick={() => setMoreOpen(false)} />
      <aside className="absolute inset-y-0 right-0 w-[min(100%,320px)] overflow-y-auto border-l border-line bg-bg-elev p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">More</p>
          <button type="button" onClick={() => setMoreOpen(false)} className="text-xs text-muted">
            Close
          </button>
        </div>
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="mb-3">
            {group.label ? <p className="text-[10px] tracking-wide text-muted uppercase">{group.label}</p> : null}
            {NAV_ITEMS.filter((item) => item.group === group.id).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className="block py-1.5 text-sm"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>
    </div>
  );
}
