"use client";

import type { GameWindowFilter } from "@/lib/types/domain";

const OPTIONS: GameWindowFilter[] = ["ALL", "EARLY", "LATE", "SNF"];

export function WindowSwitcher({
  value,
  onChange,
}: {
  value: GameWindowFilter;
  onChange: (next: GameWindowFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Game window">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`action-btn ${value === option ? "text-gold" : ""}`}
        >
          {option === "EARLY" ? "1 PM" : option === "LATE" ? "4 PM" : option}
        </button>
      ))}
    </div>
  );
}
