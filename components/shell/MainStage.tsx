"use client";

import { useShell } from "./ShellProvider";
import { FinalCardView } from "./FinalCardView";

export function MainStage({ children }: { children: React.ReactNode }) {
  const { finalCard } = useShell();
  return (
    <main className="flex-1 px-3 py-4 pb-20 sm:px-5 lg:px-6 lg:pb-6">
      {finalCard ? <FinalCardView /> : children}
    </main>
  );
}
