"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg-elev/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-3 py-2">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Sunday HQ
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-line px-2 py-1 text-[11px] tracking-wide uppercase"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-line px-2 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="mb-2">
              <p className="px-2 text-[10px] tracking-[0.16em] text-muted uppercase">{group.label}</p>
              {NAV_ITEMS.filter((item) => item.group === group.id).map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-2 py-1.5 text-sm ${active ? "text-gold" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
