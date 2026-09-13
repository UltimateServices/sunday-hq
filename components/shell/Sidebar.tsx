"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { useShell } from "./ShellProvider";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useShell();

  return (
    <aside
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-bg-elev lg:flex ${
        collapsed ? "w-16" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-3">
        {collapsed ? (
          <span className="text-gold">⌘</span>
        ) : (
          <div>
            <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Ultimate</p>
            <Link href="/" className="text-sm font-semibold">
              Sunday HQ
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-sm border border-line px-1.5 py-0.5 text-[10px] text-muted"
          aria-label="Collapse sidebar"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-1.5 py-2">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((item) => item.group === group.id);
          return (
            <div key={group.id} className="mb-2">
              {!collapsed && group.label ? (
                <p className="px-2 pb-1 text-[9px] tracking-[0.16em] text-muted uppercase">{group.label}</p>
              ) : null}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/" || pathname === "/dashboard"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] ${
                          active ? "bg-card text-gold" : "text-ink/85 hover:bg-card"
                        }`}
                      >
                        <span className="w-4 text-center" aria-hidden>
                          {item.icon}
                        </span>
                        {collapsed ? null : (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.readiness !== "LIVE" ? (
                              <span className="text-[8px] text-rare">{item.readiness[0]}</span>
                            ) : null}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
