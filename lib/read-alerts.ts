import { READ_ALERTS_KEY } from "@/lib/settings";

const EVENT = "sunday-hq-read-alerts";
const EMPTY: string[] = [];

let raw = "__init__";
let cache: string[] = EMPTY;

function parse(value: string): string[] {
  try {
    const parsed = value ? (JSON.parse(value) as string[]) : EMPTY;
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function getReadAlertsSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const next = localStorage.getItem(READ_ALERTS_KEY) ?? "";
  if (next === raw) return cache;
  raw = next;
  cache = parse(next);
  return cache;
}

export function getReadAlertsServer(): string[] {
  return EMPTY;
}

export function subscribeReadAlerts(onStoreChange: () => void): () => void {
  const onEvent = () => onStoreChange();
  window.addEventListener("storage", onEvent);
  window.addEventListener(EVENT, onEvent);
  return () => {
    window.removeEventListener("storage", onEvent);
    window.removeEventListener(EVENT, onEvent);
  };
}

export function markAlertsRead(ids: string[]): void {
  const current = new Set(getReadAlertsSnapshot());
  for (const id of ids) current.add(id);
  const next = [...current];
  cache = next;
  raw = JSON.stringify(next);
  localStorage.setItem(READ_ALERTS_KEY, raw);
  window.dispatchEvent(new Event(EVENT));
}
