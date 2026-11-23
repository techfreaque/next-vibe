import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";

import { defaultLocale } from "../../../core/i18n/core/config";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import { createEndpointLogger } from "../../../logger/server";
import { CronTaskPriority, CronTaskStatus } from "../../enum";
import { GET } from "./definition";
import { TaskHistoryScope } from "./enum";
import { scopedTranslation } from "./i18n";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("../../../database", () => ({ db }));

let CronHistoryRepository: typeof import("./repository").CronHistoryRepository;
const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const taskId = "audit-job-preview";
const ownerId = "00000000-0000-0000-0000-000000000001";
const otherOwnerId = "00000000-0000-0000-0000-000000000002";
const owner: JwtPrivatePayloadType = {
  id: ownerId,
  leadId: ownerId,
  isPublic: false,
  roles: [UserPermissionRole.PARTNER_ADMIN],
};
const runTime = new Date("2026-11-19T09:00:00.000Z");

beforeAll(async () => {
  ({ CronHistoryRepository } = await import("./repository"));
  await pg.exec(`
    CREATE TABLE cron_tasks (
      id text PRIMARY KEY, user_id uuid, hidden boolean DEFAULT false, enabled boolean DEFAULT true,
      display_name text NOT NULL, route_id text NOT NULL, priority text NOT NULL
    );
    CREATE TABLE cron_task_executions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id text NOT NULL REFERENCES cron_tasks(id),
      task_name text NOT NULL, execution_id text NOT NULL UNIQUE,
      status text NOT NULL, priority text NOT NULL, started_at timestamp NOT NULL,
      completed_at timestamp, duration_ms integer, error jsonb, result jsonb,
      environment text, config jsonb NOT NULL, created_at timestamp NOT NULL DEFAULT now()
    );
  `);
  await pg.query(
    "INSERT INTO cron_tasks (id, user_id, display_name, route_id, priority) VALUES ($1, $2, $3, $4, $5)",
    [taskId, ownerId, "Audit preview", "vibe.tasks.audit-preview", CronTaskPriority.LOW],
  );
  await pg.query(
    `INSERT INTO cron_tasks (id, user_id, hidden, enabled, display_name, route_id, priority)
     VALUES ('hidden-active', $1, true, true, 'Report scope active', 'scope-test', $2),
      ('disabled-scope', $1, false, false, 'Report scope inactive', 'scope-test', $2)`,
    [ownerId, CronTaskPriority.HIGH],
  );
  await pg.query(
    `INSERT INTO cron_task_executions
     (task_id, task_name, execution_id, started_at, status, priority, config)
     VALUES ('hidden-active', 'scope-test', 'scope-enabled', $1, $2, $3, '{}'),
            ('disabled-scope', 'scope-test', 'scope-disabled', $1, $2, $3, '{}')`,
    [runTime, CronTaskStatus.COMPLETED, CronTaskPriority.HIGH],
  );
  await pg.query(
    "INSERT INTO cron_tasks (id, user_id, display_name, route_id, priority) VALUES ($1, $2, $3, $4, $5)",
    [
      "other-audit",
      otherOwnerId,
      "Audit preview for another owner",
      "vibe.tasks.audit-preview",
      CronTaskPriority.LOW,
    ],
  );
  await pg.query(
    `INSERT INTO cron_task_executions
      (task_id, task_name, execution_id, started_at, status, priority, duration_ms, config)
      VALUES ($1, $2, 'audit-success', $3, $4, $6, 0, '{}'),
      ($1, $2, 'audit-error', $3, $5, $6, 100, '{}'),
      ($7, $2, 'audit-other', $3, $4, $6, NULL, '{}')`,
    [
      taskId,
      "vibe.tasks.audit-preview",
      runTime,
      CronTaskStatus.COMPLETED,
      CronTaskStatus.ERROR,
      CronTaskPriority.HIGH,
      "other-audit",
    ],
  );
});

afterAll(async () => {
  await pg.close();
});

it("counts the same owner-scoped runs matched by display name and execution priority", async () => {
  const result = await CronHistoryRepository.getTaskHistory(
    GET.requestSchema.parse({
      taskName: "Audit PREVIEW",
      priority: CronTaskPriority.HIGH,
      limit: 1,
    }),
    owner,
    t,
    logger,
  );
  expect(result.success && result.data.totalCount).toBe(2);
  expect(result.success && result.data.statusCounts.all).toBe(2);
  expect(result.success && result.data.statusCounts.failed).toBe(1);
  expect(result.success && result.data.hasMore).toBe(true);
  expect(result.success && result.data.executions[0]?.taskId).toBe(taskId);
  expect(result.success && result.data.executions[0]?.priority).toBe(CronTaskPriority.HIGH);
});

it("keeps task identity in a filtered run view and does not reveal another owner's task", async () => {
  const selected = await CronHistoryRepository.getTaskHistory(
    GET.requestSchema.parse({
      taskId,
      status: CronTaskStatus.COMPLETED,
    }),
    owner,
    t,
    logger,
  );
  expect(selected.success && selected.data.selectedTask).toEqual({
    id: taskId,
    name: "Audit preview",
  });
  expect(selected.success && selected.data.totalCount).toBe(1);
  expect(selected.success && selected.data.summary.averageDuration).toBe(0);
  const other = await CronHistoryRepository.getTaskHistory(
    GET.requestSchema.parse({
      taskId: "other-audit",
    }),
    owner,
    t,
    logger,
  );
  expect(other.success && other.data.totalCount).toBe(0);
  expect(other.success && other.data.selectedTask).toBeUndefined();
});

it("matches report scope, including hidden enabled tasks and optionally disabled ones", async () => {
  const run = (
    taskScope: (typeof TaskHistoryScope)[keyof typeof TaskHistoryScope],
  ): ReturnType<typeof CronHistoryRepository.getTaskHistory> =>
    CronHistoryRepository.getTaskHistory(
      GET.requestSchema.parse({ taskName: "Report scope", taskScope }),
      owner,
      t,
      logger,
    );
  const [enabled, all] = await Promise.all([
    run(TaskHistoryScope.ENABLED),
    run(TaskHistoryScope.ALL),
  ]);
  expect(enabled.success && enabled.data.executions.map((r) => r.taskId)).toEqual([
    "hidden-active",
  ]);
  expect(all.success && all.data.totalCount).toBe(2);
});
