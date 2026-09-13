"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-dvh w-56 shrink-0 flex-col border-r border-line bg-bg-elev lg:flex">
      <div className="border-b border-line px-4 py-4">
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">UltimateServices</p>
        <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
          Sunday HQ
        </Link>
        <p className="text-[11px] text-muted">Props · Parlays · Research</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className="mb-3">
            <p className="px-2 pb-1 text-[10px] tracking-[0.16em] text-muted uppercase">{group.label}</p>
            <ul className="space-y-0.5">
              {NAV_ITEMS.filter((item) => item.group === group.id).map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[12px] ${
                        active ? "bg-card text-gold" : "text-ink/85 hover:bg-card hover:text-ink"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.readiness !== "LIVE" ? (
                        <span className="text-[9px] tracking-wide text-rare uppercase">{item.readiness}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
