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

type WebStorageArea = "localStorage" | "sessionStorage";

/** The part of the DOM `Storage` interface these helpers use. */
interface WebStorageLike {
  readonly length: number;
  key: (index: number) => string | null;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/** Page-lifetime stand-in for a Web Storage area the browser has disabled. */
class MemoryWebStorage implements WebStorageLike {
  private readonly items = new Map<string, string>();
  get length(): number {
    return this.items.size;
  }
  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
  removeItem(key: string): void {
    this.items.delete(key);
  }
}

const memoryFallback: Record<WebStorageArea, MemoryWebStorage | null> = {
  localStorage: null,
  sessionStorage: null,
};

/**
 * The Web Storage area to use, or null when there is none (SSR / workers:
 * "nothing stored", debug-logged only).
 *
 * Some browsers disable Web Storage for the whole page: Android WebViews with
 * DOM storage off expose `localStorage === null`, sandboxed frames and some
 * privacy modes throw a SecurityError on access. Every get/set/remove would
 * then fail the same way (one log row per key per call). Instead the page
 * switches to an in-memory store and reports the condition ONCE per area:
 * values still work for this page view but are lost on reload, so it is an
 * error. Per-call failures on a working area (quota) are still reported by
 * the callers below.
 */
function resolveWebStorage(
  area: WebStorageArea,
  key: string,
  logger: EndpointLogger,
): WebStorageLike | null {
  const missing =
    area === "localStorage"
      ? typeof localStorage === "undefined"
      : typeof sessionStorage === "undefined";
  if (missing) {
    logger.debug(`[storage] ${area} unavailable (SSR/worker)`, { key });
    return null;
  }
  const fallback = memoryFallback[area];
  if (fallback) {
    return fallback;
  }
  let disabledBy: Error | string | null = null;
  try {
    const store: WebStorageLike | null =
      area === "localStorage" ? localStorage : sessionStorage;
    if (store) {
      return store;
    }
    disabledBy = `${area} is null (Web Storage disabled by the browser)`;
  } catch (error) {
    disabledBy = error instanceof Error ? error : String(error);
  }
  const memory = new MemoryWebStorage();
  memoryFallback[area] = memory;
  reportStorageFailure(logger, {
    platform: "web",
    area,
    operation: "open",
    key,
    error: disabledBy,
    disabled: true,
  });
  return memory;
}

/** Test hook: forget a previous disabled-storage fallback. */
export function resetWebStorageFallbackForTests(): void {
  memoryFallback.localStorage = null;
  memoryFallback.sessionStorage = null;
}

// ─── Sync localStorage helpers ────────────────────────────────────────────────
// Use these when synchronous access is required (e.g. event handlers, bridge protocols).

/**
 * Keys that are only ever read through `largeStorage` (IndexedDB first).
 * Builds before 2026-11-13 wrote them to localStorage; a copy left there can
 * fill the whole ~5 MB origin quota (prod 2026-11-17: `incognito_messages` at
 * 5.2 MB made every draft/tour write fail, 425 failed writes from one tab).
 */
const LARGE_VALUE_KEY = /^incognito_|^chat-draft:.+-attachments$/;

/**
 * Values a full localStorage could not take, kept for this page view. Later
 * writes of the same key go here directly (no repeated failing setItem) until
 * freeing quota lets them move back.
 */
const quotaOverflow = new Map<string, string>();
/** Keys whose quota failure was already reported on this page. */
const quotaReported = new Set<string>();
/** One quota cleanup per page: move stale large values to IndexedDB. */
let quotaCleanup: Promise<void> | null = null;

function isQuotaError(error: Error | string): boolean {
  const text =
    typeof error === "string" ? error : `${error.name} ${error.message}`;
  return /quota/i.test(text);
}

/** Test hook: forget quota overflow state. */
export function resetQuotaOverflowForTests(): void {
  quotaOverflow.clear();
  quotaReported.clear();
  quotaCleanup = null;
}

/**
 * Free localStorage quota: move stale large values (LARGE_VALUE_KEY) to
 * IndexedDB, where `largeStorage` reads them, then write back the values that
 * overflowed into memory. Runs once per page.
 */
function freeLocalQuota(
  store: WebStorageLike,
  logger: EndpointLogger,
): Promise<void> {
  if (quotaCleanup) {
    return quotaCleanup;
  }
  quotaCleanup = (async (): Promise<void> => {
    const backend = getIndexedDbBackend();
    const candidates: string[] = [];
    try {
      for (let i = 0; i < store.length; i++) {
        const storedKey = store.key(i);
        if (storedKey !== null && LARGE_VALUE_KEY.test(storedKey)) {
          candidates.push(storedKey);
        }
      }
    } catch {
      // Enumeration failing leaves nothing to move; overflow stays in memory
    }
    const moved: string[] = [];
    let freedChars = 0;
    if (backend) {
      for (const largeKey of candidates) {
        const legacy = store.getItem(largeKey);
        if (legacy === null) {
          continue;
        }
        // largeStorage reads IndexedDB first: an existing copy there is the
        // live one and the localStorage copy is dead weight
        const existing = await backend.get(largeKey);
        if (!(existing.ok && existing.value !== null)) {
          const put = await backend.put(largeKey, legacy);
          if (!put.ok) {
            await reportIdb(
              backend,
              "migrate",
              largeKey,
              put.error,
              logger,
              legacy.length,
            );
            continue;
          }
        }
        try {
          store.removeItem(largeKey);
          moved.push(largeKey);
          freedChars += largeKey.length + legacy.length;
        } catch {
          // Still readable from IndexedDB; the next cleanup retries
        }
      }
    }
    const restored: string[] = [];
    for (const [overflowKey, value] of quotaOverflow) {
      try {
        store.setItem(overflowKey, value);
        quotaOverflow.delete(overflowKey);
        restored.push(overflowKey);
      } catch {
        break; // still full: the rest stays in memory for this page
      }
    }
    logger.info("[storage] localStorage quota cleanup", {
      hasIndexedDb: backend !== null,
      candidates: candidates.join(", ").slice(0, 300),
      movedToIndexedDb: moved.join(", ").slice(0, 300),
      freedChars,
      restoredKeys: restored.length,
      stillInMemory: quotaOverflow.size,
    });
  })();
  return quotaCleanup;
}

export function getLocalItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  const overflow = quotaOverflow.get(key);
  if (overflow !== undefined) {
    return overflow;
  }
  const store = resolveWebStorage("localStorage", key, logger);
  if (!store) {
    return null;
  }
  try {
    return store.getItem(key);
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
  if (quotaOverflow.has(key)) {
    // localStorage was full for this key: keep it in memory instead of
    // failing (and reporting) the same write on every keystroke
    quotaOverflow.set(key, value);
    return;
  }
  const store = resolveWebStorage("localStorage", key, logger);
  if (!store) {
    return;
  }
  try {
    store.setItem(key, value);
  } catch (error) {
    const failure = error instanceof Error ? error : String(error);
    if (!isQuotaError(failure)) {
      reportStorageFailure(logger, {
        platform: "web",
        area: "localStorage",
        operation: "set",
        key,
        error: failure,
        valueLength: value.length,
        usage: storageUsage(store),
      });
      return;
    }
    quotaOverflow.set(key, value);
    const usage = storageUsage(store);
    const firstForKey = !quotaReported.has(key);
    quotaReported.add(key);
    if (!firstForKey) {
      void freeLocalQuota(store, logger);
      return;
    }
    void freeLocalQuota(store, logger).then(() => {
      // Reported once per key and page, after the cleanup, so the row says
      // whether the value is safe again or only lives until reload.
      reportStorageFailure(logger, {
        platform: "web",
        area: "localStorage",
        operation: "set",
        key,
        error: failure,
        valueLength: value.length,
        usage,
        extra: {
          fallback: "memory",
          recoveredAfterCleanup: !quotaOverflow.has(key),
        },
      });
      return undefined;
    });
  }
}

/**
 * What fills the area right now (key names + lengths only), so a quota
 * failure says which key is hogging the ~5 MB origin budget.
 */
function storageUsage(store: WebStorageLike): StorageUsage {
  try {
    let usedChars = 0;
    let largestKey: string | null = null;
    let largestChars = 0;
    for (let i = 0; i < store.length; i++) {
      const storedKey = store.key(i);
      if (storedKey === null) {
        continue;
      }
      const chars = storedKey.length + (store.getItem(storedKey)?.length ?? 0);
      usedChars += chars;
      if (chars > largestChars) {
        largestChars = chars;
        largestKey = storedKey;
      }
    }
    return {
      usedChars,
      keyCount: store.length,
      largestKey,
      largestChars,
    };
  } catch {
    // Usage is diagnostic context only; the failure itself is still reported
    return {};
  }
}

export function removeLocalItem(key: string, logger: EndpointLogger): void {
  quotaOverflow.delete(key);
  const store = resolveWebStorage("localStorage", key, logger);
  if (!store) {
    return;
  }
  try {
    store.removeItem(key);
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
  const store = resolveWebStorage("sessionStorage", key, logger);
  if (!store) {
    return null;
  }
  try {
    return store.getItem(key);
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
  const store = resolveWebStorage("sessionStorage", key, logger);
  if (!store) {
    return;
  }
  try {
    store.setItem(key, value);
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
  const store = resolveWebStorage("sessionStorage", key, logger);
  if (!store) {
    return;
  }
  try {
    store.removeItem(key);
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
/** Test hook: backend used instead of real IndexedDB (undefined = real). */
let indexedDbBackendOverride: LargeStoreBackend | null | undefined;

/** Test hook: swap the IndexedDB backend the quota cleanup uses. */
export function setIndexedDbBackendForTests(
  backend: LargeStoreBackend | null | undefined,
): void {
  indexedDbBackendOverride = backend;
}

function getIndexedDbBackend(): LargeStoreBackend | null {
  if (indexedDbBackendOverride !== undefined) {
    return indexedDbBackendOverride;
  }
  if (indexedDbBackend === undefined) {
    indexedDbBackend = createIndexedDbBackend();
  }
  return indexedDbBackend;
}

/**
 * Storage for values that can outgrow localStorage (MBs): IndexedDB on web,
 * localStorage only where IndexedDB does not exist. Same API as `storage`.
 */
export const largeStorage: Storage = createLargeStorage(getIndexedDbBackend);
