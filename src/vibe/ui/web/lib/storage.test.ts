import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import type { EndpointLogger, LoggerMetadata } from "../../../logger/types";
import {
  createLargeStorage,
  type LargeStoreBackend,
  type LargeStoreResult,
  setLocalItem,
} from "./storage";

interface LoggedCall {
  level: "error" | "warn";
  message: string;
  context: LoggerMetadata;
}

function createCapturingLogger(calls: LoggedCall[]): EndpointLogger {
  return {
    info: () => undefined,
    vibe: () => undefined,
    debug: () => undefined,
    isDebugEnabled: false,
    error: (message, context) => {
      calls.push({ level: "error", message, context });
    },
    warn: (message, context) => {
      calls.push({ level: "warn", message, context });
    },
  };
}

/** Web Storage stand-in with an optional character quota. */
class FakeLocalStorage {
  readonly items = new Map<string, string>();
  constructor(private readonly quotaChars = Number.POSITIVE_INFINITY) {}
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
    let used = key.length + value.length;
    for (const [k, v] of this.items) {
      if (k !== key) {
        used += k.length + v.length;
      }
    }
    if (used > this.quotaChars) {
      const error = new Error("The quota has been exceeded.");
      error.name = "QuotaExceededError";
      // oxlint-disable-next-line no-restricted-syntax -- mimics DOMException from localStorage.setItem
      throw error;
    }
    this.items.set(key, value);
  }
  removeItem(key: string): void {
    this.items.delete(key);
  }
}

function createMemoryBackend(failPut = false): {
  backend: LargeStoreBackend;
  data: Map<string, string>;
} {
  const data = new Map<string, string>();
  const ok = <T>(value: T): Promise<LargeStoreResult<T>> =>
    Promise.resolve({ ok: true, value });
  return {
    data,
    backend: {
      get: (key) => ok(data.get(key) ?? null),
      put: (key, value) => {
        if (failPut) {
          return Promise.resolve({ ok: false, error: "QuotaExceededError" });
        }
        data.set(key, value);
        return ok(true);
      },
      delete: (key) => {
        data.delete(key);
        return ok(true);
      },
      usage: () => Promise.resolve({ originUsageBytes: 1, originQuotaBytes: 2 }),
    },
  };
}

function installLocalStorage(fake: FakeLocalStorage | undefined): void {
  Object.defineProperty(globalThis, "localStorage", {
    value: fake,
    configurable: true,
    writable: true,
  });
}

describe("largeStorage (IndexedDB with localStorage migration)", () => {
  let calls: LoggedCall[];
  let logger: EndpointLogger;

  beforeEach(() => {
    calls = [];
    logger = createCapturingLogger(calls);
  });

  afterEach(() => {
    installLocalStorage(undefined);
  });

  it("stores values bigger than the localStorage quota in the backend", async () => {
    const local = new FakeLocalStorage(1000);
    installLocalStorage(local);
    const { backend, data } = createMemoryBackend();
    const store = createLargeStorage(() => backend);

    const big = "x".repeat(10_000);
    await store.setItem("incognito_messages", big, logger);

    expect(data.get("incognito_messages")).toBe(big);
    expect(local.items.has("incognito_messages")).toBe(false);
    expect(await store.getItem("incognito_messages", logger)).toBe(big);
    expect(calls).toEqual([]);
  });

  it("reads a legacy localStorage value and moves it to the backend", async () => {
    const local = new FakeLocalStorage();
    local.items.set("chat-draft:abc-attachments", "[legacy]");
    installLocalStorage(local);
    const { backend, data } = createMemoryBackend();
    const store = createLargeStorage(() => backend);

    expect(await store.getItem("chat-draft:abc-attachments", logger)).toBe(
      "[legacy]",
    );
    expect(data.get("chat-draft:abc-attachments")).toBe("[legacy]");
    expect(local.items.has("chat-draft:abc-attachments")).toBe(false);
    expect(calls).toEqual([]);
  });

  it("keeps the legacy value readable and reports when the move fails", async () => {
    const local = new FakeLocalStorage();
    local.items.set("incognito_messages", "{}");
    installLocalStorage(local);
    const { backend } = createMemoryBackend(true);
    const store = createLargeStorage(() => backend);

    expect(await store.getItem("incognito_messages", logger)).toBe("{}");
    expect(local.items.get("incognito_messages")).toBe("{}");
    expect(calls).toHaveLength(1);
    // Nothing is lost (still readable from localStorage), so it is a warning
    expect(calls[0]?.level).toBe("warn");
    expect(calls[0]?.message).toBe("[storage] indexedDB.migrate failed");
  });

  it("reports a failed backend write as an error with usage context", async () => {
    installLocalStorage(new FakeLocalStorage());
    const { backend } = createMemoryBackend(true);
    const store = createLargeStorage(() => backend);

    await store.setItem("incognito_messages", "{}", logger);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.level).toBe("error");
    expect(calls[0]?.message).toBe("[storage] indexedDB.set failed");
    expect(calls[0]?.context).toMatchObject({
      key: "incognito_messages",
      valueLength: 2,
      originQuotaBytes: 2,
    });
  });

  it("removes the key from both stores", async () => {
    const local = new FakeLocalStorage();
    local.items.set("k", "old");
    installLocalStorage(local);
    const { backend, data } = createMemoryBackend();
    data.set("k", "new");
    const store = createLargeStorage(() => backend);

    await store.removeItem("k", logger);

    expect(data.has("k")).toBe(false);
    expect(local.items.has("k")).toBe(false);
  });

  it("falls back to localStorage where IndexedDB is unavailable", async () => {
    const local = new FakeLocalStorage();
    installLocalStorage(local);
    const store = createLargeStorage(() => null);

    await store.setItem("k", "v", logger);
    expect(local.items.get("k")).toBe("v");
    expect(await store.getItem("k", logger)).toBe("v");
  });
});

describe("setLocalItem quota failure", () => {
  afterEach(() => {
    installLocalStorage(undefined);
  });

  it("still reports the failure, now naming the key hogging the quota", () => {
    const local = new FakeLocalStorage(100);
    local.items.set("hog", "y".repeat(90));
    installLocalStorage(local);
    const calls: LoggedCall[] = [];

    setLocalItem("draft", "z".repeat(50), createCapturingLogger(calls));

    expect(calls).toHaveLength(1);
    expect(calls[0]?.level).toBe("error");
    expect(calls[0]?.message).toBe("[storage] localStorage.set failed");
    expect(calls[0]?.context).toMatchObject({
      key: "draft",
      valueLength: 50,
      quotaExceeded: true,
      usedChars: 93,
      keyCount: 1,
      largestKey: "hog",
      largestChars: 93,
    });
  });
});
