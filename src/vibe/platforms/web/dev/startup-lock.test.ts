import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync } from "node:fs";
import { join } from "node:path";

import { acquireDevStartupLock } from "./startup-lock";

function fixturePidFile(): string {
  const scratch = join(process.cwd(), ".tmp", "todelete");
  mkdirSync(scratch, { recursive: true });
  return join(mkdtempSync(join(scratch, "dev-startup-lock-")), ".atlas.pid");
}

function claimInChild(pidFile: string, abandon = false): number {
  return Bun.spawnSync({
    cmd: [
      process.execPath,
      "--eval",
      `
        import { acquireDevStartupLock } from ${JSON.stringify(import.meta.resolve("./startup-lock.ts"))};
        const lock = acquireDevStartupLock(${JSON.stringify(pidFile)});
        if (!lock.acquired) process.exit("ownerPid" in lock ? 2 : 1);
        process.exit(!${JSON.stringify(abandon)} && lock.release() ? 1 : 0);
      `,
    ],
    stdout: "ignore",
    stderr: "inherit",
  }).exitCode;
}

describe("development startup lock", () => {
  it("rejects a competing process until the current launch publishes its PID", () => {
    const pidFile = fixturePidFile();
    const owner = acquireDevStartupLock(pidFile);
    expect(owner.acquired).toBe(true);
    if (!owner.acquired) {
      return;
    }
    try {
      expect(claimInChild(pidFile)).toBe(2);
    } finally {
      expect(owner.release()).toBeUndefined();
    }
    expect(claimInChild(pidFile)).toBe(0);
  });

  it("reclaims an abandoned claim and keeps Atlas and Hermes independent", () => {
    const pidFile = fixturePidFile();
    expect(claimInChild(pidFile, true)).toBe(0);
    const atlas = acquireDevStartupLock(pidFile);
    const hermes = acquireDevStartupLock(`${pidFile}.hermes`);
    try {
      expect(atlas.acquired).toBe(true);
      expect(hermes.acquired).toBe(true);
    } finally {
      if (atlas.acquired) {
        expect(atlas.release()).toBeUndefined();
      }
      if (hermes.acquired) {
        expect(hermes.release()).toBeUndefined();
      }
    }
  });

  it("keeps the active marker when a previous owner retries cleanup", () => {
    const pidFile = fixturePidFile();
    const previous = acquireDevStartupLock(pidFile);
    expect(previous.acquired).toBe(true);
    if (!previous.acquired) {
      return;
    }
    expect(previous.release()).toBeUndefined();
    const current = acquireDevStartupLock(pidFile);
    expect(current.acquired).toBe(true);
    if (!current.acquired) {
      return;
    }
    try {
      expect(previous.release()).toBeUndefined();
      expect(acquireDevStartupLock(pidFile)).toEqual({
        acquired: false,
        ownerPid: process.pid,
      });
    } finally {
      expect(current.release()).toBeUndefined();
    }
  });
});
