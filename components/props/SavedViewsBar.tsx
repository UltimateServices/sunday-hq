"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  QUICK_FILTERS,
  SAVED_VIEWS,
  applyViewParams,
  clearViewParams,
  getServerCustomViews,
  paramsFromSearch,
  readCustomViews,
  replaceWithView,
  subscribeCustomViews,
  viewIsActive,
  writeCustomViews,
  type NamedView,
} from "@/lib/saved-views";

export function SavedViewsBar() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const custom = useSyncExternalStore(subscribeCustomViews, readCustomViews, getServerCustomViews);
  const [label, setLabel] = useState("");

  const named = useMemo(() => [...SAVED_VIEWS, ...custom], [custom]);

  function go(next: URLSearchParams) {
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function applyNamed(view: NamedView) {
    go(replaceWithView(view.params, view.id));
  }

  function applyQuick(view: NamedView) {
    const next = applyViewParams(params, view.params);
    next.delete("view");
    go(next);
  }

  function saveCurrent() {
    const name = label.trim();
    if (!name) return;
    const id = `custom-${Date.now()}`;
    const next = [...custom, { id, label: name, params: paramsFromSearch(params) }];
    writeCustomViews(next);
    setLabel("");
  }

  function removeCustom(id: string) {
    writeCustomViews(custom.filter((view) => view.id !== id));
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-muted uppercase">Saved views</p>
        <div className="flex flex-wrap gap-1">
          {named.map((view) => {
            const active = viewIsActive(params, view);
            const isCustom = view.id.startsWith("custom-");
            return (
              <span key={view.id} className="inline-flex items-center gap-1">
                <button
                  type="button"
                  className={`action-btn ${active ? "text-gold" : ""}`}
                  aria-pressed={active}
                  onClick={() => applyNamed(view)}
                >
                  {view.label}
                </button>
                {isCustom ? (
                  <button
                    type="button"
                    className="action-btn px-2 py-1 text-[11px]"
                    aria-label={`Delete ${view.label}`}
                    onClick={() => removeCustom(view.id)}
                  >
                    ×
                  </button>
                ) : null}
              </span>
            );
          })}
          <button type="button" className="action-btn" onClick={() => go(clearViewParams(params))}>
            Clear
          </button>
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] tracking-wide text-muted uppercase">Quick filters</p>
        <div className="flex flex-wrap gap-1">
          {QUICK_FILTERS.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`action-btn ${viewIsActive(params, view) ? "text-gold" : ""}`}
              aria-pressed={viewIsActive(params, view)}
              onClick={() => applyQuick(view)}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Save current view</span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="w-56 rounded-md border border-line bg-card px-2 py-1.5 text-sm"
            placeholder="Name this filter set"
          />
        </label>
        <button type="button" className="action-btn" onClick={saveCurrent} disabled={!label.trim()}>
          Save on this device
        </button>
      </div>
      <p className="text-[12px] text-muted">
        Named views replace filters and stay in the URL. A/A+ only is empty on Week 1 seed by contract. “No known
        limitation” is not “healthy”.
      </p>
    </div>
  );
}
