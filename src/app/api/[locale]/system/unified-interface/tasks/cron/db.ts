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
  TaskOutputModeDB,
} from "../enum";
import type { JsonValue, NotificationTarget } from "../unified-runner/types";

/**
 * Cron Tasks Table
 * Stores cron task definitions and metadata
 */
export const cronTasks = pgTable("cron_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  /**
   * routeId — which handler to call (was: name)
   * Accepts: task name (e.g. "lead-email-campaigns"), endpoint alias (e.g. "cron:stats"),
   * or full endpoint path.
   */
  routeId: text("route_id").notNull(),
  /** Human-readable label — separate from routeId for display */
  displayName: text("display_name").notNull(),
  description: text("description"),
  version: text("version").notNull().default("1.0.0"),
  category: text("category").notNull(),
  schedule: text("schedule").notNull(), // Cron expression
  timezone: text("timezone").default("UTC"),
  enabled: boolean("enabled").notNull().default(true),
  priority: text("priority", { enum: CronTaskPriorityDB }).notNull(),
  timeout: integer("timeout").default(300000), // 5 minutes default
  retries: integer("retries").default(3),
  retryDelay: integer("retry_delay").default(30000), // 30 seconds default
  /**
   * taskInput — the input the task executes with (body + URL path params merged flat).
   * Can be overridden per DB instance. splitTaskArgs() splits by schema at execution time.
   */
  taskInput: jsonb("task_input")
    .$type<Record<string, JsonValue>>()
    .notNull()
    .default({}),
  /**
   * runOnce — when true, the task disables itself after the first execution
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
  lastExecutionError: text("last_execution_error"),
  lastExecutionDuration: integer("last_execution_duration"),
  nextExecutionAt: timestamp("next_execution_at"),

  // Statistics
  executionCount: integer("execution_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  averageExecutionTime: integer("average_execution_time").default(0),

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
  taskId: uuid("task_id")
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
  result: jsonb("result").$type<Record<string, string | number | boolean>>(),
  error: jsonb("error").$type<ErrorResponseType>(),

  // Execution context
  isManual: boolean("is_manual").notNull().default(false),
  isDryRun: boolean("is_dry_run").notNull().default(false),
  retryAttempt: integer("retry_attempt").notNull().default(0),
  parentExecutionId: text("parent_execution_id"), // For retry chains

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
 */
export type CronTaskRow = z.infer<typeof selectCronTaskSchema>;
export type NewCronTask = z.infer<typeof insertCronTaskSchema>;

export type CronTaskExecution = z.infer<typeof selectCronTaskExecutionSchema>;
export type NewCronTaskExecution = z.infer<
  typeof insertCronTaskExecutionSchema
>;
