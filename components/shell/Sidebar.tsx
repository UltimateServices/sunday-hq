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
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-bg lg:flex ${
        collapsed ? "w-[72px]" : "w-[248px]"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {collapsed ? (
          <Link href="/" className="text-[17px] font-semibold text-gold" aria-label="Sunday HQ home">
            S
          </Link>
        ) : (
          <div>
            <p className="text-[12px] text-muted">Sunday research</p>
            <Link href="/" className="text-[17px] font-semibold tracking-tight">
              Sunday HQ
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="action-btn px-2 py-1 text-[12px]"
          aria-label="Collapse sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-6">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((item) => item.group === group.id);
          return (
            <div key={group.id} className="mb-4">
              {!collapsed && group.label ? (
                <p className="px-3 pb-1 text-[11px] font-medium text-muted">{group.label}</p>
              ) : null}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[14px] ${
                          active ? "bg-card text-ink" : "text-muted hover:bg-card hover:text-ink"
                        }`}
                      >
                        <span className="w-4 text-center text-[13px] opacity-70" aria-hidden>
                          {item.icon}
                        </span>
                        {collapsed ? null : <span className="flex-1 truncate">{item.label}</span>}
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
