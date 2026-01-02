/**
 * Side Tasks Database Schema
 * Database tables specific to side task functionality
 */

import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { TaskPriorityDB, TaskStatusDB } from "../enum";

/**
 * Side Tasks Table
 * Stores side task definitions and metadata
 */
export const sideTasks = pgTable("side_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  version: text("version").notNull().default("1.0.0"),
  category: text("category").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  priority: text("priority", { enum: TaskPriorityDB }).notNull(),

  // Side task specific configuration
  autoRestart: boolean("auto_restart").notNull().default(true),
  restartDelay: integer("restart_delay").default(5000), // 5 seconds default
  maxRestarts: integer("max_restarts").default(5),
  healthCheckInterval: integer("health_check_interval").default(30000), // 30 seconds

  // Process monitoring
  processId: text("process_id"),
  startedAt: timestamp("started_at"),
  lastHealthCheck: timestamp("last_health_check"),
  restartCount: integer("restart_count").notNull().default(0),

  // Current state
  isRunning: boolean("is_running").notNull().default(false),

  // Configuration
  defaultConfig: jsonb("default_config").notNull().default({}),
  environment: jsonb("environment").notNull().default({}),

  // Metadata
  tags: jsonb("tags").notNull().default([]),
  monitoring: jsonb("monitoring"),
  documentation: jsonb("documentation"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Side Task Executions Table
 * Stores side task execution and lifecycle events
 */
export const sideTaskExecutions = pgTable("side_task_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => sideTasks.id, { onDelete: "cascade" }),
  taskName: text("task_name").notNull(),
  executionId: text("execution_id").notNull(),

  // Execution type and status
  type: text("type").notNull(), // start, stop, restart, health_check, error
  status: text("status", { enum: TaskStatusDB }).notNull(),

  // Timing
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),

  // Process information
  processId: text("process_id"),
  exitCode: integer("exit_code"),
  signal: text("signal"),

  // Results and errors
  result: jsonb("result"),
  error: jsonb("error"),
  errorStack: text("error_stack"),

  // Context
  triggeredBy: text("triggered_by"), // user, system, auto_restart, health_check
  isManual: boolean("is_manual").notNull().default(false),
  restartAttempt: integer("restart_attempt").notNull().default(0),

  // Metadata
  environment: text("environment").default("production"),
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Side Task Health Checks Table
 * Stores health check results for side tasks
 */
export const sideTaskHealthChecks = pgTable("side_task_health_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => sideTasks.id, { onDelete: "cascade" }),
  taskName: text("task_name").notNull(),

  // Health check results
  isHealthy: boolean("is_healthy").notNull(),
  status: text("status").notNull(), // healthy, warning, critical, unknown
  message: text("message"),

  // Metrics
  responseTimeMs: integer("response_time_ms"),
  memoryUsageMb: integer("memory_usage_mb"),
  cpuUsagePercent: integer("cpu_usage_percent"),

  // Process information
  processId: text("process_id"),
  isRunning: boolean("is_running").notNull(),
  uptime: integer("uptime"), // in seconds

  // Additional data
  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Zod schemas for validation
 */
export const insertSideTaskSchema = createInsertSchema(sideTasks);
export const selectSideTaskSchema = createSelectSchema(sideTasks);

export const insertSideTaskExecutionSchema = createInsertSchema(sideTaskExecutions);
export const selectSideTaskExecutionSchema = createSelectSchema(sideTaskExecutions);

export const insertSideTaskHealthCheckSchema = createInsertSchema(sideTaskHealthChecks);
export const selectSideTaskHealthCheckSchema = createSelectSchema(sideTaskHealthChecks);

/**
 * Type exports for side tasks
 */
export type SideTaskRecord = z.output<typeof selectSideTaskSchema>;
export type NewSideTaskRecord = z.infer<typeof insertSideTaskSchema>;

export type SideTaskExecutionRecord = z.output<typeof selectSideTaskExecutionSchema>;
export type NewSideTaskExecutionRecord = z.infer<typeof insertSideTaskExecutionSchema>;

export type SideTaskHealthCheckRecord = z.output<typeof selectSideTaskHealthCheckSchema>;
export type NewSideTaskHealthCheckRecord = z.infer<typeof insertSideTaskHealthCheckSchema>;
