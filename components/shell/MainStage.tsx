"use client";

import { useShell } from "./ShellProvider";
import { FinalCardView } from "./FinalCardView";

export function MainStage({
  children,
  banner,
}: {
  children: React.ReactNode;
  banner?: React.ReactNode;
}) {
  const { finalCard } = useShell();
  return (
    <main className="flex-1 px-3 py-4 pb-20 sm:px-5 lg:px-6 lg:pb-6">
      {banner ? <div className="mb-4">{banner}</div> : null}
      {finalCard ? <FinalCardView /> : children}
    </main>
  );
}
