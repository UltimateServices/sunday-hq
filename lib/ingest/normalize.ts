import type { BookId, BookQuote, DataQuality, MarketType, MeasuredNumber, Side } from "@/lib/types/domain";
import { matchGameId, matchPlayerId } from "./names";
import type { OddsApiEvent, OddsApiMarket } from "./odds-api";
import type { OverlayGameLine, OverlayPropLine } from "./types";

const MARKET_MAP: Record<string, MarketType> = {
  player_pass_yds: "PASS_YDS",
  player_pass_tds: "PASS_TD",
  player_pass_completions: "COMPLETIONS",
  player_rush_yds: "RUSH_YDS",
  player_rush_tds: "RUSH_TD",
  player_reception_yds: "REC_YDS",
  player_receptions: "RECEPTIONS",
  player_reception_tds: "REC_TD",
  player_anytime_td: "ANYTIME_TD",
  player_1st_td: "FIRST_TD",
};

function measured(
  value: number | null,
  quality: DataQuality,
  source: string,
  asOf: string,
  note: string,
): MeasuredNumber {
  return { value, quality, source, asOf, note };
}

function draftKingsBook(): BookId {
  return "DRAFTKINGS";
}

function dkSource(asOf: string): string {
  return `DraftKings via The Odds API (${asOf})`;
}

const BOOK_KEY: Record<string, BookId> = {
  draftkings: "DRAFTKINGS",
  fanduel: "FANDUEL",
  betmgm: "BETMGM",
  williamhill_us: "CAESARS",
  caesars: "CAESARS",
};

function draftKingsMarkets(event: OddsApiEvent): OddsApiMarket[] {
  const book = event.bookmakers?.find((row) => row.key === "draftkings");
  return book?.markets ?? [];
}

function bookIdFor(key: string): BookId {
  return BOOK_KEY[key] ?? "UNKNOWN";
}

export function normalizeGameLines(events: OddsApiEvent[], asOf: string): {
  games: OverlayGameLine[];
  unmatchedGames: Array<{ name: string; market: string; reason: string }>;
} {
  const games: OverlayGameLine[] = [];
  const unmatchedGames: Array<{ name: string; market: string; reason: string }> = [];
  const source = dkSource(asOf);

  for (const event of events) {
    const gameId = matchGameId(event.away_team, event.home_team);
    if (!gameId) {
      unmatchedGames.push({
        name: `${event.away_team} @ ${event.home_team}`,
        market: "GAME",
        reason: "Event not on the Sunday HQ Week 1 Sunday slate.",
      });
      continue;
    }

    const markets = draftKingsMarkets(event);
    const spreads = markets.find((m) => m.key === "spreads");
    const totals = markets.find((m) => m.key === "totals");
    const homeSpread = spreads?.outcomes.find((o) => o.name === event.home_team);
    const over = totals?.outcomes.find((o) => o.name.toLowerCase() === "over");

    games.push({
      gameId,
      eventId: event.id,
      commenceTime: event.commence_time,
      spreadHome: measured(
        homeSpread?.point ?? null,
        homeSpread?.point !== undefined ? "VERIFIED" : "UNAVAILABLE",
        source,
        asOf,
        homeSpread?.point !== undefined
          ? `DK home spread. American ${homeSpread.price}.`
          : "DATA UNAVAILABLE — DraftKings spread missing on this event.",
      ),
      total: measured(
        over?.point ?? null,
        over?.point !== undefined ? "VERIFIED" : "UNAVAILABLE",
        source,
        asOf,
        over?.point !== undefined
          ? `DK total. Over ${over.price}.`
          : "DATA UNAVAILABLE — DraftKings total missing on this event.",
      ),
    });
  }

  return { games, unmatchedGames };
}

export function normalizePlayerProps(events: OddsApiEvent[], asOf: string): {
  props: OverlayPropLine[];
  unmatched: Array<{ name: string; market: string; reason: string }>;
} {
  const props: OverlayPropLine[] = [];
  const unmatched: Array<{ name: string; market: string; reason: string }> = [];
  const source = dkSource(asOf);

  const grouped = new Map<string, OverlayPropLine>();

  for (const event of events) {
    const gameId = matchGameId(event.away_team, event.home_team);
    if (!gameId) continue;
    for (const bookmaker of event.bookmakers ?? []) {
      const book = bookIdFor(bookmaker.key);
      for (const market of bookmaker.markets ?? []) {
        const mapped = MARKET_MAP[market.key];
        if (!mapped) continue;
        for (const outcome of market.outcomes) {
          const playerName = outcome.description ?? "";
          if (!playerName) continue;
          const side = (outcome.name.toLowerCase() === "under" ? "UNDER" : "OVER") as Side;
          const playerId = matchPlayerId(playerName);
          if (!playerId) {
            if (book === "DRAFTKINGS") {
              unmatched.push({
                name: playerName,
                market: mapped,
                reason: "Player is not in the Sunday HQ Week 1 desk.",
              });
            }
            continue;
          }
          const quote: BookQuote = {
            book,
            line: measured(
              outcome.point ?? (mapped === "ANYTIME_TD" ? 0.5 : null),
              outcome.point !== undefined || mapped === "ANYTIME_TD" ? "VERIFIED" : "UNAVAILABLE",
              `${book} via The Odds API (${asOf})`,
              asOf,
              `${book} player-prop line.`,
            ),
            oddsAmerican: measured(
              outcome.price ?? null,
              outcome.price !== undefined ? "VERIFIED" : "UNAVAILABLE",
              `${book} via The Odds API (${asOf})`,
              asOf,
              `${book} American odds.`,
            ),
          };
          const key = `${playerId}:${mapped}:${side}:${gameId}`;
          const existing = grouped.get(key);
          if (!existing) {
            grouped.set(key, {
              playerId,
              playerName,
              gameId,
              market: mapped,
              side,
              line: quote.line,
              oddsAmerican: quote.oddsAmerican,
              books: [quote],
            });
            continue;
          }
          existing.books = [...(existing.books ?? []), quote];
          if (book === "DRAFTKINGS") {
            existing.line = quote.line;
            existing.oddsAmerican = quote.oddsAmerican;
          }
        }
      }
    }
  }

  for (const row of grouped.values()) {
    const dk = row.books?.find((quote) => quote.book === "DRAFTKINGS");
    if (dk) {
      row.line = dk.line;
      row.oddsAmerican = dk.oddsAmerican;
    } else {
      row.line = measured(row.line.value, "UNAVAILABLE", source, asOf, "DK missing. Other books stored for compare only.");
      row.oddsAmerican = measured(null, "UNAVAILABLE", source, asOf, "DraftKings price DATA UNAVAILABLE. Do not treat another book as DK.");
    }
    props.push(row);
  }

  return { props, unmatched };
}

export { draftKingsBook };
