"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

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
  finalCard: boolean;
  setFinalCard: (v: boolean) => void;
  stars: string[];
  watch: string[];
  card: string[];
  toggleStar: (id: string) => void;
  toggleWatch: (id: string) => void;
  addToCard: (id: string) => void;
  isStarred: (id: string) => boolean;
  isWatched: (id: string) => boolean;
};

const ShellContext = createContext<ShellState | null>(null);

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [viewRefreshedAt, setViewRefreshedAt] = useState<string | null>(null);
  const [finalCard, setFinalCard] = useState(false);
  const [stars, setStars] = useState<string[]>([]);
  const [watch, setWatch] = useState<string[]>([]);
  const [card, setCard] = useState<string[]>([]);

  const refreshView = useCallback(() => {
    setViewRefreshedAt(new Date().toISOString());
  }, []);

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
      finalCard,
      setFinalCard,
      stars,
      watch,
      card,
      toggleStar: (id) => setStars((s) => toggleId(s, id)),
      toggleWatch: (id) => setWatch((s) => toggleId(s, id)),
      addToCard: (id) => setCard((s) => (s.includes(id) ? s : [...s, id])),
      isStarred: (id) => stars.includes(id),
      isWatched: (id) => watch.includes(id),
    }),
    [collapsed, searchOpen, alertsOpen, moreOpen, viewRefreshedAt, refreshView, finalCard, stars, watch, card],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellState {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell requires ShellProvider");
  return ctx;
}
