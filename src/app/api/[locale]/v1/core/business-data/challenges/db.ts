/**
 * Challenges Database Schema
 * Business challenges and pain points table
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "@/app/api/[locale]/v1/core/user/db";

/**
 * Challenges table for storing business challenges and pain points
 * Handles challenge identification for the challenges form
 */
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Current challenges
  currentChallenges: text("current_challenges"), // JSON array of current challenges

  // Challenge categories
  marketingChallenges: text("marketing_challenges"), // JSON array of marketing challenges
  operationalChallenges: text("operational_challenges"), // JSON array of operational challenges
  financialChallenges: text("financial_challenges"), // JSON array of financial challenges
  technicalChallenges: text("technical_challenges"), // JSON array of technical challenges

  // Challenge details
  biggestChallenge: text("biggest_challenge"), // Main challenge description
  challengeImpact: text("challenge_impact"), // How challenges impact business
  previousSolutions: text("previous_solutions"), // JSON array of attempted solutions

  // Resource constraints
  resourceConstraints: text("resource_constraints"), // JSON array of resource limitations
  budgetConstraints: text("budget_constraints"), // Budget limitations
  timeConstraints: text("time_constraints"), // Time limitations

  // Support needs
  supportNeeded: text("support_needed"), // JSON array of support areas needed
  priorityAreas: text("priority_areas"), // JSON array of priority areas to address

  // Additional context
  additionalNotes: text("additional_notes"),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Zod Schemas
 */
export const selectChallengesSchema = createSelectSchema(challenges);
export const insertChallengesSchema = createInsertSchema(challenges);

/**
 * Types
 */
export type Challenges = z.infer<typeof selectChallengesSchema>;
export type NewChallenges = z.infer<typeof insertChallengesSchema>;
