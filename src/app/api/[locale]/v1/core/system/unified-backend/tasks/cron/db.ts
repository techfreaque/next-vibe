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
import type { ErrorResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { z } from "zod";

import { CronTaskPriorityDB, CronTaskStatusDB } from "../enum";

/**
 * Cron Tasks Table
 * Stores cron task definitions and metadata
 */
export const cronTasks = pgTable("cron_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
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
  defaultConfig: jsonb("default_config").notNull().default({}),

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
  dependencies: jsonb("dependencies").notNull().default([]),
  monitoring: jsonb("monitoring"),
  documentation: jsonb("documentation"),

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
  error: jsonb("error").$type<ErrorResponseType>(),
  errorStack: text("error_stack"),

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
 * Cron Task Schedules Table
 * Manages cron scheduling information
 */
export const cronTaskSchedules = pgTable("cron_task_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => cronTasks.id, { onDelete: "cascade" }),
  taskName: text("task_name").notNull(),
  schedule: text("schedule").notNull(),
  timezone: text("timezone").notNull().default("UTC"),

  // Scheduling state
  isActive: boolean("is_active").notNull().default(true),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),

  // Statistics
  totalRuns: integer("total_runs").notNull().default(0),
  consecutiveFailures: integer("consecutive_failures").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const insertCronTaskScheduleSchema =
  createInsertSchema(cronTaskSchedules);
export const selectCronTaskScheduleSchema =
  createSelectSchema(cronTaskSchedules);

/**
 * Type exports for cron tasks
 */
export type CronTask = z.infer<typeof selectCronTaskSchema>;
export type NewCronTask = z.infer<typeof insertCronTaskSchema>;

export type CronTaskExecution = z.infer<typeof selectCronTaskExecutionSchema>;
export type NewCronTaskExecution = z.infer<
  typeof insertCronTaskExecutionSchema
>;

export type CronTaskSchedule = z.infer<typeof selectCronTaskScheduleSchema>;
export type NewCronTaskSchedule = z.infer<typeof insertCronTaskScheduleSchema>;
