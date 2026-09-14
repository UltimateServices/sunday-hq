"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PropView } from "@/lib/prop-view";
import { RankingTable } from "@/components/ds/RankingTable";
import { FilterDrawer } from "@/components/ds/FilterDrawer";
import { EmptyState } from "@/components/ds/EmptyState";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { GAME_BY_ID } from "@/data/week1/games";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { matchesWindow } from "@/lib/game-window";
import { SavedViewsBar } from "@/components/props/SavedViewsBar";
import { useShell } from "@/components/shell/ShellProvider";
import type { ConfidenceGrade } from "@/lib/types/domain";

type SortKey = "edge" | "line" | "player" | "prob" | "ev";

const CONF_RANK: Record<ConfidenceGrade, number> = {
  PASS: 0,
  C: 1,
  "B-": 2,
  B: 3,
  "B+": 4,
  "A-": 5,
  A: 6,
  "A+": 7,
};

export function PropsBoard({ views, live = false }: { views: PropView[]; live?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isStarred, gameWindow } = useShell();

  const side = params.get("side") ?? "ALL";
  const market = params.get("market") ?? "ALL";
  const pos = params.get("pos") ?? "ALL";
  const windowParam = params.get("window") ?? "ALL";
  const windowFilter = windowParam === "ALL" ? gameWindow : windowParam;
  const sort = (params.get("sort") ?? "edge") as SortKey;
  const dir = params.get("dir") === "asc" ? "asc" : "desc";
  const q = params.get("q") ?? "";
  const compare = params.get("compare");
  const focus = params.get("focus");
  const conf = params.get("conf") ?? "ALL";
  const health = params.get("health") ?? "ALL";
  const weather = params.get("weather") ?? "ALL";
  const starred = params.get("starred") === "1";
  const minEdge = Number(params.get("minEdge") ?? "");
  const minEv = Number(params.get("minEv") ?? "");
  const minProb = Number(params.get("minProb") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "ALL") next.delete(key);
    else next.set(key, value);
    next.delete("view");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let rows = [...views];
    if (side !== "ALL") rows = rows.filter((r) => r.side === side);
    if (market !== "ALL") rows = rows.filter((r) => r.market === market);
    if (pos !== "ALL") rows = rows.filter((r) => r.position === pos);
    if (windowFilter !== "ALL") {
      rows = rows.filter((r) => matchesWindow(GAME_BY_ID[r.gameId], windowFilter as "EARLY" | "LATE" | "SNF"));
    }
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter((r) => `${r.playerName} ${r.matchup} ${r.market}`.toLowerCase().includes(needle));
    }
    if (conf !== "ALL") {
      const floor = CONF_RANK[conf as ConfidenceGrade] ?? 0;
      rows = rows.filter((r) => CONF_RANK[r.confidenceGrade] >= floor);
    }
    if (health !== "ALL") rows = rows.filter((r) => r.health === health);
    if (weather === "CLEAN") {
      rows = rows.filter((r) => {
        const wx = WEATHER_BY_GAME[r.gameId];
        return !wx || wx.indoor || wx.impact === "NONE" || wx.impact === "MINOR";
      });
    }
    if (starred) rows = rows.filter((r) => isStarred(r.id));
    if (!Number.isNaN(minEdge) && params.get("minEdge")) {
      rows = rows.filter((r) => (r.pricing.edge.value ?? Number.NEGATIVE_INFINITY) >= minEdge);
    }
    if (!Number.isNaN(minEv) && params.get("minEv")) {
      rows = rows.filter((r) => (r.pricing.ev.value ?? Number.NEGATIVE_INFINITY) >= minEv);
    }
    if (!Number.isNaN(minProb) && params.get("minProb")) {
      rows = rows.filter((r) => (r.pricing.modelProb.value ?? 0) >= minProb);
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
      if (sort === "ev") return mul * ((a.pricing.ev.value ?? -999) - (b.pricing.ev.value ?? -999));
      return mul * ((a.pricing.edge.value ?? -999) - (b.pricing.edge.value ?? -999));
    });
    return rows;
  }, [
    views,
    side,
    market,
    pos,
    windowFilter,
    q,
    sort,
    dir,
    focus,
    compare,
    conf,
    health,
    weather,
    starred,
    minEdge,
    minEv,
    minProb,
    params,
    isStarred,
  ]);

  const filters = (
    <div className="space-y-3">
      <SavedViewsBar />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <Field label="Side" value={side} onChange={(v) => setParam("side", v)} options={["ALL", "OVER", "UNDER"]} />
        <Field
          label="Market"
          value={market}
          onChange={(v) => setParam("market", v)}
          options={["ALL", "PASS_YDS", "RUSH_YDS", "REC_YDS", "ANYTIME_TD"]}
        />
        <Field label="Pos" value={pos} onChange={(v) => setParam("pos", v)} options={["ALL", "QB", "RB", "WR", "TE"]} />
        <Field label="Window" value={windowParam} onChange={(v) => setParam("window", v)} options={["ALL", "EARLY", "LATE", "SNF"]} />
        <Field label="Sort" value={sort} onChange={(v) => setParam("sort", v)} options={["edge", "line", "prob", "ev", "player"]} />
        <Field label="Dir" value={dir} onChange={(v) => setParam("dir", v)} options={["desc", "asc"]} />
        <Field
          label="Min confidence"
          value={conf}
          onChange={(v) => setParam("conf", v)}
          options={["ALL", "A+", "A", "A-", "B+", "B", "B-", "C"]}
        />
        <Field
          label="Health"
          value={health}
          onChange={(v) => setParam("health", v)}
          options={["ALL", "NO_KNOWN_LIMITATION", "MINOR_CONCERN", "QUESTIONABLE", "EXPECTED_LIMITED", "GAME_TIME_DECISION", "OUT"]}
        />
        <Field label="Weather" value={weather} onChange={(v) => setParam("weather", v)} options={["ALL", "CLEAN"]} />
        <Field label="Starred" value={starred ? "1" : "ALL"} onChange={(v) => setParam("starred", v)} options={["ALL", "1"]} />
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Min edge</span>
          <input
            defaultValue={params.get("minEdge") ?? ""}
            onChange={(e) => setParam("minEdge", e.target.value)}
            className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
            placeholder="yards / %"
          />
        </label>
        <label className="text-[11px]">
          <span className="mb-1 block text-muted">Min EV</span>
          <input
            defaultValue={params.get("minEv") ?? ""}
            onChange={(e) => setParam("minEv", e.target.value)}
            className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
            placeholder="estimate only"
          />
        </label>
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
    </div>
  );

  return (
    <div className="space-y-4">
      <SeedBanner>
        Placeholder normal CDF + assumed -110 ranking. DK player-prop odds remain DATA UNAVAILABLE — never shown as a verified book price.
      </SeedBanner>
      <div className="hidden md:block">{filters}</div>
      <FilterDrawer title="Prop filters">{filters}</FilterDrawer>
      {!live ? (
        <EmptyState
          message="No live props."
          hint="Saved views still update the URL. Seed constructs stay hidden so they cannot look like tickets."
        />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <RankingTable views={filtered} />
      )}
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
            {o.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
