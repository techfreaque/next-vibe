import {
  reportStorageFailure,
  type StorageUsage,
} from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";

// Cross-platform storage interface
export interface Storage {
  getItem: (key: string, logger: EndpointLogger) => Promise<string | null>;
  setItem: (
    key: string,
    value: string,
    logger: EndpointLogger,
  ) => Promise<void>;
  removeItem: (key: string, logger: EndpointLogger) => Promise<void>;
}

// Platform-specific storage for Web using localStorage
export const storage: Storage = {
  getItem: (key: string, logger: EndpointLogger): Promise<string | null> => {
    return Promise.resolve(getLocalItem(key, logger));
  },

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

/**
 * SSR / workers have no Web Storage at all: that is "nothing stored", not a
 * failure, so it is debug-logged instead of reported.
 */
function storageUnavailable(
  area: "localStorage" | "sessionStorage",
  key: string,
  logger: EndpointLogger,
): boolean {
  const missing =
    area === "localStorage"
      ? typeof localStorage === "undefined"
      : typeof sessionStorage === "undefined";
  if (missing) {
    logger.debug(`[storage] ${area} unavailable (SSR/worker)`, { key });
  }
  return missing;
}

// ─── Sync localStorage helpers ────────────────────────────────────────────────
// Use these when synchronous access is required (e.g. event handlers, bridge protocols).

export function getLocalItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  if (storageUnavailable("localStorage", key, logger)) {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "get",
      key,
      error: error instanceof Error ? error : String(error),
    });
    return null;
  }
}

export function setLocalItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  if (storageUnavailable("localStorage", key, logger)) {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "set",
      key,
      error: error instanceof Error ? error : String(error),
      valueLength: value.length,
      usage: localStorageUsage(),
    });
  }
}

/**
 * What fills localStorage right now (key names + lengths only), so a quota
 * failure says which key is hogging the ~5 MB origin budget.
 */
function localStorageUsage(): StorageUsage {
  try {
    let usedChars = 0;
    let largestKey: string | null = null;
    let largestChars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const storedKey = localStorage.key(i);
      if (storedKey === null) {
        continue;
      }
      const chars =
        storedKey.length + (localStorage.getItem(storedKey)?.length ?? 0);
      usedChars += chars;
      if (chars > largestChars) {
        largestChars = chars;
        largestKey = storedKey;
      }
    }
    return {
      usedChars,
      keyCount: localStorage.length,
      largestKey,
      largestChars,
    };
  } catch {
    // Usage is diagnostic context only; the failure itself is still reported
    return {};
  }
}

export function removeLocalItem(key: string, logger: EndpointLogger): void {
  if (storageUnavailable("localStorage", key, logger)) {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "remove",
      key,
      error: error instanceof Error ? error : String(error),
    });
  }
}

// ─── Sync sessionStorage helpers ──────────────────────────────────────────────

export function getSessionItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  if (storageUnavailable("sessionStorage", key, logger)) {
    return null;
  }
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "sessionStorage",
      operation: "get",
      key,
      error: error instanceof Error ? error : String(error),
    });
    return null;
  }
}

export function setSessionItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  if (storageUnavailable("sessionStorage", key, logger)) {
    return;
  }
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "sessionStorage",
      operation: "set",
      key,
      error: error instanceof Error ? error : String(error),
      valueLength: value.length,
    });
  }
}

export function removeSessionItem(key: string, logger: EndpointLogger): void {
  if (storageUnavailable("sessionStorage", key, logger)) {
    return;
  }
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "sessionStorage",
      operation: "remove",
      key,
      error: error instanceof Error ? error : String(error),
    });
  }
}

// ─── Large values: IndexedDB with localStorage migration ─────────────────────
// localStorage caps at ~5 MB per origin and blocks the main thread. Values that
// can grow past that (incognito message history with inlined attachments,
// draft attachments) go to IndexedDB, whose quota is a share of free disk.
// Values written by older builds still sit in localStorage: a read that misses
// IndexedDB falls back to localStorage and moves the value over.

/** Outcome of one key-value backend call - never thrown, never rejected. */
export type LargeStoreResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error | string };

/** Minimal async key-value backend behind `largeStorage` (IndexedDB on web). */
export interface LargeStoreBackend {
  get: (key: string) => Promise<LargeStoreResult<string | null>>;
  put: (key: string, value: string) => Promise<LargeStoreResult<true>>;
  delete: (key: string) => Promise<LargeStoreResult<true>>;
  usage: () => Promise<StorageUsage>;
}

const IDB_NAME = "next-vibe-storage";
const IDB_STORE = "kv";

function domError(
  error: DOMException | Error | null,
  fallback: string,
): Error | string {
  return error ?? fallback;
}

/**
 * IndexedDB backend. Opens the database lazily; returns null from `open` when
 * IndexedDB is missing (SSR, some privacy modes) so callers use localStorage.
 */
function createIndexedDbBackend(): LargeStoreBackend | null {
  if (typeof indexedDB === "undefined") {
    return null;
  }
  let dbPromise: Promise<LargeStoreResult<IDBDatabase>> | null = null;

  /**
   * `version` undefined opens whatever exists (creating v1 + store when new).
   * A database that exists without our store is reopened one version higher
   * so upgradeneeded creates it.
   */
  const openAt = (
    version: number | undefined,
    healAttempts: number,
  ): Promise<LargeStoreResult<IDBDatabase>> =>
    new Promise<LargeStoreResult<IDBDatabase>>((resolve) => {
      let request: IDBOpenDBRequest;
      try {
        request =
          version === undefined
            ? indexedDB.open(IDB_NAME)
            : indexedDB.open(IDB_NAME, version);
      } catch (error) {
        resolve({
          ok: false,
          error: error instanceof Error ? error : String(error),
        });
        return;
      }
      request.addEventListener("upgradeneeded", () => {
        if (!request.result.objectStoreNames.contains(IDB_STORE)) {
          request.result.createObjectStore(IDB_STORE);
        }
      });
      request.addEventListener("success", () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          const nextVersion = db.version + 1;
          db.close();
          if (healAttempts <= 0) {
            resolve({ ok: false, error: "indexedDB store missing" });
            return;
          }
          void openAt(nextVersion, healAttempts - 1).then(resolve);
          return;
        }
        // Another tab upgrading or the browser evicting: reopen next time
        db.addEventListener("versionchange", () => {
          db.close();
          dbPromise = null;
        });
        db.addEventListener("close", () => {
          dbPromise = null;
        });
        resolve({ ok: true, value: db });
      });
      request.addEventListener("error", () => {
        resolve({
          ok: false,
          error: domError(request.error, "indexedDB.open failed"),
        });
      });
      request.addEventListener("blocked", () => {
        resolve({ ok: false, error: "indexedDB.open blocked" });
      });
    });

  const open = (): Promise<LargeStoreResult<IDBDatabase>> => {
    dbPromise ??= openAt(undefined, 1).then((result) => {
      if (!result.ok) {
        // Retry on the next call instead of caching the failure forever
        dbPromise = null;
      }
      return result;
    });
    return dbPromise;
  };

  const write = async (
    mode: "put" | "delete",
    key: string,
    value: string,
  ): Promise<LargeStoreResult<true>> => {
    const db = await open();
    if (!db.ok) {
      return db;
    }
    return new Promise<LargeStoreResult<true>>((resolve) => {
      try {
        const tx = db.value.transaction(IDB_STORE, "readwrite");
        const store = tx.objectStore(IDB_STORE);
        if (mode === "put") {
          store.put(value, key);
        } else {
          store.delete(key);
        }
        // Resolve on commit: QuotaExceededError surfaces as a transaction abort
        tx.addEventListener("complete", () =>
          resolve({ ok: true, value: true }),
        );
        tx.addEventListener("abort", () =>
          resolve({
            ok: false,
            error: domError(tx.error, "transaction aborted"),
          }),
        );
        tx.addEventListener("error", () =>
          resolve({
            ok: false,
            error: domError(tx.error, "transaction error"),
          }),
        );
      } catch (error) {
        resolve({
          ok: false,
          error: error instanceof Error ? error : String(error),
        });
      }
    });
  };

  return {
    get: async (key) => {
      const db = await open();
      if (!db.ok) {
        return db;
      }
      return new Promise<LargeStoreResult<string | null>>((resolve) => {
        try {
          const request = db.value
            .transaction(IDB_STORE, "readonly")
            .objectStore(IDB_STORE)
            .get(key);
          request.addEventListener("success", () => {
            const value: string | null =
              typeof request.result === "string" ? request.result : null;
            resolve({ ok: true, value });
          });
          request.addEventListener("error", () => {
            resolve({
              ok: false,
              error: domError(request.error, "get failed"),
            });
          });
        } catch (error) {
          resolve({
            ok: false,
            error: error instanceof Error ? error : String(error),
          });
        }
      });
    },
    put: (key, value) => write("put", key, value),
    delete: (key) => write("delete", key, ""),
    usage: async () => {
      try {
        if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
          return {};
        }
        const estimate = await navigator.storage.estimate();
        return {
          originUsageBytes: estimate.usage,
          originQuotaBytes: estimate.quota,
        };
      } catch {
        // Diagnostic context only
        return {};
      }
    },
  };
}

/** Report an IndexedDB failure; writes carry origin usage/quota context. */
async function reportIdb(
  backend: LargeStoreBackend,
  operation: "get" | "set" | "remove" | "migrate",
  key: string,
  error: Error | string,
  logger: EndpointLogger,
  valueLength?: number,
): Promise<void> {
  reportStorageFailure(logger, {
    platform: "web",
    area: "indexedDB",
    operation,
    key,
    error,
    valueLength,
    usage: operation === "get" ? undefined : await backend.usage(),
  });
}

/**
 * Build a `Storage` that keeps values in `backend` and transparently migrates
 * values an older build left in localStorage. Exported for tests.
 */
export function createLargeStorage(
  getBackend: () => LargeStoreBackend | null,
): Storage {
  return {
    getItem: async (key, logger) => {
      const backend = getBackend();
      if (!backend) {
        return getLocalItem(key, logger);
      }
      const stored = await backend.get(key);
      if (!stored.ok) {
        await reportIdb(backend, "get", key, stored.error, logger);
        return getLocalItem(key, logger);
      }
      if (stored.value !== null) {
        return stored.value;
      }
      // Not in IndexedDB yet: an older build may have left it in localStorage
      const legacy = getLocalItem(key, logger);
      if (legacy === null) {
        return null;
      }
      const moved = await backend.put(key, legacy);
      if (moved.ok) {
        // Free the localStorage quota the value was blocking
        removeLocalItem(key, logger);
      } else {
        // Value stays readable from localStorage; the move retries next read
        await reportIdb(
          backend,
          "migrate",
          key,
          moved.error,
          logger,
          legacy.length,
        );
      }
      return legacy;
    },

    setItem: async (key, value, logger) => {
      const backend = getBackend();
      if (!backend) {
        setLocalItem(key, value, logger);
        return;
      }
      const written = await backend.put(key, value);
      if (!written.ok) {
        // No localStorage fallback: a stale IndexedDB copy would shadow it on
        // the next read. The write is lost, so it is reported as an error.
        await reportIdb(
          backend,
          "set",
          key,
          written.error,
          logger,
          value.length,
        );
        return;
      }
      // Drop any pre-migration copy so it can never shadow or hog quota
      removeLocalItem(key, logger);
    },

    removeItem: async (key, logger) => {
      const backend = getBackend();
      if (backend) {
        const removed = await backend.delete(key);
        if (!removed.ok) {
          await reportIdb(backend, "remove", key, removed.error, logger);
        }
      }
      removeLocalItem(key, logger);
    },
  };
}

let indexedDbBackend: LargeStoreBackend | null | undefined;

/**
 * Storage for values that can outgrow localStorage (MBs): IndexedDB on web,
 * localStorage only where IndexedDB does not exist. Same API as `storage`.
 */
export const largeStorage: Storage = createLargeStorage(() => {
  if (indexedDbBackend === undefined) {
    indexedDbBackend = createIndexedDbBackend();
  }
  return indexedDbBackend;
});
