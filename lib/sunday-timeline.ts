import { SUNDAY_ROUTINE } from "@/data/week1/admin";
import type { SundayRoutineStep } from "@/lib/types/domain";

export type SundayMilestone = {
  id: string;
  label: string;
  status: SundayRoutineStep["status"];
  at: string | null;
  note: string;
};

const MILESTONES: { id: string; label: string; stepId: string }[] = [
  { id: "slate", label: "Initial slate", stepId: "r1" },
  { id: "inactive", label: "Inactives", stepId: "r2" },
  { id: "pregame", label: "Pregame model", stepId: "r4" },
  { id: "refresh", label: "Major refresh", stepId: "r6" },
  { id: "late", label: "Late-game refresh", stepId: "r6" },
  { id: "snf", label: "SNF / learn", stepId: "r8" },
];

export function sundayMilestones(routine: SundayRoutineStep[] = SUNDAY_ROUTINE): SundayMilestone[] {
  return MILESTONES.map((item) => {
    const step = routine.find((row) => row.id === item.stepId);
    return {
      id: item.id,
      label: item.label,
      status: step?.status ?? "PENDING",
      at: step?.at ?? null,
      note: step?.note ?? "PENDING — no timestamp stored.",
    };
  });
}
