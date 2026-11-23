import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import {
  handleChunkLoadFailure,
  isChunkLoadError,
  observeChunkReloadOutcome,
  resetChunkReloadForTests,
} from "./chunk-reload";
import type { EndpointLogger, LoggerMetadata } from "./types";

interface LoggedCall {
  level: "error" | "warn" | "debug";
  message: string;
  context: LoggerMetadata;
}

function createCapturingLogger(calls: LoggedCall[]): EndpointLogger {
  return {
    info: () => undefined,
    vibe: () => undefined,
    debug: (message, context) => {
      calls.push({ level: "debug", message, context });
    },
    isDebugEnabled: false,
    error: (message, context) => {
      calls.push({ level: "error", message, context });
    },
    warn: (message, context) => {
      calls.push({ level: "warn", message, context });
    },
  };
}

class FakeSessionStorage {
  readonly items = new Map<string, string>();
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

function chunkError(id = "4521"): Error {
  const error = new Error(
    `Loading chunk ${id} failed. (error: https://unbottled.ai/_next/static/chunks/${id}-abc.js)`,
  );
  error.name = "ChunkLoadError";
  return error;
}

function waitForReload(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 900);
  });
}

describe("handleChunkLoadFailure", () => {
  let reloads = 0;
  let session: FakeSessionStorage;
  let buildId = "old-build";
  let appRouter = false;

  beforeEach(() => {
    reloads = 0;
    buildId = "old-build";
    appRouter = false;
    session = new FakeSessionStorage();
    resetChunkReloadForTests();
    Object.defineProperty(globalThis, "sessionStorage", {
      value: session,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: {
        location: {
          href: "https://unbottled.ai/en-US/chat",
          origin: "https://unbottled.ai",
          pathname: "/en-US/chat",
          reload: (): void => {
            reloads++;
          },
        },
      },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, "document", {
      value: {
        readyState: "complete",
        getElementById: () =>
          appRouter ? null : { textContent: JSON.stringify({ buildId }) },
        querySelector: () => null,
        body: {
          querySelectorAll: (): { text: string }[] => {
            const root = `0:${JSON.stringify({ b: buildId })}\n`;
            return [root.slice(0, 8), root.slice(8)].map((part) => ({
              text: `self.__next_f.push(${JSON.stringify([1, part])})`,
            }));
          },
        },
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "sessionStorage", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, "document", {
      value: undefined,
      configurable: true,
      writable: true,
    });
  });

  it("detects webpack and native ESM chunk errors", () => {
    expect(isChunkLoadError(chunkError())).toBe(true);
    expect(
      isChunkLoadError(
        new TypeError("Failed to fetch dynamically imported module: /x.js"),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new Error("boom"))).toBe(false);
  });

  it("reports each failed chunk and reloads only once when the failure recurs", async () => {
    const calls: LoggedCall[] = [];
    const logger = createCapturingLogger(calls);

    expect(
      handleChunkLoadFailure(logger, { source: "test", error: chunkError() }),
    ).toBe(true);
    expect(
      handleChunkLoadFailure(logger, {
        source: "test",
        error: chunkError("4522"),
      }),
    ).toBe(true);
    expect(calls).toMatchObject([
      {
        level: "error",
        context: {
          chunkId: "4521",
          buildIdBefore: "old-build",
          recoveredByReload: null,
        },
      },
      {
        level: "error",
        context: { chunkId: "4522", recoveredByReload: null },
      },
    ]);
    await waitForReload();
    expect(reloads).toBe(1);
    const record: { at: number } = JSON.parse(
      session.getItem("vibe-chunk-reload") ?? "{}",
    );
    const originalRequestId = "eb3a8c4c-de39-4d30-baad-fa32f10d555e";
    session.setItem(
      "vibe-chunk-reload",
      JSON.stringify({
        ...record,
        edgeRequestId: originalRequestId,
        edgeTimingNode: "s1",
        resourceStartedAtMs: 1_795_390_000_000,
      }),
    );

    // The reloaded page fails again: reported, no second reload
    resetChunkReloadForTests();
    buildId = "new-build";
    expect(
      handleChunkLoadFailure(logger, { source: "after", error: chunkError() }),
    ).toBe(false);
    expect(calls).toHaveLength(3);
    expect(calls[2]?.message).toBe(
      "[chunk] Load still failing after an automatic reload",
    );
    expect(calls[2]?.context).toMatchObject({
      source: "after",
      firstSource: "test",
      firstChunkId: "4521",
      firstEdgeRequestId: originalRequestId,
      firstEdgeTimingNode: "s1",
      firstResourceStartedAtMs: 1_795_390_000_000,
      chunkId: "4521",
      chunkFailKind: "error",
      buildIdBefore: "old-build",
      buildIdAfter: "new-build",
      recoveredByReload: false,
    });
    expect(reloads).toBe(1);
  });

  it("reports startup after the reload at the original warning level", async () => {
    const calls: LoggedCall[] = [];
    const logger = createCapturingLogger(calls);
    const now = spyOn(Date, "now").mockReturnValue(
      Math.floor(performance.timeOrigin) - 1,
    );
    const entry = {
      name: "https://unbottled.ai/en-US/chat",
      entryType: "navigation",
      type: "reload",
      startTime: 0,
      duration: 0,
      toJSON: (): string => "",
    };
    const navigation = spyOn(performance, "getEntriesByType").mockReturnValue([
      entry,
    ]);
    try {
      expect(
        handleChunkLoadFailure(logger, {
          source: "icon-loader",
          error: new TypeError(
            "Failed to fetch dynamically imported module: /assets/icon-abc.js",
          ),
          level: "warn",
        }),
      ).toBe(true);
      expect(calls[0]).toMatchObject({
        level: "warn",
        context: { chunkId: "icon-abc.js", recoveredByReload: null },
      });
      await waitForReload();
      expect(reloads).toBe(1);
      resetChunkReloadForTests();
      buildId = "new-build";
      appRouter = true;
      observeChunkReloadOutcome(logger);
      observeChunkReloadOutcome(logger);
      await waitForReload();
      expect(calls).toHaveLength(2);
      expect(calls[1]).toMatchObject({
        level: "warn",
        context: {
          chunkId: "icon-abc.js",
          buildIdBefore: "old-build",
          buildIdAfter: "new-build",
          recoveredByReload: true,
        },
      });
    } finally {
      navigation.mockRestore();
      now.mockRestore();
    }
  });

  it("reports the failure when the reload guard cannot be stored", () => {
    const calls: LoggedCall[] = [];
    const logger = createCapturingLogger(calls);
    const setItem = spyOn(session, "setItem").mockImplementation(
      () => undefined,
    );
    try {
      expect(
        handleChunkLoadFailure(logger, { source: "test", error: chunkError() }),
      ).toBe(false);
      expect(calls).toMatchObject([
        {
          level: "error",
          context: {
            chunkId: "4521",
            reloadSkipped: true,
            recoveredByReload: false,
          },
        },
      ]);
      expect(reloads).toBe(0);
    } finally {
      setItem.mockRestore();
    }
  });
});
