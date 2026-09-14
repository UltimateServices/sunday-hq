import { ALERTS } from "@/data/week1/alerts";
import { WEEK1_META } from "@/data/week1/meta";
import { CHANGES } from "@/data/week1/news";
import type { AlertItem, ChangeItem } from "@/lib/types/domain";
import { readJson, writeJson } from "./store";
import { STORE_KEYS, type ChangelogSnapshot } from "./types";

const MAX_ITEMS = 40;

export async function readChangelog(): Promise<ChangelogSnapshot> {
  const stored = await readJson<ChangelogSnapshot>(STORE_KEYS.changelog);
  if (stored) return stored;
  return {
    asOf: WEEK1_META.lastUpdatedIso,
    items: CHANGES,
    alerts: ALERTS,
  };
}

export async function appendChangelog(input: {
  items?: ChangeItem[];
  alerts?: AlertItem[];
}): Promise<ChangelogSnapshot> {
  const current = await readChangelog();
  const nextItems = [...(input.items ?? []), ...current.items].filter(
    (item, index, all) => all.findIndex((row) => row.id === item.id || (row.fingerprint && row.fingerprint === item.fingerprint)) === index,
  );
  const nextAlerts = [...(input.alerts ?? []), ...current.alerts].filter(
    (item, index, all) => all.findIndex((row) => row.id === item.id) === index,
  );
  const next: ChangelogSnapshot = {
    asOf: new Date().toISOString(),
    items: nextItems.slice(0, MAX_ITEMS),
    alerts: nextAlerts.slice(0, MAX_ITEMS),
  };
  await writeJson(STORE_KEYS.changelog, next);
  return next;
}

export function changeFrom(partial: Omit<ChangeItem, "id"> & { id?: string }): ChangeItem {
  return {
    id: partial.id ?? `chg-${partial.fingerprint ?? Date.now()}`,
    ...partial,
  };
}
