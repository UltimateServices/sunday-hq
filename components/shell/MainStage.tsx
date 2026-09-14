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
    <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
      {banner ? <div className="mb-5">{banner}</div> : null}
      {finalCard ? <FinalCardView /> : children}
    </main>
  );
}
