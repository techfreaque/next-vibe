/**
 * Error log persistence under a storm: repeats of one fingerprint coalesce into
 * few upserts, and a message whose metadata varies per hit (forged webhook
 * signatures, 2026-11-17) collapses onto one row instead of one row per hit.
 */

import { beforeAll, describe, expect, it, mock } from "bun:test";

interface UpsertedRow {
  fingerprint: string;
  occurrences: number;
  message: string;
}

const upserts: UpsertedRow[] = [];

void mock.module("../database", () => ({
  db: {
    insert: () => ({
      values: (row: UpsertedRow) => ({
        onConflictDoUpdate: (): Promise<void> => {
          upserts.push(row);
          return Promise.resolve();
        },
      }),
    }),
  },
}));

let persistErrorLog: typeof import("./db-persist").persistErrorLog;

beforeAll(async () => {
  ({ persistErrorLog } = await import("./db-persist"));
});

async function settle(ms: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function occurrencesFor(message: string): number {
  return upserts
    .filter((r) => r.message === message)
    .reduce((sum, r) => sum + r.occurrences, 0);
}

describe("persistErrorLog", () => {
  it("coalesces a storm of one fingerprint into few upserts without losing counts", async () => {
    const message = "storm same fingerprint";
    for (let i = 0; i < 2000; i++) {
      persistErrorLog("error", message, { path: "/x" }, [], "en-GLOBAL");
    }
    await settle(1300);
    const rows = upserts.filter((r) => r.message === message);
    expect(new Set(rows.map((r) => r.fingerprint)).size).toBe(1);
    expect(rows.length).toBeLessThanOrEqual(3);
    expect(occurrencesFor(message)).toBe(2000);
  });

  it("collapses per-hit varying metadata onto one row after the variant cap", async () => {
    const message = "storm varying metadata";
    for (let i = 0; i < 3000; i++) {
      persistErrorLog(
        "error",
        message,
        { receivedSignature: `sig-${String(i)}` },
        [],
        "en-GLOBAL",
      );
    }
    await settle(1300);
    const rows = upserts.filter((r) => r.message === message);
    // 50 distinct variants + the collapsed row
    expect(new Set(rows.map((r) => r.fingerprint)).size).toBe(51);
    expect(occurrencesFor(message)).toBe(3000);
  });

  it("keeps distinct errors on separate rows", async () => {
    persistErrorLog("error", "distinct a", undefined, [], "en-GLOBAL");
    persistErrorLog("error", "distinct b", undefined, [], "en-GLOBAL");
    await settle(50);
    expect(occurrencesFor("distinct a")).toBe(1);
    expect(occurrencesFor("distinct b")).toBe(1);
  });
});
