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
import type { z } from "zod";

import { users } from "@/app/api/[locale]/user/db";

import {
  CronTaskPriorityDB,
  CronTaskStatusDB,
  TaskOutputModeDB,
} from "../enum";

/**
 * Cron Tasks Table
 * Stores cron task definitions and metadata
 */
export const cronTasks = pgTable("cron_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  /**
   * routeId — which handler to call (was: name)
   * Accepts: task name (e.g. "lead-email-campaigns"), endpoint alias (e.g. "cron:stats"),
   * full endpoint path, or "cron-steps" for dynamic step tasks.
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
   * defaultConfig — validated by the resolved route's/task's configSchema
   * For "cron-steps" tasks: { steps: CronStep[] }
   * For system tasks: whatever the task's configSchema defines
   */
  defaultConfig: jsonb("default_config").notNull().default({}),

  /** Output mode after execution */
  outputMode: text("output_mode", { enum: TaskOutputModeDB })
    .notNull()
    .default(TaskOutputModeDB[0]),
  /** Notification targets (email/sms/webhook) for non-store-only modes */
  notificationTargets: jsonb("notification_targets").notNull().default([]),

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
  tags: jsonb("tags").notNull().default([]),

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
  result: jsonb("result"),
  error: jsonb("error"),
  errorStack: text("error_stack"),

  // Steps execution results (for cron-steps tasks)
  stepResults: jsonb("step_results"),
  /** Thread created/used by an ai_agent step */
  threadId: uuid("thread_id"),
  /** Total token count across all ai_agent steps */
  tokenCount: integer("token_count"),

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
export const insertCronTaskSchema = createInsertSchema(cronTasks);
export const selectCronTaskSchema = createSelectSchema(cronTasks);

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
