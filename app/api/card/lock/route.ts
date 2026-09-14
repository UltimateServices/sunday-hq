import { applyLockToBet, buildLockSnapshot, livePropFromSnapshot } from "@/lib/card/lock";
import { readOddsSnapshot } from "@/lib/ingest/store";
import { upsertPlaced } from "@/lib/settle/pipeline";
import { SEED_CARD } from "@/data/week1/card";
import type { CardBet } from "@/lib/types/domain";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    bet?: CardBet;
    betId?: string;
    propId?: string;
    units?: number;
  } | null;

  const units = Number(body?.units);
  if (!Number.isFinite(units) || units <= 0) {
    return Response.json({ ok: false, error: "units must be a positive number." }, { status: 400 });
  }

  const seed = body?.bet ?? SEED_CARD.find((row) => row.id === body?.betId);
  if (!seed && !body?.propId) {
    return Response.json({ ok: false, error: "bet or propId required." }, { status: 400 });
  }

  const bet: CardBet = seed ?? {
    id: `lock-${body?.propId}`,
    propId: body?.propId ?? "",
    status: "READY",
    units: null,
    placedAt: null,
    settledAt: null,
    result: null,
    lineAtAdd: null,
    currentLine: null,
    review: null,
    note: "Locked from API.",
    seedLabel: "SESSION",
  };

  const snapshot = await readOddsSnapshot();
  const live = livePropFromSnapshot(snapshot, bet.propId);
  const lock = buildLockSnapshot(bet.propId, live);
  const placed = applyLockToBet(bet, units, lock);
  await upsertPlaced(placed);
  return Response.json({ ok: true, bet: placed, usedLive: Boolean(live) });
}
