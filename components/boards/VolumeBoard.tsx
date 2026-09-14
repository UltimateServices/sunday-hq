"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterDrawer } from "@/components/ds/FilterDrawer";
import { VolumeTable } from "@/components/boards/VolumeTable";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { filterVolumeRows, type VolumeBoardTab, type VolumeRow } from "@/lib/volume-board";
import type { GameWindowFilter, Position } from "@/lib/types/domain";
import type { VolumeStability } from "@/lib/volume-stability";

const TABS: { id: VolumeBoardTab; label: string; lede: string }[] = [
  {
    id: "SAFE",
    label: "Safe volume",
    lede: "ELITE / HIGH stability, no known limitation, no significant weather. Carry / target / snap counts stay DATA UNAVAILABLE.",
  },
  {
    id: "CEILING",
    label: "Ceiling",
    lede: "High-volume or shootout looks. Upside ranking is an ESTIMATE — explosive / RZ usage is not invented.",
  },
  {
    id: "FLOOR",
    label: "Floor",
    lede: "High-stability usage for conservative constructions. Not a guaranteed floor.",
  },
];

export function VolumeBoard({ rows, research }: { rows: VolumeRow[]; research: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = (params.get("tab") as VolumeBoardTab) || "SAFE";
  const pos = (params.get("pos") as Position | "ALL") || "ALL";
  const window = (params.get("window") as GameWindowFilter) || "ALL";
  const stability = (params.get("stability") as VolumeStability | "ALL") || "ALL";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "ALL") next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];
  const filtered = useMemo(
    () =>
      filterVolumeRows(rows, activeTab.id, {
        pos,
        window,
        stability,
      }),
    [rows, activeTab.id, pos, window, stability],
  );

  const filters = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`action-btn ${activeTab.id === item.id ? "text-gold" : ""}`}
            aria-pressed={activeTab.id === item.id}
            onClick={() => setParam("tab", item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Field label="Pos" value={pos} onChange={(value) => setParam("pos", value)} options={["ALL", "QB", "RB", "WR", "TE"]} />
        <Field
          label="Window"
          value={window}
          onChange={(value) => setParam("window", value)}
          options={["ALL", "EARLY", "LATE", "SNF"]}
        />
        <Field
          label="Stability"
          value={stability}
          onChange={(value) => setParam("stability", value)}
          options={["ALL", "ELITE", "HIGH", "MEDIUM", "LOW"]}
        />
      </div>
      <p className="text-[12px] text-muted">{activeTab.lede}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <SeedBanner>
        {research
          ? "Research board. Seed volume tags only. Not tickets. Live DK player-prop prices stay DATA UNAVAILABLE."
          : "Volume stability is still an ESTIMATE. Live tape does not create carry or target counts."}
      </SeedBanner>
      <div className="hidden md:block">{filters}</div>
      <FilterDrawer title="Volume filters">{filters}</FilterDrawer>
      <VolumeTable rows={filtered} research={research} />
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
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="text-[11px]">
      <span className="mb-1 block text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
