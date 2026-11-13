/**
 * Deploy drain contract (drain.ts + loop/active-loops.ts): the files the
 * deploy script reads and writes, and the run tracking the wait relies on.
 * Pure filesystem + timers in a temp dir: no server, no DB.
 */

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  activeRunCount,
  drainActiveLoops,
  trackActiveRun,
} from "../../agent/ai-stream/repository/loop/active-loops";
import { startDrainWatcher } from "./drain";

const dirs: string[] = [];
const stops: Array<() => void> = [];

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "vibe-drain-"));
  dirs.push(dir);
  return dir;
}

async function sleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

afterEach(() => {
  for (const stop of stops.splice(0)) {
    stop();
  }
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("drain watcher", () => {
  it("stays silent until a drain is requested, then reports counts", async () => {
    const dir = tempDir();
    let runs = 2;
    stops.push(
      startDrainWatcher({
        role: "next",
        counts: () => ({ runs }),
        intervalMs: 20,
        dir,
      }),
    );
    const status = join(dir, "status-next.json");
    await sleep(80);
    expect(existsSync(status)).toBe(false);

    writeFileSync(join(dir, "request"), "test");
    await sleep(80);
    const first = JSON.parse(readFileSync(status, "utf8")) as {
      role: string;
      counts: { runs: number };
      wsClosed: boolean;
    };
    expect(first.role).toBe("next");
    expect(first.counts.runs).toBe(2);
    expect(first.wsClosed).toBe(false);

    runs = 0;
    await sleep(80);
    const second = JSON.parse(readFileSync(status, "utf8")) as {
      counts: { runs: number };
    };
    expect(second.counts.runs).toBe(0);
  });

  it("closes WebSockets once on ws-close and cleans up on undrain", async () => {
    const dir = tempDir();
    let closeCalls = 0;
    stops.push(
      startDrainWatcher({
        role: "server",
        counts: () => ({ wsClients: 3 }),
        onWsClose: () => {
          closeCalls++;
          return 3;
        },
        intervalMs: 20,
        dir,
      }),
    );
    writeFileSync(join(dir, "request"), "test");
    await sleep(60);
    expect(closeCalls).toBe(0);

    writeFileSync(join(dir, "ws-close"), "test");
    await sleep(120);
    expect(closeCalls).toBe(1);
    const status = join(dir, "status-server.json");
    expect(
      (JSON.parse(readFileSync(status, "utf8")) as { wsClosed: boolean })
        .wsClosed,
    ).toBe(true);

    rmSync(join(dir, "request"));
    await sleep(80);
    expect(existsSync(status)).toBe(false);
  });
});

describe("active run tracking", () => {
  it("counts a run until it settles, rejected runs included", async () => {
    const before = activeRunCount();
    let resolveRun: () => void = () => undefined;
    const ok = new Promise<void>((resolve) => {
      resolveRun = resolve;
    });
    const bad = sleep(30).then(() => {
      throw new Error("run failed");
    });
    trackActiveRun(ok);
    trackActiveRun(bad);
    expect(activeRunCount()).toBe(before + 2);
    await sleep(60);
    expect(activeRunCount()).toBe(before + 1);
    resolveRun();
    await sleep(10);
    expect(activeRunCount()).toBe(before);
  });

  it("drain waits for runs and extra work, then reports clean", async () => {
    let tasks = 1;
    trackActiveRun(sleep(150));
    setTimeout(() => {
      tasks = 0;
    }, 300);
    const started = Date.now();
    const remaining = await drainActiveLoops(5000, undefined, () => tasks);
    expect(remaining).toBe(0);
    expect(Date.now() - started).toBeGreaterThanOrEqual(280);
  });

  it("drain gives up after the timeout and reports what was left", async () => {
    const remaining = await drainActiveLoops(100, undefined, () => 1);
    expect(remaining).toBe(1);
  });
});
