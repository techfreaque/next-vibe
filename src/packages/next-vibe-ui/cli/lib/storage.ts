/**
 * CLI storage implementation — file-backed, one file per key.
 * Stored at ./.tmp/storage/<key>.json relative to cwd.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";

import type { Storage } from "../../web/lib/storage";

function storageDir(): string {
  return join(process.cwd(), ".tmp", "storage");
}

function keyPath(key: string): string {
  // Sanitize key to safe filename
  const safe = key.replace(/[^a-zA-Z0-9_\-.]/g, "_"); // eslint-disable-line i18next/no-literal-string
  return join(storageDir(), `${safe}.json`);
}

function ensureDir(): void {
  const dir = storageDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export const storage: Storage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      const path = keyPath(key);
      if (!existsSync(path)) {
        return Promise.resolve(null);
      }
      const raw = readFileSync(path, "utf-8");
      const parsed = JSON.parse(raw) as { value: string };
      return Promise.resolve(parsed.value);
    } catch {
      return Promise.resolve(null);
    }
  },

  setItem: (key: string, value: string): Promise<void> => {
    try {
      ensureDir();
      writeFileSync(keyPath(key), JSON.stringify({ value }), "utf-8");
    } catch {
      // Silent
    }
    return Promise.resolve();
  },

  removeItem: (key: string): Promise<void> => {
    try {
      const path = keyPath(key);
      if (existsSync(path)) {
        unlinkSync(path);
      }
    } catch {
      // Silent
    }
    return Promise.resolve();
  },
};
