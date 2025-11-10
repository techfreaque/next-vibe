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
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { TaskStatusDB } from "./enum";

/**
 * NOTE: Using text() with enum constraint instead of pgEnum() because translation keys
 * exceed PostgreSQL's 63-byte enum label limit. Type safety is maintained through
 * Drizzle's enum constraint and Zod validation.
 */

/**
 * Core Tables as per spec.md database schema
 */

/**
 * Import and re-export cron task tables from cron/db.ts to avoid duplicate definitions
 */
import { cronTasks, cronTaskExecutions, cronTaskSchedules } from "./cron/db";

export {
  cronTasks,
  cronTaskExecutions,
  cronTaskSchedules,
  type CronTask,
  type NewCronTask,
  type CronTaskExecution,
  type NewCronTaskExecution,
  type CronTaskSchedule,
  type NewCronTaskSchedule,
} from "./cron/db";

/**
 * Import and re-export side task tables from side-tasks/db.ts to avoid duplicate definitions
 */
import {
  sideTasks,
  sideTaskExecutions,
  sideTaskHealthChecks,
} from "./side-tasks/db";

export {
  sideTasks,
  sideTaskExecutions,
  sideTaskHealthChecks,
  type SideTaskRecord,
  type NewSideTaskRecord,
  type SideTaskExecutionRecord,
  type NewSideTaskExecutionRecord,
  type SideTaskHealthCheckRecord,
  type NewSideTaskHealthCheckRecord,
} from "./side-tasks/db";

/**
 * Import and re-export pulse health tables from pulse/db.ts to avoid duplicate definitions
 */
import { pulseHealth, pulseExecutions, pulseNotifications } from "./pulse/db";

export {
  pulseHealth,
  pulseExecutions,
  pulseNotifications,
  type PulseHealth,
  type NewPulseHealth,
  type PulseExecution,
  type NewPulseExecution,
  type PulseNotification,
  type NewPulseNotification,
} from "./pulse/db";

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
export const insertTaskRunnerStateSchema = createInsertSchema(taskRunnerState);
export const selectTaskRunnerStateSchema = createSelectSchema(taskRunnerState);

/**
 * Type definitions
 */
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
