"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PropView } from "@/lib/prop-view";
import { RankingTable } from "@/components/ds/RankingTable";
import { FilterDrawer } from "@/components/ds/FilterDrawer";
import { EmptyState } from "@/components/ds/EmptyState";
import { PendingPanel } from "@/components/shared/PendingPanel";
import { pendingForPhase } from "@/lib/pending";
import { GAME_BY_ID } from "@/data/week1/games";
import { matchesWindow } from "@/lib/game-window";

type SortKey = "edge" | "line" | "player" | "prob";

export function PropsBoard({ views }: { views: PropView[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const side = params.get("side") ?? "ALL";
  const market = params.get("market") ?? "ALL";
  const pos = params.get("pos") ?? "ALL";
  const window = params.get("window") ?? "ALL";
  const sort = (params.get("sort") ?? "edge") as SortKey;
  const dir = params.get("dir") === "asc" ? "asc" : "desc";
  const q = params.get("q") ?? "";
  const compare = params.get("compare");
  const focus = params.get("focus");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "ALL") next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let rows = [...views];
    if (side !== "ALL") rows = rows.filter((r) => r.side === side);
    if (market !== "ALL") rows = rows.filter((r) => r.market === market);
    if (pos !== "ALL") rows = rows.filter((r) => r.position === pos);
    if (window !== "ALL") {
      rows = rows.filter((r) => matchesWindow(GAME_BY_ID[r.gameId], window as "EARLY" | "LATE" | "SNF"));
    }
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter((r) => `${r.playerName} ${r.matchup} ${r.market}`.toLowerCase().includes(needle));
    }
    if (focus) {
      const hit = rows.find((r) => r.id === focus);
      if (hit) rows = [hit, ...rows.filter((r) => r.id !== focus)];
    }
    if (compare) {
      const hit = rows.find((r) => r.id === compare);
      if (hit) rows = [hit, ...rows.filter((r) => r.id !== compare && r.market === hit.market)];
    }
    rows.sort((a, b) => {
      const mul = dir === "asc" ? 1 : -1;
      if (sort === "player") return mul * a.playerName.localeCompare(b.playerName);
      if (sort === "line") return mul * ((a.line.value ?? 0) - (b.line.value ?? 0));
      if (sort === "prob") return mul * ((a.pricing.modelProb.value ?? 0) - (b.pricing.modelProb.value ?? 0));
      return mul * ((a.pricing.edge.value ?? -999) - (b.pricing.edge.value ?? -999));
    });
    return rows;
  }, [views, side, market, pos, window, q, sort, dir, focus, compare]);

  const filters = (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
      <Field label="Side" value={side} onChange={(v) => setParam("side", v)} options={["ALL", "OVER", "UNDER"]} />
      <Field
        label="Market"
        value={market}
        onChange={(v) => setParam("market", v)}
        options={["ALL", "PASS_YDS", "RUSH_YDS", "REC_YDS", "ANYTIME_TD"]}
      />
      <Field label="Pos" value={pos} onChange={(v) => setParam("pos", v)} options={["ALL", "QB", "RB", "WR", "TE"]} />
      <Field label="Window" value={window} onChange={(v) => setParam("window", v)} options={["ALL", "EARLY", "LATE", "SNF"]} />
      <Field label="Sort" value={sort} onChange={(v) => setParam("sort", v)} options={["edge", "line", "prob", "player"]} />
      <Field label="Dir" value={dir} onChange={(v) => setParam("dir", v)} options={["desc", "asc"]} />
      <label className="col-span-full text-[11px]">
        <span className="mb-1 block text-muted">Search</span>
        <input
          defaultValue={q}
          onChange={(e) => setParam("q", e.target.value)}
          className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
          placeholder="Player or market"
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      <PendingPanel capability={pendingForPhase(3)!} />
      <div className="hidden md:block">{filters}</div>
      <FilterDrawer title="Prop filters">{filters}</FilterDrawer>
      {filtered.length === 0 ? <EmptyState /> : <RankingTable views={filtered} />}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="text-[11px]">
      <span className="mb-1 block text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
