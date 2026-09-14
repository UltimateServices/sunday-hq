import type { BookId, BookQuote, Side } from "@/lib/types/domain";
import { americanToImplied } from "@/lib/odds";

export const BOOK_LABEL: Record<BookId, string> = {
  DRAFTKINGS: "DraftKings",
  FANDUEL: "FanDuel",
  BETMGM: "BetMGM",
  CAESARS: "Caesars",
  CONSENSUS: "Consensus",
  UNKNOWN: "Unknown",
};

function juiceScore(odds: number | null): number {
  if (odds === null) return -999;
  return -americanToImplied(odds);
}

/** Most favorable non-DK quote: better juice, then more favorable line for the side. */
export function bestBookQuote(books: BookQuote[], side: Side): BookQuote | null {
  const others = books.filter((row) => row.book !== "DRAFTKINGS" && row.oddsAmerican.value !== null);
  if (!others.length) return null;
  return [...others].sort((a, b) => {
    const juice = juiceScore(b.oddsAmerican.value) - juiceScore(a.oddsAmerican.value);
    if (juice !== 0) return juice;
    const aLine = a.line.value ?? 0;
    const bLine = b.line.value ?? 0;
    return side === "OVER" ? aLine - bLine : bLine - aLine;
  })[0] ?? null;
}

export function dkQuote(books: BookQuote[]): BookQuote | null {
  return books.find((row) => row.book === "DRAFTKINGS") ?? null;
}
