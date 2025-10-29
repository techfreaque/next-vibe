/**
 * Pulse Health Database Schema
 * Database tables for health monitoring and pulse checks
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

import type { ErrorResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";

import { PulseExecutionStatusDB, PulseHealthStatusDB } from "../enum";

/**
 * Pulse Health Table
 * Stores pulse system health status
 */
export const pulseHealth = pgTable("pulse_health", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status", { enum: PulseHealthStatusDB }).notNull(),
  lastPulseAt: timestamp("last_pulse_at"),
  consecutiveFailures: integer("consecutive_failures").notNull().default(0),
  avgExecutionTimeMs: integer("avg_execution_time_ms"),
  successRate: integer("success_rate"), // Stored as basis points (0-10000)
  totalExecutions: integer("total_executions").notNull().default(0),
  totalSuccesses: integer("total_successes").notNull().default(0),
  totalFailures: integer("total_failures").notNull().default(0),
  metadata: jsonb("metadata"),
  alertsSent: integer("alerts_sent").notNull().default(0),
  lastAlertAt: timestamp("last_alert_at"),
  isMaintenanceMode: boolean("is_maintenance_mode").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Pulse Executions Table
 * Health monitoring and pulse checks
 */
export const pulseExecutions = pgTable("pulse_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  pulseId: text("pulse_id").notNull(),
  executionId: text("execution_id").notNull(),
  status: text("status", { enum: PulseExecutionStatusDB }).notNull(),
  healthStatus: text("health_status", { enum: PulseHealthStatusDB }).notNull(),

  // Timing
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  durationMs: integer("duration_ms"),

  // Pulse execution data
  totalTasksDiscovered: integer("total_tasks_discovered").notNull().default(0),
  tasksDue: jsonb("tasks_due").notNull().default([]),
  tasksExecuted: jsonb("tasks_executed").notNull().default([]),
  tasksSucceeded: jsonb("tasks_succeeded").notNull().default([]),
  tasksFailed: jsonb("tasks_failed").notNull().default([]),
  tasksSkipped: jsonb("tasks_skipped").notNull().default([]),
  totalExecutionTimeMs: integer("total_execution_time_ms"),

  // Results and errors
  result: jsonb("result"),
  errors: jsonb("errors").$type<ErrorResponseType[]>(),

  // Metadata
  environment: text("environment").default("production"),
  triggeredBy: text("triggered_by").default("schedule"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Pulse Notifications Table
 * Stores pulse-related notification records
 */
export const pulseNotifications = pgTable("pulse_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  pulseExecutionId: uuid("pulse_execution_id").references(
    () => pulseExecutions.id,
    { onDelete: "cascade" },
  ),

  // Notification details
  type: text("type").notNull(), // health_degraded, health_critical, recovery
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  message: text("message").notNull(),

  // Health context
  healthStatus: text("health_status", { enum: PulseHealthStatusDB }).notNull(),
  consecutiveFailures: integer("consecutive_failures").default(0),

  // Recipients and channels
  recipients: jsonb("recipients").notNull().default([]),
  channels: jsonb("channels").notNull().default([]), // email, slack, webhook

  // Status
  sent: boolean("sent").notNull().default(false),
  sentAt: timestamp("sent_at"),
  error: text("error"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Zod schemas for validation
 */
export const insertPulseHealthSchema = createInsertSchema(pulseHealth);
export const selectPulseHealthSchema = createSelectSchema(pulseHealth);

export const insertPulseExecutionSchema = createInsertSchema(pulseExecutions);
export const selectPulseExecutionSchema = createSelectSchema(pulseExecutions);

export const insertPulseNotificationSchema =
  createInsertSchema(pulseNotifications);
export const selectPulseNotificationSchema =
  createSelectSchema(pulseNotifications);

/**
 * Type exports for pulse health
 */
export type PulseHealth = z.infer<typeof selectPulseHealthSchema>;
export type NewPulseHealth = z.infer<typeof insertPulseHealthSchema>;

export type PulseExecution = z.infer<typeof selectPulseExecutionSchema>;
export type NewPulseExecution = z.infer<typeof insertPulseExecutionSchema>;

export type PulseNotification = z.infer<typeof selectPulseNotificationSchema>;
export type NewPulseNotification = z.infer<
  typeof insertPulseNotificationSchema
>;
