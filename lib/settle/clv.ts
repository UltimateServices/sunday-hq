import type { DataQuality, MeasuredNumber, Side } from "@/lib/types/domain";
import type { OddsSnapshot, OverlayPropLine } from "@/lib/ingest/types";
import { readOddsArchive, readOddsSnapshot } from "@/lib/ingest/store";

export function closingLineValue(side: Side, lineTaken: number, closingLine: number): number {
  return side === "OVER" ? closingLine - lineTaken : lineTaken - closingLine;
}

export function gradeSide(side: Side, line: number, actual: number): "WIN" | "LOSS" | "PUSH" {
  if (actual === line) return "PUSH";
  const overHits = actual > line;
  if (side === "OVER") return overHits ? "WIN" : "LOSS";
  return overHits ? "LOSS" : "WIN";
}

function pickProp(snapshot: OddsSnapshot, playerId: string, market: string, side: Side): OverlayPropLine | undefined {
  return snapshot.props.find((row) => row.playerId === playerId && row.market === market && row.side === side);
}

export async function closingFromArchive(input: {
  playerId: string;
  market: string;
  side: Side;
  kickoffIso: string;
}): Promise<{ line: MeasuredNumber; snapshotAsOf: string | null }> {
  const archive = await readOddsArchive();
  const latest = await readOddsSnapshot();
  const pool = [...archive, ...(latest ? [latest] : [])];
  const kickoff = Date.parse(input.kickoffIso);
  const preKick = pool
    .filter((snap) => snap.status === "LIVE" && Date.parse(snap.asOf) < kickoff)
    .sort((a, b) => Date.parse(b.asOf) - Date.parse(a.asOf));

  for (const snap of preKick) {
    const hit = pickProp(snap, input.playerId, input.market, input.side);
    if (hit && hit.line.value !== null) {
      return { line: hit.line, snapshotAsOf: snap.asOf };
    }
  }

  return {
    line: {
      value: null,
      quality: "UNAVAILABLE" as DataQuality,
      source: "sunday-hq",
      asOf: null,
      note: "No pre-kick DraftKings snapshot. CLV stays DATA UNAVAILABLE — not invented.",
    },
    snapshotAsOf: null,
  };
}

export function measuredClv(side: Side, taken: number | null, close: number | null, asOf: string | null): MeasuredNumber {
  if (taken === null || close === null) {
    return {
      value: null,
      quality: "UNAVAILABLE",
      source: "sunday-hq",
      asOf,
      note: "CLV requires a lock line and a last pre-kick snapshot.",
    };
  }
  return {
    value: closingLineValue(side, taken, close),
    quality: "VERIFIED",
    source: "CLV = close − taken (OVER) or taken − close (UNDER)",
    asOf,
    note: "Yards (or TD units) vs last pre-kick DK snapshot.",
  };
}
