export type ViewParams = Record<string, string>;

export type NamedView = {
  id: string;
  label: string;
  params: ViewParams;
};

export const SAVED_VIEWS: NamedView[] = [
  { id: "wr-overs", label: "My Sunday WR Overs", params: { pos: "WR", side: "OVER" } },
  { id: "top-tds", label: "Top TDs", params: { market: "ANYTIME_TD" } },
  { id: "1pm-conf", label: "1 PM High Confidence", params: { window: "EARLY", conf: "B+" } },
  { id: "late", label: "Late Games", params: { window: "LATE" } },
  { id: "unders", label: "Unders Only", params: { side: "UNDER" } },
];

export const QUICK_FILTERS: NamedView[] = [
  { id: "aa", label: "A/A+ only", params: { conf: "A" } },
  { id: "no-limit", label: "No known limitation", params: { health: "NO_KNOWN_LIMITATION" } },
  { id: "no-wx", label: "No weather risk", params: { weather: "CLEAN" } },
  { id: "1pm", label: "1 PM", params: { window: "EARLY" } },
  { id: "4pm", label: "4 PM", params: { window: "LATE" } },
  { id: "tds", label: "TDs", params: { market: "ANYTIME_TD" } },
  { id: "overs", label: "Overs", params: { side: "OVER" } },
  { id: "unders", label: "Unders", params: { side: "UNDER" } },
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
