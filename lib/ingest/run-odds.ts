import { hasOddsApiKey } from "./env";
import { fetchDraftKingsEventProps, fetchDraftKingsGameLines } from "./odds-api";
import { normalizeGameLines, normalizePlayerProps } from "./normalize";
import { storeBackend, writeOddsSnapshot } from "./store";
import type { OddsSnapshot } from "./types";
import { GAMES } from "@/data/week1/games";

function nowIso(): string {
  return new Date().toISOString();
}

function unavailableSnapshot(note: string, failure = false): OddsSnapshot {
  const asOf = nowIso();
  return {
    asOf,
    source: "none",
    book: "DRAFTKINGS",
    status: "UNAVAILABLE",
    freshness: "UNAVAILABLE",
    lastSuccessAt: null,
    lastFailureAt: failure ? asOf : null,
    lastFailureNote: failure ? note : null,
    lastAttemptAt: asOf,
    games: [],
    props: [],
    unmatched: [],
    requestsRemaining: null,
    note,
  };
}

export async function ingestOdds(): Promise<OddsSnapshot> {
  if (!hasOddsApiKey()) {
    const snapshot = unavailableSnapshot(
      "ODDS_API_KEY is not set. DraftKings prices stay DATA UNAVAILABLE. Seed lines remain labeled CONSENSUS/ESTIMATE — no verified DK prop tape was invented.",
    );
    snapshot.status = "DEGRADED";
    await writeOddsSnapshot(snapshot);
    return snapshot;
  }

  try {
    const gamesResult = await fetchDraftKingsGameLines();
    const slateIds = new Set(GAMES.map((game) => game.id));
    const { games, unmatchedGames } = normalizeGameLines(gamesResult.events, nowIso());
    const slateEvents = games.filter((game) => slateIds.has(game.gameId));

    const propEvents = [];
    let remaining = gamesResult.remaining;
    for (const game of slateEvents) {
      const fetched = await fetchDraftKingsEventProps(game.eventId);
      remaining = fetched.remaining ?? remaining;
      propEvents.push(...fetched.events);
    }

    const asOf = nowIso();
    const { props, unmatched } = normalizePlayerProps(propEvents, asOf);
    const snapshot: OddsSnapshot = {
      asOf,
      source: "the-odds-api",
      book: "DRAFTKINGS",
      status: slateEvents.length === 0 && props.length === 0 ? "DEGRADED" : "LIVE",
      freshness: "FRESH",
      lastSuccessAt: asOf,
      lastFailureAt: null,
      lastFailureNote: null,
      lastAttemptAt: asOf,
      games: slateEvents,
      props,
      unmatched: [...unmatchedGames, ...unmatched].slice(0, 40),
      requestsRemaining: remaining,
      note:
        slateEvents.length === 0 && props.length === 0
          ? "The Odds API responded but no Sunday HQ slate games matched. Seed remains in force. No invented DK prices."
          : `DraftKings tape via The Odds API. ${slateEvents.length} game lines, ${props.length} player-prop sides. Storage ${storeBackend()}.`,
    };
    await writeOddsSnapshot(snapshot);
    return snapshot;
  } catch (error) {
    const snapshot = unavailableSnapshot(error instanceof Error ? error.message : "Odds ingest failed.", true);
    snapshot.status = "DEGRADED";
    await writeOddsSnapshot(snapshot);
    return snapshot;
  }
}
