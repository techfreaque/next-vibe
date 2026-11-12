/**
 * Client logger dedup: the first occurrence is sent at once, repeats inside
 * the window are counted and flushed as one report with `occurrences`.
 */

import { afterAll, beforeAll, describe, expect, it, jest, mock } from "bun:test";

interface SentReport {
  level: string;
  message: string;
  metadata: Array<Record<string, string | number | boolean | null>> | undefined;
}

const sent: SentReport[] = [];

void mock.module("../unified-ui/hooks/mutation-executor", () => ({
  executeMutation: (args: { requestData: SentReport }): Promise<{ success: true; data: { ok: true } }> => {
    sent.push(args.requestData);
    return Promise.resolve({ success: true, data: { ok: true } });
  },
}));

let createClientLogger: typeof import("./client").createClientLogger;

/** Drain microtasks until `count` reports for `message` went out. */
async function waitForSent(message: string, count: number): Promise<void> {
  for (let i = 0; i < 1000; i++) {
    if (sent.filter((r) => r.message === message).length >= count) {
      return;
    }
    await Promise.resolve();
  }
}

describe("client logger dedup", () => {
  beforeAll(async () => {
    ({ createClientLogger } = await import("./client"));
    // Pre-load what the logger imports lazily, so under fake timers its
    // transmit chain settles on microtasks alone.
    await import("../unified-ui/hooks/mutation-executor");
    await import("./error-monitor/client-log/definition");
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("sends the first occurrence immediately and flushes repeats as a count", async () => {
    const logger = createClientLogger(false, "en-US", "tab-1");
    const error = new Error("dedup-test-boom");

    for (let i = 0; i < 5; i++) {
      logger.error("Dedup test failure", error, { component: "test" });
    }
    await waitForSent("Dedup test failure", 1);

    const first = sent.filter((r) => r.message === "Dedup test failure");
    expect(first).toHaveLength(1);
    expect(first[0]?.level).toBe("error");
    // Context travels with every report
    const flat = Object.assign({}, ...(first[0]?.metadata ?? []));
    expect(flat).toMatchObject({
      component: "test",
      error: "dedup-test-boom",
      errorName: "Error",
      tabId: "tab-1",
    });
    expect(flat).toHaveProperty("platform");

    jest.advanceTimersByTime(30_000);
    await waitForSent("Dedup test failure", 2);

    const all = sent.filter((r) => r.message === "Dedup test failure");
    expect(all).toHaveLength(2);
    const flush = Object.assign({}, ...(all[1]?.metadata ?? []));
    expect(flush["occurrences"]).toBe(4);
  });

  it("does not merge distinct errors", async () => {
    const logger = createClientLogger(false, "en-US", "tab-1");
    logger.warn("Distinct A", { component: "x" });
    logger.warn("Distinct B", { component: "x" });
    logger.warn("Distinct A", { component: "y" });
    await waitForSent("Distinct B", 1);
    await waitForSent("Distinct A", 2);
    expect(sent.filter((r) => r.message.startsWith("Distinct "))).toHaveLength(3);
  });
});
