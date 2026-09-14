"use client";

import Link from "next/link";
import type { PropView } from "@/lib/prop-view";
import { useShell } from "@/components/shell/ShellProvider";

import { useLiveOps } from "@/components/shell/LiveOpsProvider";

export function PropActions({ view }: { view: PropView }) {
  const { toggleStar, toggleWatch, isStarred, isWatched, addToCard } = useShell();
  const live = useLiveOps().liveGate.actionable;
  return (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" onClick={() => toggleStar(view.id)} className="action-btn">
        {isStarred(view.id) ? "Starred" : "Star"}
      </button>
      <button
        type="button"
        onClick={() => addToCard(view.id)}
        className="action-btn"
        disabled={!live}
        title={live ? "Add to card" : "Not live — do not bet from this page."}
      >
        {live ? "Add" : "Add locked"}
      </button>
      <button type="button" onClick={() => toggleWatch(view.id)} className="action-btn">
        {isWatched(view.id) ? "Watching" : "Watch"}
      </button>
      <Link href={`/players/${view.playerId}`} className="action-btn">
        Player
      </Link>
      <Link href={`/games/${view.gameId}`} className="action-btn">
        Game
      </Link>
      <Link href={`/compare?ids=${view.id}`} className="action-btn">
        Compare
      </Link>
    </div>
  );
}
