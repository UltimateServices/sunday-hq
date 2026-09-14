"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { SEED_CARD } from "@/data/week1/card";
import { PROP_BY_ID } from "@/data/week1/props";
import { applyLockToBet, buildLockSnapshot, livePropFromSnapshot } from "@/lib/card/lock";
import { CARD_KEY, DEFAULT_SETTINGS, SETTINGS_KEY, STARS_KEY, type AppSettings } from "@/lib/settings";
import type { OddsSnapshot } from "@/lib/ingest/types";
import type { CardBet, CardStatus, GameWindowFilter } from "@/lib/types/domain";

function persistCard(next: CardBet[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CARD_KEY, JSON.stringify(next));
}

type ShellState = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  alertsOpen: boolean;
  setAlertsOpen: (v: boolean) => void;
  moreOpen: boolean;
  setMoreOpen: (v: boolean) => void;
  viewRefreshedAt: string | null;
  refreshView: () => void;
  gameWindow: GameWindowFilter;
  setGameWindow: (v: GameWindowFilter) => void;
  finalCard: boolean;
  setFinalCard: (v: boolean) => void;
  stars: string[];
  watch: string[];
  card: string[];
  bets: CardBet[];
  toggleStar: (id: string) => void;
  toggleWatch: (id: string) => void;
  addToCard: (id: string) => void;
  placeBet: (betId: string, units: number) => Promise<void>;
  setBetStatus: (betId: string, status: CardStatus) => void;
  isStarred: (id: string) => boolean;
  isWatched: (id: string) => boolean;
};

const ShellContext = createContext<ShellState | null>(null);

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

const STARS_EVENT = "sunday-hq-stars";
const WINDOW_EVENT = "sunday-hq-window";
const EMPTY_STARS: string[] = [];
const SERVER_WINDOW: GameWindowFilter = DEFAULT_SETTINGS.defaultWindow;

let starsRaw = "__init__";
let starsCache: string[] = EMPTY_STARS;
let windowRaw = "__init__";
let windowCache: GameWindowFilter = SERVER_WINDOW;

function getStarsSnapshot(): string[] {
  const raw = localStorage.getItem(STARS_KEY) ?? "";
  if (raw === starsRaw) return starsCache;
  starsRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as string[]) : EMPTY_STARS;
    starsCache = parsed;
  } catch {
    starsCache = EMPTY_STARS;
  }
  return starsCache;
}

function getWindowSnapshot(): GameWindowFilter {
  const raw = localStorage.getItem(SETTINGS_KEY) ?? "";
  if (raw === windowRaw) return windowCache;
  windowRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<AppSettings>) : null;
    windowCache = parsed?.defaultWindow ?? SERVER_WINDOW;
  } catch {
    windowCache = SERVER_WINDOW;
  }
  return windowCache;
}

function getStarsServer(): string[] {
  return EMPTY_STARS;
}

function getWindowServer(): GameWindowFilter {
  return SERVER_WINDOW;
}

function subscribeStars(onStoreChange: () => void) {
  window.addEventListener(STARS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(STARS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function subscribeWindow(onStoreChange: () => void) {
  window.addEventListener(WINDOW_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(WINDOW_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [viewRefreshedAt, setViewRefreshedAt] = useState<string | null>(null);
  const gameWindow = useSyncExternalStore(subscribeWindow, getWindowSnapshot, getWindowServer);
  const [finalCard, setFinalCard] = useState(false);
  const stars = useSyncExternalStore(subscribeStars, getStarsSnapshot, getStarsServer);
  const [bets, setBets] = useState<CardBet[]>(SEED_CARD);

  const setGameWindow = useCallback((next: GameWindowFilter) => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const current = raw ? (JSON.parse(raw) as AppSettings) : DEFAULT_SETTINGS;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, defaultWindow: next }));
      window.dispatchEvent(new Event(WINDOW_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const watch = useMemo(() => bets.filter((b) => b.status === "WATCHING").map((b) => b.propId), [bets]);
  const card = useMemo(
    () => bets.filter((b) => b.status === "READY" || b.status === "PLACED").map((b) => b.propId),
    [bets],
  );

  const commitBets = useCallback((updater: (current: CardBet[]) => CardBet[]) => {
    setBets((current) => {
      const next = updater(current);
      persistCard(next);
      return next;
    });
  }, []);

  const refreshView = useCallback(() => {
    setViewRefreshedAt(new Date().toISOString());
  }, []);

  const addToCard = useCallback((propId: string) => {
    commitBets((current) => {
      if (current.some((b) => b.propId === propId && b.status !== "SETTLED")) return current;
      const prop = PROP_BY_ID[propId];
      const next: CardBet = {
        id: `session-${propId}`,
        propId,
        status: "READY",
        units: null,
        placedAt: null,
        settledAt: null,
        result: null,
        lineAtAdd: prop?.line.value ?? null,
        currentLine: prop?.line.value ?? null,
        review: prop?.line.quality === "ESTIMATE" ? "LINE_MOVED" : null,
        note: "Added from a board. Units unset. Confirm the real DK number before placing.",
        seedLabel: "SESSION",
      };
      return [...current, next];
    });
  }, [commitBets]);

  const placeBet = useCallback(async (betId: string, units: number) => {
    let snapshot: OddsSnapshot | null = null;
    try {
      const response = await fetch("/api/markets/live", { cache: "no-store" });
      if (response.ok) {
        const json = (await response.json()) as { snapshot?: OddsSnapshot | null };
        snapshot = json.snapshot ?? null;
      }
    } catch {
      snapshot = null;
    }

    let locked: CardBet | null = null;
    commitBets((current) =>
      current.map((b) => {
        if (b.id !== betId) return b;
        const live = livePropFromSnapshot(snapshot, b.propId);
        const next = applyLockToBet(b, units, buildLockSnapshot(b.propId, live));
        locked = next;
        return next;
      }),
    );

    if (locked) {
      try {
        await fetch("/api/card/lock", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ bet: locked, units }),
        });
      } catch {
        // local lock still holds
      }
    }
  }, [commitBets]);

  const setBetStatus = useCallback((betId: string, status: CardStatus) => {
    commitBets((current) => current.map((b) => (b.id === betId ? { ...b, status } : b)));
  }, [commitBets]);

  const value = useMemo<ShellState>(
    () => ({
      collapsed,
      setCollapsed,
      searchOpen,
      setSearchOpen,
      alertsOpen,
      setAlertsOpen,
      moreOpen,
      setMoreOpen,
      viewRefreshedAt,
      refreshView,
      gameWindow,
      setGameWindow,
      finalCard,
      setFinalCard,
      stars,
      watch,
      card,
      bets,
      toggleStar: (id) => {
        try {
          const next = toggleId(getStarsSnapshot(), id);
          localStorage.setItem(STARS_KEY, JSON.stringify(next));
          window.dispatchEvent(new Event(STARS_EVENT));
        } catch {
          // ignore
        }
      },
      toggleWatch: (id) => {
        commitBets((current) => {
          const exists = current.find((b) => b.propId === id && b.status === "WATCHING");
          if (exists) return current.filter((b) => b.id !== exists.id);
          const prop = PROP_BY_ID[id];
          return [
            ...current,
            {
              id: `watch-${id}`,
              propId: id,
              status: "WATCHING",
              units: null,
              placedAt: null,
              settledAt: null,
              result: null,
              lineAtAdd: prop?.line.value ?? null,
              currentLine: prop?.line.value ?? null,
              review: null,
              note: "Watching from a board.",
              seedLabel: "SESSION",
            },
          ];
        });
      },
      addToCard,
      placeBet,
      setBetStatus,
      isStarred: (id) => stars.includes(id),
      isWatched: (id) => watch.includes(id),
    }),
    [collapsed, searchOpen, alertsOpen, moreOpen, viewRefreshedAt, refreshView, gameWindow, setGameWindow, finalCard, stars, watch, card, bets, addToCard, placeBet, setBetStatus, commitBets],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellState {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell requires ShellProvider");
  return ctx;
}
