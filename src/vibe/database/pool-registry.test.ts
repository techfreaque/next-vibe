/**
 * Process-wide pool registry (prod incident 2026-11-18): every bundled copy of
 * the database client must get the SAME pool, so DATABASE_POOL_MAX bounds the
 * whole process instead of each Next.js bundle layer. No database needed:
 * pg pools connect lazily.
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { Pool } from "pg";
import { afterEach, describe, expect, it } from "vitest";

import {
  processSharedPool,
  runDetachedFromAsyncContext,
  setProcessSharedPool,
  takeProcessSharedPool,
} from "./pool";

const KEY = "registry-test";

function lazyPool(): Pool {
  return new Pool({ connectionString: "postgres://u:p@127.0.0.1:1/x", max: 1 });
}

describe("processSharedPool", () => {
  afterEach(async () => {
    const p = takeProcessSharedPool(KEY);
    if (p && !p.ending && !p.ended) {
      await p.end();
    }
  });

  it("returns one pool for every caller (bundle copies) in the process", () => {
    let created = 0;
    const create = (): Pool => {
      created++;
      return lazyPool();
    };
    const a = processSharedPool(KEY, create);
    const b = processSharedPool(KEY, create);
    expect(b).toBe(a);
    expect(created).toBe(1);
  });

  it("replaces an ended pool instead of handing it out", async () => {
    const first = processSharedPool(KEY, lazyPool);
    await first.end();
    const second = processSharedPool(KEY, lazyPool);
    expect(second).not.toBe(first);
    expect(second.ended).toBe(false);
  });

  it("set and take update the registry", async () => {
    const replacement = lazyPool();
    setProcessSharedPool(KEY, replacement);
    expect(processSharedPool(KEY, lazyPool)).toBe(replacement);
    expect(takeProcessSharedPool(KEY)).toBe(replacement);
    expect(takeProcessSharedPool(KEY)).toBeNull();
    await replacement.end();
  });
});

describe("runDetachedFromAsyncContext", () => {
  it("breaks AsyncLocalStorage propagation via root snapshot and MessageChannel fallback", async () => {
    const als = new AsyncLocalStorage<{ requestId: string }>();
    const prevSnapshot = globalThis.__vibeRootAsyncSnapshot;
    try {
      // 1. MessageChannel fallback (when no boot-time snapshot is installed)
      globalThis.__vibeRootAsyncSnapshot = undefined;
      const fromFallback = await als.run({ requestId: "req-1" }, () =>
        runDetachedFromAsyncContext(async () => als.getStore()),
      );
      expect(fromFallback).toBeUndefined();

      // 2. Synchronous boot-time root snapshot path
      const rootSnapshot = AsyncLocalStorage.snapshot();
      globalThis.__vibeRootAsyncSnapshot = <TResult>(
        fn: () => TResult,
      ): TResult => rootSnapshot(fn);
      const fromSnapshot = await als.run({ requestId: "req-2" }, () =>
        runDetachedFromAsyncContext(async () => als.getStore()),
      );
      expect(fromSnapshot).toBeUndefined();
    } finally {
      globalThis.__vibeRootAsyncSnapshot = prevSnapshot;
    }
  });

  it("keeps the process alive until the MessageChannel hop runs (prod boot 2026-11-27)", () => {
    // Bun's MessagePort holds no event-loop ref: with nothing else pending the
    // process exited 0 before the detached connect ran (vibe start died
    // silently in deployDbFunctions). Run it in a bare process to prove the hop
    // completes on its own.
    const poolModule = join(import.meta.dirname, "pool.ts");
    const script = [
      `const { runDetachedFromAsyncContext } = await import(${JSON.stringify(poolModule)});`,
      "async function run() {",
      "  await new Promise((r) => setTimeout(r, 5));",
      '  const value = await runDetachedFromAsyncContext(async () => "ran");',
      "  console.log(`DETACHED:${value}`);",
      "}",
      "void run();",
    ].join("\n");
    const result = spawnSync(process.execPath, ["-e", script], {
      encoding: "utf-8",
      timeout: 30_000,
    });
    expect(result.stdout).toContain("DETACHED:ran");
  });
});
