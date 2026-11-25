import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { asc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import { notifications } from "@/notifications/db";
import { NotificationType } from "@/notifications/enum";

import { AI_RUN_ALIAS } from "../../agent/ai-stream/run/constants";
import { scopedTranslation as streamTranslation } from "../../agent/ai-stream/stream/i18n";
import { defaultLocale } from "../../core/i18n/core/config";
import { success } from "../../core/route/response.schema";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { createEndpointLogger } from "../../logger/server";
import { cronTaskExecutions, cronTasks } from "../cron/db";
import { CronTaskPriority, CronTaskStatus, TaskCategory, TaskOutputMode } from "../enum";
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
async function failedForumRun() {
  const { shapeRunResult } = await import("../../agent/ai-stream/repository/run-result");
  return shapeRunResult({
    headlessResult: {
      lastAiMessageId: "fixture",
      lastAiMessageContent: null,
      providerErrorText: "malformed tool call data that could not be repaired",
      totalCreditsDeducted: 2,
      pinnedToolCount: 0,
    },
    isIncognito: true,
    headlessThreadMode: "none",
    preCallResults: [],
    logger,
    t: streamTranslation.scopedT(defaultLocale).t,
  });
}

mock.module("../../database", () => ({ db }));
mock.module("../../identity/auth/repository", () => ({
  AuthRepository: { authenticateUserByEmail: async () => success(admin) },
}));
mock.module("../cron/resolve-task-user", () => ({
  resolveTaskOwnerUser: async () => ({ user: admin, locale: defaultLocale }),
}));
mock.module("@/generated/routes/handlers", () => ({
  getRouteHandler: async (path: string) => path === AI_RUN_ALIAS ? failedForumRun : sweep,
}));

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE pulse_health (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), status text, last_pulse_at timestamp,
      consecutive_failures integer DEFAULT 0, avg_execution_time_ms integer, success_rate integer,
      total_executions integer DEFAULT 0, total_successes integer DEFAULT 0,
      total_failures integer DEFAULT 0, metadata jsonb, alerts_sent integer DEFAULT 0,
      last_alert_at timestamp, is_maintenance_mode boolean DEFAULT false,
      created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE task_incidents (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), task_id text, task_name text, type text,
      reason text, metadata jsonb, created_at timestamp DEFAULT now(), resolved_at timestamp
    );
    CREATE TABLE users (id uuid PRIMARY KEY, locale text);
    CREATE TABLE notifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, type text, title text,
      body text, link text, read boolean DEFAULT false, dedupe_key text,
      metadata jsonb, created_at timestamp DEFAULT now(), UNIQUE(user_id, dedupe_key)
    );
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
  await pg.query("INSERT INTO users (id, locale) VALUES ($1, $2)", [admin.id, defaultLocale]);
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
  expect(live.success && live.data.summary.tasksSkipped).toEqual([TASK_WATCHDOG_SELF_ID]);
  expect(sweep).not.toHaveBeenCalled();

  const abandonedAt = new Date(liveStart.getTime() - 20 * 60_000);
  await db.update(cronTasks).set({ runStartedAt: null, updatedAt: abandonedAt }).where(taskFilter);

  const recovered = await pulse();
  expect(recovered.success && recovered.data.summary.tasksSucceeded).toEqual([TASK_WATCHDOG_SELF_ID]);
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
  expect(history.map((run) => run.taskName)).toEqual([
    TASK_WATCHDOG_SWEEP_ALIAS,
    TASK_WATCHDOG_SWEEP_ALIAS,
  ]);
  expect(history[0]?.startedAt).toEqual(abandonedAt);
  expect(history[1]?.completedAt).toBeInstanceOf(Date);
  expect(history[1]?.result).toEqual({ checked: 0, cancelled: 0 });
});

test("pulse history localizes task ids and handles shared legacy keys", async () => {
  const { loadPulseTaskNames } = await import("./i18n-utils");
  const sessionId = "pulse-history-session-cleanup";
  const signupId = "pulse-history-signup-reminder";
  await db.insert(cronTasks).values(
    [
      { id: sessionId, routeId: "user_session-cleanup_POST" },
      { id: signupId, routeId: "user_signup-reminder_POST" },
    ].map((task) => ({
      ...task,
      shortId: task.id,
      displayName: "task.name",
      schedule: "0 7 * * *",
      category: TaskCategory.MAINTENANCE,
      priority: CronTaskPriority.LOW,
    })),
  );

  const unavailableName = "Nazwa zadania niedostępna";
  const names = await loadPulseTaskNames(
    [sessionId, signupId, "task.name", "Custom task"],
    "pl-PL",
    unavailableName,
  );
  expect(names.get(sessionId)).toBe("Czyszczenie sesji");
  expect(names.get(signupId)).toBe("Przypomnienie o rejestracji");
  expect(names.get("task.name")).toBe(unavailableName);
  expect(names.get("Custom task")).toBeUndefined();
});

test("seeding the replacement disables the legacy cleanup and keeps its history", async () => {
  const retiredTaskId = "incognito-media-cleanup";
  const replacementTaskId = "guest-media-cleanup";
  const unrelatedTaskId = "custom-media-cleanup";
  const schedule = "0 7 * * *";
  const category = TaskCategory.MAINTENANCE;
  const priority = CronTaskPriority.LOW;

  await db.insert(cronTasks).values([
    {
      id: retiredTaskId,
      shortId: retiredTaskId,
      routeId: retiredTaskId,
      displayName: retiredTaskId,
      category,
      priority,
      schedule,
      nextExecutionAt: new Date(),
    },
    {
      id: replacementTaskId,
      shortId: replacementTaskId,
      routeId: replacementTaskId,
      displayName: replacementTaskId,
      category,
      priority,
      schedule,
      enabled: false,
    },
    {
      id: unrelatedTaskId,
      shortId: unrelatedTaskId,
      routeId: retiredTaskId,
      displayName: unrelatedTaskId,
      category,
      priority,
      schedule,
      userId: admin.id,
    },
  ]);
  await db.insert(cronTaskExecutions).values({
    taskId: retiredTaskId,
    taskName: retiredTaskId,
    executionId: retiredTaskId,
    startedAt: new Date(),
    status: CronTaskStatus.COMPLETED,
    priority,
    config: {},
  });
  void mock.module("@/generated/tasks/index", () => ({
    taskRegistry: {
      cronTasks: [{
        id: replacementTaskId,
        name: "task.name",
        definition: { aliases: [replacementTaskId] },
        category,
        schedule: "0 6 * * *",
        enabled: true,
        priority,
      }],
    },
  }));

  const { dev, prod } = await import("../seeds");
  await dev(logger);
  await prod(logger);

  const tasks = await db.select({
    id: cronTasks.id,
    enabled: cronTasks.enabled,
    nextExecutionAt: cronTasks.nextExecutionAt,
    schedule: cronTasks.schedule,
  }).from(cronTasks).where(inArray(cronTasks.id, [
    retiredTaskId,
    replacementTaskId,
    unrelatedTaskId,
  ]));
  expect(tasks.find((task) => task.id === retiredTaskId)).toMatchObject({
    enabled: false,
    nextExecutionAt: null,
  });
  expect(tasks.find((task) => task.id === replacementTaskId)).toMatchObject({
    enabled: false,
    schedule,
  });
  expect(tasks.find((task) => task.id === unrelatedTaskId)?.enabled).toBe(true);
  const history = await db.select({ taskId: cronTaskExecutions.taskId })
    .from(cronTaskExecutions)
    .where(eq(cronTaskExecutions.taskId, retiredTaskId));
  expect(history).toEqual([{ taskId: retiredTaskId }]);
});

test("scheduled ai-run records an empty provider error and notifies the owner once per failed run", async () => {
  const { PulseHealthRepository } = await import("./repository");
  const taskId = "fixture-forum-host";
  await db.insert(cronTasks).values({
    id: taskId,
    shortId: taskId,
    routeId: AI_RUN_ALIAS,
    displayName: "Forum host fixture",
    category: TaskCategory.MONITORING,
    priority: CronTaskPriority.CRITICAL,
    schedule: "* * * * *",
    userId: admin.id,
    outputMode: TaskOutputMode.NOTIFY_ON_FAILURE,
    taskInput: { prompt: "fixture", rootFolderId: "incognito" },
  });
  const pulse = () => PulseHealthRepository.executePulse(
    { force: true, taskNames: [AI_RUN_ALIAS], systemLocale: defaultLocale }, logger, defaultLocale,
  );
  for (let run = 0; run < 2; run++) {
    const result = await pulse();
    expect(result.success && result.data.summary.tasksFailed).toEqual([taskId]);
  }
  const history = await db.select().from(cronTaskExecutions).where(eq(cronTaskExecutions.taskId, taskId));
  expect(history).toHaveLength(2);
  for (const execution of history) {
    expect(execution).toMatchObject({ status: CronTaskStatus.FAILED, result: null, error: { success: false } });
  }
  const bell = await db.select().from(notifications).where(eq(notifications.userId, admin.id));
  expect(bell).toHaveLength(2);
  expect(new Set(bell.map((row) => row.dedupeKey)).size).toBe(2);
  expect(bell[0]).toMatchObject({ type: NotificationType.TASK_FAILED, link: `/tools/cron-history?taskId=${taskId}` });
  await db.update(cronTasks).set({ outputMode: TaskOutputMode.STORE_ONLY }).where(eq(cronTasks.id, taskId));
  const silent = await pulse();
  expect(silent.success && silent.data.summary.tasksFailed).toEqual([taskId]);
  expect(await db.select().from(notifications).where(eq(notifications.userId, admin.id))).toHaveLength(2);
});
