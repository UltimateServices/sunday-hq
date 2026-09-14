import { injuryForPlayer } from "@/data/week1/injuries";
import { PROP_BY_ID } from "@/data/week1/props";
import { confidenceGrade } from "@/lib/ui/confidence";
import { weatherLine } from "@/lib/prop-view";
import type { CardBet, PlaceLockSnapshot } from "@/lib/types/domain";
import type { OddsSnapshot, OverlayPropLine } from "@/lib/ingest/types";

export function buildLockSnapshot(propId: string, live?: OverlayPropLine | null): PlaceLockSnapshot {
  const seed = PROP_BY_ID[propId];
  const health = injuryForPlayer(seed?.playerId ?? "")?.health ?? "NO_KNOWN_LIMITATION";
  const line = live?.line.value ?? seed?.line.value ?? null;
  const odds = live?.oddsAmerican.value ?? seed?.oddsAmerican.value ?? null;
  const lineQuality = live?.line.quality ?? seed?.line.quality ?? "UNAVAILABLE";
  const oddsQuality = live?.oddsAmerican.quality ?? seed?.oddsAmerican.quality ?? "UNAVAILABLE";
  return {
    line,
    lineQuality,
    odds,
    oddsQuality,
    projection: seed?.model.value ?? null,
    confidence: confidenceGrade({
      hasModel: seed?.model.value !== null,
      hasLine: line !== null,
      hasVerifiedOdds: odds !== null && oddsQuality === "VERIFIED",
      health,
      lineQuality,
      modelQuality: seed?.model.quality ?? "UNAVAILABLE",
    }),
    health,
    weather: seed ? weatherLine(seed.gameId) : "DATA UNAVAILABLE",
    book: live ? "DRAFTKINGS" : seed?.book ?? "UNKNOWN",
    asOf: new Date().toISOString(),
  };
}

export function applyLockToBet(bet: CardBet, units: number, lock: PlaceLockSnapshot): CardBet {
  return {
    ...bet,
    status: "PLACED",
    units,
    placedAt: new Date().toISOString(),
    lineAtAdd: bet.lineAtAdd ?? lock.line,
    currentLine: lock.line,
    lockSnapshot: lock,
    seedLabel: lock.oddsQuality === "VERIFIED" || lock.lineQuality === "VERIFIED" ? "REAL" : bet.seedLabel,
    note: `${bet.note} Locked ${units}u @ ${lock.line ?? "DATA UNAVAILABLE"} / ${lock.odds ?? "no DK odds"} · ${lock.confidence} · ${lock.health} · ${lock.weather}. No dollars. No unit inflation.`,
  };
}

export function livePropFromSnapshot(snapshot: OddsSnapshot | null, propId: string): OverlayPropLine | null {
  const seed = PROP_BY_ID[propId];
  if (!seed || !snapshot) return null;
  return (
    snapshot.props.find(
      (row) => row.playerId === seed.playerId && row.market === seed.market && row.side === seed.side,
    ) ?? null
  );
}
