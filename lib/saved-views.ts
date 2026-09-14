export type ViewParams = Record<string, string>;

export type NamedView = {
  id: string;
  label: string;
  params: ViewParams;
};

/** Query keys owned by the props (and similar) boards. Named views replace these. */
export const FILTER_KEYS = [
  "side",
  "market",
  "pos",
  "window",
  "sort",
  "dir",
  "q",
  "conf",
  "health",
  "weather",
  "starred",
  "minEdge",
  "minEv",
  "minProb",
  "compare",
  "focus",
  "view",
] as const;

export const CUSTOM_VIEWS_KEY = "sunday-hq-custom-views";
export const CUSTOM_VIEWS_EVENT = "sunday-hq-custom-views";

const EMPTY_CUSTOM_VIEWS: NamedView[] = [];
let customCache: NamedView[] = EMPTY_CUSTOM_VIEWS;
let customRaw = "";

export const SAVED_VIEWS: NamedView[] = [
  { id: "wr-overs", label: "My Sunday WR Overs", params: { pos: "WR", side: "OVER" } },
  { id: "top-tds", label: "Top TDs", params: { market: "ANYTIME_TD" } },
  { id: "1pm-conf", label: "1 PM High Confidence", params: { window: "EARLY", conf: "B+" } },
  { id: "late", label: "Late Games", params: { window: "LATE" } },
  { id: "unders", label: "Unders Only", params: { side: "UNDER" } },
];

/** Blueprint 116 says “HEALTHY ONLY”; product lock forbids a “healthy” chip. */
export const QUICK_FILTERS: NamedView[] = [
  { id: "aa", label: "A/A+ only", params: { conf: "A" } },
  { id: "no-limit", label: "No known limitation", params: { health: "NO_KNOWN_LIMITATION" } },
  { id: "no-wx", label: "No weather risk", params: { weather: "CLEAN" } },
  { id: "1pm", label: "1 PM", params: { window: "EARLY" } },
  { id: "4pm", label: "4 PM", params: { window: "LATE" } },
  { id: "tds", label: "TDs", params: { market: "ANYTIME_TD" } },
  { id: "overs", label: "Overs", params: { side: "OVER" } },
  { id: "unders-q", label: "Unders", params: { side: "UNDER" } },
  { id: "edge", label: "Top edge", params: { sort: "edge" } },
  { id: "ev", label: "Top EV", params: { sort: "ev" } },
  { id: "starred", label: "Starred", params: { starred: "1" } },
];

export function applyViewParams(current: URLSearchParams, params: ViewParams): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(params)) {
    if (!value || value === "ALL") next.delete(key);
    else next.set(key, value);
  }
  return next;
}

export function replaceWithView(params: ViewParams, viewId?: string): URLSearchParams {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!value || value === "ALL" || key === "view") continue;
    next.set(key, value);
  }
  if (viewId) next.set("view", viewId);
  return next;
}

export function clearViewParams(current: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  for (const key of FILTER_KEYS) next.delete(key);
  return next;
}

export function viewIsActive(current: URLSearchParams, view: NamedView): boolean {
  if (current.get("view") === view.id) return true;
  const entries = Object.entries(view.params).filter(([, value]) => value && value !== "ALL");
  if (entries.length === 0) return false;
  return entries.every(([key, value]) => current.get(key) === value);
}

export function paramsFromSearch(current: URLSearchParams): ViewParams {
  const params: ViewParams = {};
  for (const key of FILTER_KEYS) {
    if (key === "view") continue;
    const value = current.get(key);
    if (value) params[key] = value;
  }
  return params;
}

export function readCustomViews(): NamedView[] {
  if (typeof window === "undefined") return EMPTY_CUSTOM_VIEWS;
  const raw = localStorage.getItem(CUSTOM_VIEWS_KEY) ?? "";
  if (raw === customRaw) return customCache;
  customRaw = raw;
  try {
    const parsed = JSON.parse(raw) as NamedView[];
    customCache =
      Array.isArray(parsed) && parsed.length > 0
        ? parsed.filter((view) => view && typeof view.id === "string" && typeof view.label === "string" && view.params)
        : EMPTY_CUSTOM_VIEWS;
  } catch {
    customCache = EMPTY_CUSTOM_VIEWS;
  }
  return customCache;
}

export function writeCustomViews(views: NamedView[]) {
  if (typeof window === "undefined") return;
  const next = views.slice(0, 12);
  const raw = JSON.stringify(next);
  localStorage.setItem(CUSTOM_VIEWS_KEY, raw);
  customRaw = raw;
  customCache = next.length > 0 ? next : EMPTY_CUSTOM_VIEWS;
  window.dispatchEvent(new Event(CUSTOM_VIEWS_EVENT));
}

export function subscribeCustomViews(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(CUSTOM_VIEWS_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(CUSTOM_VIEWS_EVENT, handler);
  };
}

export function getServerCustomViews(): NamedView[] {
  return EMPTY_CUSTOM_VIEWS;
}
