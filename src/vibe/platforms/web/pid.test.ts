/**
 * Stale-instance kill guard (prod boot 2026-11-27, f1f703a62d): after a
 * container restart PIDs repeat, and the stale `.tmp/.hermes.pid` held a pid
 * that was now a thread of the booting server itself. kill(2) on a thread id
 * signals the whole process, so the server SIGKILLed itself on every boot.
 */

import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { createEndpointLogger } from "../../logger/server";
import { isForeignStaleCandidate, killPreviousInstance } from "./pid";

const logger = createEndpointLogger(false, "en-GLOBAL");
const TMP_DIR = join(process.cwd(), ".tmp", "pid-test");

function writeTestPidFile(name: string, pids: number[]): string {
  mkdirSync(TMP_DIR, { recursive: true });
  const file = join(TMP_DIR, name);
  writeFileSync(file, [...pids.map(String), "PORT:39990"].join("\n"), "utf-8");
  return file;
}

/** Thread ids of this process other than the main thread (Linux only). */
function ownThreadIds(): number[] {
  try {
    return readdirSync(`/proc/${String(process.pid)}/task`)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id) && id !== process.pid);
  } catch {
    return [];
  }
}

describe("isForeignStaleCandidate", () => {
  it("never targets this process or its parent", () => {
    expect(isForeignStaleCandidate(process.pid, undefined)).toBe(false);
    expect(isForeignStaleCandidate(process.ppid, undefined)).toBe(false);
    expect(isForeignStaleCandidate(0, undefined)).toBe(false);
    expect(isForeignStaleCandidate(-1, undefined)).toBe(false);
  });

  it.skipIf(process.platform !== "linux")(
    "never targets a thread of this process",
    () => {
      const threads = ownThreadIds();
      expect(threads.length).toBeGreaterThan(0);
      for (const tid of threads) {
        expect(isForeignStaleCandidate(tid, undefined)).toBe(false);
      }
    },
  );

  it.skipIf(process.platform !== "linux")(
    "never targets its own child, but targets a same-cwd process started before the pid file",
    async () => {
      const child = spawn("sleep", ["30"], { stdio: "ignore" });
      try {
        const pid = child.pid ?? 0;
        expect(pid).toBeGreaterThan(0);
        // Our own child is off limits.
        expect(isForeignStaleCandidate(pid, Date.now())).toBe(false);
        // A pid file written before the process started lists a recycled pid.
        expect(isForeignStaleCandidate(pid, Date.now() - 60_000)).toBe(false);
      } finally {
        child.kill("SIGKILL");
        await new Promise<void>((resolve) => {
          child.once("exit", () => resolve());
        });
      }
    },
  );
});

describe("killPreviousInstance", () => {
  it.skipIf(process.platform !== "linux")(
    "survives a stale pid file listing its own pid, parent and threads",
    () => {
      const file = writeTestPidFile("self.pid", [
        process.pid,
        process.ppid,
        ...ownThreadIds(),
      ]);
      // Would SIGKILL this test process before the fix.
      killPreviousInstance(file, logger, undefined, false, 200);
      expect(process.kill(process.pid, 0)).toBe(true);
    },
  );

  it.skipIf(process.platform !== "linux")(
    "still stops a foreign previous instance from the pid file",
    async () => {
      // A previous instance is never our child: background it from a shell
      // that exits, so the sleep is re-parented away from this process.
      const shell = spawn("sh", ["-c", "sleep 30 & echo $!"], {
        stdio: ["ignore", "pipe", "ignore"],
      });
      const pid = await new Promise<number>((resolve) => {
        shell.stdout.once("data", (chunk: Buffer) => {
          resolve(parseInt(chunk.toString().trim(), 10));
        });
      });
      await new Promise<void>((resolve) => {
        if (shell.exitCode !== null) {
          resolve();
          return;
        }
        shell.once("exit", () => resolve());
      });
      const file = writeTestPidFile("foreign.pid", [pid]);
      killPreviousInstance(file, logger, undefined, false, 2000);
      let alive = true;
      try {
        process.kill(pid, 0);
      } catch {
        alive = false;
      }
      expect(alive).toBe(false);
    },
  );
});
