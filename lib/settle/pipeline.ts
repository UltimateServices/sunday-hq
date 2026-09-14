import { SEED_CARD } from "@/data/week1/card";
import { GAME_BY_ID } from "@/data/week1/games";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { PROP_BY_ID } from "@/data/week1/props";
import { WEEK1_META } from "@/data/week1/meta";
import { readJson, writeJson } from "@/lib/ingest/store";
import { STORE_KEYS, type CardStore, type ResultsSnapshot } from "@/lib/ingest/types";
import type { CardBet, ResultRow } from "@/lib/types/domain";
import { actualForMarket, ESPN_SOURCE, fetchEspnBox, fetchEspnScoreboard } from "./espn";
import { closingFromArchive, gradeSide, measuredClv } from "./clv";

export async function readCardStore(): Promise<CardStore> {
  return (
    (await readJson<CardStore>(STORE_KEYS.card)) ?? {
      asOf: new Date().toISOString(),
      placed: [],
    }
  );
}

export async function upsertPlaced(bet: CardBet): Promise<CardStore> {
  const store = await readCardStore();
  store.placed = [bet, ...store.placed.filter((row) => row.id !== bet.id)];
  store.asOf = new Date().toISOString();
  await writeJson(STORE_KEYS.card, store);
  return store;
}

export async function readResultsSnapshot(): Promise<ResultsSnapshot> {
  return (
    (await readJson<ResultsSnapshot>(STORE_KEYS.results)) ?? {
      asOf: null,
      week: WEEK1_META.week,
      season: WEEK1_META.season,
      source: ESPN_SOURCE,
      rows: [],
      pending: [],
    }
  );
}

function ticketsToSettle(): CardBet[] {
  return SEED_CARD.filter((bet) => bet.status === "PLACED" || bet.status === "SETTLED");
}

export async function settleWeek(): Promise<ResultsSnapshot> {
  const [scoreboard, stored] = await Promise.all([fetchEspnScoreboard(), readCardStore()]);
  const finals = scoreboard.filter((game) => game.status === "FINAL");
  const pending = scoreboard.filter((game) => game.status !== "FINAL").map((game) => game.gameId);

  const statsByPlayer = new Map<string, Awaited<ReturnType<typeof fetchEspnBox>>[number]>();
  for (const game of finals) {
    const box = await fetchEspnBox(game.espnEventId);
    for (const row of box) statsByPlayer.set(row.playerId, row);
  }

  const tickets = [...stored.placed, ...ticketsToSettle()].filter(
    (bet, index, all) => all.findIndex((row) => row.id === bet.id) === index,
  );

  const rows: ResultRow[] = [];
  const stillPending: string[] = [...pending];

  for (const bet of tickets) {
    const prop = PROP_BY_ID[bet.propId];
    if (!prop) continue;
    const game = GAME_BY_ID[prop.gameId];
    if (!game) continue;
    const board = scoreboard.find((row) => row.gameId === game.id);
    if (!board || board.status !== "FINAL") {
      stillPending.push(`${bet.id}:${game.id}`);
      continue;
    }
    const stat = statsByPlayer.get(prop.playerId);
    const actualValue = actualForMarket(stat, prop.market);
    const player = PLAYER_BY_ID[prop.playerId];
    const taken = bet.lockSnapshot?.line ?? bet.lineAtAdd ?? prop.line.value;
    const close = await closingFromArchive({
      playerId: prop.playerId,
      market: prop.market,
      side: prop.side,
      kickoffIso: game.kickoffIso,
    });

    if (actualValue === null) {
      rows.push({
        id: `real-${bet.id}`,
        label: `REAL · ${player?.name ?? prop.playerId} ${prop.market} ${prop.side}`,
        market: prop.market,
        side: prop.side,
        units: bet.units ?? 0,
        result: "VOID",
        clv: measuredClv(prop.side, taken, close.line.value, close.snapshotAsOf),
        closingLine: close.line,
        lineTaken: {
          value: taken,
          quality: bet.lockSnapshot?.lineQuality ?? prop.line.quality,
          source: "PLACED lock snapshot",
          asOf: bet.placedAt,
        },
        seedLabel: "REAL",
        note: "FINAL game but no matching ESPN box-score line for this player/market. VOID — not a guessed grade.",
        week: WEEK1_META.week,
        actual: { value: null, quality: "UNAVAILABLE", source: ESPN_SOURCE, asOf: new Date().toISOString() },
        source: ESPN_SOURCE,
      });
      continue;
    }

    if (taken === null) {
      stillPending.push(`${bet.id}:no-lock-line`);
      continue;
    }

    rows.push({
      id: `real-${bet.id}`,
      label: `REAL · ${player?.name ?? prop.playerId} ${prop.market} ${prop.side} ${taken}`,
      market: prop.market,
      side: prop.side,
      units: bet.units ?? 0,
      result: gradeSide(prop.side, taken, actualValue),
      clv: measuredClv(prop.side, taken, close.line.value, close.snapshotAsOf),
      closingLine: close.line,
      lineTaken: {
        value: taken,
        quality: bet.lockSnapshot?.lineQuality ?? prop.line.quality,
        source: "PLACED lock snapshot",
        asOf: bet.placedAt,
      },
      seedLabel: "REAL",
      note: `Settled from ESPN box score. Actual ${actualValue}. Closing snapshot ${close.snapshotAsOf ?? "DATA UNAVAILABLE"}.`,
      week: WEEK1_META.week,
      actual: {
        value: actualValue,
        quality: "VERIFIED",
        source: ESPN_SOURCE,
        asOf: new Date().toISOString(),
      },
      source: ESPN_SOURCE,
    });
  }

  const snapshot: ResultsSnapshot = {
    asOf: new Date().toISOString(),
    week: WEEK1_META.week,
    season: WEEK1_META.season,
    source: ESPN_SOURCE,
    rows,
    pending: [...new Set(stillPending)],
  };
  await writeJson(STORE_KEYS.results, snapshot);
  return snapshot;
}
