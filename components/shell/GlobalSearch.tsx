"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { runSearch } from "@/lib/search";
import { useShell } from "./ShellProvider";

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useShell();
  const [q, setQ] = useState("");
  const query = searchOpen ? q : "";
  const hits = useMemo(() => runSearch(query), [query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh]" role="dialog" aria-modal>
      <div className="w-full max-w-xl rounded-lg border border-line bg-bg-elev p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] tracking-wide text-gold uppercase">Search players · teams · games · props · books</p>
          <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-muted">
            Close
          </button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Burrow, CIN, TB@CIN, Chase rec, DraftKings…"
          className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus:border-gold/50"
        />
        <ul className="mt-2 max-h-80 overflow-y-auto">
          {q && hits.length === 0 ? <li className="px-2 py-3 text-sm text-muted">NO PLAYS MEET FILTERS</li> : null}
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
