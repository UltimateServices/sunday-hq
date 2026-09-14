import { PLAYER_BY_ID } from "@/data/week1/players";
import type { Player } from "@/lib/types/domain";

export const RB_ROLES = [
  "WORKHORSE",
  "LEAD_BACK",
  "COMMITTEE",
  "PASS_DOWN_BACK",
  "GOAL_LINE_BACK",
  "ROLE_UNCERTAIN",
] as const;

export type RbRole = (typeof RB_ROLES)[number];

/**
 * Role from seed depth + notes only. Do not invent workhorse shares.
 * SOURCE CONFLICT / limited / successor notes stay ROLE UNCERTAIN or the note's lean.
 */
export function rbRoleFor(player: Player): RbRole {
  const notes = (player.notes ?? "").toLowerCase();
  if (notes.includes("source conflict") || notes.includes("usage uncertain") || notes.includes("managed")) {
    return "ROLE_UNCERTAIN";
  }
  if (notes.includes("volume beneficiary") || notes.includes("volume successor") || notes.includes("inherits")) {
    return "LEAD_BACK";
  }
  if (notes.includes("pass-down") || notes.includes("passing-down")) return "PASS_DOWN_BACK";
  if (notes.includes("goal-line") || notes.includes("goal line")) return "GOAL_LINE_BACK";
  if (player.depth === 2) return "COMMITTEE";
  if (player.depth === 1) return "LEAD_BACK";
  return "ROLE_UNCERTAIN";
}

export function rbRoleForId(playerId: string): RbRole | null {
  const player = PLAYER_BY_ID[playerId];
  if (!player || player.position !== "RB") return null;
  return rbRoleFor(player);
}

export function rbRoleLabel(role: RbRole): string {
  return role.replaceAll("_", " ");
}
