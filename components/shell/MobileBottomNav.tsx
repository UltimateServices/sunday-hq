"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TABS } from "@/lib/nav";
import { useShell } from "./ShellProvider";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setMoreOpen } = useShell();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg-elev/95 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {MOBILE_TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" || pathname === "/dashboard" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center py-2 text-[10px] tracking-wide uppercase ${active ? "text-gold" : "text-muted"}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex w-full flex-col items-center py-2 text-[10px] tracking-wide text-muted uppercase"
          >
            <span>☰</span>
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
