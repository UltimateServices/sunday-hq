import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hasBlobToken, isVercelRuntime } from "./env";
import type { OddsArchive, OddsSnapshot } from "./types";
import { STORE_KEYS } from "./types";

const memory = new Map<string, unknown>();

export type StoreBackend = "blob" | "memory" | "file";

export function storeBackend(): StoreBackend {
  if (hasBlobToken()) return "blob";
  if (isVercelRuntime()) return "memory";
  return "file";
}

function localPath(key: string): string {
  const file = key.replace("sunday-hq/", "");
  return path.join(process.cwd(), "data", "snapshots", file);
}

async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

async function blobRead<T>(key: string): Promise<T | null> {
  const { get } = await import("@vercel/blob");
  const result = await get(key, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await streamToText(result.stream);
  return JSON.parse(text) as T;
}

async function blobWrite(key: string, value: unknown): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(key, JSON.stringify(value), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

async function fileRead<T>(key: string): Promise<T | null> {
  try {
    const text = await readFile(localPath(key), "utf8");
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function fileWrite(key: string, value: unknown): Promise<void> {
  const dest = localPath(key);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, JSON.stringify(value, null, 2), "utf8");
}

export async function readJson<T>(key: string): Promise<T | null> {
  const backend = storeBackend();
  if (backend === "blob") {
    try {
      const fromBlob = await blobRead<T>(key);
      if (fromBlob) {
        memory.set(key, fromBlob);
        return fromBlob;
      }
    } catch {
      // fall through to memory overlay
    }
  }
  if (memory.has(key)) return memory.get(key) as T;
  if (backend === "file") return fileRead<T>(key);
  return null;
}

export async function writeJson<T>(key: string, value: T): Promise<StoreBackend> {
  memory.set(key, value);
  const backend = storeBackend();
  if (backend === "blob") {
    await blobWrite(key, value);
    return "blob";
  }
  if (backend === "file") {
    await fileWrite(key, value);
    return "file";
  }
  return "memory";
}

export async function readOddsSnapshot(): Promise<OddsSnapshot | null> {
  return readJson<OddsSnapshot>(STORE_KEYS.odds);
}

export async function writeOddsSnapshot(snapshot: OddsSnapshot): Promise<StoreBackend> {
  const archive = (await readJson<OddsArchive>(STORE_KEYS.archive)) ?? { snapshots: [] };
  const nextArchive: OddsArchive = {
    snapshots: [snapshot, ...archive.snapshots.filter((row) => row.asOf !== snapshot.asOf)].slice(0, 16),
  };
  await writeJson(STORE_KEYS.archive, nextArchive);
  return writeJson(STORE_KEYS.odds, snapshot);
}

export async function readOddsArchive(): Promise<OddsSnapshot[]> {
  const archive = await readJson<OddsArchive>(STORE_KEYS.archive);
  return archive?.snapshots ?? [];
}

export function fingerprint(input: unknown): string {
  const json = JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < json.length; i += 1) {
    hash = (Math.imul(31, hash) + json.charCodeAt(i)) | 0;
  }
  return `h${(hash >>> 0).toString(16)}`;
}
