/**
 * Tasks Database Schema
 * Database tables for task management system
 */

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */
/**
 * Tasks Database Schema
 * Database tables for task management system
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

import { CronTaskStatus, TaskPriorityDB, TaskStatusDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Core Tables as per spec.md database schema
 */

/**
 * Main cron tasks table with execution tracking and statistics
 */
export const cronTasks = pgTable("cron_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  schedule: text("schedule"), // Cron expression string (nullable for function-based schedules)
  scheduleFunction: text("schedule_function"), // Function name for dynamic scheduling
  enabled: boolean("enabled").default(true).notNull(),
  priority: text("priority", { enum: TaskPriorityDB }).notNull(),
  timeout: integer("timeout").default(300000), // 5 minutes default
  retries: integer("retries").default(3),
  description: text("description"),
  version: text("version").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  dependencies: jsonb("dependencies").$type<string[]>(),
  defaultConfig: jsonb("default_config").notNull(),
  monitoring: jsonb("monitoring"),
  documentation: jsonb("documentation"),
  // Execution tracking
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  runCount: integer("run_count").default(0).notNull(),
  successCount: integer("success_count").default(0).notNull(),
  errorCount: integer("error_count").default(0).notNull(),
  averageExecutionTime: integer("average_execution_time"), // milliseconds
  lastExecutionDuration: integer("last_execution_duration"), // milliseconds
  lastError: text("last_error"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Individual execution records
 */
export const cronTaskExecutions = pgTable("cron_task_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .references(() => cronTasks.id)
    .notNull(),
  status: text("status", { enum: TaskStatusDB }).notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),
  config: jsonb("config").notNull(),
  result: jsonb("result"),
  error: jsonb("error"),
  skippedReason: text("skipped_reason"), // Reason if skipped (e.g., "previous_instance_running")
  executionEnvironment: text("execution_environment"), // "development", "production", "serverless"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Side tasks table
 */
export const sideTasks = pgTable("side_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  priority: text("priority", { enum: TaskPriorityDB }).notNull(),
  version: text("version").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  dependencies: jsonb("dependencies").$type<string[]>(),
  defaultConfig: jsonb("default_config").notNull(),
  monitoring: jsonb("monitoring"),
  documentation: jsonb("documentation"),
  // Status tracking
  status: text("status", { enum: TaskStatusDB })
    .default(CronTaskStatus.STOPPED)
    .notNull(),
  lastStarted: timestamp("last_started"),
  lastStopped: timestamp("last_stopped"),
  restartCount: integer("restart_count").default(0).notNull(),
  errorCount: integer("error_count").default(0).notNull(),
  uptime: integer("uptime"), // seconds
  lastError: text("last_error"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Task runner state tracking
 */
export const taskRunnerState = pgTable("task_runner_state", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskName: text("task_name").notNull(),
  taskType: text("task_type").notNull(), // "cron" or "side"
  status: text("status", { enum: TaskStatusDB }).notNull(),
  startedAt: timestamp("started_at").notNull(),
  environment: text("environment").notNull(),
  runnerInstanceId: text("runner_instance_id").notNull(),
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

export const insertSideTaskSchema = createInsertSchema(sideTasks);
export const selectSideTaskSchema = createSelectSchema(sideTasks);

export const insertTaskRunnerStateSchema = createInsertSchema(taskRunnerState);
export const selectTaskRunnerStateSchema = createSelectSchema(taskRunnerState);

/**
 * Type definitions
 */
export type CronTask = z.infer<typeof selectCronTaskSchema>;
export type NewCronTask = z.infer<typeof insertCronTaskSchema>;

export type CronTaskExecution = z.infer<typeof selectCronTaskExecutionSchema>;
export type NewCronTaskExecution = z.infer<
  typeof insertCronTaskExecutionSchema
>;

export type SideTask = z.infer<typeof selectSideTaskSchema>;
export type NewSideTask = z.infer<typeof insertSideTaskSchema>;

export type TaskRunnerState = z.infer<typeof selectTaskRunnerStateSchema>;
export type NewTaskRunnerState = z.infer<typeof insertTaskRunnerStateSchema>;

/**
 * Export all tables for use in other modules
 */
export const taskTables = {
  cronTasks,
  cronTaskExecutions,
  sideTasks,
  taskRunnerState,
};
