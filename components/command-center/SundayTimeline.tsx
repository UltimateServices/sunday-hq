"use client";

import { useState, useSyncExternalStore } from "react";
import { ToneChip } from "@/components/ds/badges";
import { EmptyState } from "@/components/ds/EmptyState";
import { getServerSettings, readSettings, subscribeSettings, writeSettings } from "@/lib/settings";
import {
  MILESTONE_LABELS,
  TIMELINE_MILESTONE_IDS,
  type SundayMilestone,
  type TimelineMilestoneId,
} from "@/lib/sunday-timeline";

const TONE = {
  DONE: "green",
  LIVE: "blue",
  PENDING: "purple",
} as const;

export function SundayTimeline({ milestones }: { milestones: SundayMilestone[] }) {
  const settings = useSyncExternalStore(subscribeSettings, readSettings, getServerSettings);
  const hidden = settings.hiddenTimelineMilestones;
  const [open, setOpen] = useState(false);

  function persist(nextHidden: TimelineMilestoneId[]) {
    writeSettings({ ...readSettings(), hiddenTimelineMilestones: nextHidden });
  }

  function toggle(id: TimelineMilestoneId) {
    persist(hidden.includes(id) ? hidden.filter((item) => item !== id) : [...hidden, id]);
  }

  const visible = milestones.filter((item) => !hidden.includes(item.id as TimelineMilestoneId));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] text-muted">Configurable milestones. RUN NOW stays on Admin. No invented clocks.</p>
        <button type="button" className="action-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? "Hide configure" : "Configure"}
        </button>
      </div>
      {open ? (
        <div className="flex flex-wrap gap-1">
          {TIMELINE_MILESTONE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`action-btn ${hidden.includes(id) ? "" : "text-gold"}`}
              aria-pressed={!hidden.includes(id)}
              onClick={() => toggle(id)}
            >
              {hidden.includes(id) ? "Hidden · " : "On · "}
              {MILESTONE_LABELS[id]}
            </button>
          ))}
        </div>
      ) : null}
      {visible.length === 0 ? (
        <EmptyState message="All timeline milestones are hidden." hint="Configure to show slate, inactives, pregame, refresh, late, or SNF." />
      ) : (
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
          {visible.map((item, index) => (
            <li key={item.id} className="surface relative p-3">
              <p className="text-[11px] text-muted">
                {index + 1} / {visible.length}
              </p>
              <ToneChip tone={TONE[item.status]}>{item.status}</ToneChip>
              <p className="mt-2 text-[14px] font-semibold">{item.label}</p>
              <p className="mt-1 text-[12px] text-muted">
                {item.at ? new Date(item.at).toLocaleString("en-US", { timeZone: "America/New_York" }) : "No timestamp"}
              </p>
              <p className="mt-1 text-[12px] text-muted">{item.note}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
