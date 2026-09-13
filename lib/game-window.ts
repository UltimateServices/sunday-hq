import type { Game, LiveStatus } from "@/lib/types/domain";

export function liveStatus(game: Game): LiveStatus {
  return game.status === "FINAL" ? "FINAL" : game.status === "LIVE" ? "LIVE" : "UPCOMING";
}

export function windowFilter(game: Game): "1PM" | "4PM" | "SNF" {
  if (game.window === "SNF") return "SNF";
  if (game.window === "LATE") return "4PM";
  return "1PM";
}

export function matchesWindow(game: Game, filter: "ALL" | "1PM" | "4PM" | "SNF" | "EARLY" | "LATE"): boolean {
  if (filter === "ALL") return true;
  if (filter === "EARLY") return game.window === "EARLY";
  if (filter === "LATE") return game.window === "LATE";
  if (filter === "SNF") return game.window === "SNF";
  return windowFilter(game) === filter;
}
