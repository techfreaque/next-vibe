import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";

import { defaultLocale } from "../../../core/i18n/core/config";
import { createEndpointLogger } from "../../server";
import { errorLogs } from "../db";
import { GET } from "./definition";
import { ErrorLogStatusFilter } from "./enum";
import { scopedTranslation } from "./i18n";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("../../../database", () => ({ db }));

let ErrorLogsRepository: typeof import("./repository").ErrorLogsRepository;
const { t } = scopedTranslation.scopedT(defaultLocale);
const logger = createEndpointLogger(false, defaultLocale);
const firstId = "8b6fa4b2-174a-438c-a664-478e9688c458";
const lastSeen = new Date("2026-11-19T08:12:00.000Z");

beforeAll(async () => {
  ({ ErrorLogsRepository } = await import("./repository"));
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
      message: "Job X matching",
      fingerprint: "aaaaaaaaaaaa",
      createdAt: lastSeen,
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
      GET.requestSchema.parse({ search }),
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
    GET.requestSchema.parse({ limit: 1, offset: 0 }),
    t,
    logger,
  );
  const nextPage = await ErrorLogsRepository.getLogs(
    GET.requestSchema.parse({ limit: 1, offset: 1 }),
    t,
    logger,
  );
  expect(firstPage.success && firstPage.data.hasMore).toBe(true);
  expect(nextPage.success && nextPage.data.hasMore).toBe(false);
  expect(firstPage.success && firstPage.data.logs[0]?.id).not.toBe(
    nextPage.success && nextPage.data.logs[0]?.id,
  );
});
