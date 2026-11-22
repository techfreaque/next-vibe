import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import { defaultLocale } from "../../core/i18n/core/config";
import { success } from "../../core/route/response.schema";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { createEndpointLogger } from "../../logger/server";
import { cronTaskExecutions, cronTasks } from "../cron/db";
import { CronTaskPriority, CronTaskStatus, TaskCategory } from "../enum";
import { TASK_WATCHDOG_SELF_ID } from "../watchdog/config";
import { TASK_WATCHDOG_SWEEP_ALIAS } from "../watchdog/constants";

const pg = new PGlite();
const db = drizzle(pg);
const logger = createEndpointLogger(false, defaultLocale);
const admin: JwtPrivatePayloadType = {
  id: "00000000-0000-4000-8000-000000000001",
  leadId: "00000000-0000-4000-8000-000000000002",
  isPublic: false,
  roles: [UserPermissionRole.ADMIN],
};
const sweep = mock(async () => success({ checked: 0, cancelled: 0 }));

mock.module("../../database", () => ({ db }));
mock.module("../../identity/auth/repository", () => ({
  AuthRepository: { authenticateUserByEmail: async () => success(admin) },
}));
mock.module("../cron/resolve-task-user", () => ({
  resolveTaskOwnerUser: async () => ({ user: admin, locale: defaultLocale }),
}));
mock.module("@/generated/routes/handlers", () => ({
  getRouteHandler: async () => sweep,
}));

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE cron_tasks (
      id text PRIMARY KEY, short_id text, route_id text, display_name text,
      description text, version text DEFAULT '1.0.0', category text, schedule text,
      timezone text DEFAULT 'UTC', enabled boolean DEFAULT true, hidden boolean DEFAULT false,
      priority text, timeout integer DEFAULT 60000, retries integer DEFAULT 0,
      retry_delay integer DEFAULT 30000, task_input jsonb DEFAULT '{}',
      run_once boolean DEFAULT false, output_mode text, notification_targets jsonb DEFAULT '[]',
      last_executed_at timestamp, last_execution_status text, last_execution_duration integer,
      run_started_at timestamp, next_execution_at timestamp, history_interval integer,
      last_history_logged_at timestamp, execution_count integer DEFAULT 0, success_count integer DEFAULT 0,
      error_count integer DEFAULT 0, average_execution_time integer, consecutive_failures integer DEFAULT 0,
      target_instance text, tags jsonb DEFAULT '[]', user_id uuid,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE cron_task_executions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), task_id text REFERENCES cron_tasks(id),
      task_name text, execution_id text, status text, priority text,
      started_at timestamp, completed_at timestamp, duration_ms integer, config jsonb,
      result jsonb, error jsonb, is_manual boolean DEFAULT false, is_dry_run boolean DEFAULT false,
      retry_attempt integer DEFAULT 0, parent_execution_id text, server_timezone text,
      executed_by_instance text, triggered_by text, environment text, created_at timestamp DEFAULT now()
    );
  `);
});

afterAll(async () => {
  await pg.close();
});

test("pulse leaves a live watchdog claim alone and completes a replacement for an abandoned claim", async () => {
  const { PulseHealthRepository } = await import("./repository");
  const pulse = () =>
    PulseHealthRepository.executePulse(
      {
        force: true,
        taskNames: [TASK_WATCHDOG_SWEEP_ALIAS],
        systemLocale: defaultLocale,
      },
      logger,
      defaultLocale,
    );
  const taskFilter = eq(cronTasks.id, TASK_WATCHDOG_SELF_ID);
  const liveStart = new Date();
  await db.insert(cronTasks).values({
    id: TASK_WATCHDOG_SELF_ID,
    shortId: TASK_WATCHDOG_SELF_ID,
    routeId: TASK_WATCHDOG_SWEEP_ALIAS,
    displayName: "Watchdog",
    category: TaskCategory.MONITORING,
    priority: CronTaskPriority.CRITICAL,
    schedule: "* * * * *",
    lastExecutionStatus: CronTaskStatus.RUNNING,
    runStartedAt: liveStart,
    historyInterval: 15 * 60_000,
  });

  const live = await pulse();
  expect(live.success && live.data.summary.tasksSkipped).toEqual(["Watchdog"]);
  expect(sweep).not.toHaveBeenCalled();

  const abandonedAt = new Date(liveStart.getTime() - 20 * 60_000);
  await db.update(cronTasks).set({ runStartedAt: null, updatedAt: abandonedAt }).where(taskFilter);

  const recovered = await pulse();
  expect(recovered.success && recovered.data.summary.tasksSucceeded).toEqual(["Watchdog"]);
  expect(sweep).toHaveBeenCalledTimes(1);

  const [task] = await db.select().from(cronTasks).where(taskFilter);
  expect(task?.lastExecutionStatus).toBe(CronTaskStatus.COMPLETED);
  expect(task?.runStartedAt).toBeNull();
  expect(task?.executionCount).toBe(2);
  expect(task?.successCount).toBe(1);
  const history = await db
    .select()
    .from(cronTaskExecutions)
    .orderBy(asc(cronTaskExecutions.startedAt));
  expect(history.map((run) => run.status)).toEqual([
    CronTaskStatus.TIMEOUT,
    CronTaskStatus.COMPLETED,
  ]);
  expect(history[0]?.startedAt).toEqual(abandonedAt);
  expect(history[1]?.completedAt).toBeInstanceOf(Date);
  expect(history[1]?.result).toEqual({ checked: 0, cancelled: 0 });
});
