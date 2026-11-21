import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";

import { defaultLocale } from "../../../core/i18n/core/config";
import { createEndpointLogger } from "../../server";
import { errorLogs } from "../db";
import { GET } from "./definition";
import { AnalyticsRange } from "../../../unified-ui/analytics/enum";
import {
  ErrorLogSourceFilter,
  ErrorLogStatusFilter,
  ErrorLogTrendSplit,
} from "./enum";
import { scopedTranslation } from "./i18n";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("../../../database", () => ({ db }));

let ErrorLogsRepository: typeof import("./repository").ErrorLogsRepository;
let recordErrorLogDaily: typeof import("../daily").recordErrorLogDaily;
const { t } = scopedTranslation.scopedT(defaultLocale);
const logger = createEndpointLogger(false, defaultLocale);
const firstId = "8b6fa4b2-174a-438c-a664-478e9688c458";
const lastSeen = new Date("2026-11-19T08:12:00.000Z");

beforeAll(async () => {
  ({ ErrorLogsRepository } = await import("./repository"));
  ({ recordErrorLogDaily } = await import("../daily"));
  await pg.exec(`
    CREATE TABLE error_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      message text NOT NULL,
      fingerprint text NOT NULL UNIQUE,
      error_type text,
      stack_trace text,
      metadata jsonb,
      occurrences integer NOT NULL DEFAULT 1,
      resolved boolean NOT NULL DEFAULT false,
      level text NOT NULL DEFAULT 'error',
      first_seen timestamp NOT NULL DEFAULT now(),
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE TABLE error_log_daily (
      fingerprint text NOT NULL REFERENCES error_logs(fingerprint) ON DELETE cascade,
      day timestamp NOT NULL,
      occurrences integer NOT NULL DEFAULT 0,
      user_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
      lead_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
      PRIMARY KEY (fingerprint, day)
    )
  `);
  await db.insert(errorLogs).values([
    {
      id: firstId,
      message: "Could not read job settings",
      fingerprint: "6f7c1b82d9e1",
      createdAt: lastSeen,
    },
    {
      message: "[client] Job X matching",
      fingerprint: "aaaaaaaaaaaa",
      metadata: [{ route: "/en-US/threads/private/new" }],
      createdAt: lastSeen,
      firstSeen: new Date("2026-11-10T08:00:00.000Z"),
    },
    {
      message: "Settings key job_% does not exist",
      fingerprint: "bbbbbbbbbbbb",
      resolved: true,
      createdAt: lastSeen,
    },
  ]);
});

afterAll(async () => {
  await pg.close();
});

it("looks up a fingerprint or partial log ID and matches case-insensitive message text", async () => {
  for (const search of ["6f7c1b82", "8B6FA4B2", "JOB SETTINGS"]) {
    const result = await ErrorLogsRepository.getLogs(
      GET.requestSchema.parse({
        search,
        range: AnalyticsRange.ALL_TIME,
        group: false,
      }),
      t,
      logger,
    );
    expect(result.success && result.data.logs.map((log) => log.id)).toEqual([
      firstId,
    ]);
  }
});

it("matches literal percent and underscore without counting unrelated groups", async () => {
  const result = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({
      search: "job_%",
      range: AnalyticsRange.ALL_TIME,
      status: ErrorLogStatusFilter.RESOLVED,
    }),
    t,
    logger,
  );
  expect(result.success && result.data.totalCount).toBe(1);
  expect(result.success && result.data.unresolvedCount).toBe(2);
});

it("uses the requested page size and keeps equal timestamps in deterministic order", async () => {
  const firstPage = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({
      limit: 1,
      offset: 0,
      group: false,
      range: AnalyticsRange.ALL_TIME,
    }),
    t,
    logger,
  );
  const nextPage = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({
      limit: 1,
      offset: 1,
      group: false,
      range: AnalyticsRange.ALL_TIME,
    }),
    t,
    logger,
  );
  expect(firstPage.success && firstPage.data.hasMore).toBe(true);
  expect(nextPage.success && nextPage.data.hasMore).toBe(false);
  expect(firstPage.success && firstPage.data.logs[0]?.id).not.toBe(
    nextPage.success && nextPage.data.logs[0]?.id,
  );
});

it("records daily occurrences with distinct users and charts them", async () => {
  const userA = "11111111-1111-4111-8111-111111111111";
  const userB = "22222222-2222-4222-8222-222222222222";
  const lead = "33333333-3333-4333-8333-333333333333";
  await recordErrorLogDaily({
    fingerprint: "aaaaaaaaaaaa",
    occurrences: 2,
    metadata: [{ userId: userA, leadId: lead }],
    at: new Date("2026-11-10T09:00:00.000Z"),
  });
  await recordErrorLogDaily({
    fingerprint: "aaaaaaaaaaaa",
    occurrences: 3,
    metadata: [{ userId: userB }, { userId: userA }],
    at: lastSeen,
  });
  await recordErrorLogDaily({
    fingerprint: "6f7c1b82d9e1",
    occurrences: 4,
    metadata: [],
    at: lastSeen,
  });

  const result = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({
      range: AnalyticsRange.CUSTOM,
      from: "2026-11-01",
      to: "2026-11-30",
      group: false,
      split: ErrorLogTrendSplit.NEW_VS_RECURRING,
    }),
    t,
    logger,
  );
  expect(result.success).toBe(true);
  if (!result.success) {
    return;
  }
  const { kpis, trend, logs, byEndpoint } = result.data;
  expect(kpis.unresolved).toBe(2);
  expect(kpis.occurrences.value).toBe(9);
  expect(kpis.affectedUsers.value).toBe(2);
  expect(kpis.affectedLeads.value).toBe(1);
  const total = (key: string): number =>
    trend.series
      .find((s) => s.key === key)
      ?.values.reduce((a, b) => a + b, 0) ?? 0;
  // "aaaa" first seen 11-10: its 2 hits that day are new, 3 later recurring
  expect(total("new")).toBe(2);
  expect(total("recurring")).toBe(3 + 4);
  // ordered by hits in period
  expect(logs.map((l) => l.fingerprint)).toEqual([
    "aaaaaaaaaaaa",
    "6f7c1b82d9e1",
  ]);
  expect(logs[0]?.windowOccurrences).toBe(5);
  expect(logs[0]?.source).toBe("client");
  expect(logs[0]?.endpoint).toBe("/threads/private/new");
  expect(logs[0]?.userIds).toEqual([userA, userB]);
  expect(byEndpoint.find((r) => r.key === "/threads/private/new")?.metrics)
    .toEqual({ occurrences: 5, classes: 1, unresolved: 1 });

  const server = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({
      range: AnalyticsRange.CUSTOM,
      from: "2026-11-01",
      to: "2026-11-30",
      source: ErrorLogSourceFilter.SERVER,
    }),
    t,
    logger,
  );
  expect(server.success && server.data.logs.map((l) => l.fingerprint)).toEqual(
    ["6f7c1b82d9e1"],
  );
  expect(server.success && server.data.kpis.occurrences.value).toBe(4);
});

it("resolves several fingerprints at once and reopens them", async () => {
  const resolved = await ErrorLogsRepository.updateStatus(
    { fingerprints: ["6f7c1b82d9e1", "aaaaaaaaaaaa"], resolved: true },
    t,
    logger,
  );
  expect(resolved.success && resolved.data.affectedRows).toBe(2);
  const after = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({ range: AnalyticsRange.ALL_TIME }),
    t,
    logger,
  );
  expect(after.success && after.data.kpis.unresolved).toBe(0);
  const reopened = await ErrorLogsRepository.updateStatus(
    { fingerprints: ["6f7c1b82d9e1", "aaaaaaaaaaaa"], resolved: false },
    t,
    logger,
  );
  expect(reopened.success && reopened.data.affectedRows).toBe(2);
});

it("groups classes with the same message and resolves the whole group", async () => {
  await db.insert(errorLogs).values([
    {
      message: "Same failure",
      fingerprint: "grp-a",
      occurrences: 5,
      createdAt: lastSeen,
    },
    {
      message: "Same failure",
      fingerprint: "grp-b",
      occurrences: 2,
      createdAt: lastSeen,
    },
  ]);
  const grouped = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({ range: AnalyticsRange.ALL_TIME, search: "Same failure" }),
    t,
    logger,
  );
  expect(grouped.success && grouped.data.logs.length).toBe(1);
  expect(grouped.success && grouped.data.logs[0]?.fingerprint).toBe("grp-a");
  expect(grouped.success && grouped.data.logs[0]?.similar).toBe(1);
  expect(grouped.success && grouped.data.logs[0]?.occurrences).toBe(7);

  const resolved = await ErrorLogsRepository.updateStatus(
    { similarTo: "grp-b", resolved: true },
    t,
    logger,
  );
  expect(resolved.success && resolved.data.affectedRows).toBe(2);
});
