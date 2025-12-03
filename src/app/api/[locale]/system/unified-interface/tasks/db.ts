import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { TaskStatusDB } from "./enum";

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
