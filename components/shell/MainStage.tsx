"use client";

import { useShell } from "./ShellProvider";
import { FinalCardView } from "./FinalCardView";

export function MainStage({ children }: { children: React.ReactNode }) {
  const { finalCard } = useShell();
  return (
    <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
      {finalCard ? <FinalCardView /> : children}
    </main>
  );
}
