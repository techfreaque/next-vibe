/**
 * Cron Tasks Database Schema
 * Database tables specific to cron task functionality
 */

import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import type { ErrorResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { users } from "@/app/api/[locale]/user/db";

import {
  CronTaskPriorityDB,
  CronTaskStatusDB,
  TaskCategoryDB,
  TaskOutputModeDB,
} from "../enum";
import type { JsonValue, NotificationTarget } from "../unified-runner/types";

/**
 * Cron Tasks Table
 * Stores cron task definitions and metadata
 */
export const cronTasks = pgTable("cron_tasks", {
  /**
   * id - stable, human-readable identity (e.g. "db-health", "credits-expire").
   * System tasks get this from code; user/remote tasks get it generated.
   */
  id: text("id").primaryKey(),
  /**
   * shortId - short, user-scoped display identifier (nanoid ~8 chars).
   * For system tasks (userId IS NULL): mirrors id (already a short slug).
   * For user tasks: nanoid(8), unique per user via partial index.
   * Use this for display/formatter output; use id for internal DB references.
   */
  shortId: text("short_id").notNull(),
  /**
   * routeId - which handler to call.
   * NOT an identity key - multiple tasks can call the same endpoint.
   * Accepts: task name, endpoint alias, or full endpoint path.
   */
  routeId: text("route_id").notNull(),
  /** Human-readable label - separate from routeId for display */
  displayName: text("display_name").notNull(),
  description: text("description"),
  version: text("version").notNull().default("1.0.0"),
  category: text("category", { enum: TaskCategoryDB }).notNull(),
  schedule: text("schedule").notNull(), // Cron expression
  timezone: text("timezone").default("UTC"),
  enabled: boolean("enabled").notNull().default(true),
  /** When true, task is hidden from AI system prompt and default task list views */
  hidden: boolean("hidden").notNull().default(false),
  priority: text("priority", { enum: CronTaskPriorityDB }).notNull(),
  timeout: integer("timeout").default(300000), // 5 minutes default
  retries: integer("retries").default(3),
  retryDelay: integer("retry_delay").default(30000), // 30 seconds default
  /**
   * taskInput - the input the task executes with (body + URL path params merged flat).
   * Can be overridden per DB instance. splitTaskArgs() splits by schema at execution time.
   */
  taskInput: jsonb("task_input")
    .$type<Record<string, JsonValue>>()
    .notNull()
    .default({}),
  /**
   * runOnce - when true, the task disables itself after the first execution
   * (success or failure). Re-enable by setting enabled=true again.
   */
  runOnce: boolean("run_once").notNull().default(false),

  /** Output mode after execution */
  outputMode: text("output_mode", { enum: TaskOutputModeDB })
    .notNull()
    .default(TaskOutputModeDB[0]),
  /** Notification targets (email/sms/webhook) for non-store-only modes */
  notificationTargets: jsonb("notification_targets")
    .$type<NotificationTarget[]>()
    .notNull()
    .default([]),

  // Execution tracking
  lastExecutedAt: timestamp("last_executed_at"),
  lastExecutionStatus: text("last_execution_status", {
    enum: CronTaskStatusDB,
  }),
  lastExecutionDuration: integer("last_execution_duration"),
  nextExecutionAt: timestamp("next_execution_at"),

  // History logging throttle
  /** Minimum interval (ms) between successful execution history records. null = log every run. */
  historyInterval: integer("history_interval"),
  /** Last time a history record was written for this task (success or error). */
  lastHistoryLoggedAt: timestamp("last_history_logged_at"),

  // Statistics
  executionCount: integer("execution_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  averageExecutionTime: integer("average_execution_time").default(0),

  // Failure tracking (informational only)
  /** Running count of consecutive failures - reset to 0 on success */
  consecutiveFailures: integer("consecutive_failures").notNull().default(0),

  // Instance routing - null means "run only on host instance"
  targetInstance: text("target_instance"),

  // Revival context - typed columns for wakeUp/wait callback flow.
  // Stored here (not in taskInput) so they are first-class typed fields
  // that handleTaskCompletion can read without parsing untyped JSON.
  wakeUpThreadId: text("wake_up_thread_id"),
  wakeUpToolMessageId: text("wake_up_tool_message_id"),
  wakeUpLeafMessageId: text("wake_up_leaf_message_id"),
  wakeUpCallbackMode: text("wake_up_callback_mode"),
  wakeUpModelId: text("wake_up_model_id"),
  wakeUpSkillId: text("wake_up_skill_id"),
  wakeUpFavoriteId: text("wake_up_favorite_id"),

  // Metadata
  tags: jsonb("tags").$type<string[]>().notNull().default([]),

  // Ownership - null means system task (admin-seeded), otherwise user who created it
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Cron Task Executions Table
 * Stores individual cron task execution records
 */
export const cronTaskExecutions = pgTable("cron_task_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: text("task_id")
    .notNull()
    .references(() => cronTasks.id, { onDelete: "cascade" }),
  /** Snapshot of routeId at execution time */
  taskName: text("task_name").notNull(),
  executionId: text("execution_id").notNull().unique(),
  status: text("status", { enum: CronTaskStatusDB }).notNull(),
  priority: text("priority", { enum: CronTaskPriorityDB }).notNull(),

  // Timing
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),

  // Configuration and results
  config: jsonb("config").notNull(),
  result: jsonb("result").$type<Record<string, JsonValue>>(),
  error: jsonb("error").$type<ErrorResponseType>(),

  // Execution context
  isManual: boolean("is_manual").notNull().default(false),
  isDryRun: boolean("is_dry_run").notNull().default(false),
  retryAttempt: integer("retry_attempt").notNull().default(0),
  parentExecutionId: text("parent_execution_id"), // For retry chains

  // Instance context
  /** IANA timezone of the server that executed this task (e.g. "Europe/Vienna") */
  serverTimezone: text("server_timezone"),
  /** Instance ID that executed this task (e.g. "hermes") */
  executedByInstance: text("executed_by_instance"),

  // Metadata
  triggeredBy: text("triggered_by"), // user, schedule, dependency, manual
  environment: text("environment").default("production"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Zod schemas for validation
 */
const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const taskInputSchema = z.record(z.string(), jsonValueSchema);
const notificationTargetsSchema = z.array(
  z.object({ type: z.enum(["email", "sms", "webhook"]), target: z.string() }),
);
const tagsSchema = z.array(z.string());

export const insertCronTaskSchema = createInsertSchema(cronTasks, {
  taskInput: taskInputSchema.optional(),
  notificationTargets: notificationTargetsSchema.optional(),
  tags: tagsSchema.optional(),
});
export const selectCronTaskSchema = createSelectSchema(cronTasks, {
  taskInput: taskInputSchema,
  notificationTargets: notificationTargetsSchema,
  tags: tagsSchema,
});

export const insertCronTaskExecutionSchema =
  createInsertSchema(cronTaskExecutions);
export const selectCronTaskExecutionSchema =
  createSelectSchema(cronTaskExecutions);

/**
 * Type exports for cron tasks
 *
 * Use $inferSelect / $inferInsert so that db.select().from(table) and
 * .insert().returning() unify to the same types without casts.
 */
export type CronTaskRow = typeof cronTasks.$inferSelect;
export type NewCronTask<TTaskInput> = typeof cronTasks.$inferInsert & {
  taskInput: TTaskInput;
};

export type CronTaskExecution = typeof cronTaskExecutions.$inferSelect;
export type NewCronTaskExecution = typeof cronTaskExecutions.$inferInsert;
