/**
 * CLI storage implementation - file-backed, one file per key.
 * Stored at ./.tmp/storage/<key>.json relative to cwd.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
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

// ─── Sync localStorage helpers (CLI: file-backed) ─────────────────────────────

export function getLocalItem(key: string): string | null {
  try {
    const path = keyPath(key);
    if (!existsSync(path)) {
      return null;
    }
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as { value: string };
    return parsed.value;
  } catch {
    return null;
  }
}

export function setLocalItem(key: string, value: string): void {
  try {
    ensureDir();
    writeFileSync(keyPath(key), JSON.stringify({ value }), "utf-8");
  } catch {
    // Silent
  }
}

export function removeLocalItem(key: string): void {
  try {
    const path = keyPath(key);
    if (existsSync(path)) {
      unlinkSync(path);
    }
  } catch {
    // Silent
  }
}

// ─── Sync sessionStorage helpers (CLI: same as local, no true session concept) ─

export function getSessionItem(key: string): string | null {
  return getLocalItem(key);
}

export function setSessionItem(key: string, value: string): void {
  setLocalItem(key, value);
}

export function removeSessionItem(key: string): void {
  removeLocalItem(key);
}
