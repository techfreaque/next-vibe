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
let normalizeForFingerprint: typeof import("./db-persist").normalizeForFingerprint;

beforeAll(async () => {
  ({ persistErrorLog, normalizeForFingerprint } = await import("./db-persist"));
});

function fingerprintsFor(prefix: string): Set<string> {
  return new Set(
    upserts
      .filter((r) => r.message.startsWith(prefix))
      .map((r) => r.fingerprint),
  );
}

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

  it("puts one error class on one row when only ids and numbers vary", async () => {
    const users = [
      "71df9839-1f3d-412f-8fa9-014580b9d7d9",
      "ad22ba94-ea94-4dd2-b257-18cd6114aad9",
      "7f8a5811-3476-41a0-a18d-af0fe1fd36dc",
    ];
    for (const [i, uid] of users.entries()) {
      persistErrorLog(
        "warn",
        `API Error: User ${uid} lacks required roles: Admin [errorTypes.forbidden / 403]`,
        {
          threadId: uid,
          balance: 0.1 * (i + 1),
          path: `/api/en-US/chat/threads/${uid}?cb=${String(i)}`,
          email: `user${String(i)}@example.com`,
          at: `2026-11-1${String(i)}T10:00:00Z`,
        },
        [],
        i === 0 ? "en-US" : "de-DE",
      );
    }
    // repeats of one fingerprint coalesce for 1 s before the next upsert
    await settle(1300);
    expect(fingerprintsFor("API Error: User ").size).toBe(1);
    expect(
      upserts
        .filter((r) => r.message.startsWith("API Error: User "))
        .reduce((sum, r) => sum + r.occurrences, 0),
    ).toBe(3);
  });

  it("keeps different status codes and endpoints apart", async () => {
    persistErrorLog("warn", "split status", { errorCode: 403 }, [], "en-US");
    persistErrorLog("warn", "split status", { errorCode: 500 }, [], "en-US");
    persistErrorLog(
      "warn",
      "split endpoint",
      { endpoint: "a/GET" },
      [],
      "en-US",
    );
    persistErrorLog(
      "warn",
      "split endpoint",
      { endpoint: "b/GET" },
      [],
      "en-US",
    );
    await settle(50);
    expect(fingerprintsFor("split status").size).toBe(2);
    expect(fingerprintsFor("split endpoint").size).toBe(2);
  });

  it("normalizes per-occurrence parts but keeps the shape", () => {
    expect(
      normalizeForFingerprint(
        'cost: 5.46, balance: 0.039999999999992 at 94.59.19.246 id deadbeef1234cafe (received "x")',
      ),
    ).toBe("cost: <n>, balance: <n> at <ip> id <hex> (received <v>)");
    expect(normalizeForFingerprint("Validation failed (7 errors) [403]")).toBe(
      "Validation failed (7 errors) [403]",
    );
    expect(normalizeForFingerprint("No account yet? Sign up /a?b=1&c=2")).toBe(
      "No account yet? Sign up /a?<q>",
    );
  });
});
