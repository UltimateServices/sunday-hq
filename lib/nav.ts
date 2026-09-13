import type { PhaseId, RouteReadiness } from "@/lib/types/domain";

export type NavItem = {
  href: string;
  label: string;
  short: string;
  readiness: RouteReadiness;
  phase: PhaseId;
  group: "command" | "research" | "markets" | "ticket" | "learn";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Command Center", short: "HOME", readiness: "LIVE", phase: 1, group: "command" },
  { href: "/games", label: "Games", short: "GAMES", readiness: "LIVE", phase: 1, group: "research" },
  { href: "/props", label: "Props", short: "PROPS", readiness: "PLACEHOLDER", phase: 3, group: "markets" },
  { href: "/quarterbacks", label: "Quarterbacks", short: "QB", readiness: "PLACEHOLDER", phase: 2, group: "research" },
  { href: "/running-backs", label: "Running Backs", short: "RB", readiness: "PLACEHOLDER", phase: 2, group: "research" },
  { href: "/wide-receivers", label: "Wide Receivers", short: "WR", readiness: "PLACEHOLDER", phase: 2, group: "research" },
  { href: "/tight-ends", label: "Tight Ends", short: "TE", readiness: "PLACEHOLDER", phase: 2, group: "research" },
  { href: "/touchdowns", label: "Touchdowns", short: "TD", readiness: "PLACEHOLDER", phase: 2, group: "markets" },
  { href: "/team-totals", label: "Team Totals", short: "TT", readiness: "PLACEHOLDER", phase: 2, group: "markets" },
  { href: "/game-totals", label: "Game Totals", short: "GT", readiness: "LIVE", phase: 1, group: "markets" },
  { href: "/fantasy", label: "Fantasy", short: "FAN", readiness: "PLACEHOLDER", phase: 2, group: "research" },
  { href: "/matchups", label: "Matchups", short: "MATCH", readiness: "PENDING", phase: 4, group: "research" },
  { href: "/weather", label: "Weather", short: "WX", readiness: "LIVE", phase: 2, group: "research" },
  { href: "/injuries", label: "Injuries", short: "INJ", readiness: "LIVE", phase: 2, group: "research" },
  { href: "/lines", label: "Lines", short: "LINES", readiness: "LIVE", phase: 1, group: "markets" },
  { href: "/parlays", label: "Parlays", short: "SGP", readiness: "PENDING", phase: 5, group: "ticket" },
  { href: "/boosts", label: "Boosts", short: "BOOST", readiness: "PENDING", phase: 5, group: "ticket" },
  { href: "/my-card", label: "My Card", short: "CARD", readiness: "PENDING", phase: 5, group: "ticket" },
  { href: "/results", label: "Results", short: "RES", readiness: "PENDING", phase: 6, group: "learn" },
  { href: "/model-performance", label: "Model Performance", short: "MODEL", readiness: "PENDING", phase: 6, group: "learn" },
  { href: "/admin", label: "Admin / Settings", short: "ADMIN", readiness: "PENDING", phase: 7, group: "learn" },
];

export const NAV_GROUPS: { id: NavItem["group"]; label: string }[] = [
  { id: "command", label: "Command" },
  { id: "research", label: "Research" },
  { id: "markets", label: "Markets" },
  { id: "ticket", label: "Ticket" },
  { id: "learn", label: "Record / Learn" },
];
