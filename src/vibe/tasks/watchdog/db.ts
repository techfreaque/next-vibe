/**
 * Task Watchdog Database Schema
 *
 * - task_incidents:    structured record of every watchdog / retry / budget stop
 * - task_budget_caps:  admin-editable credit caps (per task, per day, per goal)
 * - task_spend_ledger: one row per billed step of a background task. Source of
 *                      truth for spend, turn and tool-call counts.
 *
 * Task ids are plain text (no FK): incidents and spend outlive the task row.
 */

import {
  boolean,
  doublePrecision,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { BudgetScopeDB, SpendKindDB, TaskIncidentTypeDB } from "./enum";

export type IncidentMetadata = Record<string, string | number | boolean | null>;

export const taskIncidents = pgTable(
  "task_incidents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: text("task_id").notNull(),
    taskName: text("task_name").notNull(),
    type: text("type", { enum: TaskIncidentTypeDB }).notNull(),
    reason: text("reason").notNull(),
    metadata: jsonb("metadata").$type<IncidentMetadata>().notNull().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at"),
  },
  (table) => [
    index("idx_task_incidents_task").on(table.taskId, table.type),
    index("idx_task_incidents_created").on(table.createdAt),
    index("idx_task_incidents_unresolved").on(table.resolvedAt),
  ],
);

export const taskBudgetCaps = pgTable(
  "task_budget_caps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scope: text("scope", { enum: BudgetScopeDB }).notNull(),
    /** task: task id or "*"; day: "global"; goal: goal name or "*" */
    key: text("key").notNull(),
    maxCredits: doublePrecision("max_credits").notNull(),
    enabled: boolean("enabled").notNull().default(true),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_task_budget_caps_scope_key").on(table.scope, table.key),
  ],
);

export const taskSpendLedger = pgTable(
  "task_spend_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: text("task_id").notNull(),
    /** Goal group of the task at spend time (cron_tasks tag "goal:<name>") */
    goal: text("goal"),
    threadId: text("thread_id"),
    kind: text("kind", { enum: SpendKindDB }).notNull(),
    amount: doublePrecision("amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_task_spend_task").on(table.taskId, table.createdAt),
    index("idx_task_spend_created").on(table.createdAt),
  ],
);

export const insertTaskIncidentSchema = createInsertSchema(taskIncidents);
export const selectTaskIncidentSchema = createSelectSchema(taskIncidents);

export type TaskIncidentRow = typeof taskIncidents.$inferSelect;
export type NewTaskIncident = typeof taskIncidents.$inferInsert;
export type TaskBudgetCapRow = typeof taskBudgetCaps.$inferSelect;
export type TaskSpendRow = typeof taskSpendLedger.$inferSelect;
export type NewTaskSpend = typeof taskSpendLedger.$inferInsert;
