import type { AlertItem } from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

export const ALERTS: AlertItem[] = [
  {
    id: "al-atl",
    kind: "INJURIES",
    severity: "CRITICAL",
    title: "Tua + Penix OUT — Rush starts",
    body: "ATL passing environment downgraded. Decision-impacting.",
    href: "/games/atl-pit",
    asOf: AS_OF,
  },
  {
    id: "al-bowers",
    kind: "INJURIES",
    severity: "CRITICAL",
    title: "Bowers OUT — Mayer residual",
    body: "Meniscus surgery. Mayer 39.5 consensus is not Bowers.",
    href: "/players/bowers",
    asOf: AS_OF,
  },
  {
    id: "al-kamara",
    kind: "INJURIES",
    severity: "IMPORTANT",
    title: "Kamara SOURCE CONFLICT",
    body: "Seed OUT vs CBS QUESTIONABLE. Etienne volume is conditional.",
    href: "/players/kamara",
    asOf: AS_OF,
  },
  {
    id: "al-nabers",
    kind: "INJURIES",
    severity: "WATCH",
    title: "Nabers GAME-TIME DECISION",
    body: "Full practice. His call. No consensus yard line.",
    href: "/players/nabers",
    asOf: AS_OF,
  },
  {
    id: "al-jax",
    kind: "WEATHER",
    severity: "IMPORTANT",
    title: "CLE @ JAX heat / storms",
    body: "Owner seed ESTIMATE. NWS hourly PENDING.",
    href: "/games/cle-jax",
    asOf: AS_OF,
  },
  {
    id: "al-ten",
    kind: "MARKETS",
    severity: "WATCH",
    title: "NYJ @ TEN total 38.5 → 39.5",
    body: "Owner floor vs ESPN DK widget. Still Sunday floor.",
    href: "/markets",
    asOf: AS_OF,
  },
  {
    id: "al-mayer",
    kind: "PROJECTIONS",
    severity: "INFO",
    title: "Mayer placeholder mean 45",
    body: "Vs 39.5 consensus after Bowers OUT. EV still unpriced.",
    href: "/players/mayer",
    asOf: AS_OF,
  },
];
