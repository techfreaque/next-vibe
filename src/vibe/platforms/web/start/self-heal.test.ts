import { describe, expect, it } from "vitest";

import {
  childPidsFromProcStat,
  CrashLoopTracker,
  NextUptimeTracker,
  OutputTail,
} from "./self-heal";

describe("NextUptimeTracker", () => {
  it("escalates only after Next.js stayed down for the whole window", () => {
    const t = new NextUptimeTracker(300_000);
    expect(t.shouldEscalate(0)).toBe(false);
    t.markDown(1_000);
    // Repeated exits keep the FIRST down time (the 2026-11-17 loop).
    t.markDown(100_000);
    t.markDown(200_000);
    expect(t.shouldEscalate(299_999)).toBe(false);
    expect(t.shouldEscalate(301_000)).toBe(true);
    expect(t.downForMs(301_000)).toBe(300_000);
  });

  it("a recovery in between resets the window", () => {
    const t = new NextUptimeTracker(300_000);
    t.markDown(0);
    t.markUp();
    t.markDown(250_000);
    expect(t.shouldEscalate(400_000)).toBe(false);
    expect(t.shouldEscalate(550_000)).toBe(true);
  });
});

describe("CrashLoopTracker", () => {
  it("flags a crash loop at N crashes inside the window", () => {
    const t = new CrashLoopTracker(60_000, 3);
    expect(t.recordCrash(0)).toBe(false);
    expect(t.recordCrash(10_000)).toBe(false);
    expect(t.recordCrash(20_000)).toBe(true);
  });

  it("forgets crashes older than the window", () => {
    const t = new CrashLoopTracker(60_000, 3);
    t.recordCrash(0);
    t.recordCrash(10_000);
    expect(t.recordCrash(80_000)).toBe(false);
    expect(t.recentCrashes).toBe(1);
  });
});

describe("OutputTail", () => {
  it("keeps the last lines across chunk boundaries, without ANSI codes", () => {
    const tail = new OutputTail(3);
    tail.push("\u001B[31mline one\u001B[0m\nline ");
    tail.push("two\nline three\nError: listen EADDRINUSE: address already in use :::3100\n");
    expect(tail.text()).toBe(
      "line two\nline three\nError: listen EADDRINUSE: address already in use :::3100",
    );
  });

  it("includes an unterminated last line and truncates long lines", () => {
    const tail = new OutputTail(5, 10);
    tail.push("short\n0123456789abcdef\npartial");
    expect(tail.text()).toBe("short\n0123456789...\npartial");
  });
});

describe("childPidsFromProcStat", () => {
  it("finds live children of a parent and skips zombies and others", () => {
    const stats = [
      { pid: 20, stat: "20 (bun) S 1 20 1 0 -1" },
      { pid: 37, stat: "37 (bun run next) S 1 20 1 0 -1" },
      { pid: 38, stat: "38 (next-server (v16.4.5)) S 1 20 1 0 -1" },
      { pid: 40, stat: "40 (next-server) Z 1 20 1 0 -1" },
      { pid: 41, stat: "41 (sh) S 0 41 41 0 -1" },
      { pid: 42, stat: "42 (node) S 38 20 1 0 -1" },
      { pid: 43, stat: "garbage" },
    ];
    expect(childPidsFromProcStat(stats, 1)).toEqual([20, 37, 38]);
    expect(childPidsFromProcStat(stats, 38)).toEqual([42]);
  });
});
