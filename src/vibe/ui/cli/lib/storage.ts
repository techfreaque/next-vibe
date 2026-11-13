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

import {
  reportStorageFailure,
  type StorageOperation,
} from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";
import type { Storage } from "../../web/lib/storage";

function storageDir(): string {
  return join(process.cwd(), ".tmp", "storage");
}

function keyPath(key: string): string {
  // Sanitize key to safe filename
  const safe = key.replaceAll(/[^a-zA-Z0-9_\-.]/g, "_"); // eslint-disable-line i18next/no-literal-string
  return join(storageDir(), `${safe}.json`);
}

function ensureDir(): void {
  const dir = storageDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function report(
  logger: EndpointLogger,
  operation: StorageOperation,
  key: string,
  error: Error | string,
  valueLength?: number,
): void {
  reportStorageFailure(logger, {
    platform: "cli",
    area: "file",
    operation,
    key,
    error,
    valueLength,
  });
}

export const storage: Storage = {
  getItem: (key: string, logger: EndpointLogger): Promise<string | null> =>
    Promise.resolve(getLocalItem(key, logger)),

  setItem: (
    key: string,
    value: string,
    logger: EndpointLogger,
  ): Promise<void> => {
    setLocalItem(key, value, logger);
    return Promise.resolve();
  },

  removeItem: (key: string, logger: EndpointLogger): Promise<void> => {
    removeLocalItem(key, logger);
    return Promise.resolve();
  },
};

// ─── Sync localStorage helpers (CLI: file-backed) ─────────────────────────────

export function getLocalItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  const path = keyPath(key);
  if (!existsSync(path)) {
    return null;
  }
  let raw: string;
  try {
    raw = readFileSync(path, "utf-8");
  } catch (error) {
    report(logger, "get", key, error instanceof Error ? error : String(error));
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as { value: string };
    return parsed.value;
  } catch (error) {
    // Corrupt/hand-edited file: treated as absent, but reported
    report(
      logger,
      "parse",
      key,
      error instanceof Error ? error : String(error),
    );
    return null;
  }
}

export function setLocalItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  try {
    ensureDir();
    writeFileSync(keyPath(key), JSON.stringify({ value }), "utf-8");
  } catch (error) {
    report(
      logger,
      "set",
      key,
      error instanceof Error ? error : String(error),
      value.length,
    );
  }
}

export function removeLocalItem(key: string, logger: EndpointLogger): void {
  try {
    const path = keyPath(key);
    if (existsSync(path)) {
      unlinkSync(path);
    }
  } catch (error) {
    report(
      logger,
      "remove",
      key,
      error instanceof Error ? error : String(error),
    );
  }
}

// ─── Sync sessionStorage helpers (CLI: same as local, no true session concept) ─

export function getSessionItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  return getLocalItem(key, logger);
}

export function setSessionItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  setLocalItem(key, value, logger);
}

export function removeSessionItem(key: string, logger: EndpointLogger): void {
  removeLocalItem(key, logger);
}

/**
 * Storage for values that can grow to MBs (web: IndexedDB).
 * The file store has no size cap, so large values use the same store.
 */
export const largeStorage: Storage = storage;
