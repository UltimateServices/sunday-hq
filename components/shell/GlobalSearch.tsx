"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import { runSearch } from "@/lib/search";
import { useLiveOps } from "./LiveOpsProvider";
import { useShell } from "./ShellProvider";

type Command = {
  id: string;
  label: string;
  sub: string;
  href?: string;
  run?: () => void;
};

export function GlobalSearch() {
  const { searchOpen, setSearchOpen, setAlertsOpen, refreshView, setFinalCard, finalCard } = useShell();
  const ops = useLiveOps();
  const [q, setQ] = useState("");
  const query = searchOpen ? q : "";
  const hits = useMemo(() => runSearch(query), [query]);

  const commands = useMemo<Command[]>(() => {
    const nav = NAV_ITEMS.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
      sub: "Go to",
      href: item.href,
    }));
    const extras: Command[] = [
      { id: "cmd-refresh", label: "Refresh view + ops", sub: "Command", run: () => { refreshView(); void ops.reload(); } },
      { id: "cmd-alerts", label: "Open alerts", sub: "Command", run: () => setAlertsOpen(true) },
      { id: "cmd-final", label: finalCard ? "Exit Final Card" : "Open Final Card", sub: "Command", run: () => setFinalCard(!finalCard) },
      { id: "cmd-td", label: "Touchdown center", sub: "Go to", href: "/touchdowns" },
      { id: "cmd-card", label: "My Card", sub: "Go to", href: "/my-card" },
    ];
    const all = [...extras, ...nav];
    if (!query.trim()) return all.slice(0, 10);
    const needle = query.toLowerCase();
    return all.filter((cmd) => `${cmd.label} ${cmd.sub}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [query, refreshView, ops, setAlertsOpen, setFinalCard, finalCard]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh]" role="dialog" aria-modal aria-label="Command palette">
      <div className="w-full max-w-xl rounded-lg border border-line bg-bg-elev p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] tracking-wide text-gold uppercase">Command · players · teams · games · props · books</p>
          <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-muted">
            Esc
          </button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="⌘K · Burrow, CIN, TB@CIN, Chase rec, DraftKings…"
          className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus:border-gold/50"
        />
        <ul className="mt-2 max-h-80 overflow-y-auto">
          {commands.map((cmd) => (
            <li key={cmd.id}>
              {cmd.href ? (
                <Link
                  href={cmd.href}
                  onClick={() => setSearchOpen(false)}
                  className="block rounded-md px-2 py-2 hover:bg-card"
                >
                  <p className="text-sm font-semibold">{cmd.label}</p>
                  <p className="text-[11px] text-muted">{cmd.sub}</p>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    cmd.run?.();
                    setSearchOpen(false);
                  }}
                  className="block w-full rounded-md px-2 py-2 text-left hover:bg-card"
                >
                  <p className="text-sm font-semibold">{cmd.label}</p>
                  <p className="text-[11px] text-muted">{cmd.sub}</p>
                </button>
              )}
            </li>
          ))}
          {q && hits.length === 0 && commands.length === 0 ? <li className="px-2 py-3 text-sm text-muted">NO PLAYS MEET FILTERS</li> : null}
          {hits.map((hit) => (
            <li key={hit.id}>
              <Link
                href={hit.href}
                onClick={() => setSearchOpen(false)}
                className="block rounded-md px-2 py-2 hover:bg-card"
              >
                <p className="text-sm font-semibold">{hit.label}</p>
                <p className="text-[11px] text-muted">
                  {hit.kind} · {hit.sub}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
