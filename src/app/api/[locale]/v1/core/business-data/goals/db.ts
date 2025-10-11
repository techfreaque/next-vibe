/**
 * Goals Database Schema
 * Business goals and objectives table
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

/**
 * Goals table for storing business goals and objectives
 * Handles goal setting for the goals form
 */
export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Primary business goal (single enum value, not array)
  primaryBusinessGoal: text("primary_business_goal"), // Single business goal enum value

  // Short-term goals (3-6 months)
  shortTermGoals: text("short_term_goals"),

  // Long-term goals (1-3 years)
  longTermGoals: text("long_term_goals"),

  // Revenue targets
  revenueTargets: text("revenue_targets"),

  // Growth metrics
  growthMetrics: text("growth_metrics"),

  // Success metrics
  successMetrics: text("success_metrics"),

  // Additional context
  additionalNotes: text("additional_notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectGoalsSchema = createSelectSchema(goals);
export const insertGoalsSchema = createInsertSchema(goals);

/**
 * Types
 */
export type Goals = z.infer<typeof selectGoalsSchema>;
export type NewGoals = z.infer<typeof insertGoalsSchema>;
