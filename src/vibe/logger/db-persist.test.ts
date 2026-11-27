/**
 * Error log persistence under a storm: repeats of one fingerprint coalesce into
 * few upserts, and a message whose metadata varies per hit (forged webhook
 * signatures, 2026-11-17) collapses onto one row instead of one row per hit.
 */

import { beforeAll, describe, expect, it, mock } from "bun:test";

import {
  CLIENT_LOG_FINGERPRINT_IGNORE_KEYS,
  FOREIGN_SOURCE_FINGERPRINT_IGNORE_KEYS,
} from "./error-monitor/client-log/fingerprint-keys";
import type { LoggerMetadata } from "./types";

interface UpsertedRow {
  fingerprint: string;
  occurrences: number;
  message: string;
  metadata: LoggerMetadata[];
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
void mock.module("./error-monitor/daily", () => ({
  recordErrorLogDaily: (): Promise<void> => Promise.resolve(),
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

  it("retains bounded cause diagnostics without storing response bodies or changing the fingerprint", async () => {
    const privateBody = "private upstream response";
    const cause = Object.assign(new TypeError("request failed"), {
      code: "ETIMEDOUT",
      statusCode: 504,
      responseBody: privateBody,
    });
    persistErrorLog(
      "error",
      "wrapped upstream error",
      new Error("request failed", { cause }),
      [],
      "en-GLOBAL",
    );
    persistErrorLog(
      "error",
      "wrapped upstream error",
      new Error("request failed"),
      [],
      "en-GLOBAL",
    );
    await settle(1300);
    const rows = upserts.filter((r) =>
      r.message.startsWith("wrapped upstream error"),
    );
    expect(new Set(rows.map((r) => r.fingerprint)).size).toBe(1);
    expect(rows.some((r) => JSON.stringify(r.metadata).includes('"code":"ETIMEDOUT"'))).toBe(true);
    expect(rows.some((r) => JSON.stringify(r.metadata).includes('"status":504'))).toBe(true);
    expect(rows.some((r) => JSON.stringify(r.metadata).includes(privateBody))).toBe(false);
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

  it("groups foreign-source client errors across routes, keeps route in metadata", async () => {
    const message =
      "[client] Uncaught error [injected-global: __firefox__]: Can't find variable: __firefox__";
    for (const route of ["/en-US", "/de-DE/threads", "/pl-PL/story"]) {
      persistErrorLog(
        "error",
        message,
        undefined,
        [
          {
            source: "window.onerror",
            file: route,
            line: 1,
            column: 12,
            errorSource: "injected-global",
            injectedGlobal: "__firefox__",
          },
          { platform: "web", route },
        ],
        "en-US",
        { fingerprintIgnoreKeys: FOREIGN_SOURCE_FINGERPRINT_IGNORE_KEYS },
      );
    }
    await settle(1300);
    const rows = upserts.filter((r) => r.message === message);
    expect(new Set(rows.map((r) => r.fingerprint)).size).toBe(1);
    expect(occurrencesFor(message)).toBe(3);
    expect(JSON.stringify(rows[0]?.metadata)).toContain('"route"');
  });

  it("keeps our own client errors split per route", async () => {
    const message = "[client] Uncaught error: our split";
    for (const route of ["/en-US", "/de-DE/threads"]) {
      persistErrorLog(
        "error",
        message,
        undefined,
        [{ errorSource: "our-bundle" }, { route }],
        "en-US",
        { fingerprintIgnoreKeys: CLIENT_LOG_FINGERPRINT_IGNORE_KEYS },
      );
    }
    await settle(50);
    expect(fingerprintsFor(message).size).toBe(2);
  });

  it("keeps one refusal class in one row whatever its refusalDetail", async () => {
    const message = "[AiStream] Setup failed: refusal collapse";
    for (const [model, text] of [
      ["kimi-k3", "Not enough credits: this request costs 9, your balance is 7."],
      ["glm-5.3", "To zapytanie przekracza Twój dzisiejszy bezpłatny limit."],
    ]) {
      persistErrorLog(
        "warn",
        message,
        undefined,
        [
          {
            errorKey: "errorTypes.payment_required",
            userKind: "user",
            refusalDetail: { model, message: text },
          },
        ],
        "en-US",
      );
    }
    await settle(1300);
    const rows = upserts.filter((r) => r.message === message);
    expect(new Set(rows.map((r) => r.fingerprint)).size).toBe(1);
    expect(occurrencesFor(message)).toBe(2);
  });

  it("normalizes masked emails like plain ones", () => {
    expect(
      normalizeForFingerprint("Login failed for ba***@bg2000.at and a@b.co"),
    ).toBe("Login failed for <email> and <email>");
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
