import { SUNDAY_ROUTINE } from "@/data/week1/admin";
import type { SundayRoutineStep } from "@/lib/types/domain";

export type SundayMilestone = {
  id: string;
  label: string;
  status: SundayRoutineStep["status"];
  at: string | null;
  note: string;
};

export const TIMELINE_MILESTONE_IDS = ["slate", "inactive", "pregame", "refresh", "late", "snf"] as const;
export type TimelineMilestoneId = (typeof TIMELINE_MILESTONE_IDS)[number];

const MILESTONES: { id: TimelineMilestoneId; label: string; stepId: string; fallbackNote: string }[] = [
  { id: "slate", label: "Initial slate", stepId: "r1", fallbackNote: "PENDING — no slate timestamp stored." },
  { id: "inactive", label: "Inactives", stepId: "r2", fallbackNote: "PENDING — no inactive timestamp stored." },
  { id: "pregame", label: "Pregame model", stepId: "r4", fallbackNote: "PENDING — no pregame timestamp stored." },
  { id: "refresh", label: "Major refresh", stepId: "r6", fallbackNote: "PENDING — no major-refresh timestamp stored." },
  {
    id: "late",
    label: "Late-game refresh",
    stepId: "late",
    fallbackNote: "PENDING — no separate 4 PM pull stored. Late window still uses the monitor step.",
  },
  { id: "snf", label: "SNF / learn", stepId: "r8", fallbackNote: "PENDING — Week 1 not settled. No SNF learn timestamp." },
];

export const MILESTONE_LABELS: Record<TimelineMilestoneId, string> = Object.fromEntries(
  MILESTONES.map((item) => [item.id, item.label]),
) as Record<TimelineMilestoneId, string>;

export function sundayMilestones(routine: SundayRoutineStep[] = SUNDAY_ROUTINE): SundayMilestone[] {
  return MILESTONES.map((item) => {
    if (item.id === "late") {
      return {
        id: item.id,
        label: item.label,
        status: "PENDING",
        at: null,
        note: item.fallbackNote,
      };
    }
    const step = routine.find((row) => row.id === item.stepId);
    return {
      id: item.id,
      label: item.label,
      status: step?.status ?? "PENDING",
      at: step?.at ?? null,
      note: step?.note ?? item.fallbackNote,
    };
  });
}
