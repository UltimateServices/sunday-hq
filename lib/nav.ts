import type { PhaseId, RouteReadiness } from "@/lib/types/domain";

export type NavGroupId =
  | "command"
  | "slate"
  | "positions"
  | "research"
  | "ticket"
  | "learn"
  | "admin";

export type NavItem = {
  href: string;
  label: string;
  short: string;
  icon: string;
  readiness: RouteReadiness;
  phase: PhaseId;
  group: NavGroupId;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Command Center", short: "HOME", icon: "⌘", readiness: "LIVE", phase: 1, group: "command" },
  { href: "/games", label: "Games", short: "GAMES", icon: "▦", readiness: "LIVE", phase: 1, group: "slate" },
  { href: "/props", label: "Props", short: "PROPS", icon: "☰", readiness: "LIVE", phase: 3, group: "slate" },
  { href: "/touchdowns", label: "Touchdowns", short: "TD", icon: "†", readiness: "LIVE", phase: 3, group: "slate" },
  { href: "/team-totals", label: "Team Totals", short: "TT", icon: "Σ", readiness: "LIVE", phase: 3, group: "slate" },
  { href: "/game-totals", label: "Game Totals", short: "GT", icon: "Σ", readiness: "LIVE", phase: 3, group: "slate" },
  { href: "/quarterbacks", label: "Quarterbacks", short: "QB", icon: "Q", readiness: "LIVE", phase: 2, group: "positions" },
  { href: "/running-backs", label: "Running Backs", short: "RB", icon: "R", readiness: "LIVE", phase: 2, group: "positions" },
  { href: "/wide-receivers", label: "Wide Receivers", short: "WR", icon: "W", readiness: "LIVE", phase: 2, group: "positions" },
  { href: "/tight-ends", label: "Tight Ends", short: "TE", icon: "T", readiness: "LIVE", phase: 2, group: "positions" },
  { href: "/fantasy", label: "Fantasy", short: "FAN", icon: "F", readiness: "LIVE", phase: 3, group: "positions" },
  { href: "/matchups", label: "Matchups", short: "MATCH", icon: "⚔", readiness: "LIVE", phase: 4, group: "research" },
  { href: "/weather", label: "Weather", short: "WX", icon: "☁", readiness: "LIVE", phase: 2, group: "research" },
  { href: "/injuries", label: "Injuries", short: "INJ", icon: "+", readiness: "LIVE", phase: 2, group: "research" },
  { href: "/markets", label: "Market Movement", short: "MKT", icon: "↕", readiness: "LIVE", phase: 4, group: "research" },
  { href: "/parlays", label: "Parlays", short: "SGP", icon: "⧉", readiness: "LIVE", phase: 5, group: "ticket" },
  { href: "/boosts", label: "Boosts", short: "BOOST", icon: "%", readiness: "LIVE", phase: 5, group: "ticket" },
  { href: "/my-card", label: "My Card", short: "CARD", icon: "▣", readiness: "LIVE", phase: 5, group: "ticket" },
  { href: "/results", label: "Results", short: "RES", icon: "✓", readiness: "LIVE", phase: 6, group: "learn" },
  { href: "/model-performance", label: "Model Performance", short: "MODEL", icon: "μ", readiness: "LIVE", phase: 6, group: "learn" },
  { href: "/admin", label: "Admin", short: "ADMIN", icon: "⚙", readiness: "LIVE", phase: 7, group: "admin" },
  { href: "/settings", label: "Settings", short: "SET", icon: "·", readiness: "LIVE", phase: 7, group: "admin" },
];

export const NAV_GROUPS: { id: NavGroupId; label: string }[] = [
  { id: "command", label: "" },
  { id: "slate", label: "Slate" },
  { id: "positions", label: "Positions" },
  { id: "research", label: "Context" },
  { id: "ticket", label: "Ticket" },
  { id: "learn", label: "Record" },
  { id: "admin", label: "System" },
];

export const MOBILE_TABS = [
  { href: "/", label: "Home", icon: "⌘" },
  { href: "/games", label: "Games", icon: "▦" },
  { href: "/props", label: "Props", icon: "☰" },
  { href: "/my-card", label: "My Card", icon: "▣" },
] as const;

export function titleFromPath(pathname: string): string {
  if (pathname.startsWith("/games/") && pathname !== "/games") return "Game Deep Dive";
  if (pathname.startsWith("/players/")) return "Player Deep Dive";
  if (pathname.startsWith("/teams/")) return "Team Deep Dive";
  if (pathname === "/dashboard") return "Command Center";
  return NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Sunday HQ";
}
