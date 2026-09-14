"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TABS } from "@/lib/nav";
import { useShell } from "./ShellProvider";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setMoreOpen } = useShell();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <ul className="grid grid-cols-5">
        {MOBILE_TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${active ? "text-ink" : "text-muted"}`}
              >
                <span className="text-[15px] opacity-80" aria-hidden>
                  {tab.icon}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-muted"
          >
            <span className="text-[15px] opacity-80" aria-hidden>
              ☰
            </span>
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
