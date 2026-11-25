import { runInNewContext } from "node:vm";

import { describe, expect, it } from "bun:test";

import {
  CHUNK_RELOAD_DELAY_MS,
  CHUNK_RELOAD_KEY,
} from "../../../logger/chunk-reload-policy";
import { withDevClientEntryRecovery } from "./dev-client-entry-recovery";

const entry = "/src/generated/app-tanstack/client.tsx";
const reporter = "next-vibe/logger/browser-startup-error";
const preamble = `markRefreshReady();\nawait import("${entry}");`;
const entryError = new TypeError(
  `Failed to fetch dynamically imported module: http://localhost:3000${entry}`,
);
const reporterError = new TypeError(
  "Failed to fetch dynamically imported module: http://localhost:3000/src/vibe/logger/browser-startup-error.ts",
);

async function runPreamble({
  storage = new Map<string, string>(),
  persist = true,
  startupError = entryError,
  reporterAvailable = false,
}: {
  storage?: Map<string, string>;
  persist?: boolean;
  startupError?: Error;
  reporterAvailable?: boolean;
} = {}): Promise<{
  delays: number[];
  failures: (string | Error | { fallbackReloadScheduled: boolean })[][];
  imports: string[];
  reloads: number;
  reports: Error[];
}> {
  const imports: string[] = [];
  const delays: number[] = [];
  const reports: Error[] = [];
  const failures: (string | Error | { fallbackReloadScheduled: boolean })[][] =
    [];
  let refreshReady = false;
  let reloads = 0;
  const code = withDevClientEntryRecovery(preamble) ?? "";
  // Substitute the loader while executing the emitted bootstrap in its own realm.
  const script = code.replaceAll(/\bimport\((?=")/g, "loadModule(");
  await runInNewContext(`(async () => {\n${script}\n})()`, {
    Error,
    loadModule: (id: string) => {
      expect(refreshReady).toBe(true);
      imports.push(id);
      if (id === reporter && reporterAvailable) {
        return Promise.resolve({
          reportDevClientEntryError: (error: Error): void => {
            reports.push(error);
          },
        });
      }
      return Promise.reject(id === entry ? startupError : reporterError);
    },
    markRefreshReady: (): void => {
      refreshReady = true;
    },
    console: {
      error: (
        ...args: (string | Error | { fallbackReloadScheduled: boolean })[]
      ): void => {
        failures.push(args);
      },
    },
    window: {
      sessionStorage: {
        getItem: (key: string): string | null => storage.get(key) ?? null,
        setItem: (key: string, value: string): void => {
          if (persist) {
            storage.set(key, value);
          }
        },
      },
      location: {
        reload: (): void => {
          reloads += 1;
        },
      },
    },
    setTimeout: (callback: () => void, delay: number): void => {
      delays.push(delay);
      callback();
    },
  });
  return { delays, failures, imports, reloads, reports };
}

describe("TanStack dev client entry recovery", () => {
  it("uses the existing reporter when it loads", async () => {
    const result = await runPreamble({ reporterAvailable: true });
    expect(result.imports).toEqual([entry, reporter]);
    expect(result.reports).toEqual([entryError]);
    expect(result.failures).toEqual([]);
    expect(result.reloads).toBe(0);
  });

  it("preserves both errors and reloads once across documents when both imports fail", async () => {
    const storage = new Map<string, string>();
    const first = await runPreamble({ storage });
    expect(first.delays).toEqual([CHUNK_RELOAD_DELAY_MS]);
    expect(first.reloads).toBe(1);
    expect(first.failures[0]?.slice(1)).toEqual([
      entryError,
      reporterError,
      { fallbackReloadScheduled: true },
    ]);
    expect(storage.has(CHUNK_RELOAD_KEY)).toBe(true);

    const retry = await runPreamble({ storage });
    expect(retry.reloads).toBe(0);
    expect(retry.failures[0]?.slice(1)).toEqual([
      entryError,
      reporterError,
      { fallbackReloadScheduled: false },
    ]);
  });

  it("keeps the error visible without reloading when the guard cannot persist", async () => {
    const result = await runPreamble({ persist: false });
    expect(result.reloads).toBe(0);
    expect(result.failures[0]?.[1]).toBe(entryError);
  });

  it("does not reload for an entry evaluation error", async () => {
    const startupError = new ReferenceError("Cannot access binding before initialization");
    const result = await runPreamble({ startupError });
    expect(result.reloads).toBe(0);
    expect(result.failures[0]?.[1]).toBe(startupError);
  });
});
